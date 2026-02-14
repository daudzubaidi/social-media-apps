"use client";

import { useState } from "react";
import Link from "next/link";
import { Heart } from "lucide-react";
import { FallbackImage } from "@/components/shared/fallback-image";
import { InfiniteScroll } from "@/components/shared/infinite-scroll";
import { LikesModal } from "@/components/post/likes-modal";
import { ROUTES } from "@/config/routes";
import type { Post } from "@/types/post";

interface PostGridProps {
  posts: Post[];
  hasMore: boolean;
  isLoading: boolean;
  onLoadMore: () => void;
}

export function PostGrid({
  posts,
  hasMore,
  isLoading,
  onLoadMore,
}: PostGridProps) {
  const [selectedPostId, setSelectedPostId] = useState<string | null>(null);
  const [likesModalOpen, setLikesModalOpen] = useState(false);

  if (posts.length === 0) {
    return null;
  }

  function handleLikeCountClick(postId: string, e: React.MouseEvent) {
    e.preventDefault();
    e.stopPropagation();
    setSelectedPostId(postId);
    setLikesModalOpen(true);
  }

  return (
    <>
      <div className="grid grid-cols-3 gap-1">
        {posts.map((post) => (
          <Link
            key={post.id}
            href={ROUTES.POST_DETAIL(post.id)}
            className="group relative aspect-square overflow-hidden rounded-sm bg-muted"
          >
            <FallbackImage
              src={post.imageUrl}
              alt={`Post by ${post.author.name}`}
              fill
              sizes="(max-width: 768px) 118px, 268px"
              className="object-cover transition-transform duration-300 group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-black/0 transition-colors duration-300 group-hover:bg-black/30" />

            {/* Like Count Overlay */}
            {post.likeCount > 0 && (
              <button
                type="button"
                onClick={(e) => handleLikeCountClick(post.id, e)}
                className="absolute left-2 top-2 z-10 hidden pointer-events-none items-center gap-1 rounded-full bg-black/60 px-2 py-1 text-xs font-semibold text-white opacity-0 transition-opacity duration-300 hover:bg-black/80 md:flex md:group-hover:pointer-events-auto md:group-hover:opacity-100"
              >
                <Heart className="size-3 fill-white" />
                <span>{post.likeCount}</span>
              </button>
            )}
          </Link>
        ))}
      </div>

      <InfiniteScroll
        hasMore={hasMore}
        isLoading={isLoading}
        onLoadMore={onLoadMore}
      />

      {selectedPostId && (
        <LikesModal
          open={likesModalOpen}
          onOpenChange={(open) => {
            setLikesModalOpen(open);
            if (!open) setSelectedPostId(null);
          }}
          postId={selectedPostId}
        />
      )}
    </>
  );
}

export function PostGridSkeleton() {
  return (
    <div className="grid grid-cols-3 gap-1">
      {Array.from({ length: 9 }).map((_, i) => (
        <div
          key={i}
          className="aspect-square animate-pulse rounded-sm bg-muted"
        />
      ))}
    </div>
  );
}
