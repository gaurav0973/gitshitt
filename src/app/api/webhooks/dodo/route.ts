import { eq } from "drizzle-orm";
import { NextResponse } from "next/server";
import { db } from "@/db";
import { payments, users } from "@/db/schema";
import { getWebhookSecret } from "@/lib/dodo";
import { verifyDodoWebhook } from "@/lib/webhookVerify";

interface DodoWebhookEvent {
  type?: string;
  data?: {
    payment_id?: string;
    amount?: number;
    currency?: string;
    metadata?: {
      userId?: string;
    };
  };
}

export async function POST(request: Request) {
  const rawBody = await request.text();
  const secret = getWebhookSecret();

  const verified = verifyDodoWebhook(rawBody, {
    webhookId: request.headers.get("webhook-id") ?? "",
    webhookSignature: request.headers.get("webhook-signature") ?? "",
    webhookTimestamp: request.headers.get("webhook-timestamp") ?? "",
  }, secret);

  if (!verified) {
    return NextResponse.json({ error: "Invalid signature" }, { status: 401 });
  }

  let event: DodoWebhookEvent;
  try {
    event = JSON.parse(rawBody) as DodoWebhookEvent;
  } catch {
    return NextResponse.json({ error: "Invalid payload" }, { status: 400 });
  }

  if (event.type === "payment.succeeded") {
    const paymentId = event.data?.payment_id;
    const userId = event.data?.metadata?.userId;

    if (!paymentId || !userId) {
      return NextResponse.json({ error: "Missing payment data" }, { status: 400 });
    }

    const [existing] = await db
      .select({ id: payments.id })
      .from(payments)
      .where(eq(payments.dodoPaymentId, paymentId))
      .limit(1);

    if (!existing) {
      await db.insert(payments).values({
        userId,
        dodoPaymentId: paymentId,
        amountPaise: event.data?.amount ?? 10000,
        currency: event.data?.currency ?? "INR",
        status: "succeeded",
      });

      await db
        .update(users)
        .set({ isPro: true, proGrantedAt: new Date(), updatedAt: new Date() })
        .where(eq(users.id, userId));
    }
  }

  if (event.type === "payment.failed") {
    const paymentId = event.data?.payment_id;
    const userId = event.data?.metadata?.userId;
    if (paymentId && userId) {
      const [existing] = await db
        .select({ id: payments.id })
        .from(payments)
        .where(eq(payments.dodoPaymentId, paymentId))
        .limit(1);
      if (!existing) {
        await db.insert(payments).values({
          userId,
          dodoPaymentId: paymentId,
          amountPaise: event.data?.amount ?? 10000,
          currency: event.data?.currency ?? "INR",
          status: "failed",
        });
      }
    }
  }

  return NextResponse.json({ received: true });
}
