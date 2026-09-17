import Link from "next/link";
import { cn } from "@/lib/utils";
import { ArrowRightIcon } from "./icons";

type ButtonBase = {
  className?: string;
  children: React.ReactNode;
  showArrow?: boolean;
};

export function PrimaryButton({
  className,
  children,
  showArrow = true,
  ...props
}: ButtonBase & React.ButtonHTMLAttributes<HTMLButtonElement>) {
  return (
    <button
      className={cn("btn-primary", !showArrow && "pr-5", className)}
      {...props}
    >
      <span>{children}</span>
      {showArrow && (
        <span className="btn-primary-chip">
          <ArrowRightIcon size={14} className="text-accent" />
        </span>
      )}
    </button>
  );
}

export function PrimaryLink({
  href,
  className,
  children,
  showArrow = true,
}: ButtonBase & { href: string }) {
  return (
    <Link href={href} className={cn("btn-primary", !showArrow && "pr-5", className)}>
      <span>{children}</span>
      {showArrow && (
        <span className="btn-primary-chip">
          <ArrowRightIcon size={14} className="text-accent" />
        </span>
      )}
    </Link>
  );
}

export function SecondaryButton({
  className,
  children,
  ...props
}: ButtonBase & React.ButtonHTMLAttributes<HTMLButtonElement>) {
  return (
    <button className={cn("btn-secondary", className)} {...props}>
      {children}
    </button>
  );
}

export function SecondaryLink({
  href,
  className,
  children,
}: ButtonBase & { href: string }) {
  return (
    <Link href={href} className={cn("btn-secondary", className)}>
      {children}
    </Link>
  );
}

export function PillTab({
  active,
  children,
  className,
  ...props
}: {
  active?: boolean;
  className?: string;
  children: React.ReactNode;
} & React.ButtonHTMLAttributes<HTMLButtonElement>) {
  return (
    <button
      className={cn("pill-tab", active && "pill-tab-active", className)}
      {...props}
    >
      {children}
    </button>
  );
}
