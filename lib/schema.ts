import { z } from "zod";

export const signUpSchema = z.object({
  name: z
    .string("Name is required.")
    .min(2, "Name must be at least 2 characters.")
    .max(64, "Name must be at most 64 characters.")
    .trim(),
  email: z.email("Please enter a valid email address.").toLowerCase().trim(),
  password: z
    .string("Password is required.")
    .min(8, "Password must be at least 8 characters.")
    .max(128, "Password must be at most 128 characters.")
    .regex(/[A-Z]/, "Password must contain at least one uppercase letter.")
    .regex(/[0-9]/, "Password must contain at least one number."),
});

export type SignUpSchema = z.infer<typeof signUpSchema>;
export const signInSchema = z.object({
  email: z.email("Please enter a valid email address.").toLowerCase().trim(),
  password: z
    .string("Password is required.")
    .min(1, "Password is required.")
    .max(128, "Password must be at most 128 characters."),
});

export type SignInSchema = z.infer<typeof signInSchema>;
export const onboardingSchema = z.object({
  name: z
    .string()
    .min(2, "Workspace name must be at least 2 characters")
    .max(64, "Workspace name must be under 64 characters")
    .trim(),

  slug: z
    .string()
    .min(2, "Slug must be at least 2 characters")
    .max(32, "Slug must be under 32 characters")
    .regex(
      /^[a-z0-9]+(?:-[a-z0-9]+)*$/,
      "Slug can only contain lowercase letters, numbers, and hyphens",
    ),
});

export const createBoardSchema = z.object({
  name: z
    .string()
    .min(1, "Board name is required")
    .min(3, "Board name must be at least 3 characters")
    .max(50, "Board name must be at most 50 characters")
    .regex(
      /^[a-zA-Z0-9\s\-_]+$/,
      "Board name can only contain letters, numbers, spaces, hyphens, and underscores",
    ),
  slug: z
    .string()
    .min(1, "URL slug is required")
    .min(3, "URL slug must be at least 3 characters")
    .max(50, "URL slug must be at most 50 characters")
    .regex(
      /^[a-z0-9]+(?:-[a-z0-9]+)*$/,
      "URL slug must be lowercase letters, numbers, and hyphens only",
    ),
});

export type CreateBoardInput = z.infer<typeof createBoardSchema>;

// Helper to generate slug from name
export function generateSlug(name: string): string {
  return name
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "");
}
