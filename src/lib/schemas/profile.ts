import { z } from "zod";

export const updateProfileSchema = z.object({
  name: z.string().trim().min(1, "Name is required"),
  username: z.string().trim().min(3, "Username min 3 chars"),
  email: z.email("Valid email required"),
  numberPhone: z.string().trim().optional(),
  bio: z.string().trim().max(160, "Bio max 160 chars").optional(),
});

export type UpdateProfileFormValues = z.infer<typeof updateProfileSchema>;
