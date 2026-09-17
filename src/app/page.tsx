"use client";

import { HeroTerminalMock } from "@/components/playful/hero-terminal-mock";
import { HomeNav } from "@/components/playful/nav";
import { PrimaryLink, SecondaryLink } from "@/components/playful/buttons";
import {
  ConfettiDecor,
  DecorativeCircle,
  DashedConnector,
  DotGrid,
  Eyebrow,
} from "@/components/playful/decor";
import { BadgeStar, FeatureCard, StickerCard } from "@/components/playful/card";
import {
  ActivityIcon,
  CheckIcon,
  ShieldIcon,
  TerminalIcon,
} from "@/components/playful/icons";
import Link from "next/link";

const FREE_FEATURES = [
  "Interactive terminal sandbox",
  "Live commit graph",
  "3 guided demo flows",
];

const PRO_FEATURES = [
  "Every Git command, no limits",
  "Save & resume your sessions",
  "Presentation & recording presets",
  "Priority feature requests",
];

export default function HomePage() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <HomeNav />

      <main>
        <section className="relative mx-auto max-w-6xl overflow-hidden px-4 pb-16 pt-6 md:px-6 md:pt-8">
          <ConfettiDecor />

          <div className="relative grid items-center gap-10 lg:grid-cols-2 lg:gap-12">
            <div className="space-y-6">
              <Eyebrow>Practice without fear</Eyebrow>
              <h1 className="font-heading text-4xl font-extrabold leading-[1.08] tracking-tight sm:text-5xl lg:text-6xl">
                Learn Git without losing your shit.
              </h1>
              <p className="max-w-lg text-base leading-relaxed text-muted-foreground sm:text-lg">
                Type real commands in a terminal, watch the commit graph update
                live, and practice branching, merging, and rebasing in a sandbox
                where nothing can break.
              </p>
              <div className="flex flex-wrap gap-3">
                <PrimaryLink href="/git-visualizer">Start practicing</PrimaryLink>
                <SecondaryLink href="/git-visualizer" showArrow={false}>
                  See how it works
                </SecondaryLink>
              </div>
            </div>

            <div className="relative mx-auto w-full max-w-md lg:mx-0 lg:justify-self-end">
              <DecorativeCircle
                color="tertiary"
                className="-right-8 top-1/2 -translate-y-1/2 opacity-90"
                size={280}
              />
              <HeroTerminalMock className="relative z-10 w-full" />
            </div>
          </div>
        </section>

        <DotGrid className="relative px-4 py-16 md:px-6">
          <DashedConnector className="left-0 right-0 top-[42%]" />
          <div id="features" className="relative mx-auto max-w-6xl">
            <div className="mx-auto mb-12 max-w-2xl text-center">
              <Eyebrow className="mx-auto">Why it works</Eyebrow>
              <h2 className="mt-4 font-heading text-3xl font-extrabold sm:text-4xl">
                Three things that make it click
              </h2>
            </div>

            <div className="grid items-stretch gap-x-6 gap-y-12 pt-4 md:grid-cols-3">
              <FeatureCard
                title="Type real commands"
                description="Not a quiz app. A terminal that accepts actual git commands and responds like you'd expect."
                icon={<TerminalIcon className="text-accent" />}
                iconClassName="bg-accent/15 text-accent"
              />
              <FeatureCard
                title="Watch the graph update live"
                description="Every commit, branch, and merge shows up instantly on an interactive commit graph."
                icon={<ActivityIcon className="text-secondary" />}
                iconClassName="bg-secondary/15 text-secondary"
              />
              <FeatureCard
                title="Nothing to lose"
                description="No repos harmed. No credentials needed. Break things on purpose and learn from it."
                icon={<ShieldIcon className="text-tertiary" />}
                iconClassName="bg-tertiary/15 text-foreground"
              />
            </div>
          </div>
        </DotGrid>

        <section
          id="pricing"
          className="relative overflow-hidden bg-muted px-4 py-16 md:px-6"
        >
          <DecorativeCircle
            color="quaternary"
            className="-left-24 top-8 opacity-70"
            size={200}
          />
          <DecorativeCircle
            color="secondary"
            className="-right-16 bottom-0 opacity-60"
            size={240}
          />

          <div className="relative mx-auto max-w-4xl text-center">
            <Eyebrow className="mx-auto">Pricing</Eyebrow>
            <h2 className="mt-4 font-heading text-3xl font-extrabold sm:text-4xl">
              Free to start. ₹100 to unlock it all.
            </h2>
            <p className="mx-auto mt-3 max-w-xl text-muted-foreground">
              Practice for free with demos and core commands. Pay once to unlock
              the full playground forever.
            </p>

            <div className="mx-auto mt-10 grid max-w-4xl items-stretch gap-6 md:grid-cols-2">
              <StickerCard className="flex h-full flex-col p-6 text-left">
                <p className="font-heading text-2xl font-extrabold">Free</p>
                <p className="mt-1 text-sm text-muted-foreground">forever</p>
                <p className="mt-4 font-heading text-4xl font-extrabold">₹0</p>
                <ul className="mt-6 space-y-2">
                  {FREE_FEATURES.map((item) => (
                    <li
                      key={item}
                      className="flex items-center gap-2 text-sm text-foreground"
                    >
                      <span className="flex size-5 items-center justify-center rounded-full bg-accent text-white">
                        <CheckIcon size={12} />
                      </span>
                      {item}
                    </li>
                  ))}
                </ul>
                <PrimaryLink
                  href="/git-visualizer"
                  className="mt-auto w-full justify-center pt-8"
                >
                  Start practicing
                </PrimaryLink>
              </StickerCard>

              <StickerCard featured className="relative flex h-full flex-col p-6 text-left">
                <BadgeStar>UNLOCK ALL</BadgeStar>
                <p className="font-heading text-2xl font-extrabold">Pro</p>
                <p className="mt-1 text-sm text-muted-foreground">one-time</p>
                <p className="mt-4 font-heading text-4xl font-extrabold">
                  ₹100
                </p>
                <ul className="mt-6 space-y-2">
                  {PRO_FEATURES.map((item) => (
                    <li
                      key={item}
                      className="flex items-center gap-2 text-sm text-foreground"
                    >
                      <span className="flex size-5 items-center justify-center rounded-full bg-accent text-white">
                        <CheckIcon size={12} />
                      </span>
                      {item}
                    </li>
                  ))}
                </ul>
                <PrimaryLink href="/payment" className="mt-auto w-full justify-center pt-8">
                  Unlock full access
                </PrimaryLink>
              </StickerCard>
            </div>
          </div>
        </section>
      </main>

      <footer className="border-t-2 border-border px-4 py-8 md:px-6">
        <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-4 text-sm text-muted-foreground">
          <p>© {new Date().getFullYear()} gitshitt — practice Git safely.</p>
          <div className="flex items-center gap-4">
            <a
              href="https://github.com/gaurav0973/gitshitt"
              target="_blank"
              rel="noopener noreferrer"
              className="font-semibold hover:text-accent"
            >
              GitHub
            </a>
            <Link href="/login" className="font-semibold hover:text-accent">
              Log in
            </Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
