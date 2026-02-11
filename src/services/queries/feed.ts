import {
  useInfiniteQuery,
  useQueryClient,
  type InfiniteData,
} from "@tanstack/react-query";
import { apiClient } from "@/services/api/client";
import { API_ENDPOINTS, PAGINATION_LIMIT } from "@/config/constants";
import { queryKeys } from "@/lib/query-keys";
import type { ApiResponse, Pagination } from "@/types/api";
import { extractPaginatedList } from "@/types/api";
import type { Post } from "@/types/post";

export interface FeedPage {
  items: Post[];
  pagination: Pagination;
}

function getSavedStateMap(feedData?: InfiniteData<FeedPage>): Map<string, boolean> {
  const map = new Map<string, boolean>();
  feedData?.pages.forEach((page) => {
    page.items.forEach((item) => {
      if (typeof item.savedByMe === "boolean") {
        map.set(item.id, item.savedByMe);
      }
    });
  });
  return map;
}

function normalizePost(post: Post, savedStateMap: Map<string, boolean>): Post {
  const postId = String(post.id);
  const normalizedSavedByMe =
    typeof post.savedByMe === "boolean"
      ? post.savedByMe
      : savedStateMap.get(postId);

  return {
    ...post,
    id: postId,
    author: {
      ...post.author,
      id: String(post.author.id),
      avatarUrl: post.author.avatarUrl ?? undefined,
    },
    likeCount: Number(post.likeCount ?? 0),
    commentCount: Number(post.commentCount ?? 0),
    likedByMe: Boolean(post.likedByMe),
    savedByMe: normalizedSavedByMe,
  };
}

async function fetchFeed(
  page: number,
  savedStateMap: Map<string, boolean>,
): Promise<FeedPage> {
  const response = await apiClient.get<ApiResponse<Record<string, unknown>>>(
    API_ENDPOINTS.FEED,
    {
      params: {
        page,
        limit: PAGINATION_LIMIT,
      },
    },
  );

  const { items, pagination } = extractPaginatedList<Post>(response.data.data);

  return {
    items: items.map((item) => normalizePost(item, savedStateMap)),
    pagination,
  };
}

export function useFeed() {
  const queryClient = useQueryClient();

  return useInfiniteQuery({
    queryKey: queryKeys.feed.all,
    initialPageParam: 1,
    queryFn: ({ pageParam }) => {
      const previousFeed =
        queryClient.getQueryData<InfiniteData<FeedPage>>(queryKeys.feed.all);
      return fetchFeed(pageParam, getSavedStateMap(previousFeed));
    },
    getNextPageParam: (lastPage) => {
      if (lastPage.pagination.page >= lastPage.pagination.totalPages) {
        return undefined;
      }

      return lastPage.pagination.page + 1;
    },
  });
}
