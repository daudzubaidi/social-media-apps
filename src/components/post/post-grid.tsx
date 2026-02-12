"use client";

import Link from "next/link";
import { FallbackImage } from "@/components/shared/fallback-image";
import { InfiniteScroll } from "@/components/shared/infinite-scroll";
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
  if (posts.length === 0) {
    return null;
  }

  return (
    <>
      <div className="grid grid-cols-3 gap-1 md:gap-3">
        {posts.map((post) => (
          <Link
            key={post.id}
            href={ROUTES.POST_DETAIL(post.id)}
            className="group relative aspect-square overflow-hidden bg-muted"
          >
            <FallbackImage
              src={post.imageUrl}
              alt={`Post by ${post.author.name}`}
              fill
              sizes="(max-width: 768px) 120px, 262px"
              className="object-cover transition-transform duration-300 group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-black/0 transition-colors duration-300 group-hover:bg-black/10" />
          </Link>
        ))}
      </div>

      <InfiniteScroll
        hasMore={hasMore}
        isLoading={isLoading}
        onLoadMore={onLoadMore}
      />
    </>
  );
}

export function PostGridSkeleton() {
  return (
    <div className="grid grid-cols-3 gap-1 md:gap-3">
      {Array.from({ length: 9 }).map((_, i) => (
        <div
          key={i}
          className="aspect-square animate-pulse bg-muted"
        />
      ))}
    </div>
  );
}
