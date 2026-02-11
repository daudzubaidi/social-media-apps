"use client";

import { Heart } from "lucide-react";
import { cn } from "@/lib/utils";
import { useLikeToggle } from "@/services/queries/likes";

interface LikeButtonProps {
  postId: string;
  likedByMe: boolean;
  likeCount: number;
  className?: string;
}

export function LikeButton({
  postId,
  likedByMe,
  likeCount,
  className,
}: LikeButtonProps) {
  const likeToggle = useLikeToggle(postId);

  return (
    <button
      type="button"
      onClick={() => likeToggle.mutate({ likedByMe })}
      disabled={likeToggle.isPending}
      className={cn(
        "inline-flex items-center gap-1 text-sm transition-colors disabled:cursor-not-allowed disabled:opacity-60",
        likedByMe ? "text-primary" : "text-muted-foreground",
        className,
      )}
      aria-label={likedByMe ? "Unlike post" : "Like post"}
      aria-pressed={likedByMe}
    >
      <Heart className={cn("size-4", likedByMe && "fill-current")} />
      <span>{likeCount}</span>
    </button>
  );
}
