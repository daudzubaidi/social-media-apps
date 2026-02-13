"use client";

import { useMemo } from "react";
import { useParams, useRouter } from "next/navigation";
import { ArrowLeft, User, Users } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { EmptyState } from "@/components/shared/empty-state";
import { ErrorState } from "@/components/shared/error-state";
import { InfiniteScroll } from "@/components/shared/infinite-scroll";
import { LoadingState } from "@/components/shared/loading-state";
import { FollowButton } from "@/components/user/follow-button";
import { useFollowing } from "@/services/queries/follow";
import { getAuthUserId } from "@/lib/auth";

export default function FollowingPage() {
  const params = useParams<{ username: string }>();
  const router = useRouter();
  const username = params?.username ?? "";

  const {
    data,
    error,
    isPending,
    isError,
    hasNextPage,
    fetchNextPage,
    isFetchingNextPage,
    refetch,
  } = useFollowing(username);

  const authUserId = getAuthUserId();
  const users = useMemo(() => {
    return data?.pages.flatMap((page) => page.items) ?? [];
  }, [data]);

  return (
    <section className="mx-auto w-full max-w-[361px] px-4 pb-6 pt-4 md:max-w-[812px] md:pb-10 md:pt-10">
      <div className="flex items-center gap-3">
        <button
          type="button"
          onClick={() => router.back()}
          className="inline-flex size-10 items-center justify-center text-foreground hover:opacity-80"
          aria-label="Go back"
        >
          <ArrowLeft className="size-6" />
        </button>
        <h1 className="text-base font-bold leading-[30px] tracking-[-0.32px] text-foreground">
          Following
        </h1>
      </div>

      <div className="mt-4">
        {isPending && users.length === 0 ? (
          <LoadingState className="min-h-[200px]" />
        ) : isError ? (
          <ErrorState
            message={error instanceof Error ? error.message : "Failed to load following"}
            onRetry={() => {
              void refetch();
            }}
            className="min-h-[200px]"
          />
        ) : users.length === 0 ? (
          <EmptyState
            icon={Users}
            title="Not following anyone"
            description="Following will appear here."
            className="min-h-[200px]"
          />
        ) : (
          <div className="space-y-5">
            {users.map((user) => {
              const isMe = user.id === authUserId;

              return (
                <div key={user.id} className="flex h-14 items-center gap-3">
                  <Avatar size="default" className="size-10">
                    <AvatarImage src={user.avatarUrl} alt={user.name} />
                    <AvatarFallback>
                      {user.name.charAt(0).toUpperCase() || <User className="size-4" />}
                    </AvatarFallback>
                  </Avatar>

                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-bold leading-7 tracking-[-0.14px] text-foreground">
                      {user.name}
                    </p>
                    <p className="truncate text-sm leading-7 tracking-[-0.14px] text-muted-foreground">
                      {user.username}
                    </p>
                  </div>

                  {isMe ? (
                    <span className="text-sm text-muted-foreground">You</span>
                  ) : (
                    <FollowButton
                      username={user.username}
                      isFollowing={user.isFollowedByMe}
                    />
                  )}
                </div>
              );
            })}

            <InfiniteScroll
              hasMore={Boolean(hasNextPage)}
              isLoading={isFetchingNextPage}
              onLoadMore={() => {
                void fetchNextPage();
              }}
            />
          </div>
        )}
      </div>
    </section>
  );
}
