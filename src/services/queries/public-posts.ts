import { useInfiniteQuery } from "@tanstack/react-query";
import axios from "axios";
import { API_ENDPOINTS, PAGINATION_LIMIT } from "@/config/constants";
import type { ApiResponse, Pagination } from "@/types/api";
import { extractPaginatedList } from "@/types/api";
import type { Post } from "@/types/post";

export interface PublicPostsPage {
  items: Post[];
  pagination: Pagination;
}

// Create a separate axios instance without auth interceptors for public endpoints
const publicApiClient = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
});

function normalizePost(post: Post): Post {
  return {
    ...post,
    id: String(post.id),
    author: {
      ...post.author,
      id: String(post.author.id),
      avatarUrl: post.author.avatarUrl ?? undefined,
    },
    likeCount: Number(post.likeCount ?? 0),
    commentCount: Number(post.commentCount ?? 0),
    likedByMe: false, // Always false for unauthenticated users
    savedByMe: false, // Always false for unauthenticated users
  };
}

async function fetchPublicPosts(page: number): Promise<PublicPostsPage> {
  const response = await publicApiClient.get<ApiResponse<Record<string, unknown>>>(
    API_ENDPOINTS.POSTS.LIST,
    {
      params: {
        page,
        limit: PAGINATION_LIMIT,
      },
    },
  );

  const { items, pagination } = extractPaginatedList<Post>(response.data.data);
  const normalizedPosts = items.map(normalizePost);

  return {
    items: normalizedPosts,
    pagination,
  };
}

export function usePublicPosts() {
  return useInfiniteQuery({
    queryKey: ["public-posts"],
    initialPageParam: 1,
    queryFn: ({ pageParam }) => fetchPublicPosts(pageParam),
    getNextPageParam: (lastPage) => {
      if (lastPage.pagination.page >= lastPage.pagination.totalPages) {
        return undefined;
      }
      return lastPage.pagination.page + 1;
    },
    retry: 1, // Only retry once
  });
}
