import { z } from "zod";

export const createCommentSchema = z.object({
  text: z
    .string()
    .trim()
    .min(1, "Comment cannot be empty")
    .max(500, "Comment must be 500 characters or less"),
});

export type CreateCommentFormValues = z.infer<typeof createCommentSchema>;
