import { NextResponse } from "next/server";
import { getAppUrl } from "@/lib/appUrl";
import { requireUser } from "@/lib/auth";
import { handleApiError } from "@/lib/apiError";
import { createProCheckout } from "@/lib/dodo";

export async function POST() {
  try {
    const user = await requireUser();

    if (user.isPro) {
      return NextResponse.json({ error: "Already Pro" }, { status: 400 });
    }

    const { checkoutUrl, sessionId } = await createProCheckout({
      userId: user.id,
      email: user.email,
      name: user.name,
      returnUrl: `${getAppUrl()}/payment/success`,
    });

    return NextResponse.json({ checkoutUrl, sessionId });
  } catch (error) {
    return handleApiError(error);
  }
}
