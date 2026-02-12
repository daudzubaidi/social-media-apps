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
    <div className="w-full">
      {/* Header skeleton */}
      <div className="flex items-center gap-2 pb-2 md:gap-3 md:pb-3">
        <Skeleton className="size-11 shrink-0 rounded-full md:size-16" />
        <div className="flex-1 space-y-1 md:space-y-2">
          <Skeleton className="h-4 w-1/3 md:h-5" />
          <Skeleton className="h-3 w-1/4 md:h-4" />
        </div>
      </div>

      {/* Image skeleton */}
      <Skeleton className="aspect-square w-full rounded-lg" />

      {/* Actions skeleton */}
      <div className="flex items-center justify-between py-2 md:py-3">
        <div className="flex items-center gap-3 md:gap-4">
          <Skeleton className="h-6 w-12" />
          <Skeleton className="h-6 w-12" />
          <Skeleton className="size-6" />
        </div>
        <Skeleton className="size-6" />
      </div>

      {/* Caption skeleton */}
      <Skeleton className="h-4 w-full md:h-5" />
      <Skeleton className="h-4 w-4/5 md:h-5" />
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
      <div className="mx-auto flex w-full max-w-[361px] flex-col gap-4 px-4 pb-4 pt-4 md:max-w-[600px] md:gap-6 md:px-0 md:pb-6 md:pt-10">
        <FeedCardSkeleton />
        <hr className="border-border" />
        <FeedCardSkeleton />
      </div>
    );
  }

  if (isError) {
    const message = error instanceof Error ? error.message : "Failed to load feed";

    return (
      <div className="mx-auto w-full max-w-[361px] px-4 pt-4 md:max-w-[600px] md:px-0 md:pt-10">
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
      <div className="mx-auto w-full max-w-[361px] px-4 pt-4 md:max-w-[600px] md:px-0 md:pt-10">
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
    <div className="mx-auto flex w-full max-w-[361px] flex-col gap-4 px-4 pb-4 pt-4 md:max-w-[600px] md:gap-6 md:px-0 md:pb-6 md:pt-10">
      {posts.map((post, index) => (
        <Fragment key={post.id}>
          <PostCard post={post} />
          {index < posts.length - 1 && <hr className="border-neutral-900" />}
        </Fragment>
      ))}

      <InfiniteScroll
        hasMore={Boolean(hasNextPage)}
        isLoading={isFetchingNextPage}
        onLoadMore={handleLoadMore}
      />
    </div>
  );
}
