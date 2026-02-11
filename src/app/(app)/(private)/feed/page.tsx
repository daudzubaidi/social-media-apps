"use client";

import { useCallback, useMemo } from "react";
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
    <div className="w-full overflow-hidden rounded-2xl border border-border bg-card">
      <Skeleton className="aspect-square w-full rounded-none" />
      <div className="space-y-4 p-4">
        <div className="flex items-center gap-3">
          <Skeleton className="size-10 rounded-full" />
          <div className="flex-1 space-y-2">
            <Skeleton className="h-4 w-1/3" />
            <Skeleton className="h-3 w-1/4" />
          </div>
        </div>
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-5/6" />
        <div className="flex items-center gap-4 border-t border-border pt-3">
          <Skeleton className="h-4 w-12" />
          <Skeleton className="h-4 w-12" />
          <Skeleton className="h-4 w-5" />
          <Skeleton className="ml-auto h-4 w-5" />
        </div>
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
      <div className="mx-auto flex w-full max-w-[600px] flex-col gap-6 px-4 py-6 md:px-0">
        <FeedCardSkeleton />
        <FeedCardSkeleton />
      </div>
    );
  }

  if (isError) {
    const message = error instanceof Error ? error.message : "Failed to load feed";

    return (
      <ErrorState
        message={message}
        onRetry={() => {
          void refetch();
        }}
        className="min-h-[60vh]"
      />
    );
  }

  if (posts.length === 0) {
    return (
      <EmptyState
        icon={Users}
        title="No posts yet"
        description="Follow someone to see posts here"
        className="min-h-[60vh]"
      />
    );
  }

  return (
    <div className="mx-auto flex w-full max-w-[600px] flex-col gap-6 px-4 py-6 md:px-0">
      {posts.map((post) => (
        <PostCard key={post.id} post={post} />
      ))}

      <InfiniteScroll
        hasMore={Boolean(hasNextPage)}
        isLoading={isFetchingNextPage}
        onLoadMore={handleLoadMore}
      />
    </div>
  );
}
