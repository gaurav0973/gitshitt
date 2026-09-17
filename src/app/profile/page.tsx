import Link from "next/link";
import { ProfileHeader } from "@/components/playful/nav";
import { PrimaryLink, SecondaryButton } from "@/components/playful/buttons";
import { StickerCard } from "@/components/playful/card";
import {
  ActivityIcon,
  GitBranchIcon,
  LockIcon,
  ResetIcon,
  SparkleIcon,
  TagIcon,
  TerminalIcon,
} from "@/components/playful/icons";

const BADGES = [
  { label: "First merge", icon: <GitBranchIcon />, color: "bg-accent text-white" },
  { label: "Rebase master", icon: <ResetIcon />, color: "bg-secondary text-white" },
  { label: "Tag it", icon: <TagIcon />, color: "bg-tertiary text-foreground" },
  { label: "Reset hero", icon: <SparkleIcon />, color: "bg-quaternary text-white" },
];

const STATS = [
  {
    title: "Sessions",
    value: "12",
    subtitle: "Total sessions",
    icon: <TerminalIcon className="text-accent" />,
    iconClass: "bg-accent/15",
  },
  {
    title: "Commands",
    value: "184",
    subtitle: "Commands run",
    icon: <ActivityIcon className="text-secondary" />,
    iconClass: "bg-secondary/15",
  },
  {
    title: "Streak",
    value: "5-day",
    subtitle: "Current streak",
    icon: <SparkleIcon className="text-tertiary" />,
    iconClass: "bg-tertiary/20",
  },
];

export default function ProfilePage() {
  return (
    <div className="min-h-screen bg-background">
      <ProfileHeader />

      <main className="mx-auto grid max-w-6xl gap-6 px-4 py-8 md:grid-cols-[300px_1fr] md:px-6">
        <StickerCard className="h-fit p-6 text-center">
          <div className="mx-auto flex size-20 items-center justify-center rounded-full border-2 border-foreground bg-accent font-heading text-2xl font-extrabold text-white">
            GM
          </div>
          <h1 className="mt-4 font-heading text-xl font-extrabold">Gaurav Maurya</h1>
          <p className="text-sm text-muted-foreground">you@example.com</p>
          <span className="mt-3 inline-flex rounded-full border-2 border-border bg-muted px-3 py-1 text-[11px] font-bold uppercase tracking-wider">
            Free plan
          </span>
          <PrimaryLink href="/payment" className="mt-5 w-full justify-center">
            Upgrade to Pro
          </PrimaryLink>
          <p className="mt-4 text-xs text-muted-foreground">
            Signed in with GitHub · via Clerk
          </p>
          <SecondaryButton className="mt-4 w-full justify-center">
            Sign out
          </SecondaryButton>
        </StickerCard>

        <div className="space-y-6">
          <section>
            <h2 className="mb-4 font-heading text-xl font-extrabold">Your progress</h2>
            <div className="grid gap-4 sm:grid-cols-3">
              {STATS.map((stat) => (
                <StickerCard
                  key={stat.title}
                  icon={stat.icon}
                  iconClassName={stat.iconClass}
                  className="pt-10"
                >
                  <p className="font-heading text-3xl font-extrabold">{stat.value}</p>
                  <p className="text-sm font-bold text-foreground">{stat.title}</p>
                  <p className="text-xs text-muted-foreground">{stat.subtitle}</p>
                </StickerCard>
              ))}
            </div>
          </section>

          <section>
            <h2 className="mb-4 font-heading text-xl font-extrabold">Badges earned</h2>
            <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
              {BADGES.map((badge) => (
                <div key={badge.label} className="flex flex-col items-center gap-2 text-center">
                  <span
                    className={`flex size-16 items-center justify-center rounded-full border-2 border-foreground ${badge.color}`}
                  >
                    {badge.icon}
                  </span>
                  <span className="text-xs font-bold">{badge.label}</span>
                </div>
              ))}
            </div>
          </section>

          <section>
            <h2 className="mb-4 font-heading text-xl font-extrabold">Saved sessions</h2>
            <div className="relative overflow-hidden rounded-2xl border-2 border-foreground bg-card">
              <div className="space-y-0 divide-y-2 divide-border">
                {["Feature branch walkthrough", "Merge conflict practice", "Rebase drill"].map(
                  (session) => (
                    <div
                      key={session}
                      className="px-4 py-3 text-sm text-muted-foreground/70"
                    >
                      {session}
                    </div>
                  ),
                )}
              </div>
              <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 bg-background/75 backdrop-blur-[1px]">
                <LockIcon className="text-foreground" size={22} />
                <PrimaryLink href="/payment" className="px-5 py-2 text-sm">
                  Upgrade — ₹100
                </PrimaryLink>
              </div>
            </div>
          </section>
        </div>
      </main>
    </div>
  );
}
