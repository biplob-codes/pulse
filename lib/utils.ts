import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import slugify from "slugify";
import { nanoid } from "nanoid";
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function generateSlug(title: string): string {
  const base = slugify(title, { lower: true, strict: true, trim: true });
  const suffix = nanoid(6); // e.g. "k3x9mq"
  return `${base}-${suffix}`; // "my-feature-request-k3x9mq"
}
