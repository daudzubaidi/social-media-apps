import { useMutation, useQueryClient, type InfiniteData } from "@tanstack/react-query";
import { apiClient } from "@/services/api/client";
import { API_ENDPOINTS } from "@/config/constants";
import { queryKeys } from "@/lib/query-keys";
import type { ApiResponse } from "@/types/api";
import type { Post } from "@/types/post";
import type { FeedPage } from "@/services/queries/feed";

interface ToggleLikeVariables {
  likedByMe: boolean;
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
      void queryClient.invalidateQueries({ queryKey: queryKeys.me.likes() });
    },
  });
}
