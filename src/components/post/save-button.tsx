"use client";

import { cn } from "@/lib/utils";
import { BookmarkIcon } from "@/components/icons/bookmark";
import { useSaveToggle } from "@/services/queries/saves";

interface SaveButtonProps {
  postId: string;
  savedByMe?: boolean;
  className?: string;
}

export function SaveButton({ postId, savedByMe, className }: SaveButtonProps) {
  const saveToggle = useSaveToggle(postId);
  const isSaved = Boolean(savedByMe);

  return (
    <button
      type="button"
      onClick={() => saveToggle.mutate({ savedByMe: isSaved })}
      disabled={saveToggle.isPending}
      className={cn(
        "inline-flex items-center rounded transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background disabled:cursor-not-allowed disabled:opacity-60",
        isSaved ? "text-destructive" : "text-foreground hover:text-foreground/80",
        className,
      )}
      aria-label={isSaved ? "Unsave post" : "Save post"}
      aria-pressed={isSaved}
    >
      <BookmarkIcon filled={isSaved} className="size-6" />
    </button>
  );
}
