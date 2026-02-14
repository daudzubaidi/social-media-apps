import {
  useInfiniteQuery,
  useMutation,
  useQueryClient,
  type InfiniteData,
} from "@tanstack/react-query";
import { apiClient } from "@/services/api/client";
import { API_ENDPOINTS, PAGINATION_LIMIT } from "@/config/constants";
import { queryKeys } from "@/lib/query-keys";
import { getAuthUserId } from "@/lib/auth";
import { createCommentSchema } from "@/lib/schemas/comment";
import type { ApiResponse, Pagination } from "@/types/api";
import type { Comment, CreateCommentRequest } from "@/types/comment";
import type { Profile } from "@/types/user";
import type { Post } from "@/types/post";

interface CommentsPayload {
  comments?: Comment[];
  pagination?: Pagination;
}

interface CommentsPage {
  items: Comment[];
  pagination: Pagination;
}

interface DeleteCommentResponse {
  deleted: boolean;
}

interface CreateCommentContext {
  previousComments?: InfiniteData<CommentsPage>;
  previousDetail?: PostDetailCache;
  tempId: string;
}

interface DeleteCommentContext {
  previousComments?: InfiniteData<CommentsPage>;
  previousDetail?: PostDetailCache;
}

type PostDetailCache = Post | { post: Post } | undefined;

