import Link from "next/link";
import { PlayfulLogo } from "./logo";
import { PrimaryLink, SecondaryLink } from "./buttons";

export function HomeNav() {
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
          href="/login"
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

export function VisualizerHeader() {
  return (
    <header className="flex flex-wrap items-center justify-between gap-3 border-b-2 border-border bg-card px-4 py-3 md:px-6">
      <div className="flex items-center gap-3">
        <Link
          href="/"
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
          Home
        </Link>
        <PlayfulLogo href="/git-visualizer" />
      </div>
      <div className="flex items-center gap-2 sm:gap-3">
        <span className="rounded-full border-2 border-border bg-muted px-3 py-1 text-xs font-bold text-foreground">
          Free plan · 3 demos
        </span>
        <PrimaryLink href="/payment" className="px-4 py-2 text-sm">
          Upgrade — ₹100
        </PrimaryLink>
      </div>
    </header>
  );
}

export function ProfileHeader() {
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
        <PlayfulLogo href="/" />
      </div>
      <span className="rounded-full border-2 border-border bg-muted px-3 py-1 text-xs font-bold text-foreground">
        Your profile
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
