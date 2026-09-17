import { cn } from "@/lib/utils";

type StickerCardProps = {
  children: React.ReactNode;
  className?: string;
  featured?: boolean;
  icon?: React.ReactNode;
  iconClassName?: string;
};

export function StickerCard({
  children,
  className,
  featured = false,
  icon,
  iconClassName,
}: StickerCardProps) {
  return (
    <article className={cn("sticker-card", featured && "sticker-card-featured", className)}>
      {icon && (
        <div className={cn("sticker-card-icon", iconClassName)}>{icon}</div>
      )}
      {children}
    </article>
  );
}

export function FeatureCard({
  title,
  description,
  icon,
  iconClassName,
}: {
  title: string;
  description: string;
  icon: React.ReactNode;
  iconClassName?: string;
}) {
  return (
    <StickerCard icon={icon} iconClassName={iconClassName} className="pt-10">
      <h3 className="font-heading text-lg font-bold text-foreground">{title}</h3>
      <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
        {description}
      </p>
    </StickerCard>
  );
}

export function BadgeStar({ children }: { children: React.ReactNode }) {
  return <span className="badge-star">{children}</span>;
}
