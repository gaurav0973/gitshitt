import Link from "next/link";
import { SignIn } from "@clerk/nextjs";
import {
  ConfettiDecor,
  DecorativeCircle,
  DotGrid,
} from "@/components/playful/decor";
import { LockIcon } from "@/components/playful/icons";
import { PlayfulLogo } from "@/components/playful/logo";
import { SimpleBackNav } from "@/components/playful/nav";
import { clerkSignInAppearance } from "@/lib/clerkAppearance";

export function generateStaticParams() {
  return [{ "sign-in": [] }];
}

export default function SignInPage() {
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

      <div className="relative z-10 w-full max-w-110">
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

          <div className="mt-6">
            <SignIn
              appearance={clerkSignInAppearance}
              routing="path"
              path="/sign-in"
            />
          </div>

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
