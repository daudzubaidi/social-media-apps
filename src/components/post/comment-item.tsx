"use client";

import Link from "next/link";
import { Trash2, User } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ROUTES } from "@/config/routes";
import { cn, formatRelativeTime } from "@/lib/utils";
import type { Comment } from "@/types/comment";

interface CommentItemProps {
  comment: Comment;
  canDelete?: boolean;
  isDeleting?: boolean;
  onDelete?: (commentId: string) => void;
  className?: string;
}

export function CommentItem({
  comment,
  canDelete = false,
  isDeleting = false,
  onDelete,
  className,
}: CommentItemProps) {
  const authorInitial = comment.author.name.charAt(0).toUpperCase();

  return (
    <article className={cn("flex flex-col gap-3", className)}>
      <div className="flex items-center justify-between gap-2">
        <div className="flex min-w-0 items-center gap-2">
          <Avatar size="default" className="size-10">
            <AvatarImage src={comment.author.avatarUrl ?? undefined} alt={comment.author.name} />
            <AvatarFallback>{authorInitial || <User className="size-4" />}</AvatarFallback>
          </Avatar>

          <div className="min-w-0 pb-[2px]">
            <Link
              href={ROUTES.PROFILE(comment.author.username)}
              className="block truncate text-sm font-bold leading-7 tracking-[-0.14px] text-foreground hover:underline"
            >
              {comment.author.name}
            </Link>
            <p className="text-xs leading-4 text-muted-foreground">
              {formatRelativeTime(comment.createdAt)}
            </p>
          </div>
        </div>

        {canDelete && onDelete && (
          <button
            type="button"
            onClick={() => onDelete(comment.id)}
            disabled={isDeleting}
            className="inline-flex size-6 items-center justify-center rounded text-muted-foreground transition-colors hover:text-destructive focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-60"
            aria-label="Delete comment"
          >
            <Trash2 className="size-4" />
          </button>
        )}
      </div>

      <p className="w-full break-words text-sm leading-7 tracking-[-0.28px] text-foreground">
        {comment.text}
      </p>
    </article>
  );
}
