"use client";

import { useCallback } from "react";
import { cn } from "@/lib/utils";
import { LoadingState } from "@/components/shared/loading-state";
import { useIntersection } from "@/hooks/use-intersection";

interface InfiniteScrollProps {
  hasMore: boolean;
  isLoading: boolean;
  onLoadMore: () => void;
  className?: string;
}

export function InfiniteScroll({
  hasMore,
  isLoading,
  onLoadMore,
  className,
}: InfiniteScrollProps) {
  const handleIntersect = useCallback(() => {
    if (!hasMore || isLoading) return;
    onLoadMore();
  }, [hasMore, isLoading, onLoadMore]);

  const sentinelRef = useIntersection(handleIntersect, {
    enabled: hasMore,
    rootMargin: "200px 0px",
    threshold: 0,
  });

  if (!hasMore) return null;

  return (
    <div ref={sentinelRef} className={cn("py-4", className)}>
      {isLoading && <LoadingState />}
    </div>
  );
}
