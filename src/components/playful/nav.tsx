"use client";

import Link from "next/link";
import { useAuth, useUser } from "@clerk/nextjs";
import { PlayfulLogo } from "./logo";
import { PrimaryLink, SecondaryLink } from "./buttons";

export function HomeNav() {
  const { isSignedIn, isLoaded } = useAuth();

  if (isLoaded && isSignedIn) {
    return null;
  }

  return (
    <header className="mx-auto grid w-full max-w-6xl grid-cols-[auto_1fr_auto] items-center gap-4 px-4 py-5 md:px-6">
      <PlayfulLogo className="justify-self-start" />
      <nav className="hidden items-center justify-center gap-8 md:flex">
        <a
          href="#features"
          className="text-sm font-semibold text-foreground hover:text-accent"
        >
          Features
        </a>
        <a
          href="#pricing"
          className="text-sm font-semibold text-foreground hover:text-accent"
        >
          Pricing
        </a>
      </nav>
      <div className="col-start-3 flex items-center justify-end gap-2 sm:gap-3">
        <SecondaryLink
          href="/sign-in"
          showArrow={false}
          className="hidden px-4 py-2 text-sm sm:inline-flex"
        >
          Log in
        </SecondaryLink>
        <PrimaryLink href="/git-visualizer" className="px-4 py-2 text-sm">
          Start practicing
        </PrimaryLink>
      </div>
    </header>
  );
}

interface VisualizerHeaderProps {
  isPro?: boolean;
  isSignedIn?: boolean;
  commandsUsedToday?: number;
  commandDailyLimit?: number;
  demosUsedToday?: number;
  demoDailyLimit?: number;
  branchName?: string;
  statusMessage?: string | null;
  children?: React.ReactNode;
}

export function VisualizerHeader({
  isPro = false,
  isSignedIn = false,
  commandsUsedToday,
  commandDailyLimit,
  demosUsedToday,
  demoDailyLimit,
  branchName,
  statusMessage,
  children,
}: VisualizerHeaderProps) {
  const planBadge = isPro
    ? "Pro plan · unlimited"
    : isSignedIn
      ? `Free plan · ${commandsUsedToday ?? 0}/${commandDailyLimit ?? 5} cmds · ${demosUsedToday ?? 0}/${demoDailyLimit ?? 3} demos`
      : "Guest · sign in to save progress";

  return (
    <header className="border-b-2 border-border bg-card px-4 py-2.5 md:px-6">
      <div className="flex items-center gap-2 md:gap-3">
        <div className="flex shrink-0 items-center gap-2 md:gap-3">
          {!isSignedIn ? (
            <Link
              href="/"
              className="hidden items-center gap-1.5 text-sm font-semibold text-muted-foreground hover:text-foreground sm:inline-flex"
            >
              <svg width="16" height="16" viewBox="0 0 24 24" aria-hidden>
                <path
                  d="M19 12H5M11 6l-6 6 6 6"
                  stroke="currentColor"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  fill="none"
                />
              </svg>
              Home
            </Link>
          ) : null}
          <PlayfulLogo href="/git-visualizer" />
        </div>

        {children ? (
          <div className="flex min-w-0 flex-1 flex-nowrap items-center gap-1.5 overflow-x-auto [-ms-overflow-style:none] scrollbar-none [&::-webkit-scrollbar]:hidden">
            {children}
          </div>
        ) : (
          <div className="min-w-0 flex-1" />
        )}

        <div className="flex shrink-0 items-center gap-1.5 sm:gap-2">
          {statusMessage ? (
            <span className="hidden max-w-40 truncate text-xs font-semibold text-accent sm:inline">
              {statusMessage}
            </span>
          ) : null}
          {branchName ? (
            <span className="hidden text-xs font-semibold whitespace-nowrap text-muted-foreground xl:inline">
              Branch: {branchName}
            </span>
          ) : null}
          <span className="hidden rounded-full border-2 border-border bg-muted px-3 py-1 text-xs font-bold text-foreground lg:inline">
            {planBadge}
          </span>
          {isSignedIn ? (
            <>
              {!isPro ? (
                <PrimaryLink href="/payment" className="px-4 py-2 text-sm">
                  Upgrade — ₹149
                </PrimaryLink>
              ) : null}
              <ProfileAvatarLink />
            </>
          ) : (
            <>
              <SecondaryLink
                href="/sign-in"
                showArrow={false}
                className="px-4 py-2 text-sm"
              >
                Log in
              </SecondaryLink>
              <PrimaryLink href="/sign-in" className="px-4 py-2 text-sm">
                Sign up free
              </PrimaryLink>
            </>
          )}
        </div>
      </div>
    </header>
  );
}

function ProfileAvatarLink() {
  const { user } = useUser();
  const name = user?.fullName ?? user?.username ?? "Profile";

  return (
    <Link
      href="/profile"
      aria-label="Open your profile"
      title={name}
      className="flex size-9 shrink-0 items-center justify-center overflow-hidden rounded-full border-2 border-border bg-muted text-sm font-bold text-foreground transition-transform hover:-translate-y-0.5"
    >
      {user?.imageUrl ? (
        // biome-ignore lint/performance/noImgElement: Clerk avatar is a remote URL; plain img avoids next/image remote config
        <img
          src={user.imageUrl}
          alt={name}
          className="size-full object-cover"
          referrerPolicy="no-referrer"
        />
      ) : (
        name.charAt(0).toUpperCase()
      )}
    </Link>
  );
}

export function ProfileHeader({ isPro = false }: { isPro?: boolean }) {
  return (
    <header className="flex flex-wrap items-center justify-between gap-3 border-b-2 border-border bg-card px-4 py-3 md:px-6">
      <div className="flex items-center gap-3">
        <Link
          href="/git-visualizer"
          className="inline-flex items-center gap-1.5 text-sm font-semibold text-muted-foreground hover:text-foreground"
        >
          <svg width="16" height="16" viewBox="0 0 24 24" aria-hidden>
            <path
              d="M19 12H5M11 6l-6 6 6 6"
              stroke="currentColor"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
              fill="none"
            />
          </svg>
          Back to visualizer
        </Link>
        <PlayfulLogo href="/git-visualizer" />
      </div>
      <span className="rounded-full border-2 border-border bg-muted px-3 py-1 text-xs font-bold text-foreground">
        {isPro ? "Pro profile" : "Your profile"}
      </span>
    </header>
  );
}

export function SimpleBackNav({
  href,
  label,
}: {
  href: string;
  label: string;
}) {
  return (
    <Link
      href={href}
      className="inline-flex items-center gap-1.5 text-sm font-semibold text-muted-foreground hover:text-foreground"
    >
      <svg width="16" height="16" viewBox="0 0 24 24" aria-hidden>
        <path
          d="M19 12H5M11 6l-6 6 6 6"
          stroke="currentColor"
          strokeWidth="2.5"
          strokeLinecap="round"
          strokeLinejoin="round"
          fill="none"
        />
      </svg>
      {label}
    </Link>
  );
}
