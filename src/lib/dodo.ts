import { ApiError } from "@/lib/apiError";

function getDodoApiKey(): string {
  const key =
    process.env.DODO_PAYMENTS_API_KEY ?? process.env.DODO_PAYMENT ?? "";
  if (!key) {
    throw new ApiError(
      500,
      "DODO_PAYMENTS_API_KEY is not configured",
      "DODO_CONFIG",
    );
  }
  return key;
}

function isDodoLiveMode(): boolean {
  const env =
    process.env.DODO_ENVIRONMENT ?? process.env.DODO_PAYMENTS_ENVIRONMENT;
  return env === "live" || env === "live_mode";
}

function getDodoBaseUrl(): string {
  return isDodoLiveMode()
    ? "https://live.dodopayments.com"
    : "https://test.dodopayments.com";
}

export function getDodoEnvironment(): "test_mode" | "live_mode" {
  return isDodoLiveMode() ? "live_mode" : "test_mode";
}

interface CreateProCheckoutParams {
  userId: string;
  email: string;
  name: string | null;
  returnUrl: string;
}

interface DodoCheckoutResponse {
  checkout_url: string;
  session_id?: string;
  id?: string;
}

export async function createProCheckout({
  userId,
  email,
  name,
  returnUrl,
}: CreateProCheckoutParams): Promise<{
  checkoutUrl: string;
  sessionId: string;
}> {
  const productId = process.env.DODO_PRO_PRODUCT_ID;
  if (!productId) {
    throw new ApiError(
      500,
      "DODO_PRO_PRODUCT_ID is not configured",
      "DODO_CONFIG",
    );
  }

  const response = await fetch(`${getDodoBaseUrl()}/checkouts`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${getDodoApiKey()}`,
    },
    body: JSON.stringify({
      product_cart: [{ product_id: productId, quantity: 1 }],
      billing_currency: "INR",
      billing_address: { country: "IN" },
      customer: {
        email,
        name: name ?? email.split("@")[0],
      },
      return_url: returnUrl,
      metadata: { userId },
    }),
  });

  if (!response.ok) {
    const errorText = await response.text();
    console.error(
      `Dodo checkout failed (${getDodoEnvironment()}, HTTP ${response.status}): ${errorText}`,
    );
    if (response.status === 401) {
      throw new ApiError(
        502,
        `Payment provider rejected the API key. Check that DODO_ENVIRONMENT (currently "${getDodoEnvironment()}") matches the mode of DODO_PAYMENTS_API_KEY.`,
        "DODO_AUTH",
      );
    }
    throw new ApiError(
      502,
      "Could not start checkout. Please try again.",
      "DODO_CHECKOUT",
    );
  }

  const data = (await response.json()) as DodoCheckoutResponse;
  const sessionId = data.session_id ?? data.id ?? "";

  return {
    checkoutUrl: data.checkout_url,
    sessionId,
  };
}

export function getWebhookSecret(): string {
  return (
    process.env.DODO_WEBHOOK_SECRET ??
    process.env.DODO_PAYMENTS_WEBHOOK_KEY ??
    ""
  );
}
