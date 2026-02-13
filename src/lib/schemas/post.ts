import { z } from "zod";

const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB
const ACCEPTED_IMAGE_TYPES = [
  "image/jpeg",
  "image/jpg",
  "image/png",
  "image/webp",
];

export const createPostSchema = z.object({
  caption: z
    .string()
    .trim()
    .min(1, "Caption is required")
    .max(2200, "Caption must be 2200 characters or less"),
  image: z
    .instanceof(File, { message: "Image is required" })
    .refine((file) => file.size <= MAX_FILE_SIZE, {
      message: "Image size must be less than 5MB",
    })
    .refine((file) => ACCEPTED_IMAGE_TYPES.includes(file.type), {
      message: "Only .jpg, .jpeg, .png and .webp formats are supported",
    }),
});

export type CreatePostFormValues = z.infer<typeof createPostSchema>;
