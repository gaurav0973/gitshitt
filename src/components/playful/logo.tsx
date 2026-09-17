import Link from "next/link";
import { cn } from "@/lib/utils";

export function PlayfulLogo({
  href = "/",
  className,
  showWordmark = true,
}: {
  href?: string;
  className?: string;
  showWordmark?: boolean;
}) {
  return (
    <Link href={href} className={cn("inline-flex items-center gap-2.5", className)}>
      <span className="flex size-9 items-center justify-center rounded-lg border-2 border-foreground bg-accent shadow-pop">
        <svg width="18" height="18" viewBox="0 0 24 24" aria-hidden>
          <path
            d="M6 8l4 4-4 4M12 16h6"
            stroke="white"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
            fill="none"
          />
        </svg>
      </span>
      {showWordmark && (
        <span className="font-heading text-xl font-extrabold tracking-tight text-foreground">
          gitshitt
        </span>
      )}
    </Link>
  );
}
