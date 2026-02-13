"use client";

import { useState, useCallback, useRef } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Image as ImageIcon, X } from "lucide-react";
import { toast } from "sonner";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { setCreatePostDialogOpen } from "@/features/ui/ui-slice";
import { useCreatePost } from "@/services/queries/posts";
import { createPostSchema, type CreatePostFormValues } from "@/lib/schemas/post";
import { cn } from "@/lib/utils";

export function CreatePostDialog() {
  const dispatch = useAppDispatch();
  const open = useAppSelector((state) => state.ui.createPostDialogOpen);
  const [preview, setPreview] = useState<string | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const createPost = useCreatePost();

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<CreatePostFormValues>({
    resolver: zodResolver(createPostSchema),
  });

  const caption = watch("caption");
  const image = watch("image");

  const handleClose = useCallback(() => {
    dispatch(setCreatePostDialogOpen(false));
    reset();
    setPreview(null);
  }, [dispatch, reset]);

  const handleFileSelect = useCallback(
    (file: File) => {
      setValue("image", file, { shouldValidate: true });
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    },
    [setValue],
  );

  const handleFileInputChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (file) {
        handleFileSelect(file);
      }
    },
    [handleFileSelect],
  );

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  }, []);

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      setIsDragging(false);
      const file = e.dataTransfer.files?.[0];
      if (file && file.type.startsWith("image/")) {
        handleFileSelect(file);
      }
    },
    [handleFileSelect],
  );

  const handleRemoveImage = useCallback(() => {
    setValue("image", undefined as unknown as File, { shouldValidate: false });
    setPreview(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  }, [setValue]);

  const onSubmit = async (data: CreatePostFormValues) => {
    try {
      await createPost.mutateAsync(data);
      toast.success("Success Post");
      handleClose();
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Failed to create post");
    }
  };

  return (
    <Dialog open={open} onOpenChange={(isOpen) => !isOpen && handleClose()}>
      <DialogContent
        showCloseButton={false}
        className="top-[50%] h-auto w-screen max-w-[393px] translate-y-[-50%] gap-0 overflow-hidden border border-neutral-900 bg-neutral-950 p-0 sm:max-w-[600px]"
      >
        <div className="flex h-full flex-col">
          {/* Header */}
          <div className="flex h-14 items-center justify-between border-b border-neutral-900 px-4 sm:h-16 sm:px-6">
            <DialogTitle className="text-base font-bold leading-[30px] tracking-[-0.32px] text-foreground sm:text-lg">
              Create Post
            </DialogTitle>
            <button
              type="button"
              onClick={handleClose}
              className="inline-flex size-6 items-center justify-center text-foreground transition-opacity hover:opacity-80"
              aria-label="Close"
            >
              <X className="size-6" />
            </button>
          </div>

          {/* Content */}
          <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col">
            <div className="flex-1 overflow-y-auto px-4 py-4 sm:px-6 sm:py-6">
              {/* Image Upload Area */}
              {!preview ? (
                <div
                  onDragOver={handleDragOver}
                  onDragLeave={handleDragLeave}
                  onDrop={handleDrop}
                  onClick={() => fileInputRef.current?.click()}
                  className={cn(
                    "flex h-[200px] cursor-pointer flex-col items-center justify-center gap-3 rounded-2xl border-2 border-dashed transition-colors sm:h-[280px]",
                    isDragging
                      ? "border-primary-300 bg-primary-300/10"
                      : "border-neutral-800 bg-neutral-900 hover:border-neutral-700",
                    errors.image && "border-destructive",
                  )}
                >
                  <div className="flex size-12 items-center justify-center rounded-full bg-neutral-800">
                    <ImageIcon className="size-6 text-neutral-400" />
                  </div>
                  <div className="text-center">
                    <p className="text-sm font-semibold text-foreground">
                      Click to upload or drag and drop
                    </p>
                    <p className="text-xs text-muted-foreground">
                      PNG, JPG, WEBP (max 5MB)
                    </p>
                  </div>
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/jpeg,image/jpg,image/png,image/webp"
                    onChange={handleFileInputChange}
                    className="hidden"
                  />
                </div>
              ) : (
                <div className="relative">
                  <div className="relative aspect-square w-full overflow-hidden rounded-2xl bg-neutral-900">
                    <img
                      src={preview}
                      alt="Preview"
                      className="size-full object-cover"
                    />
                  </div>
                  <button
                    type="button"
                    onClick={handleRemoveImage}
                    className="absolute right-2 top-2 flex size-8 items-center justify-center rounded-full bg-black/60 text-white transition-opacity hover:bg-black/80"
                    aria-label="Remove image"
                  >
                    <X className="size-5" />
                  </button>
                </div>
              )}
              {errors.image && (
                <p className="mt-2 text-sm text-destructive">{errors.image.message}</p>
              )}

              {/* Caption */}
              <div className="mt-4">
                <label htmlFor="caption" className="sr-only">
                  Caption
                </label>
                <textarea
                  id="caption"
                  {...register("caption")}
                  placeholder="Write a caption..."
                  rows={4}
                  className={cn(
                    "w-full rounded-xl border bg-neutral-900 px-4 py-3 text-sm leading-[28px] tracking-[-0.28px] text-foreground placeholder:text-neutral-600 focus:outline-none focus:ring-2 focus:ring-primary-300",
                    errors.caption
                      ? "border-destructive focus:ring-destructive"
                      : "border-neutral-800",
                  )}
                />
                <div className="mt-2 flex items-center justify-between">
                  {errors.caption ? (
                    <p className="text-sm text-destructive">{errors.caption.message}</p>
                  ) : (
                    <p className="text-xs text-muted-foreground">
                      {caption?.length || 0} / 2200
                    </p>
                  )}
                </div>
              </div>
            </div>

            {/* Footer */}
            <div className="border-t border-neutral-900 px-4 py-3 sm:px-6 sm:py-4">
              <Button
                type="submit"
                disabled={isSubmitting || !image || createPost.isPending}
                className="h-12 w-full rounded-full bg-primary-300 text-base font-bold leading-[30px] tracking-[-0.32px] text-neutral-25 transition-opacity hover:opacity-90 disabled:opacity-50"
              >
                {isSubmitting || createPost.isPending ? "Posting..." : "Post"}
              </Button>
            </div>
          </form>
        </div>
      </DialogContent>
    </Dialog>
  );
}
