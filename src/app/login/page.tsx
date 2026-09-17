"use client";

import Link from "next/link";
import { useState } from "react";
import {
  ConfettiDecor,
  DecorativeCircle,
  DotGrid,
  Eyebrow,
} from "@/components/playful/decor";
import { PlayfulLogo } from "@/components/playful/logo";
import { PrimaryButton, SecondaryButton } from "@/components/playful/buttons";
import { SimpleBackNav } from "@/components/playful/nav";
import { LockIcon } from "@/components/playful/icons";

export default function LoginPage() {
  const [email, setEmail] = useState("");

  return (
    <DotGrid className="relative flex min-h-screen flex-col items-center justify-center px-4 py-10">
      <DecorativeCircle
        color="tertiary"
        className="-right-10 top-8 opacity-80"
        size={220}
      />
      <ConfettiDecor />

      <div className="absolute left-4 top-5 md:left-8">
        <SimpleBackNav href="/" label="Back to home" />
      </div>

      <div className="relative z-10 w-full max-w-[440px]">
        <article className="sticker-card px-6 py-8 shadow-pop-lg">
          <div className="mb-6 flex justify-center">
            <PlayfulLogo href="/" />
          </div>

          <h1 className="text-center font-heading text-3xl font-extrabold">
            Welcome back
          </h1>
          <p className="mt-2 text-center text-sm text-muted-foreground">
            Log in to save your progress and unlock the full playground.
          </p>

          <div className="mt-6 space-y-3">
            <SecondaryButton className="w-full justify-center py-3">
              <span className="flex size-6 items-center justify-center rounded-md border-2 border-foreground bg-muted text-xs font-black">
                GH
              </span>
              Continue with GitHub
            </SecondaryButton>
            <SecondaryButton className="w-full justify-center py-3">
              <span className="flex size-6 items-center justify-center rounded-md border-2 border-foreground bg-muted text-xs font-black">
                G
              </span>
              Continue with Google
            </SecondaryButton>
          </div>

          <div className="my-6 flex items-center gap-3">
            <div className="h-px flex-1 bg-border" />
            <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
              or
            </span>
            <div className="h-px flex-1 bg-border" />
          </div>

          <form
            onSubmit={(e) => {
              e.preventDefault();
            }}
            className="space-y-4"
          >
            <div>
              <label htmlFor="email" className="input-label">
                Email
              </label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                className="input-field"
              />
            </div>
            <PrimaryButton type="submit" className="w-full justify-center">
              Continue
            </PrimaryButton>
          </form>

          <p className="mt-5 text-center text-sm text-muted-foreground">
            New here?{" "}
            <Link href="/git-visualizer" className="font-bold text-accent">
              Start practicing free
            </Link>
          </p>

          <p className="mt-6 flex items-center justify-center gap-1.5 text-xs text-muted-foreground">
            <LockIcon />
            Secured & powered by Clerk
          </p>
        </article>
      </div>
    </DotGrid>
  );
}
