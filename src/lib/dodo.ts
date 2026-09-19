function getDodoApiKey(): string {
  const key =
    process.env.DODO_PAYMENTS_API_KEY ?? process.env.DODO_PAYMENT ?? "";
  if (!key) {
    throw new Error("DODO_PAYMENTS_API_KEY is not configured");
  }
  return key;
}

function isDodoLiveMode(): boolean {
  const env = process.env.DODO_ENVIRONMENT ?? process.env.DODO_PAYMENTS_ENVIRONMENT;
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
}: CreateProCheckoutParams): Promise<{ checkoutUrl: string; sessionId: string }> {
  const productId = process.env.DODO_PRO_PRODUCT_ID;
  if (!productId) {
    throw new Error("DODO_PRO_PRODUCT_ID is not configured");
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
      allowed_payment_method_types: ["upi_collect", "credit", "debit"],
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
    throw new Error(`Dodo checkout failed: ${errorText}`);
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
