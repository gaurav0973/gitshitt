import Link from "next/link";
import Image from "next/image";
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
    <Link href={href} className={cn("inline-flex items-center", className)}>
      {showWordmark ? (
        <Image
          src="/logo-lockup.png"
          alt="gitshitt"
          width={300}
          height={57}
          className="h-9 w-auto"
          priority
        />
      ) : (
        <Image
          src="/logo-icon.png"
          alt="gitshitt"
          width={150}
          height={150}
          className="size-9"
          priority
        />
      )}
    </Link>
  );
}
