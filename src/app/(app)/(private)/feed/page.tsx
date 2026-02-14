"use client";

import { Fragment, useCallback, useMemo } from "react";
import { Users } from "lucide-react";
import { useFeed } from "@/services/queries/feed";
import type { Post } from "@/types/post";
import { PostCard } from "@/components/post/post-card";
import { InfiniteScroll } from "@/components/shared/infinite-scroll";
import { EmptyState } from "@/components/shared/empty-state";
import { ErrorState } from "@/components/shared/error-state";
import { Skeleton } from "@/components/ui/skeleton";

function FeedCardSkeleton() {
  return (
    <div className="w-full animate-pulse">
      {/* Header skeleton */}
      <div className="flex items-center gap-2 pb-2 md:gap-3 md:pb-3">
        <div className="size-11 shrink-0 rounded-full bg-neutral-800 md:size-16" />
        <div className="flex-1 space-y-1 md:space-y-2">
          <div className="h-4 w-1/3 rounded bg-neutral-800 md:h-5" />
          <div className="h-3 w-1/4 rounded bg-neutral-800 md:h-4" />
        </div>
      </div>

      {/* Image skeleton */}
      <div className="aspect-square w-full rounded-lg bg-neutral-800" />

      {/* Actions skeleton */}
      <div className="flex items-center justify-between py-2 md:py-3">
        <div className="flex items-center gap-3 md:gap-4">
          <div className="h-6 w-12 rounded bg-neutral-800" />
          <div className="h-6 w-12 rounded bg-neutral-800" />
          <div className="size-6 rounded bg-neutral-800" />
        </div>
        <div className="size-6 rounded bg-neutral-800" />
      </div>

      {/* Caption skeleton */}
      <div className="space-y-1">
        <div className="h-4 w-full rounded bg-neutral-800 md:h-5" />
        <div className="h-4 w-4/5 rounded bg-neutral-800 md:h-5" />
      </div>
    </div>
  );
}

export default function FeedPage() {
  const {
    data,
    error,
    isPending,
    isError,
    hasNextPage,
    fetchNextPage,
    isFetchingNextPage,
    refetch,
  } = useFeed();

  const posts = useMemo(() => {
    const map = new Map<string, Post>();

    data?.pages.forEach((page) => {
      page.items.forEach((post) => {
        if (!map.has(post.id)) {
          map.set(post.id, post);
        }
      });
    });

    return Array.from(map.values());
  }, [data]);

  const handleLoadMore = useCallback(() => {
    if (!hasNextPage || isFetchingNextPage) return;
    fetchNextPage();
  }, [fetchNextPage, hasNextPage, isFetchingNextPage]);

  if (isPending) {
    return (
      <div className="mx-auto flex w-full max-w-[361px] flex-col gap-0 pb-4 pt-4 md:max-w-[600px] md:pb-6 md:pt-10">
        <FeedCardSkeleton />
        <div className="my-4 h-px w-full bg-neutral-900" />
        <FeedCardSkeleton />
      </div>
    );
  }

  if (isError) {
    const message = error instanceof Error ? error.message : "Failed to load feed";

    return (
      <div className="mx-auto w-full max-w-[361px] pt-4 md:max-w-[600px] md:pt-10">
        <ErrorState
          message={message}
          onRetry={() => {
            void refetch();
          }}
          className="min-h-[60vh]"
        />
      </div>
    );
  }

  if (posts.length === 0) {
    return (
      <div className="mx-auto w-full max-w-[361px] pt-4 md:max-w-[600px] md:pt-10">
        <EmptyState
          icon={Users}
          title="No posts yet"
          description="Follow someone to see posts here"
          className="min-h-[60vh]"
        />
      </div>
    );
  }

  return (
    <div className="mx-auto flex w-full max-w-[361px] flex-col gap-0 pb-4 pt-4 md:max-w-[600px] md:pb-6 md:pt-10">
      {posts.map((post, index) => (
        <Fragment key={post.id}>
          <PostCard post={post} />
          {index < posts.length - 1 && <div className="my-4 h-px w-full bg-neutral-900" />}
        </Fragment>
      ))}

      {/* Loading more indicator */}
      {isFetchingNextPage && (
        <>
          <div className="my-4 h-px w-full bg-neutral-900" />
          <FeedCardSkeleton />
        </>
      )}

      <InfiniteScroll
        hasMore={Boolean(hasNextPage)}
        isLoading={isFetchingNextPage}
        onLoadMore={handleLoadMore}
      />
    </div>
  );
}
