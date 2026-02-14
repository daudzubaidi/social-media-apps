"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { toast } from "sonner";
import { FallbackImage } from "@/components/shared/fallback-image";
import { MessageIcon } from "@/components/icons/message";
import { SendIcon } from "@/components/icons/send";
import { cn, formatRelativeTime } from "@/lib/utils";
import { ROUTES } from "@/config/routes";
import { LikeButton } from "@/components/post/like-button";
import { SaveButton } from "@/components/post/save-button";
import { CommentModal } from "@/components/post/comment-modal";
import { LikesModal } from "@/components/post/likes-modal";
import type { Post } from "@/types/post";

interface PostCardProps {
  post: Post;
  className?: string;
}

export function PostCard({ post, className }: PostCardProps) {
  const captionRef = useRef<HTMLParagraphElement>(null);
  const [isCaptionExpanded, setIsCaptionExpanded] = useState(false);
  const [isCaptionOverflowing, setIsCaptionOverflowing] = useState(false);
  const [commentModalOpen, setCommentModalOpen] = useState(false);
  const [likesModalOpen, setLikesModalOpen] = useState(false);

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
        "flex w-full flex-col gap-2 bg-background",
        className,
      )}
    >
      {/* Post Container: Header + Image */}
      <div className="flex w-full flex-col gap-2">
        {/* Post Header */}
        <div className="flex items-center gap-2 md:gap-2">
          <Link
            href={ROUTES.PROFILE(post.author.username)}
            className="relative size-11 shrink-0 overflow-hidden rounded-full bg-muted md:size-16"
          >
            {post.author.avatarUrl ? (
              <FallbackImage
                src={post.author.avatarUrl}
                alt={post.author.name}
                fill
                sizes="(max-width: 768px) 44px, 64px"
                className="object-cover"
              />
            ) : (
              <div className="flex size-full items-center justify-center text-sm font-semibold text-muted-foreground md:text-base">
                {post.author.name.charAt(0).toUpperCase()}
              </div>
            )}
          </Link>

          <div className="min-w-0 flex-1">
            <Link
              href={ROUTES.PROFILE(post.author.username)}
              className="block truncate text-sm font-bold leading-7 tracking-[-0.14px] text-foreground hover:underline md:text-base md:leading-[30px] md:tracking-[-0.32px]"
            >
              {post.author.name}
            </Link>
            <p className="text-xs leading-4 text-muted-foreground md:text-sm md:leading-7 md:tracking-[-0.28px]">
              {formatRelativeTime(post.createdAt)}
            </p>
          </div>
        </div>

        {/* Post Image */}
        <div className="relative aspect-square w-full overflow-hidden rounded-[6px] bg-muted">
          <FallbackImage
            src={post.imageUrl}
            alt={`Post by ${post.author.name}`}
            fill
            sizes="(max-width: 768px) 361px, 600px"
            className="object-cover"
          />
        </div>
      </div>

      {/* Actions Row */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3 md:gap-4">
          <LikeButton
            postId={post.id}
            likedByMe={post.likedByMe}
            likeCount={post.likeCount}
            onCountClick={() => setLikesModalOpen(true)}
          />

          <button
            type="button"
            onClick={() => setCommentModalOpen(true)}
            className="relative z-10 inline-flex items-center gap-1.5 rounded text-sm font-semibold leading-7 tracking-[-0.28px] text-foreground transition-colors hover:text-foreground/80 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background md:gap-[6px] md:text-base md:leading-[30px] md:tracking-[-0.32px]"
            aria-label="Open comments"
          >
            <MessageIcon className="size-6" />
            <span>{post.commentCount}</span>
          </button>

          <button
            type="button"
            onClick={handleShare}
            className="relative z-10 inline-flex items-center gap-1.5 rounded text-sm font-semibold leading-7 tracking-[-0.28px] text-foreground transition-colors hover:text-foreground/80 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background md:gap-[6px] md:text-base md:leading-[30px] md:tracking-[-0.32px]"
            aria-label="Share post"
          >
            <SendIcon className="size-6" />
            <span>{post.shareCount ?? post.commentCount}</span>
          </button>
        </div>

        <SaveButton
          postId={post.id}
          savedByMe={post.savedByMe}
          className="relative z-10"
        />
      </div>

      {/* Post Content */}
      <div className="flex w-full flex-col leading-7 md:w-[526px]">
        <p className="w-full text-sm font-bold leading-7 tracking-[-0.14px] text-foreground md:text-base md:leading-[30px] md:tracking-[-0.32px]">
          <Link
            href={ROUTES.PROFILE(post.author.username)}
            className="hover:underline"
          >
            {post.author.name}
          </Link>
        </p>
        <p
          ref={captionRef}
          className="w-full text-sm font-normal leading-7 tracking-[-0.28px] text-foreground md:text-base md:leading-[30px] md:tracking-[-0.32px]"
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
            onClick={(e) => {
              e.stopPropagation();
              setIsCaptionExpanded((prev) => !prev);
            }}
            className="relative z-10 w-full cursor-pointer rounded text-left text-sm font-bold leading-7 tracking-[-0.14px] text-primary hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring md:text-base md:font-semibold md:leading-[30px] md:tracking-[-0.32px]"
          >
            {isCaptionExpanded ? "Show Less" : "Show More"}
          </button>
        )}
      </div>

      {/* Modals */}
      <CommentModal
        open={commentModalOpen}
        onOpenChange={setCommentModalOpen}
        post={post}
      />

      <LikesModal
        open={likesModalOpen}
        onOpenChange={setLikesModalOpen}
        postId={post.id}
      />
    </article>
  );
}
