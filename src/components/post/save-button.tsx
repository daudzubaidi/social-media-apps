"use client";

import { Bookmark } from "lucide-react";
import { cn } from "@/lib/utils";
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
        "inline-flex items-center text-sm transition-colors disabled:cursor-not-allowed disabled:opacity-60",
        isSaved ? "text-primary" : "text-muted-foreground",
        className,
      )}
      aria-label={isSaved ? "Unsave post" : "Save post"}
      aria-pressed={isSaved}
    >
      <Bookmark className={cn("size-4", isSaved && "fill-current")} />
    </button>
  );
}
