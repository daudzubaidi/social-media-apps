"use client";

import { useMemo } from "react";
import { Bookmark } from "lucide-react";
import { EmptyState } from "@/components/shared/empty-state";
import { ErrorState } from "@/components/shared/error-state";
import { PostGrid, PostGridSkeleton } from "@/components/post/post-grid";
import { useMySaved } from "@/services/queries/profile";

export default function MeSavedPage() {
  const { data, isPending, isError, error, hasNextPage, fetchNextPage, isFetchingNextPage, refetch } =
    useMySaved();

  const posts = useMemo(() => {
    return data?.pages.flatMap((page) => page.items) ?? [];
  }, [data]);

  if (isPending && posts.length === 0) {
    return <PostGridSkeleton />;
  }

  if (isError) {
    const message = error instanceof Error ? error.message : "Failed to load saved posts";

    return (
      <ErrorState
        message={message}
        onRetry={() => {
          void refetch();
        }}
        className="min-h-[40vh]"
      />
    );
  }

  if (posts.length === 0) {
    return (
      <EmptyState
        icon={Bookmark}
        title="No saved posts"
        description="Saved posts will appear here"
        className="min-h-[40vh]"
      />
    );
  }

  return (
    <PostGrid
      posts={posts}
      hasMore={Boolean(hasNextPage)}
      isLoading={isFetchingNextPage}
      onLoadMore={() => {
        void fetchNextPage();
      }}
    />
  );
}
