"use client";

import Image from "next/image";
import { useState } from "react";
import { cn } from "@/lib/cn";

export default function CoverImage({
  src,
  alt,
  className,
  sizes,
  priority = false,
}: {
  src: string;
  alt: string;
  className?: string;
  sizes?: string;
  priority?: boolean;
}) {
  const [failed, setFailed] = useState(false);

  if (failed) {
    return <div className={cn("absolute inset-0 bg-navy-800", className)} aria-hidden="true" />;
  }

  return (
    <Image
      src={src}
      alt={alt}
      fill
      sizes={sizes}
      priority={priority}
      quality={65}
      className={className}
      onError={() => setFailed(true)}
    />
  );
}
