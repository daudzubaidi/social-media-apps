import {
  useInfiniteQuery,
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";
import { API_ENDPOINTS, PAGINATION_LIMIT } from "@/config/constants";
import { queryKeys } from "@/lib/query-keys";
import { apiClient } from "@/services/api/client";
import type { ApiResponse, Pagination } from "@/types/api";
import type { Profile, UpdateProfileRequest } from "@/types/user";
import type { Post } from "@/types/post";

type ProfileEnvelope = {
  profile?: Profile;
  user?: Profile;
};

function normalizeProfile(profile: Profile): Profile {
  const counts = profile.counts ?? {
    post: 0,
    followers: 0,
    following: 0,
    likes: 0,
  };

  return {
    ...profile,
    id: String(profile.id),
    avatarUrl: profile.avatarUrl ?? undefined,
    phone: profile.phone ?? undefined,
    counts: {
      post: Number(counts.post ?? 0),
      followers: Number(counts.followers ?? 0),
      following: Number(counts.following ?? 0),
      likes: Number(counts.likes ?? 0),
    },
    isFollowing: Boolean(profile.isFollowing),
    isMe: Boolean(profile.isMe),
  };
}

function extractProfile(payload: unknown): Profile {
  if (!payload || typeof payload !== "object") {
    throw new Error("Invalid profile payload");
  }

  const record = payload as Record<string, unknown>;
  const envelope = payload as ProfileEnvelope;

  // Check if payload has separate profile and stats
  if (envelope.profile && record.stats && typeof record.stats === "object") {
    const stats = record.stats as Record<string, unknown>;
    const profileWithStats = {
      ...envelope.profile,
      counts: {
        post: Number(stats.posts ?? 0),
        followers: Number(stats.followers ?? 0),
        following: Number(stats.following ?? 0),
        likes: Number(stats.likes ?? 0),
      },
    };
    return normalizeProfile(profileWithStats);
  }

  const profileCandidate =
    envelope.profile ??
    envelope.user ??
    (record.data as Profile | undefined) ??
    (payload as Profile);

  return normalizeProfile(profileCandidate);
}

function toFormData(data: UpdateProfileRequest): FormData {
  const formData = new FormData();

  if (typeof data.name === "string") {
    formData.append("name", data.name);
  }

  if (typeof data.username === "string") {
    formData.append("username", data.username);
  }

  if (typeof data.email === "string") {
    formData.append("email", data.email);
  }

  if (typeof data.numberPhone === "string") {
    formData.append("phone", data.numberPhone);
  }

  if (typeof data.bio === "string") {
    formData.append("bio", data.bio);
  }

  if (data.avatar) {
    formData.append("avatar", data.avatar);
  }

  return formData;
}

export function useMe(options?: { enabled?: boolean }) {
  return useQuery({
    queryKey: queryKeys.me.profile(),
    enabled: options?.enabled,
    queryFn: async () => {
      const response = await apiClient.get<ApiResponse<unknown>>(
        API_ENDPOINTS.ME.PROFILE,
      );

      const profile = extractProfile(response.data.data);
      // Force set isMe to true since this is /api/me endpoint
      return { ...profile, isMe: true };
    },
  });
}

export function useUpdateMe() {
  const queryClient = useQueryClient();

  return useMutation<Profile, Error, UpdateProfileRequest, { previous?: Profile }>({
    mutationFn: async (payload) => {
      const response = await apiClient.patch<ApiResponse<unknown>>(
        API_ENDPOINTS.ME.PROFILE,
        toFormData(payload),
      );

      return extractProfile(response.data.data);
    },
    onMutate: async (payload) => {
      await queryClient.cancelQueries({ queryKey: queryKeys.me.profile() });

      const previous = queryClient.getQueryData<Profile>(queryKeys.me.profile());

      if (previous) {
        queryClient.setQueryData<Profile>(queryKeys.me.profile(), {
          ...previous,
          name: payload.name ?? previous.name,
          username: payload.username ?? previous.username,
          email: payload.email ?? previous.email,
          phone: payload.numberPhone ?? previous.phone,
          bio: payload.bio ?? previous.bio,
        });
      }

      return { previous };
    },
    onError: (_error, _payload, context) => {
      if (context?.previous) {
        queryClient.setQueryData(queryKeys.me.profile(), context.previous);
      }
    },
    onSuccess: (profile) => {
      queryClient.setQueryData(queryKeys.me.profile(), profile);
    },
    onSettled: () => {
      void queryClient.invalidateQueries({ queryKey: queryKeys.me.all });
    },
  });
}

interface MyPostsPayload {
  posts?: Post[];
  items?: Post[];
  pagination?: Pagination;
}

interface MyPostsPage {
  items: Post[];
  pagination: Pagination;
}

function normalizePost(post: Post): Post {
  // Handle simplified post structure from /api/me/saved endpoint
  const author = post.author
    ? {
        ...post.author,
        id: String(post.author.id),
        avatarUrl: post.author.avatarUrl ?? undefined,
      }
    : {
        id: "unknown",
        username: "unknown",
        name: "Unknown",
        avatarUrl: undefined,
      };

  return {
    ...post,
    id: String(post.id),
    author,
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

async function fetchMyPosts(page: number): Promise<MyPostsPage> {
  const response = await apiClient.get<ApiResponse<MyPostsPayload>>(
    API_ENDPOINTS.ME.POSTS,
    {
      params: {
        page,
        limit: PAGINATION_LIMIT,
      },
    },
  );

  const payload = response.data.data;
  // API returns either 'posts' or 'items' depending on endpoint
  const postsArray = payload.items ?? payload.posts ?? [];
  const posts = Array.isArray(postsArray) ? postsArray : [];

  return {
    items: posts.map(normalizePost),
    pagination: normalizePagination(payload.pagination, page),
  };
}

export function useMyPosts() {
  return useInfiniteQuery({
    queryKey: [...queryKeys.me.all, "posts"],
    initialPageParam: 1,
    queryFn: ({ pageParam }) => fetchMyPosts(pageParam),
    getNextPageParam: (lastPage) => {
      if (lastPage.pagination.page >= lastPage.pagination.totalPages) {
        return undefined;
      }
      return lastPage.pagination.page + 1;
    },
  });
}

async function fetchMySaved(page: number): Promise<MyPostsPage> {
  const response = await apiClient.get<ApiResponse<MyPostsPayload>>(
    API_ENDPOINTS.ME.SAVED,
    {
      params: {
        page,
        limit: PAGINATION_LIMIT,
      },
    },
  );

  const payload = response.data.data;
  // API returns either 'posts' or 'items' depending on endpoint
  const postsArray = payload.items ?? payload.posts ?? [];
  const posts = Array.isArray(postsArray) ? postsArray : [];

  return {
    items: posts.map(normalizePost),
    pagination: normalizePagination(payload.pagination, page),
  };
}

export function useMySaved() {
  return useInfiniteQuery({
    queryKey: queryKeys.me.saved(),
    initialPageParam: 1,
    queryFn: ({ pageParam }) => fetchMySaved(pageParam),
    getNextPageParam: (lastPage) => {
      if (lastPage.pagination.page >= lastPage.pagination.totalPages) {
        return undefined;
      }
      return lastPage.pagination.page + 1;
    },
  });
}
