"use client";

import { useState } from "react";
import { CheckCircle2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { useFollowToggle } from "@/services/queries/follow";

interface FollowButtonProps {
  username: string;
  isFollowing: boolean;
  className?: string;
}

export function FollowButton({
  username,
  isFollowing,
  className,
}: FollowButtonProps) {
  const { mutate, isPending } = useFollowToggle(username);
  const [hovered, setHovered] = useState(false);

  const showUnfollow = isFollowing && hovered;

  return (
    <button
      type="button"
      disabled={isPending}
      onClick={() => mutate({ isFollowing })}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      className={cn(
        "inline-flex items-center justify-center gap-2 rounded-full font-bold transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background",
        "h-10 px-4 text-sm leading-7 tracking-[-0.14px]",
        "md:h-12 md:px-6 md:text-base md:leading-[30px] md:tracking-[-0.32px]",
        isFollowing
          ? showUnfollow
            ? "border border-destructive bg-transparent text-destructive"
            : "border border-neutral-900 bg-transparent text-neutral-25 md:w-[130px]"
          : "bg-primary-300 text-neutral-25 md:w-[120px]",
        isPending && "opacity-50",
        className,
      )}
    >
      {isFollowing && !showUnfollow && (
        <CheckCircle2 className="size-[10.667px] md:size-5" />
      )}
      {showUnfollow ? "Unfollow" : isFollowing ? "Following" : "Follow"}
    </button>
  );
}
