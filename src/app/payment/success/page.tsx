"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { DotGrid, Eyebrow } from "@/components/playful/decor";
import { PrimaryLink } from "@/components/playful/buttons";
import { StickerCard } from "@/components/playful/card";
import { SimpleBackNav } from "@/components/playful/nav";
import { useAppUser } from "@/hooks/useAppUser";

export default function PaymentSuccessPage() {
  const { user, refresh, loading } = useAppUser();
  const [polling, setPolling] = useState(true);

  useEffect(() => {
    if (user?.isPro) {
      setPolling(false);
      return;
    }

    const interval = setInterval(() => {
      void refresh();
    }, 3000);

    const timeout = setTimeout(() => {
      setPolling(false);
      clearInterval(interval);
    }, 60000);

    return () => {
      clearInterval(interval);
      clearTimeout(timeout);
    };
  }, [user?.isPro, refresh]);

  const isPro = user?.isPro ?? false;

  return (
    <DotGrid className="relative min-h-screen px-4 py-10 md:px-6">
      <div className="relative z-10 mx-auto max-w-lg">
        <SimpleBackNav href="/git-visualizer" label="Back to visualizer" />

        <div className="mt-8 text-center">
          <Eyebrow className="mx-auto">
            {isPro ? "Welcome to Pro" : "Processing payment"}
          </Eyebrow>
          <h1 className="mt-4 font-heading text-3xl font-extrabold">
            {isPro ? "You're all set!" : "Almost there…"}
          </h1>
          <p className="mt-3 text-muted-foreground">
            {isPro
              ? "Your Pro unlock is active. Save sessions, chat more, and practice without limits."
              : polling
                ? "We're confirming your payment. This usually takes a few seconds."
                : "Payment is still processing. Refresh your profile in a moment."}
          </p>
        </div>

        <StickerCard className="mx-auto mt-10 max-w-md p-6 text-center">
          {loading && !user ? (
            <p className="text-sm text-muted-foreground">Loading account…</p>
          ) : isPro ? (
            <PrimaryLink href="/profile?upgraded=1" className="w-full justify-center">
              Go to profile
            </PrimaryLink>
          ) : (
            <button
              type="button"
              onClick={() => void refresh()}
              className="w-full rounded-full border-2 border-foreground bg-accent px-5 py-3 text-sm font-bold text-white"
            >
              Check again
            </button>
          )}
        </StickerCard>

        <p className="mt-8 text-center">
          <Link
            href="/git-visualizer"
            className="text-sm font-semibold text-muted-foreground hover:text-accent"
          >
            Back to visualizer
          </Link>
        </p>
      </div>
    </DotGrid>
  );
}
