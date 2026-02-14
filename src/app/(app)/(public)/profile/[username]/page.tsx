"use client";

import { useState, useMemo } from "react";
import { useParams } from "next/navigation";
import { Grid3x3, Heart } from "lucide-react";
import { ErrorState } from "@/components/shared/error-state";
import { EmptyState } from "@/components/shared/empty-state";
import {
  ProfileHeader,
  ProfileHeaderSkeleton,
} from "@/components/user/profile-header";
import { PostGrid, PostGridSkeleton } from "@/components/post/post-grid";
import { useUserProfile, useUserPosts, useUserLikes } from "@/services/queries/users";
import { cn } from "@/lib/utils";

type TabType = "gallery" | "liked";

export default function PublicProfilePage() {
  const params = useParams<{ username: string }>();
  const encodedUsername = params?.username ?? "";
  const username = decodeURIComponent(encodedUsername);
  const [activeTab, setActiveTab] = useState<TabType>("gallery");

  const profileQuery = useUserProfile(username);
  const postsQuery = useUserPosts(username);
  const likesQuery = useUserLikes(username);

  const posts = useMemo(() => {
    const query = activeTab === "gallery" ? postsQuery : likesQuery;
    return query.data?.pages.flatMap((page) => page.items) ?? [];
  }, [activeTab, postsQuery.data, likesQuery.data]);

  const activeQuery = activeTab === "gallery" ? postsQuery : likesQuery;

  if (!username) {
    return (
      <EmptyState
        title="User not found"
        description="The username is missing."
        className="min-h-[60vh]"
      />
    );
  }

  if (profileQuery.isPending) {
    return (
      <section className="mx-auto w-full max-w-[361px] px-4 pb-6 pt-4 md:max-w-[812px] md:pb-10 md:pt-10">
        <ProfileHeaderSkeleton />
        <div className="mt-4">
          <PostGridSkeleton />
        </div>
      </section>
    );
  }

  if (profileQuery.isError || !profileQuery.data) {
    const message =
      profileQuery.error instanceof Error
        ? profileQuery.error.message
        : "Failed to load profile";

    return (
      <section className="mx-auto w-full max-w-[361px] px-4 pb-6 pt-4 md:max-w-[812px] md:pb-10 md:pt-10">
        <ErrorState
          message={message}
          onRetry={() => {
            void profileQuery.refetch();
          }}
          className="min-h-[60vh]"
        />
      </section>
    );
  }

  const profile = profileQuery.data;

  const tabs = [
    {
      key: "gallery" as TabType,
      label: "Gallery",
      icon: Grid3x3,
      active: activeTab === "gallery",
    },
    {
      key: "liked" as TabType,
      label: "Liked",
      icon: Heart,
      active: activeTab === "liked",
    },
  ];

  return (
    <section className="mx-auto w-full max-w-[361px] px-4 pb-6 pt-4 md:max-w-[812px] md:pb-10 md:pt-10">
      <ProfileHeader profile={profile} />

      <nav className="mt-4 flex w-full items-center" aria-label="Profile tabs">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          return (
            <button
              key={tab.key}
              type="button"
              onClick={() => setActiveTab(tab.key)}
              className={cn(
                "flex h-12 min-h-px flex-1 items-center justify-center gap-2 border-b px-6 md:gap-3",
                tab.active
                  ? "border-b-2 border-neutral-25 text-neutral-25"
                  : "border-neutral-900 text-neutral-400",
              )}
            >
              <Icon className="size-[16.667px] md:size-6" />
              <span
                className={cn(
                  "text-sm leading-[28px] md:text-base md:leading-[30px]",
                  tab.active
                    ? "font-bold tracking-[-0.14px] md:tracking-[-0.32px]"
                    : "font-medium",
                )}
              >
                {tab.label}
              </span>
            </button>
          );
        })}
      </nav>

      <div className="pt-6">
        {activeQuery.isPending && posts.length === 0 ? (
          <PostGridSkeleton />
        ) : activeQuery.isError ? (
          <ErrorState
            message={
              activeQuery.error instanceof Error
                ? activeQuery.error.message
                : "Failed to load posts"
            }
            onRetry={() => {
              void activeQuery.refetch();
            }}
            className="min-h-[40vh]"
          />
        ) : posts.length === 0 ? (
          <EmptyState
            title={activeTab === "gallery" ? "No posts yet" : "No liked posts"}
            description={
              activeTab === "gallery"
                ? "Posts will appear here"
                : "Liked posts will appear here"
            }
            className="min-h-[40vh]"
          />
        ) : (
          <PostGrid
            posts={posts}
            hasMore={Boolean(activeQuery.hasNextPage)}
            isLoading={activeQuery.isFetchingNextPage}
            onLoadMore={() => {
              void activeQuery.fetchNextPage();
            }}
          />
        )}
      </div>
    </section>
  );
}
