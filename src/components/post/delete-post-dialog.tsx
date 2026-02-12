"use client";

import { ConfirmDialog } from "@/components/shared/confirm-dialog";

interface DeletePostDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onConfirm: () => void;
  isPending?: boolean;
}

export function DeletePostDialog({
  open,
  onOpenChange,
  onConfirm,
  isPending = false,
}: DeletePostDialogProps) {
  return (
    <ConfirmDialog
      open={open}
      onOpenChange={onOpenChange}
      title="Delete this post?"
      description="This action cannot be undone."
      confirmLabel={isPending ? "Deleting..." : "Delete"}
      onConfirm={onConfirm}
      isPending={isPending}
      variant="destructive"
    />
  );
}
