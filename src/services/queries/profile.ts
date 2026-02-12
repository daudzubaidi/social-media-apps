import {
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";
import { API_ENDPOINTS } from "@/config/constants";
import { queryKeys } from "@/lib/query-keys";
import { apiClient } from "@/services/api/client";
import type { ApiResponse } from "@/types/api";
import type { Profile, UpdateProfileRequest } from "@/types/user";

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

      return extractProfile(response.data.data);
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
