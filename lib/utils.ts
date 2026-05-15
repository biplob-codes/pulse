import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import slugify from "slugify";
import { nanoid } from "nanoid";
import { differenceInDays, format, formatDistanceToNow } from "date-fns";
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function generateSlug(title: string): string {
  const base = slugify(title, { lower: true, strict: true, trim: true });
  const suffix = nanoid(6); // e.g. "k3x9mq"
  return `${base}-${suffix}`; // "my-feature-request-k3x9mq"
}
export const formatDate = (date: Date) => format(new Date(date), "MMM d, yyyy");

export function formatCommentDate(date: Date) {
  const dateObj = new Date(date);
  const daysDiff = differenceInDays(new Date(), dateObj);

  if (daysDiff >= 7) {
    return format(dateObj, "MMM d, yyyy");
  }

  return formatDistanceToNow(dateObj, { addSuffix: true });
}

export function getErrorMessage(error: unknown): string {
  if (error instanceof Error) return error.message;
  return "Something went wrong";
}
export function generateSlugForBoard(name: string): string {
  return name
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "");
}

export const getInitials = (name: string) =>
  name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();
