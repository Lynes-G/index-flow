import { z } from "zod";
import { isSafeExternalUrl } from "@/lib/externalLinks";

export const usernameFormSchema = z.object({
  username: z
    .string()
    .min(3, "Username must be at least 3 characters long")
    .max(20, "Username must be at most 20 characters long")
    .regex(
      /^[a-zA-Z0-9_]+$/,
      "Username can only contain letters, numbers, and underscores",
    ),
});
export type UsernameFormData = z.infer<typeof usernameFormSchema>;

export const createLinkFormSchema = z.object({
  title: z
    .string()
    .min(1, "Title is required")
    .max(100, "Title must be less than 100 characters"),
  url: z
    .string()
    .trim()
    .min(1, "URL is required")
    .refine(
      (value) => isSafeExternalUrl(value),
      "Please enter a valid http or https URL",
    ),
});
export type CreateLinkFormData = z.infer<typeof createLinkFormSchema>;
