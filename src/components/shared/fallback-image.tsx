"use client";

import { useState } from "react";
import Image, { type ImageProps } from "next/image";
import { User } from "lucide-react";
import { cn } from "@/lib/utils";

interface FallbackImageProps extends Omit<ImageProps, "onError"> {
  fallbackClassName?: string;
}

export function FallbackImage({
  alt,
  className,
  fallbackClassName,
  ...props
}: FallbackImageProps) {
  const [error, setError] = useState(false);

  if (error) {
    return (
      <div
        className={cn(
          "flex items-center justify-center bg-muted",
          className,
          fallbackClassName,
        )}
      >
        <User className="size-1/3 text-muted-foreground" />
      </div>
    );
  }

  return (
    <Image
      alt={alt}
      className={className}
      onError={() => setError(true)}
      {...props}
    />
  );
}
