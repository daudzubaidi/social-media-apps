import { useMutation, useQueryClient, type InfiniteData } from "@tanstack/react-query";
import { apiClient } from "@/services/api/client";
import { API_ENDPOINTS } from "@/config/constants";
import { queryKeys } from "@/lib/query-keys";
import { persistSavedPostState } from "@/lib/saved-posts";
import type { ApiResponse } from "@/types/api";
import type { Post } from "@/types/post";
import type { FeedPage } from "@/services/queries/feed";

interface ToggleSaveVariables {
  savedByMe: boolean;
}

type PostDetailCache = Post | { post: Post } | undefined;

interface ToggleSaveContext {
  previousFeed?: InfiniteData<FeedPage>;
  previousDetail?: PostDetailCache;
  previousSavedByMe: boolean;
}

function updateSaveState(post: Post, nextSavedByMe: boolean): Post {
  return {
    ...post,
    savedByMe: nextSavedByMe,
  };
}

function patchPostDetailCache(
  cache: PostDetailCache,
  nextSavedByMe: boolean,
): PostDetailCache {
  if (!cache) return cache;
  if ("post" in cache) {
    return {
      ...cache,
      post: updateSaveState(cache.post, nextSavedByMe),
    };
  }

  return updateSaveState(cache, nextSavedByMe);
}

export function useSaveToggle(postId: string) {
  const queryClient = useQueryClient();
  const detailKey = queryKeys.posts.detail(postId);

  return useMutation<void, Error, ToggleSaveVariables, ToggleSaveContext>({
    mutationFn: async ({ savedByMe }) => {
      const endpoint = API_ENDPOINTS.POSTS.SAVE(postId);
      if (savedByMe) {
        await apiClient.delete<ApiResponse<null>>(endpoint);
        return;
      }

      await apiClient.post<ApiResponse<null>>(endpoint);
    },
    onMutate: async ({ savedByMe }) => {
      const nextSavedByMe = !savedByMe;
      persistSavedPostState(postId, nextSavedByMe);

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
              post.id === postId ? updateSaveState(post, nextSavedByMe) : post,
            ),
          })),
        };
      });

      queryClient.setQueryData<PostDetailCache>(detailKey, (oldData) =>
        patchPostDetailCache(oldData, nextSavedByMe),
      );

      return { previousFeed, previousDetail, previousSavedByMe: savedByMe };
    },
    onError: (_error, _variables, context) => {
      if (context?.previousFeed) {
        queryClient.setQueryData(queryKeys.feed.all, context.previousFeed);
      }
      if (context?.previousDetail) {
        queryClient.setQueryData(detailKey, context.previousDetail);
      }
      if (context) {
        persistSavedPostState(postId, context.previousSavedByMe);
      }
    },
    onSettled: () => {
      void queryClient.invalidateQueries({ queryKey: detailKey });
      void queryClient.invalidateQueries({ queryKey: queryKeys.me.saved() });
    },
  });
}
