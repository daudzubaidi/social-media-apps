"use client";

import { useMemo } from "react";
import { ImageIcon } from "lucide-react";
import { EmptyState } from "@/components/shared/empty-state";
import { ErrorState } from "@/components/shared/error-state";
import { PostGrid, PostGridSkeleton } from "@/components/post/post-grid";
import { useMyPosts } from "@/services/queries/profile";

export default function MeGalleryPage() {
  const { data, isPending, isError, error, hasNextPage, fetchNextPage, isFetchingNextPage, refetch } =
    useMyPosts();

  const posts = useMemo(() => {
    return data?.pages.flatMap((page) => page.items) ?? [];
  }, [data]);

  if (isPending && posts.length === 0) {
    return <PostGridSkeleton />;
  }

  if (isError) {
    const message = error instanceof Error ? error.message : "Failed to load posts";

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
        icon={ImageIcon}
        title="No posts yet"
        description="Your posts will appear here"
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
