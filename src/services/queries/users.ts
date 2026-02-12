import { useInfiniteQuery, useQuery } from "@tanstack/react-query";
import { apiClient } from "@/services/api/client";
import { API_ENDPOINTS, PAGINATION_LIMIT } from "@/config/constants";
import { queryKeys } from "@/lib/query-keys";
import type { ApiResponse, Pagination } from "@/types/api";
import type { UserListItem, Profile } from "@/types/user";
import type { Post } from "@/types/post";

interface UsersSearchPayload {
  users?: UserListItem[];
  pagination?: Pagination;
}

interface UsersSearchPage {
  items: UserListItem[];
  pagination: Pagination;
}

interface UserPostsPayload {
  posts?: Post[];
  pagination?: Pagination;
}

interface UserPostsPage {
  items: Post[];
  pagination: Pagination;
}

function normalizeUser(user: UserListItem): UserListItem {
  return {
    ...user,
    id: String(user.id),
    avatarUrl: user.avatarUrl ?? undefined,
    isFollowedByMe: Boolean(user.isFollowedByMe),
  };
}

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
    shareCount:
      typeof post.shareCount === "number" ? Number(post.shareCount) : undefined,
    likedByMe: Boolean(post.likedByMe),
    savedByMe: Boolean(post.savedByMe),
  };
}

function normalizePagination(
  pagination: Pagination | undefined,
  page: number,
): Pagination {
  return {
    page: pagination?.page ?? page,
    limit: pagination?.limit ?? PAGINATION_LIMIT,
    total: pagination?.total ?? 0,
    totalPages: pagination?.totalPages ?? 0,
  };
}

async function searchUsers(
  query: string,
  page: number,
): Promise<UsersSearchPage> {
  const response = await apiClient.get<ApiResponse<UsersSearchPayload>>(
    API_ENDPOINTS.USERS.SEARCH,
    {
      params: {
        q: query,
        page,
        limit: PAGINATION_LIMIT,
      },
    },
  );

  const payload = response.data.data;
  const users = Array.isArray(payload.users) ? payload.users : [];

  return {
    items: users.map(normalizeUser),
    pagination: normalizePagination(payload.pagination, page),
  };
}

export function useSearchUsers(query: string) {
  return useInfiniteQuery({
    queryKey: queryKeys.users.search(query),
    initialPageParam: 1,
    queryFn: ({ pageParam }) => searchUsers(query, pageParam),
    getNextPageParam: (lastPage) => {
      if (lastPage.pagination.page >= lastPage.pagination.totalPages) {
        return undefined;
      }
      return lastPage.pagination.page + 1;
    },
    enabled: Boolean(query.trim()),
  });
}

export function useUserProfile(username: string) {
  return useQuery({
    queryKey: queryKeys.users.profile(username),
    queryFn: async () => {
      const response = await apiClient.get<ApiResponse<Profile>>(
        API_ENDPOINTS.USERS.PROFILE(username),
      );
      return response.data.data;
    },
    enabled: Boolean(username),
  });
}

async function fetchUserPosts(
  username: string,
  page: number,
): Promise<UserPostsPage> {
  const response = await apiClient.get<ApiResponse<UserPostsPayload>>(
    API_ENDPOINTS.USERS.POSTS(username),
    {
      params: {
        page,
        limit: PAGINATION_LIMIT,
      },
    },
  );

  const payload = response.data.data;
  const posts = Array.isArray(payload.posts) ? payload.posts : [];

  return {
    items: posts.map(normalizePost),
    pagination: normalizePagination(payload.pagination, page),
  };
}

export function useUserPosts(username: string) {
  return useInfiniteQuery({
    queryKey: queryKeys.users.posts(username),
    initialPageParam: 1,
    queryFn: ({ pageParam }) => fetchUserPosts(username, pageParam),
    getNextPageParam: (lastPage) => {
      if (lastPage.pagination.page >= lastPage.pagination.totalPages) {
        return undefined;
      }
      return lastPage.pagination.page + 1;
    },
    enabled: Boolean(username),
  });
}

async function fetchUserLikes(
  username: string,
  page: number,
): Promise<UserPostsPage> {
  const response = await apiClient.get<ApiResponse<UserPostsPayload>>(
    API_ENDPOINTS.USERS.LIKES(username),
    {
      params: {
        page,
        limit: PAGINATION_LIMIT,
      },
    },
  );

  const payload = response.data.data;
  const posts = Array.isArray(payload.posts) ? payload.posts : [];

  return {
    items: posts.map(normalizePost),
    pagination: normalizePagination(payload.pagination, page),
  };
}

export function useUserLikes(username: string) {
  return useInfiniteQuery({
    queryKey: queryKeys.users.likes(username),
    initialPageParam: 1,
    queryFn: ({ pageParam }) => fetchUserLikes(username, pageParam),
    getNextPageParam: (lastPage) => {
      if (lastPage.pagination.page >= lastPage.pagination.totalPages) {
        return undefined;
      }
      return lastPage.pagination.page + 1;
    },
    enabled: Boolean(username),
  });
}
