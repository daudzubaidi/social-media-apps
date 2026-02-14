"use client";

import { useMemo } from "react";
import { User, Users, X } from "lucide-react";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { FollowButton } from "@/components/user/follow-button";
import { EmptyState } from "@/components/shared/empty-state";
import { ErrorState } from "@/components/shared/error-state";
import { InfiniteScroll } from "@/components/shared/infinite-scroll";
import { LoadingState } from "@/components/shared/loading-state";
import { usePostLikes } from "@/services/queries/likes";

interface LikesModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  postId: string;
}

export function LikesModal({ open, onOpenChange, postId }: LikesModalProps) {
  const {
    data,
    error,
    isPending,
    isError,
    hasNextPage,
    fetchNextPage,
    isFetchingNextPage,
    refetch,
  } = usePostLikes(postId, open);

  const users = useMemo(() => {
    return data?.pages.flatMap((page) => page.items) ?? [];
  }, [data]);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        showCloseButton={false}
        onEscapeKeyDown={() => onOpenChange(false)}
        onPointerDownOutside={() => onOpenChange(false)}
        onInteractOutside={() => onOpenChange(false)}
        className="top-auto bottom-0 h-[558px] w-screen max-w-[393px] translate-y-0 gap-0 overflow-hidden border-0 bg-transparent p-0 shadow-none sm:top-[50%] sm:bottom-auto sm:h-[570px] sm:max-w-[548px] sm:translate-y-[-50%]"
      >
        <div className="flex h-full flex-col items-end gap-2 sm:gap-4">
          <div className="mr-4 flex h-6 w-14 items-center justify-end sm:mr-0 sm:w-6">
            <button
              type="button"
              onClick={() => onOpenChange(false)}
              className="inline-flex size-6 items-center justify-center text-foreground transition-opacity hover:opacity-80"
              aria-label="Close likes modal"
            >
              <X className="size-6" />
            </button>
          </div>

          <div className="h-[526px] w-full rounded-[16px] border border-neutral-900 bg-neutral-950 sm:h-[530px] sm:w-[548px]">
            <div className="flex h-full flex-col px-4 pt-4 sm:px-5 sm:pt-5">
              <DialogTitle className="text-base font-bold leading-[30px] tracking-[-0.32px] text-foreground">
                Likes
              </DialogTitle>

              <div className="mt-3 min-h-0 flex-1 overflow-y-auto">
                {isPending && users.length === 0 ? (
                  <LoadingState className="min-h-[200px]" />
                ) : isError ? (
                  <ErrorState
                    message={error instanceof Error ? error.message : "Failed to load likes"}
                    onRetry={() => {
                      void refetch();
                    }}
                    className="min-h-[200px]"
                  />
                ) : users.length === 0 ? (
                  <EmptyState
                    icon={Users}
                    title="No likes yet"
                    description="Be the first person to like this post."
                    className="min-h-[200px]"
                  />
                ) : (
                  <div className="space-y-5">
                    {users.map((likedUser) => (
                        <div key={likedUser.id} className="flex h-14 items-center gap-3">
                          <Avatar size="default" className="size-10">
                            <AvatarImage src={likedUser.avatarUrl} alt={likedUser.name} />
                            <AvatarFallback>
                              {likedUser.name.charAt(0).toUpperCase() || <User className="size-4" />}
                            </AvatarFallback>
                          </Avatar>

                          <div className="min-w-0 flex-1">
                            <p className="truncate text-sm font-bold leading-7 tracking-[-0.14px] text-foreground">
                              {likedUser.name}
                            </p>
                            <p className="truncate text-sm leading-7 tracking-[-0.14px] text-muted-foreground">
                              {likedUser.username}
                            </p>
                          </div>

                          {likedUser.isMe ? (
                            <span className="text-sm text-muted-foreground">You</span>
                          ) : (
                            <FollowButton
                              username={likedUser.username}
                              isFollowing={likedUser.isFollowedByMe}
                            />
                          )}
                        </div>
                      ))}

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
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
