"use client";

import { useState } from "react";
import { PrimaryButton } from "@/components/playful/buttons";

export function PaymentCheckoutButton() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleCheckout = async () => {
    setLoading(true);
    setError(null);

    try {
      const response = await fetch("/api/payments/checkout", { method: "POST" });
      const data = (await response.json()) as {
        checkoutUrl?: string;
        error?: string;
      };

      if (!response.ok || !data.checkoutUrl) {
        throw new Error(data.error ?? "Could not start checkout");
      }

      window.location.href = data.checkoutUrl;
    } catch (err) {
      setError(err instanceof Error ? err.message : "Checkout failed");
      setLoading(false);
    }
  };

  return (
    <div className="w-full">
      <PrimaryButton
        type="button"
        onClick={handleCheckout}
        disabled={loading}
        className="mt-8 w-full justify-center"
      >
        {loading ? "Starting checkout…" : "Pay ₹149 securely"}
      </PrimaryButton>
      {error ? (
        <p className="mt-3 text-center text-xs font-semibold text-red-600">
          {error}
        </p>
      ) : null}
    </div>
  );
}
