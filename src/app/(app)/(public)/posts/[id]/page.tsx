"use client";

import { useState } from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { ArrowLeft, MessageCircle, Send, Trash2, X } from "lucide-react";
import { toast } from "sonner";
import { FallbackImage } from "@/components/shared/fallback-image";
import { EmptyState } from "@/components/shared/empty-state";
import { ErrorState } from "@/components/shared/error-state";
import { LikeButton } from "@/components/post/like-button";
import { SaveButton } from "@/components/post/save-button";
import { CommentModal } from "@/components/post/comment-modal";
import { LikesModal } from "@/components/post/likes-modal";
import { DeletePostDialog } from "@/components/post/delete-post-dialog";
import { Skeleton } from "@/components/ui/skeleton";
import { usePost, useDeletePost } from "@/services/queries/posts";
import { ROUTES } from "@/config/routes";
import { getAuthUserId } from "@/lib/auth";
import { formatRelativeTime } from "@/lib/utils";
import { useAuth } from "@/hooks/use-auth";

function PostDetailSkeleton() {
  return (
    <div className="mx-auto w-full max-w-[1200px] px-4 py-6">
      <div className="grid gap-4 rounded-2xl border border-border bg-card p-4 sm:grid-cols-[1fr_420px] sm:p-6">
        <Skeleton className="aspect-square w-full rounded-xl" />
        <div className="space-y-4">
          <Skeleton className="h-5 w-1/3" />
          <Skeleton className="h-4 w-1/4" />
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-5/6" />
          <Skeleton className="h-10 w-full" />
        </div>
      </div>
    </div>
  );
}

