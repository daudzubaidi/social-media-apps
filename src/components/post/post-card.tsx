"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { MessageCircle, Send, Heart, Bookmark } from "lucide-react";
import { toast } from "sonner";
import { FallbackImage } from "@/components/shared/fallback-image";
import { cn, formatRelativeTime } from "@/lib/utils";
import { ROUTES } from "@/config/routes";
import type { Post } from "@/types/post";

interface PostCardProps {
  post: Post;
  className?: string;
}

const CAPTION_PREVIEW_LENGTH = 140;

export function PostCard({ post, className }: PostCardProps) {
  const [isCaptionExpanded, setIsCaptionExpanded] = useState(false);

  const shouldShowToggle = useMemo(
    () => post.caption.length > CAPTION_PREVIEW_LENGTH,
    [post.caption],
  );

  async function handleShare() {
    try {
      const postUrl =
        typeof window === "undefined"
          ? ROUTES.POST_DETAIL(post.id)
          : `${window.location.origin}${ROUTES.POST_DETAIL(post.id)}`;

      await navigator.clipboard.writeText(postUrl);
      toast.success("Post link copied");
    } catch {
      toast.error("Failed to copy link");
    }
  }

  return (
    <article
      className={cn(
        "w-full overflow-hidden rounded-2xl border border-border bg-card",
        className,
      )}
    >
      <div className="relative aspect-square w-full overflow-hidden bg-muted">
        <FallbackImage
          src={post.imageUrl}
          alt={`Post by ${post.author.name}`}
          fill
          sizes="(max-width: 768px) 361px, 600px"
          className="object-cover"
        />
      </div>

      <div className="space-y-4 p-4">
        <div className="flex items-center gap-3">
          <div className="relative size-10 overflow-hidden rounded-full bg-muted">
            {post.author.avatarUrl ? (
              <FallbackImage
                src={post.author.avatarUrl}
                alt={post.author.name}
                fill
                sizes="40px"
                className="object-cover"
              />
            ) : (
              <div className="flex size-full items-center justify-center text-sm font-semibold text-muted-foreground">
                {post.author.name.charAt(0).toUpperCase()}
              </div>
            )}
          </div>

          <div className="min-w-0">
            <Link
              href={ROUTES.PROFILE(post.author.username)}
              className="block truncate text-sm font-semibold text-foreground hover:underline"
            >
              {post.author.name}
            </Link>
            <p className="text-xs text-muted-foreground">
              {formatRelativeTime(post.createdAt)}
            </p>
          </div>
        </div>

        <div className="space-y-1">
          <p
            className="text-sm text-foreground"
            style={
              isCaptionExpanded
                ? undefined
                : {
                    display: "-webkit-box",
                    WebkitLineClamp: 2,
                    WebkitBoxOrient: "vertical",
                    overflow: "hidden",
                  }
            }
          >
            {post.caption}
          </p>
          {shouldShowToggle && (
            <button
              type="button"
              onClick={() => setIsCaptionExpanded((prev) => !prev)}
              className="text-sm font-semibold text-primary hover:underline"
            >
              {isCaptionExpanded ? "Show Less" : "Show More"}
            </button>
          )}
        </div>

        <div className="flex items-center gap-4 border-t border-border pt-3">
          <button
            type="button"
            className="inline-flex items-center gap-1 text-sm text-muted-foreground"
            aria-label="Likes"
          >
            <Heart
              className={cn("size-4", post.likedByMe && "fill-current text-primary")}
            />
            <span>{post.likeCount}</span>
          </button>

          <button
            type="button"
            className="inline-flex items-center gap-1 text-sm text-muted-foreground"
            aria-label="Comments"
          >
            <MessageCircle className="size-4" />
            <span>{post.commentCount}</span>
          </button>

          <button
            type="button"
            onClick={handleShare}
            className="inline-flex items-center text-sm text-muted-foreground"
            aria-label="Share post"
          >
            <Send className="size-4" />
          </button>

          <button
            type="button"
            className="ml-auto inline-flex items-center text-sm text-muted-foreground"
            aria-label="Saved state"
          >
            <Bookmark
              className={cn("size-4", post.savedByMe && "fill-current text-primary")}
            />
          </button>
        </div>
      </div>
    </article>
  );
}
