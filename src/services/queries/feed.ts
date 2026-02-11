import { useInfiniteQuery } from "@tanstack/react-query";
import { apiClient } from "@/services/api/client";
import { API_ENDPOINTS, PAGINATION_LIMIT } from "@/config/constants";
import { queryKeys } from "@/lib/query-keys";
import type { ApiResponse, Pagination } from "@/types/api";
import { extractPaginatedList } from "@/types/api";
import type { Post } from "@/types/post";

interface FeedPage {
  items: Post[];
  pagination: Pagination;
}

async function fetchFeed(page: number): Promise<FeedPage> {
  const response = await apiClient.get<ApiResponse<Record<string, unknown>>>(
    API_ENDPOINTS.FEED,
    {
      params: {
        page,
        limit: PAGINATION_LIMIT,
      },
    },
  );

  return extractPaginatedList<Post>(response.data.data);
}

export function useFeed() {
  return useInfiniteQuery({
    queryKey: queryKeys.feed.all,
    initialPageParam: 1,
    queryFn: ({ pageParam }) => fetchFeed(pageParam),
    getNextPageParam: (lastPage) => {
      if (lastPage.pagination.page >= lastPage.pagination.totalPages) {
        return undefined;
      }

      return lastPage.pagination.page + 1;
    },
  });
}