function normalizeComment(comment: Comment, authUserId: string | null): Comment {
  const authorId = String(comment.author.id);

  return {
    ...comment,
    id: String(comment.id),
    author: {
      ...comment.author,
      id: authorId,
      avatarUrl: comment.author.avatarUrl ?? undefined,
    },
    isMine:
      typeof comment.isMine === "boolean"
        ? comment.isMine
        : Boolean(authUserId && authorId === authUserId),
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

function patchPostDetailCommentCount(
  cache: PostDetailCache,
  delta: number,
): PostDetailCache {
  if (!cache) return cache;

  if ("post" in cache) {
    return {
      ...cache,
      post: {
        ...cache.post,
        commentCount: Math.max(0, cache.post.commentCount + delta),
      },
    };
  }

  return {
    ...cache,
    commentCount: Math.max(0, cache.commentCount + delta),
  };
}

async function fetchComments(postId: string, page: number): Promise<CommentsPage> {
  const authUserId = getAuthUserId();
  const response = await apiClient.get<ApiResponse<CommentsPayload>>(
    API_ENDPOINTS.POSTS.COMMENTS(postId),
    {
      params: {
        page,
        limit: PAGINATION_LIMIT,
      },
    },
  );

  const payload = response.data.data;
  const comments = Array.isArray(payload.comments) ? payload.comments : [];

  return {
    items: comments.map((comment) => normalizeComment(comment, authUserId)),
    pagination: normalizePagination(payload.pagination, page),
  };
}

export function useComments(postId: string, enabled = true) {
  return useInfiniteQuery({
    queryKey: queryKeys.posts.comments(postId),
    initialPageParam: 1,
    queryFn: ({ pageParam }) => fetchComments(postId, pageParam),
    getNextPageParam: (lastPage) => {
      if (lastPage.pagination.page >= lastPage.pagination.totalPages) {
        return undefined;
      }

      return lastPage.pagination.page + 1;
    },
    enabled: Boolean(postId) && enabled,
  });
}

export function useCreateComment(postId: string) {
  const queryClient = useQueryClient();
  const commentsKey = queryKeys.posts.comments(postId);
  const detailKey = queryKeys.posts.detail(postId);

  return useMutation<Comment, Error, CreateCommentRequest, CreateCommentContext>({
    mutationFn: async (payload) => {
      const validated = createCommentSchema.parse(payload);
      const response = await apiClient.post<ApiResponse<Comment>>(
        API_ENDPOINTS.POSTS.COMMENTS(postId),
        validated,
      );

      return normalizeComment(response.data.data, getAuthUserId());
    },
    onMutate: async (payload) => {
      const text = payload.text.trim();
      const tempId = `temp-comment-${Date.now()}`;

      await Promise.all([
        queryClient.cancelQueries({ queryKey: commentsKey }),
        queryClient.cancelQueries({ queryKey: detailKey }),
        queryClient.cancelQueries({ queryKey: queryKeys.feed.all }),
      ]);

      const previousComments =
        queryClient.getQueryData<InfiniteData<CommentsPage>>(commentsKey);
      const previousDetail = queryClient.getQueryData<PostDetailCache>(detailKey);
      const meProfile = queryClient.getQueryData<Profile>(queryKeys.me.profile());
      const authUserId = getAuthUserId();

      const optimisticComment: Comment = {
        id: tempId,
        text,
        createdAt: new Date().toISOString(),
        author: {
          id: authUserId ?? String(meProfile?.id ?? "me"),
          username: meProfile?.username ?? "you",
          name: meProfile?.name ?? "You",
          avatarUrl: meProfile?.avatarUrl,
        },
        isMine: true,
      };

      queryClient.setQueryData<InfiniteData<CommentsPage>>(commentsKey, (oldData) => {
        if (!oldData || oldData.pages.length === 0) {
          return {
            pageParams: [1],
            pages: [
              {
                items: [optimisticComment],
                pagination: {
                  page: 1,
                  limit: PAGINATION_LIMIT,
                  total: 1,
                  totalPages: 1,
                },
              },
            ],
          };
        }

        const [firstPage, ...restPages] = oldData.pages;
        const nextFirstPage: CommentsPage = {
          ...firstPage,
          items: [optimisticComment, ...firstPage.items],
          pagination: {
            ...firstPage.pagination,
            total: firstPage.pagination.total + 1,
          },
        };

        return {
          ...oldData,
          pages: [nextFirstPage, ...restPages],
        };
      });

      queryClient.setQueryData<PostDetailCache>(detailKey, (oldData) =>
        patchPostDetailCommentCount(oldData, 1),
      );

      // Update feed cache to increment comment count
      queryClient.setQueryData(queryKeys.feed.all, (oldData: InfiniteData<{ items: Post[]; pagination: unknown }> | undefined) => {
        if (!oldData) return oldData;

        return {
          ...oldData,
          pages: oldData.pages.map((page) => ({
            ...page,
            items: page.items.map((post) =>
              post.id === postId
                ? { ...post, commentCount: post.commentCount + 1 }
                : post
            ),
          })),
        };
      });

      return { previousComments, previousDetail, tempId };
    },
    onError: (_error, _variables, context) => {
      if (context?.previousComments) {
        queryClient.setQueryData(commentsKey, context.previousComments);
      }
      if (context?.previousDetail) {
        queryClient.setQueryData(detailKey, context.previousDetail);
      }
    },
    onSuccess: (createdComment, _variables, context) => {
      queryClient.setQueryData<InfiniteData<CommentsPage>>(commentsKey, (oldData) => {
        if (!oldData) return oldData;

        return {
          ...oldData,
          pages: oldData.pages.map((page) => ({
            ...page,
            items: page.items.map((comment) =>
              comment.id === context.tempId ? createdComment : comment,
            ),
          })),
        };
      });
    },
    onSettled: () => {
      void queryClient.invalidateQueries({ queryKey: commentsKey });
      void queryClient.invalidateQueries({ queryKey: detailKey });
      void queryClient.invalidateQueries({ queryKey: queryKeys.feed.all });
    },
  });
}

export function useDeleteComment(postId: string) {
  const queryClient = useQueryClient();
  const commentsKey = queryKeys.posts.comments(postId);
  const detailKey = queryKeys.posts.detail(postId);

  return useMutation<void, Error, string, DeleteCommentContext>({
    mutationFn: async (commentId) => {
      await apiClient.delete<ApiResponse<DeleteCommentResponse>>(
        API_ENDPOINTS.COMMENTS.DELETE(commentId),
      );
    },
    onMutate: async (commentId) => {
      await Promise.all([
        queryClient.cancelQueries({ queryKey: commentsKey }),
        queryClient.cancelQueries({ queryKey: detailKey }),
        queryClient.cancelQueries({ queryKey: queryKeys.feed.all }),
      ]);

      const previousComments =
        queryClient.getQueryData<InfiniteData<CommentsPage>>(commentsKey);
      const previousDetail = queryClient.getQueryData<PostDetailCache>(detailKey);

      let removedCount = 0;
      queryClient.setQueryData<InfiniteData<CommentsPage>>(commentsKey, (oldData) => {
        if (!oldData) return oldData;

        const pages = oldData.pages.map((page) => {
          const filteredItems = page.items.filter((comment) => {
            const shouldKeep = comment.id !== commentId;
            if (!shouldKeep) removedCount += 1;
            return shouldKeep;
          });

          if (filteredItems.length === page.items.length) return page;

          return {
            ...page,
            items: filteredItems,
            pagination: {
              ...page.pagination,
              total: Math.max(0, page.pagination.total - 1),
            },
          };
        });

        return {
          ...oldData,
          pages,
        };
      });

      if (removedCount > 0) {
        queryClient.setQueryData<PostDetailCache>(detailKey, (oldData) =>
          patchPostDetailCommentCount(oldData, -removedCount),
        );

        // Update feed cache to decrement comment count
        queryClient.setQueryData(queryKeys.feed.all, (oldData: InfiniteData<{ items: Post[]; pagination: unknown }> | undefined) => {
          if (!oldData) return oldData;

          return {
            ...oldData,
            pages: oldData.pages.map((page) => ({
              ...page,
              items: page.items.map((post) =>
                post.id === postId
                  ? { ...post, commentCount: Math.max(0, post.commentCount - removedCount) }
                  : post
              ),
            })),
          };
        });
      }

      return { previousComments, previousDetail };
    },
    onError: (_error, _commentId, context) => {
      if (context?.previousComments) {
        queryClient.setQueryData(commentsKey, context.previousComments);
      }
      if (context?.previousDetail) {
        queryClient.setQueryData(detailKey, context.previousDetail);
      }
    },
    onSettled: () => {
      void queryClient.invalidateQueries({ queryKey: commentsKey });
      void queryClient.invalidateQueries({ queryKey: detailKey });
      void queryClient.invalidateQueries({ queryKey: queryKeys.feed.all });
    },
  });
}
