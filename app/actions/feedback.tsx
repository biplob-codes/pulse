"use server";

import { getSession } from "@/lib/auth-session";
import prisma from "@/lib/prisma";
import { createFeedbackSchema } from "@/lib/schema";
import { generateSlug } from "@/lib/utils";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

export type FeedbackState = {
  success?: boolean;
  message?: string;
  fields?: {
    title?: string;
    description?: string;
  };
  errors?: {
    title?: string[];
    description?: string[];
  };
};

export async function createFeedbackAction(
  constext: { workspaceSlug: string; boardSlug: string },
  _prev: FeedbackState,
  formData: FormData,
): Promise<FeedbackState> {
  // 1. Auth check
  const session = await getSession();

  if (!session?.user) {
    redirect("/signin");
  }
  const { workspaceSlug, boardSlug } = constext;
  const raw = {
    title: formData.get("title") as string,
    description: formData.get("description") as string,
  };

  // 2. Validate
  const parsed = createFeedbackSchema.safeParse(raw);

  if (!parsed.success) {
    return {
      success: false,
      fields: raw,
      errors: parsed.error.flatten().fieldErrors,
    };
  }

  const { title, description } = parsed.data;

  // 3. Check slug is not taken
  const workspace = await prisma.workspace.findUnique({
    where: { slug: workspaceSlug },
    select: {
      boards: { select: { slug: true, id: true } },
    },
  });
  const found = workspace?.boards.map((b) => b.slug).includes(boardSlug);
  if (!found || !workspace) {
    return {
      success: false,
      message: "Board or workspace not found.",
    };
  }
  const board = workspace.boards.filter((b) => b.slug === boardSlug)[0];

  await prisma.feedback.create({
    data: {
      title,
      description,
      boardId: board.id,
      authorId: session.user.id,
      slug: generateSlug(title),
    },
  });

  revalidatePath(`/${workspaceSlug}/${boardSlug}`);
  return {
    success: true,
    message: "Feedback created successfully.",
  };
}
