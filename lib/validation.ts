import { z } from "zod";
import { ActionState } from "@/lib/types";

export function validateForm<T>(
  schema: z.ZodType<T>,
  raw: unknown,
): { success: true; data: T } | { success: false; state: ActionState<T> } {
  const parsed = schema.safeParse(raw);
  if (!parsed.success) {
    return {
      success: false,
      state: {
        success: false,
        fields: raw as Partial<T>,
        errors: parsed.error.flatten().fieldErrors as ActionState<T>["errors"],
      },
    };
  }
  return { success: true, data: parsed.data };
}
