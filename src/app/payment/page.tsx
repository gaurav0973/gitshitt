import Link from "next/link";
import {
  ConfettiDecor,
  DecorativeCircle,
  DotGrid,
  Eyebrow,
} from "@/components/playful/decor";
import { BadgeStar, StickerCard } from "@/components/playful/card";
import { SimpleBackNav } from "@/components/playful/nav";
import {
  BoltIcon,
  CheckIcon,
  LockIcon,
  MinusCircleIcon,
  ShieldIcon,
} from "@/components/playful/icons";
import { PaymentCheckoutButton } from "@/components/PaymentCheckoutButton";

const PRO_FEATURES = [
  "Every Git command, no limits",
  "Save & resume your sessions",
  "Presentation & recording presets",
  "Priority feature requests",
];

export default function PaymentPage() {
  return (
    <DotGrid className="relative min-h-screen overflow-hidden px-4 py-10 md:px-6">
      <DecorativeCircle color="quaternary" className="-left-16 top-10" size={220} />
      <DecorativeCircle color="secondary" className="-right-12 bottom-10" size={260} />
      <ConfettiDecor />

      <div className="relative z-10 mx-auto max-w-lg">
        <SimpleBackNav href="/git-visualizer" label="Back to visualizer" />

        <div className="mt-8 text-center">
          <Eyebrow className="mx-auto">One-time unlock</Eyebrow>
          <h1 className="mt-4 font-heading text-3xl font-extrabold sm:text-4xl">
            Unlock the full playground
          </h1>
          <p className="mt-3 text-muted-foreground">
            One payment, no subscription. Pay once and keep every feature for
            good.
          </p>
        </div>

        <StickerCard featured className="relative mx-auto mt-10 max-w-md p-6">
          <BadgeStar>ONE-TIME</BadgeStar>
          <p className="font-heading text-4xl font-extrabold">
            ₹149 <span className="text-lg font-bold text-muted-foreground">/ forever</span>
          </p>

          <ul className="mt-6 space-y-3">
            {PRO_FEATURES.map((item) => (
              <li key={item} className="flex items-center gap-3 text-sm">
                <span className="flex size-6 shrink-0 items-center justify-center rounded-full bg-accent text-white">
                  <CheckIcon size={12} />
                </span>
                {item}
              </li>
            ))}
          </ul>

          <PaymentCheckoutButton />

          <p className="mt-4 flex items-center justify-center gap-1.5 text-xs text-muted-foreground">
            <LockIcon />
            Powered by Dodo Payments · secure checkout
          </p>
        </StickerCard>

        <div className="mt-8 grid gap-4 text-center sm:grid-cols-3">
          <div className="flex flex-col items-center gap-1 text-sm">
            <ShieldIcon className="text-accent" />
            <span className="font-bold">Secure payment</span>
          </div>
          <div className="flex flex-col items-center gap-1 text-sm">
            <BoltIcon className="text-tertiary" />
            <span className="font-bold">Instant unlock</span>
          </div>
          <div className="flex flex-col items-center gap-1 text-sm">
            <MinusCircleIcon className="text-quaternary" />
            <span className="font-bold">No subscription</span>
          </div>
        </div>

        <p className="mt-8 text-center">
          <Link
            href="/git-visualizer"
            className="text-sm font-semibold text-muted-foreground hover:text-accent"
          >
            Maybe later
          </Link>
        </p>
      </div>
    </DotGrid>
  );
}
