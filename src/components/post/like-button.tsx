"use client";

import { cn } from "@/lib/utils";
import { HeartIcon } from "@/components/icons/heart";
import { useLikeToggle } from "@/services/queries/likes";

interface LikeButtonProps {
  postId: string;
  likedByMe: boolean;
  likeCount: number;
  onCountClick?: () => void;
  className?: string;
}

export function LikeButton({
  postId,
  likedByMe,
  likeCount,
  onCountClick,
  className,
}: LikeButtonProps) {
  const likeToggle = useLikeToggle(postId);

  return (
    <div className={cn("inline-flex items-center gap-1.5 md:gap-[6px]", className)}>
      <button
        type="button"
        onClick={() => likeToggle.mutate({ likedByMe })}
        disabled={likeToggle.isPending}
        className={cn(
          "inline-flex items-center rounded transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background disabled:cursor-not-allowed disabled:opacity-60",
          likedByMe ? "text-destructive" : "text-foreground hover:text-foreground/80",
        )}
        aria-label={likedByMe ? "Unlike post" : "Like post"}
        aria-pressed={likedByMe}
      >
        <HeartIcon filled={likedByMe} className="size-6" />
      </button>

      <span
        onClick={onCountClick}
        className={cn(
          "text-sm font-semibold leading-7 tracking-[-0.28px] md:text-base md:leading-[30px] md:tracking-[-0.32px]",
          likedByMe ? "text-destructive" : "text-foreground",
          onCountClick && "cursor-pointer hover:opacity-80",
        )}
      >
        {likeCount}
      </span>
    </div>
  );
}
