import {
  useInfiniteQuery,
  useMutation,
  useQueryClient,
  type InfiniteData,
} from "@tanstack/react-query";
import { apiClient } from "@/services/api/client";
import { API_ENDPOINTS, PAGINATION_LIMIT } from "@/config/constants";
import { queryKeys } from "@/lib/query-keys";
import type { ApiResponse, Pagination } from "@/types/api";
import type { Post } from "@/types/post";
import type { FeedPage } from "@/services/queries/feed";
import type { UserListItem } from "@/types/user";

interface ToggleLikeVariables {
  likedByMe: boolean;
}

interface PostLikesPayload {
  users?: PostLikeUser[];
  pagination?: Pagination;
}

interface PostLikesPage {
  items: PostLikeUser[];
  pagination: Pagination;
}

export interface PostLikeUser extends UserListItem {
  isMe?: boolean;
  followsMe?: boolean;
}

type PostDetailCache = Post | { post: Post } | undefined;

interface ToggleLikeContext {
  previousFeed?: InfiniteData<FeedPage>;
  previousDetail?: PostDetailCache;
}

function updateLikeState(post: Post, nextLikedByMe: boolean): Post {
  const currentLiked = Boolean(post.likedByMe);
  if (currentLiked === nextLikedByMe) return post;

  const delta = nextLikedByMe ? 1 : -1;
  return {
    ...post,
    likedByMe: nextLikedByMe,
    likeCount: Math.max(0, post.likeCount + delta),
  };
}

function patchPostDetailCache(
  cache: PostDetailCache,
  nextLikedByMe: boolean,
): PostDetailCache {
  if (!cache) return cache;
  if ("post" in cache) {
    return {
      ...cache,
      post: updateLikeState(cache.post, nextLikedByMe),
    };
  }

  return updateLikeState(cache, nextLikedByMe);
}

function normalizeLikeUser(user: PostLikeUser): PostLikeUser {
  return {
    ...user,
    id: String(user.id),
    avatarUrl: user.avatarUrl ?? undefined,
    isFollowedByMe: Boolean(user.isFollowedByMe),
    isMe: Boolean(user.isMe),
    followsMe: Boolean(user.followsMe),
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

async function fetchPostLikes(postId: string, page: number): Promise<PostLikesPage> {
  const response = await apiClient.get<ApiResponse<PostLikesPayload>>(
    API_ENDPOINTS.POSTS.LIKES(postId),
    {
      params: {
        page,
        limit: PAGINATION_LIMIT,
      },
    },
  );

  const payload = response.data.data;
  const users = Array.isArray(payload.users) ? payload.users : [];

  return {
    items: users.map(normalizeLikeUser),
    pagination: normalizePagination(payload.pagination, page),
  };
}

export function usePostLikes(postId: string, enabled = true) {
  return useInfiniteQuery({
    queryKey: queryKeys.posts.likes(postId),
    initialPageParam: 1,
    queryFn: ({ pageParam }) => fetchPostLikes(postId, pageParam),
    getNextPageParam: (lastPage) => {
      if (lastPage.pagination.page >= lastPage.pagination.totalPages) {
        return undefined;
      }

      return lastPage.pagination.page + 1;
    },
    enabled: Boolean(postId) && enabled,
  });
}

interface MyLikesPayload {
  posts?: Post[];
  pagination?: Pagination;
}

interface MyLikesPage {
  items: Post[];
  pagination: Pagination;
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

async function fetchMyLikes(page: number): Promise<MyLikesPage> {
  const response = await apiClient.get<ApiResponse<MyLikesPayload>>(
    API_ENDPOINTS.ME.LIKES,
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

export function useMyLikes() {
  return useInfiniteQuery({
    queryKey: queryKeys.me.likes(),
    initialPageParam: 1,
    queryFn: ({ pageParam }) => fetchMyLikes(pageParam),
    getNextPageParam: (lastPage) => {
      if (lastPage.pagination.page >= lastPage.pagination.totalPages) {
        return undefined;
      }
      return lastPage.pagination.page + 1;
    },
  });
}

export function useLikeToggle(postId: string) {
  const queryClient = useQueryClient();
  const detailKey = queryKeys.posts.detail(postId);

  return useMutation<void, Error, ToggleLikeVariables, ToggleLikeContext>({
    mutationFn: async ({ likedByMe }) => {
      const endpoint = API_ENDPOINTS.POSTS.LIKE(postId);
      if (likedByMe) {
        await apiClient.delete<ApiResponse<null>>(endpoint);
        return;
      }

      await apiClient.post<ApiResponse<null>>(endpoint);
    },
    onMutate: async ({ likedByMe }) => {
      const nextLikedByMe = !likedByMe;

      await Promise.all([
        queryClient.cancelQueries({ queryKey: queryKeys.feed.all }),
        queryClient.cancelQueries({ queryKey: detailKey }),
      ]);

      const previousFeed =
        queryClient.getQueryData<InfiniteData<FeedPage>>(queryKeys.feed.all);
      const previousDetail = queryClient.getQueryData<PostDetailCache>(detailKey);

      queryClient.setQueryData<InfiniteData<FeedPage>>(queryKeys.feed.all, (oldData) => {
        if (!oldData) return oldData;

        return {
          ...oldData,
          pages: oldData.pages.map((page) => ({
            ...page,
            items: page.items.map((post) =>
              post.id === postId ? updateLikeState(post, nextLikedByMe) : post,
            ),
          })),
        };
      });

      queryClient.setQueryData<PostDetailCache>(detailKey, (oldData) =>
        patchPostDetailCache(oldData, nextLikedByMe),
      );

      return { previousFeed, previousDetail };
    },
    onError: (_error, _variables, context) => {
      if (context?.previousFeed) {
        queryClient.setQueryData(queryKeys.feed.all, context.previousFeed);
      }
      if (context?.previousDetail) {
        queryClient.setQueryData(detailKey, context.previousDetail);
      }
    },
    onSettled: () => {
      void queryClient.invalidateQueries({ queryKey: queryKeys.feed.all });
      void queryClient.invalidateQueries({ queryKey: detailKey });
      void queryClient.invalidateQueries({ queryKey: queryKeys.posts.likes(postId) });
      void queryClient.invalidateQueries({ queryKey: queryKeys.me.likes() });
    },
  });
}
