"use client";

import { useMemo } from "react";
import Link from "next/link";
import { MessageCircle, MoreHorizontal, Send, X } from "lucide-react";
import { toast } from "sonner";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { ErrorState } from "@/components/shared/error-state";
import { FallbackImage } from "@/components/shared/fallback-image";
import { InfiniteScroll } from "@/components/shared/infinite-scroll";
import { LoadingState } from "@/components/shared/loading-state";
import { CommentComposer } from "@/components/post/comment-composer";
import { CommentItem } from "@/components/post/comment-item";
import { LikeButton } from "@/components/post/like-button";
import { SaveButton } from "@/components/post/save-button";
import { ROUTES } from "@/config/routes";
import { useAuth } from "@/hooks/use-auth";
import { cn, formatRelativeTime } from "@/lib/utils";
import { useComments, useCreateComment, useDeleteComment } from "@/services/queries/comments";
import type { Post } from "@/types/post";

interface CommentModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  post: Post;
}

export function CommentModal({ open, onOpenChange, post }: CommentModalProps) {
  const { isAuthenticated } = useAuth();
  const commentsQuery = useComments(post.id, open);
  const createComment = useCreateComment(post.id);
  const deleteComment = useDeleteComment(post.id);

  const comments = useMemo(() => {
    return commentsQuery.data?.pages.flatMap((page) => page.items) ?? [];
  }, [commentsQuery.data]);
  const shareCount =
    typeof post.shareCount === "number" ? post.shareCount : post.commentCount;

  async function handleShare() {
    try {
      const postUrl =
        typeof window === "undefined"
          ? ROUTES.POST_DETAIL(post.id)
          : `${window.location.origin}${ROUTES.POST_DETAIL(post.id)}`;

      await navigator.clipboard.writeText(postUrl);
      toast.success("Post link copied");
    } catch {
      toast.error("Failed to copy link");
    }
  }

  const commentsContent = (
    <>
      {commentsQuery.isPending && comments.length === 0 ? (
        <LoadingState className="min-h-[200px]" />
      ) : commentsQuery.isError ? (
        <ErrorState
          message={
            commentsQuery.error instanceof Error
              ? commentsQuery.error.message
              : "Failed to load comments"
          }
          onRetry={() => {
            void commentsQuery.refetch();
          }}
          className="min-h-[200px]"
        />
      ) : comments.length === 0 ? (
        <div className="flex min-h-[155px] flex-col items-center justify-center text-center">
          <p className="text-base font-bold leading-[30px] tracking-[-0.32px] text-foreground">
            No Comments yet
          </p>
          <p className="text-sm leading-7 tracking-[-0.28px] text-muted-foreground">
            Start the conversation
          </p>
        </div>
      ) : (
        <div className="flex flex-col">
          {comments.map((comment, index) => (
            <div
              key={comment.id}
              className={cn(index < comments.length - 1 && "mb-3 border-b border-neutral-900 pb-3")}
            >
              <CommentItem
                comment={comment}
                canDelete={Boolean(isAuthenticated && comment.isMine)}
                isDeleting={deleteComment.isPending && deleteComment.variables === comment.id}
                onDelete={(commentId) => {
                  deleteComment.mutate(commentId);
                }}
              />
            </div>
          ))}

          <InfiniteScroll
            hasMore={Boolean(commentsQuery.hasNextPage)}
            isLoading={commentsQuery.isFetchingNextPage}
            onLoadMore={() => {
              void commentsQuery.fetchNextPage();
            }}
          />
        </div>
      )}
    </>
  );

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        showCloseButton={false}
        onEscapeKeyDown={() => onOpenChange(false)}
        onPointerDownOutside={() => onOpenChange(false)}
        onInteractOutside={() => onOpenChange(false)}
        className="top-auto bottom-0 h-[570px] w-screen max-w-[393px] translate-y-0 gap-0 overflow-hidden border-0 bg-transparent p-0 shadow-none sm:top-[50%] sm:bottom-auto sm:h-[768px] sm:max-w-[1200px] sm:translate-y-[-50%]"
      >
        <div className="flex h-full flex-col items-end gap-2 sm:gap-6">
          <div className="mr-4 flex h-6 w-14 items-center justify-end sm:mr-0 sm:w-6">
            <button
              type="button"
              onClick={() => onOpenChange(false)}
              className="inline-flex size-6 items-center justify-center text-foreground transition-opacity hover:opacity-80"
              aria-label="Close comments modal"
            >
              <X className="size-6" />
            </button>
          </div>

          <div className="h-[538px] w-full rounded-[16px] border border-neutral-900 bg-neutral-950 sm:h-[720px] sm:w-[1200px] sm:rounded-none sm:border-0">
            <div className="hidden h-full sm:flex">
              <div className="relative size-[720px] shrink-0 bg-muted">
                <FallbackImage
                  src={post.imageUrl}
                  alt={`Post by ${post.author.name}`}
                  fill
                  sizes="720px"
                  className="object-cover"
                />
              </div>

              <div className="flex h-full w-[480px] flex-col gap-[46px] p-5">
                <div className="flex min-h-0 flex-1 flex-col gap-4">
                  <div className="flex h-[194px] flex-col gap-2">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-[13px]">
                        <div className="relative size-10 shrink-0 overflow-hidden rounded-full bg-muted">
                          {post.author.avatarUrl ? (
                            <FallbackImage
                              src={post.author.avatarUrl}
                              alt={post.author.name}
                              fill
                              sizes="40px"
                              className="object-cover"
                            />
                          ) : (
                            <div className="flex size-full items-center justify-center text-sm font-bold text-muted-foreground">
                              {post.author.name.charAt(0).toUpperCase()}
                            </div>
                          )}
                        </div>

                        <div className="space-y-0.5">
                          <Link
                            href={ROUTES.PROFILE(post.author.username)}
                            className="block text-sm font-bold leading-7 tracking-[-0.14px] text-foreground hover:underline"
                          >
                            {post.author.name}
                          </Link>
                          <p className="text-xs leading-4 text-muted-foreground">
                            {formatRelativeTime(post.createdAt)}
                          </p>
                        </div>
                      </div>

                      <button
                        type="button"
                        className="inline-flex size-6 items-center justify-center text-muted-foreground transition-colors hover:text-foreground"
                        aria-label="More options"
                      >
                        <MoreHorizontal className="size-6" />
                      </button>
                    </div>

                    <p className="line-clamp-5 text-sm leading-7 tracking-[-0.28px] text-foreground">
                      {post.caption}
                    </p>
                  </div>

                  <div className="h-px w-full bg-neutral-900" />

                  <div className="flex min-h-0 flex-1 flex-col gap-4">
                    <DialogTitle className="text-base font-bold leading-[30px] tracking-[-0.32px] text-foreground">
                      Comments
                    </DialogTitle>

                    <div className="min-h-0 max-h-[208px] overflow-y-auto">
                      {commentsContent}
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <LikeButton
                        postId={post.id}
                        likedByMe={post.likedByMe}
                        likeCount={post.likeCount}
                        className="gap-1.5 text-foreground aria-[pressed=true]:text-primary [&>span]:text-base [&>span]:font-semibold [&>span]:leading-[30px] [&>span]:tracking-[-0.32px] [&>svg]:size-6"
                      />

                      <button
                        type="button"
                        className="inline-flex items-center gap-1.5 text-foreground"
                        aria-label="Comment count"
                      >
                        <MessageCircle className="size-6" />
                        <span className="text-base font-semibold leading-[30px] tracking-[-0.32px]">
                          {post.commentCount}
                        </span>
                      </button>

                      <button
                        type="button"
                        onClick={handleShare}
                        className="inline-flex items-center gap-1.5 text-foreground"
                        aria-label="Share post"
                      >
                        <Send className="size-6" />
                        <span className="text-base font-semibold leading-[30px] tracking-[-0.32px]">
                          {shareCount}
                        </span>
                      </button>
                    </div>

                    <SaveButton
                      postId={post.id}
                      savedByMe={post.savedByMe}
                      className="[&>svg]:size-6"
                    />
                  </div>

                  {isAuthenticated ? (
                    <CommentComposer
                      onSubmit={(text) => {
                        createComment.mutate({ text });
                      }}
                      isPending={createComment.isPending}
                    />
                  ) : (
                    <p className="text-sm text-muted-foreground">
                      <Link href={ROUTES.LOGIN} className="font-semibold text-primary hover:underline">
                        Login
                      </Link>{" "}
                      to join the conversation.
                    </p>
                  )}
                </div>
              </div>
            </div>

            <div className="flex h-full flex-col px-4 pb-4 sm:hidden">
              <div className="pt-4">
                <DialogTitle className="text-base font-bold leading-[30px] tracking-[-0.32px] text-foreground">
                  Comments
                </DialogTitle>
              </div>

              <div className="mt-3 min-h-0 flex-1 overflow-y-auto">{commentsContent}</div>

              {isAuthenticated ? (
                <CommentComposer
                  className="pt-3"
                  onSubmit={(text) => {
                    createComment.mutate({ text });
                  }}
                  isPending={createComment.isPending}
                />
              ) : (
                <p className="pt-3 text-sm text-muted-foreground">
                  <Link href={ROUTES.LOGIN} className="font-semibold text-primary hover:underline">
                    Login
                  </Link>{" "}
                  to join the conversation.
                </p>
              )}
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
