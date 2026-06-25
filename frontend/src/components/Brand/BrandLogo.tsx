import Image from "next/image";

import { cn } from "@/lib/utils";

interface BrandLogoProps {
  className?: string;
  imageClassName?: string;
  alt?: string;
  priority?: boolean;
}

export function BrandLogo({
  className,
  imageClassName,
  alt = "Frag Store",
  priority = false,
}: BrandLogoProps) {
  return (
    <span className={cn("relative block h-auto w-full", className)}>
      <Image
        src="/images/logo/logo.webp"
        alt={alt}
        width={3910}
        height={1610}
        priority={priority}
        className={cn("h-auto w-full object-contain", imageClassName)}
      />
    </span>
  );
}
