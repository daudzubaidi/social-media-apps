"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { MessageCircle, Send } from "lucide-react";
import { toast } from "sonner";
import { FallbackImage } from "@/components/shared/fallback-image";
import { cn, formatRelativeTime } from "@/lib/utils";
import { ROUTES } from "@/config/routes";
import { LikeButton } from "@/components/post/like-button";
import { SaveButton } from "@/components/post/save-button";
import type { Post } from "@/types/post";

interface PostCardProps {
  post: Post;
  className?: string;
}

export function PostCard({ post, className }: PostCardProps) {
  const captionRef = useRef<HTMLParagraphElement>(null);
  const [isCaptionExpanded, setIsCaptionExpanded] = useState(false);
  const [isCaptionOverflowing, setIsCaptionOverflowing] = useState(false);

  useEffect(() => {
    const captionElement = captionRef.current;
    if (!captionElement) return;

    const frame = window.requestAnimationFrame(() => {
      setIsCaptionOverflowing(captionElement.scrollHeight > captionElement.clientHeight + 1);
    });

    return () => {
      window.cancelAnimationFrame(frame);
    };
  }, [post.id, post.caption]);

  useEffect(() => {
    setIsCaptionExpanded(false);
  }, [post.id]);

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
            ref={captionRef}
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
          {isCaptionOverflowing && (
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
          <LikeButton
            postId={post.id}
            likedByMe={post.likedByMe}
            likeCount={post.likeCount}
          />

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

          <SaveButton postId={post.id} savedByMe={post.savedByMe} className="ml-auto" />
        </div>
      </div>
    </article>
  );
}