export default function PostDetailPage() {
  const params = useParams<{ id: string }>();
  const router = useRouter();
  const postId = params?.id ?? "";
  const { isAuthenticated } = useAuth();

  const [commentModalOpen, setCommentModalOpen] = useState(false);
  const [likesModalOpen, setLikesModalOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);

  const postQuery = usePost(postId);
  const deletePost = useDeletePost();

  if (!postId) {
    return (
      <EmptyState
        title="Post not found"
        description="The post identifier is missing."
        className="min-h-[60vh]"
      />
    );
  }

  if (postQuery.isPending) {
    return <PostDetailSkeleton />;
  }

  if (postQuery.isError) {
    return (
      <ErrorState
        message={postQuery.error instanceof Error ? postQuery.error.message : "Failed to load post"}
        onRetry={() => {
          void postQuery.refetch();
        }}
        className="min-h-[60vh]"
      />
    );
  }

  const post = postQuery.data;
  if (!post) {
    return (
      <EmptyState
        title="Post not found"
        description="This post may have been removed."
        className="min-h-[60vh]"
      />
    );
  }

  const authUserId = getAuthUserId();
  const isOwner = Boolean(isAuthenticated && authUserId === post.author.id);
  const shareCount =
    typeof post.shareCount === "number" ? post.shareCount : post.commentCount;

  async function handleShare() {
    try {
      const postUrl = `${window.location.origin}${ROUTES.POST_DETAIL(post.id)}`;
      await navigator.clipboard.writeText(postUrl);
      toast.success("Post link copied");
    } catch {
      toast.error("Failed to copy link");
    }
  }

  function handleDeletePost() {
    deletePost.mutate(post.id, {
      onSuccess: () => {
        toast.success("Post deleted");
        setDeleteDialogOpen(false);
        router.replace(ROUTES.FEED);
      },
      onError: (error) => {
        toast.error(error instanceof Error ? error.message : "Failed to delete post");
      },
    });
  }

  function handleCloseDetail() {
    if (typeof window !== "undefined" && window.history.length > 1) {
      router.back();
      return;
    }

    router.replace(ROUTES.FEED);
  }

  return (
    <>
      <div className="sticky top-0 z-30 mx-auto flex w-full max-w-[1200px] items-center justify-between bg-black/95 px-4 pb-2 pt-4 backdrop-blur-sm">
        <button
          type="button"
          onClick={handleCloseDetail}
          className="inline-flex items-center gap-2 rounded-full border border-neutral-900 px-3 py-2 text-sm font-semibold text-neutral-25 transition-colors hover:bg-neutral-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
          aria-label="Back"
        >
          <ArrowLeft className="size-4" />
          Back
        </button>

        <button
          type="button"
          onClick={handleCloseDetail}
          className="inline-flex size-9 items-center justify-center rounded-full border border-neutral-900 text-neutral-25 transition-colors hover:bg-neutral-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
          aria-label="Close post detail"
        >
          <X className="size-4" />
        </button>
      </div>

      <div className="mx-auto w-full max-w-[1200px] px-4 py-6">
        <div className="grid gap-4 rounded-2xl border border-border bg-card p-4 sm:grid-cols-[1fr_420px] sm:p-6">
          <div className="relative aspect-square w-full overflow-hidden rounded-xl bg-muted">
            <FallbackImage
              src={post.imageUrl}
              alt={`Post by ${post.author.name}`}
              fill
              sizes="(max-width: 640px) 100vw, 720px"
              className="object-cover"
            />
          </div>

          <div className="flex min-h-0 flex-col gap-4">
            <div className="flex items-start justify-between gap-3">
              <div className="min-w-0">
                <Link
                  href={ROUTES.PROFILE(post.author.username)}
                  className="block truncate text-base font-semibold text-foreground hover:underline"
                >
                  {post.author.name}
                </Link>
                <p className="text-xs text-muted-foreground">
                  {formatRelativeTime(post.createdAt)}
                </p>
              </div>

              {isOwner && (
                <button
                  type="button"
                  onClick={() => setDeleteDialogOpen(true)}
                  className="inline-flex size-8 items-center justify-center rounded-full text-muted-foreground transition-colors hover:bg-accent hover:text-destructive focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                  aria-label="Delete post"
                >
                  <Trash2 className="size-4" />
                </button>
              )}
            </div>

            <p className="whitespace-pre-wrap text-sm text-foreground">{post.caption}</p>

            <div className="mt-auto space-y-2 border-t border-border pt-3">
              <div className="flex items-center gap-4">
                <LikeButton
                  postId={post.id}
                  likedByMe={post.likedByMe}
                  likeCount={post.likeCount}
                  onLikeClick={
                    isOwner
                      ? () => {
                          setLikesModalOpen(true);
                        }
                      : undefined
                  }
                  onCountClick={() => setLikesModalOpen(true)}
                />

                <button
                  type="button"
                  onClick={() => setCommentModalOpen(true)}
                  className="inline-flex items-center gap-1 rounded text-sm text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                  aria-label="Open comments"
                >
                  <MessageCircle className="size-4" />
                  <span>{post.commentCount}</span>
                </button>

                <button
                  type="button"
                  onClick={handleShare}
                  className="inline-flex items-center gap-1 rounded text-sm text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                  aria-label="Share post"
                >
                  <Send className="size-4" />
                  <span>{shareCount}</span>
                </button>

                <SaveButton postId={post.id} savedByMe={post.savedByMe} className="ml-auto" />
              </div>

              <button
                type="button"
                onClick={() => setLikesModalOpen(true)}
                className="rounded text-xs font-semibold text-primary hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
              >
                View likes
              </button>
            </div>
          </div>
        </div>
      </div>

      <CommentModal
        open={commentModalOpen}
        onOpenChange={setCommentModalOpen}
        post={post}
      />

      <LikesModal
        open={likesModalOpen}
        onOpenChange={setLikesModalOpen}
        postId={post.id}
      />

      <DeletePostDialog
        open={deleteDialogOpen}
        onOpenChange={setDeleteDialogOpen}
        onConfirm={handleDeletePost}
        isPending={deletePost.isPending}
      />
    </>
  );
}
