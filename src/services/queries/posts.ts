import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { apiClient } from "@/services/api/client";
import { API_ENDPOINTS } from "@/config/constants";
import { queryKeys } from "@/lib/query-keys";
import { getSavedPostIdsSnapshot } from "@/lib/saved-posts";
import type { ApiResponse } from "@/types/api";
import type { CreatePostRequest, Post } from "@/types/post";

interface DeletePostResponse {
  deleted: boolean;
}

function normalizePost(post: Post, previousSavedByMe?: boolean): Post {
  const postId = String(post.id);
  const persistedSavedByMe = getSavedPostIdsSnapshot().has(postId);

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
    shareCount:
      typeof post.shareCount === "number" ? Number(post.shareCount) : undefined,
    likedByMe: Boolean(post.likedByMe),
    savedByMe:
      typeof post.savedByMe === "boolean"
        ? post.savedByMe
        : typeof previousSavedByMe === "boolean"
          ? previousSavedByMe
          : persistedSavedByMe,
  };
}

export function usePost(postId: string) {
  const queryClient = useQueryClient();
  const detailKey = queryKeys.posts.detail(postId);

  return useQuery({
    queryKey: detailKey,
    queryFn: async () => {
      const previous = queryClient.getQueryData<Post>(detailKey);
      const response = await apiClient.get<ApiResponse<Post>>(
        API_ENDPOINTS.POSTS.DETAIL(postId),
      );
      return normalizePost(response.data.data, previous?.savedByMe);
    },
    enabled: Boolean(postId),
  });
}

export function useCreatePost() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (payload: CreatePostRequest) => {
      const formData = new FormData();
      formData.append("image", payload.image);
      formData.append("caption", payload.caption);

      const response = await apiClient.post<ApiResponse<Post>>(
        API_ENDPOINTS.POSTS.CREATE,
        formData,
        {
          headers: { "Content-Type": "multipart/form-data" },
        },
      );

      return normalizePost(response.data.data);
    },
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: queryKeys.feed.all });
      void queryClient.invalidateQueries({ queryKey: queryKeys.me.profile() });
    },
  });
}

export function useDeletePost() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (postId: string) => {
      const response = await apiClient.delete<ApiResponse<DeletePostResponse>>(
        API_ENDPOINTS.POSTS.DELETE(postId),
      );

      return response.data.data;
    },
    onSuccess: (_data, postId) => {
      void queryClient.invalidateQueries({ queryKey: queryKeys.feed.all });
      void queryClient.invalidateQueries({ queryKey: queryKeys.me.profile() });
      queryClient.removeQueries({ queryKey: queryKeys.posts.detail(postId) });
    },
  });
}
