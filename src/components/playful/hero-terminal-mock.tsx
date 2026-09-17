import { cn } from "@/lib/utils";

export function HeroTerminalMock({ className }: { className?: string }) {
  return (
    <div
      className={cn(
        "overflow-hidden rounded-2xl border-2 border-foreground bg-[#1E293B] shadow-pop-lg",
        className,
      )}
    >
      <div className="flex items-center gap-2 border-b border-white/10 px-4 py-2.5">
        <span className="size-2.5 rounded-full bg-[#EF4444]" />
        <span className="size-2.5 rounded-full bg-[#FBBF24]" />
        <span className="size-2.5 rounded-full bg-[#34D399]" />
      </div>
      <div className="space-y-1.5 px-4 py-3 font-mono text-xs sm:text-sm">
        <p className="text-[#34D399]">$ git checkout -b feature/login</p>
        <p className="text-[#34D399]">$ git add .</p>
        <p className="text-[#34D399]">$ git commit -m &quot;add login form&quot;</p>
        <p className="text-[#FBBF24]">$ git merge feature/login</p>
      </div>
      <div className="border-t border-white/10 bg-[#172033] px-4 py-4">
        <svg viewBox="0 0 320 120" className="h-auto w-full" aria-hidden>
          <path
            d="M40 90 L40 30 L120 30 L120 60"
            fill="none"
            stroke="#8B5CF6"
            strokeWidth="4"
            strokeLinecap="round"
          />
          <path
            d="M120 60 L200 60 L200 90"
            fill="none"
            stroke="#F472B6"
            strokeWidth="4"
            strokeLinecap="round"
          />
          <path
            d="M200 90 L280 90"
            fill="none"
            stroke="#FBBF24"
            strokeWidth="4"
            strokeLinecap="round"
          />
          <circle cx="40" cy="90" r="10" fill="#8B5CF6" stroke="#1E293B" strokeWidth="2" />
          <circle cx="40" cy="30" r="10" fill="#8B5CF6" stroke="#1E293B" strokeWidth="2" />
          <circle cx="120" cy="60" r="10" fill="#F472B6" stroke="#1E293B" strokeWidth="2" />
          <circle cx="200" cy="90" r="10" fill="#F472B6" stroke="#1E293B" strokeWidth="2" />
          <circle cx="280" cy="90" r="10" fill="#FBBF24" stroke="#1E293B" strokeWidth="2" />
          <rect x="248" y="72" width="36" height="16" rx="8" fill="#1E293B" stroke="#FBBF24" strokeWidth="2" />
          <text x="256" y="84" fill="white" fontSize="8" fontFamily="monospace">
            HEAD
          </text>
        </svg>
      </div>
    </div>
  );
}
