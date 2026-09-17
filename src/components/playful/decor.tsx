import { cn } from "@/lib/utils";

export function Eyebrow({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return <span className={cn("eyebrow", className)}>{children}</span>;
}

export function DotGrid({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return <section className={cn("dot-grid", className)}>{children}</section>;
}

export function DecorativeCircle({
  color,
  className,
  size = 280,
}: {
  color: "tertiary" | "secondary" | "quaternary";
  className?: string;
  size?: number;
}) {
  const colorClass =
    color === "tertiary"
      ? "bg-tertiary"
      : color === "secondary"
        ? "bg-secondary"
        : "bg-quaternary";

  return (
    <div
      aria-hidden
      className={cn("pointer-events-none absolute rounded-full", colorClass, className)}
      style={{ width: size, height: size }}
    />
  );
}

export function ConfettiDecor({ className }: { className?: string }) {
  return (
    <div
      aria-hidden
      className={cn("pointer-events-none absolute inset-0 overflow-hidden", className)}
    >
      <span className="confetti-triangle absolute right-[12%] top-[8%] bg-secondary" />
      <span className="confetti-square absolute bottom-[18%] left-[6%] bg-quaternary" />
      <span className="confetti-dot absolute right-[8%] top-[55%] bg-secondary" />
    </div>
  );
}

export function DashedConnector({ className }: { className?: string }) {
  return (
    <svg
      aria-hidden
      className={cn("pointer-events-none absolute hidden lg:block", className)}
      width="100%"
      height="40"
      preserveAspectRatio="none"
    >
      <line
        x1="12%"
        y1="20"
        x2="88%"
        y2="20"
        stroke="var(--border)"
        strokeWidth="2"
        strokeDasharray="8 8"
      />
    </svg>
  );
}
