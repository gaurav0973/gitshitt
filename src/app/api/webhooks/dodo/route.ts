import { eq, sql } from "drizzle-orm";
import { NextResponse } from "next/server";
import { db } from "@/db";
import { payments, users } from "@/db/schema";
import { getWebhookSecret } from "@/lib/dodo";
import { verifyDodoWebhook } from "@/lib/webhookVerify";

interface DodoWebhookEvent {
  type?: string;
  data?: {
    payment_id?: string;
    total_amount?: number;
    currency?: string;
    metadata?: {
      userId?: string;
    };
  };
}

export async function POST(request: Request) {
  const rawBody = await request.text();
  const secret = getWebhookSecret();

  // Misconfiguration: respond non-2xx so Dodo keeps retrying until the secret is set.
  if (!secret) {
    console.error("Dodo webhook secret is not configured");
    return NextResponse.json(
      { error: "Webhook not configured" },
      { status: 500 },
    );
  }

  const verified = verifyDodoWebhook(
    rawBody,
    {
      webhookId: request.headers.get("webhook-id") ?? "",
      webhookSignature: request.headers.get("webhook-signature") ?? "",
      webhookTimestamp: request.headers.get("webhook-timestamp") ?? "",
    },
    secret,
  );

  if (!verified) {
    return NextResponse.json({ error: "Invalid signature" }, { status: 401 });
  }

  let event: DodoWebhookEvent;
  try {
    event = JSON.parse(rawBody) as DodoWebhookEvent;
  } catch {
    return NextResponse.json({ error: "Invalid payload" }, { status: 400 });
  }

  if (event.type !== "payment.succeeded" && event.type !== "payment.failed") {
    return NextResponse.json({ received: true });
  }

  const paymentId = event.data?.payment_id;
  const userId = event.data?.metadata?.userId;

  // Retrying won't fix a payload without our metadata, so acknowledge it.
  if (!paymentId || !userId) {
    console.error(
      "Dodo webhook missing payment_id or metadata.userId",
      event.type,
    );
    return NextResponse.json({ received: true, ignored: true });
  }

  const paymentRow = {
    userId,
    dodoPaymentId: paymentId,
    amountPaise: event.data?.total_amount ?? 14900,
    currency: event.data?.currency ?? "INR",
  };

  if (event.type === "payment.succeeded") {
    // Both writes are idempotent and run atomically, so Dodo retries and
    // out-of-order deliveries (e.g. failed arriving before succeeded) are safe.
    await db.batch([
      db
        .insert(payments)
        .values({ ...paymentRow, status: "succeeded" })
        .onConflictDoUpdate({
          target: payments.dodoPaymentId,
          set: { status: "succeeded", amountPaise: paymentRow.amountPaise },
        }),
      db
        .update(users)
        .set({
          isPro: true,
          proGrantedAt: sql`coalesce(${users.proGrantedAt}, now())`,
          updatedAt: new Date(),
        })
        .where(eq(users.id, userId)),
    ]);
  } else {
    // Never downgrade a payment that already succeeded.
    await db
      .insert(payments)
      .values({ ...paymentRow, status: "failed" })
      .onConflictDoNothing({ target: payments.dodoPaymentId });
  }

  return NextResponse.json({ received: true });
}
