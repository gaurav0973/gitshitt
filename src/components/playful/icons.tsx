type IconProps = { className?: string; size?: number };

const stroke = {
  strokeWidth: 2.5,
  strokeLinecap: "round" as const,
  strokeLinejoin: "round" as const,
  fill: "none",
};

export function ArrowRightIcon({ className, size = 16 }: IconProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      className={className}
      aria-hidden
    >
      <path
        d="M5 12h14M13 6l6 6-6 6"
        stroke="currentColor"
        {...stroke}
      />
    </svg>
  );
}

export function ArrowLeftIcon({ className, size = 16 }: IconProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      className={className}
      aria-hidden
    >
      <path
        d="M19 12H5M11 6l-6 6 6 6"
        stroke="currentColor"
        {...stroke}
      />
    </svg>
  );
}

export function CheckIcon({ className, size = 14 }: IconProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      className={className}
      aria-hidden
    >
      <path d="M5 13l4 4L19 7" stroke="currentColor" {...stroke} />
    </svg>
  );
}

export function TerminalIcon({ className, size = 22 }: IconProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      className={className}
      aria-hidden
    >
      <path d="M6 8l4 4-4 4M12 16h6" stroke="currentColor" {...stroke} />
    </svg>
  );
}

export function ActivityIcon({ className, size = 22 }: IconProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      className={className}
      aria-hidden
    >
      <path
        d="M4 14l4-6 4 8 4-10 4 8"
        stroke="currentColor"
        {...stroke}
      />
    </svg>
  );
}

export function ShieldIcon({ className, size = 22 }: IconProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      className={className}
      aria-hidden
    >
      <path
        d="M12 3l8 3v6c0 5-3.5 9-8 9s-8-4-8-9V6l8-3z"
        stroke="currentColor"
        {...stroke}
      />
    </svg>
  );
}

export function LockIcon({ className, size = 14 }: IconProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      className={className}
      aria-hidden
    >
      <rect
        x="5"
        y="11"
        width="14"
        height="10"
        rx="2"
        stroke="currentColor"
        {...stroke}
      />
      <path d="M8 11V8a4 4 0 118 0v3" stroke="currentColor" {...stroke} />
    </svg>
  );
}

export function LightbulbIcon({ className, size = 20 }: IconProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      className={className}
      aria-hidden
    >
      <path
        d="M9 18h6M10 22h4M12 3a5 5 0 015 5c0 2-1 3-2 4H9c-1-1-2-2-2-4a5 5 0 015-5z"
        stroke="currentColor"
        {...stroke}
      />
    </svg>
  );
}

export function BoltIcon({ className, size = 18 }: IconProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      className={className}
      aria-hidden
    >
      <path d="M13 2L4 14h7l-1 8 9-12h-7l1-8z" stroke="currentColor" {...stroke} />
    </svg>
  );
}

export function MinusCircleIcon({ className, size = 18 }: IconProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      className={className}
      aria-hidden
    >
      <circle cx="12" cy="12" r="9" stroke="currentColor" {...stroke} />
      <path d="M8 12h8" stroke="currentColor" {...stroke} />
    </svg>
  );
}

export function SparkleIcon({ className, size = 20 }: IconProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      className={className}
      aria-hidden
    >
      <path
        d="M12 3v4M12 17v4M3 12h4M17 12h4M6 6l3 3M15 15l3 3M18 6l-3 3M9 15l-3 3"
        stroke="currentColor"
        {...stroke}
      />
    </svg>
  );
}

export function GitBranchIcon({ className, size = 20 }: IconProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      className={className}
      aria-hidden
    >
      <circle cx="6" cy="6" r="2.5" stroke="currentColor" {...stroke} />
      <circle cx="6" cy="18" r="2.5" stroke="currentColor" {...stroke} />
      <circle cx="18" cy="12" r="2.5" stroke="currentColor" {...stroke} />
      <path d="M6 8.5v9M8.5 6h5a4 4 0 014 4v2" stroke="currentColor" {...stroke} />
    </svg>
  );
}

export function TagIcon({ className, size = 20 }: IconProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      className={className}
      aria-hidden
    >
      <path
        d="M3 12l9 9 9-9V3H12L3 12z"
        stroke="currentColor"
        {...stroke}
      />
      <circle cx="16" cy="8" r="1.5" fill="currentColor" />
    </svg>
  );
}

export function ResetIcon({ className, size = 20 }: IconProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      className={className}
      aria-hidden
    >
      <path
        d="M4 12a8 8 0 0113.5-5.7M20 12a8 8 0 01-13.5 5.7M4 4v5h5M20 20v-5h-5"
        stroke="currentColor"
        {...stroke}
      />
    </svg>
  );
}
