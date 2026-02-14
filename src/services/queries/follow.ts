import {
  useInfiniteQuery,
  useMutation,
  useQueryClient,
} from "@tanstack/react-query";
import { apiClient } from "@/services/api/client";
import { API_ENDPOINTS, PAGINATION_LIMIT } from "@/config/constants";
import { queryKeys } from "@/lib/query-keys";
import type { ApiResponse, Pagination } from "@/types/api";
import type { Profile, UserListItem } from "@/types/user";

interface FollowToggleContext {
  previousTarget?: Profile;
  previousMe?: Profile;
}

interface FollowListPayload {
  users?: UserListItem[];
  pagination?: Pagination;
}

interface FollowListPage {
  items: UserListItem[];
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

export function useFollowToggle(username: string) {
  const queryClient = useQueryClient();
  const targetKey = queryKeys.users.profile(username);
  const meKey = queryKeys.me.profile();

  return useMutation<void, Error, { isFollowing: boolean }, FollowToggleContext>({
    mutationFn: async ({ isFollowing }) => {
      const endpoint = API_ENDPOINTS.FOLLOW.TOGGLE(username);
      if (isFollowing) {
        await apiClient.delete<ApiResponse<null>>(endpoint);
      } else {
        await apiClient.post<ApiResponse<null>>(endpoint);
      }
    },
    onSuccess: async () => {
      await Promise.all([
        queryClient.refetchQueries({ queryKey: targetKey }),
        queryClient.refetchQueries({ queryKey: meKey }),
      ]);
    },
    onSettled: () => {
      void queryClient.invalidateQueries({ queryKey: queryKeys.users.followers(username) });
      void queryClient.invalidateQueries({ queryKey: queryKeys.me.following() });
    },
  });
}

async function fetchFollowers(
  username: string,
  page: number,
): Promise<FollowListPage> {
  const response = await apiClient.get<ApiResponse<FollowListPayload>>(
    API_ENDPOINTS.USERS.FOLLOWERS(username),
    { params: { page, limit: PAGINATION_LIMIT } },
  );

  const payload = response.data.data;
  const users = Array.isArray(payload.users) ? payload.users : [];

  return {
    items: users.map(normalizeUser),
    pagination: normalizePagination(payload.pagination, page),
  };
}

async function fetchFollowing(
  username: string,
  page: number,
): Promise<FollowListPage> {
  const response = await apiClient.get<ApiResponse<FollowListPayload>>(
    API_ENDPOINTS.USERS.FOLLOWING(username),
    { params: { page, limit: PAGINATION_LIMIT } },
  );

  const payload = response.data.data;
  const users = Array.isArray(payload.users) ? payload.users : [];

  return {
    items: users.map(normalizeUser),
    pagination: normalizePagination(payload.pagination, page),
  };
}

async function fetchMyFollowers(page: number): Promise<FollowListPage> {
  const response = await apiClient.get<ApiResponse<FollowListPayload>>(
    API_ENDPOINTS.ME.FOLLOWERS,
    { params: { page, limit: PAGINATION_LIMIT } },
  );

  const payload = response.data.data;
  const users = Array.isArray(payload.users) ? payload.users : [];

  return {
    items: users.map(normalizeUser),
    pagination: normalizePagination(payload.pagination, page),
  };
}

async function fetchMyFollowing(page: number): Promise<FollowListPage> {
  const response = await apiClient.get<ApiResponse<FollowListPayload>>(
    API_ENDPOINTS.ME.FOLLOWING,
    { params: { page, limit: PAGINATION_LIMIT } },
  );

  const payload = response.data.data;
  const users = Array.isArray(payload.users) ? payload.users : [];

  return {
    items: users.map(normalizeUser),
    pagination: normalizePagination(payload.pagination, page),
  };
}

function makeInfiniteOptions(
  queryKey: readonly string[],
  fetchFn: (page: number) => Promise<FollowListPage>,
  enabled = true,
) {
  return {
    queryKey,
    initialPageParam: 1,
    queryFn: ({ pageParam }: { pageParam: number }) => fetchFn(pageParam),
    getNextPageParam: (lastPage: FollowListPage) => {
      if (lastPage.pagination.page >= lastPage.pagination.totalPages) {
        return undefined;
      }
      return lastPage.pagination.page + 1;
    },
    enabled,
  };
}

export function useFollowers(username: string) {
  return useInfiniteQuery(
    makeInfiniteOptions(
      queryKeys.users.followers(username),
      (page) => fetchFollowers(username, page),
      Boolean(username),
    ),
  );
}

export function useFollowing(username: string) {
  return useInfiniteQuery(
    makeInfiniteOptions(
      queryKeys.users.following(username),
      (page) => fetchFollowing(username, page),
      Boolean(username),
    ),
  );
}

export function useMyFollowers() {
  return useInfiniteQuery(
    makeInfiniteOptions(
      queryKeys.me.followers(),
      fetchMyFollowers,
    ),
  );
}

export function useMyFollowing() {
  return useInfiniteQuery(
    makeInfiniteOptions(
      queryKeys.me.following(),
      fetchMyFollowing,
    ),
  );
}
