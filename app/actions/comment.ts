"use server";

import { getSession } from "@/lib/auth-session";
import prisma from "@/lib/prisma";
import { createCommentSchema } from "@/lib/schema";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

interface CommentContext {
  feedbackId: string;
  boardSlug: string;
  workspaceSlug: string;
}

export interface CommentActionState {
  error?: string;
  success?: boolean;
  fields?: {
    content?: string;
  };
  errors?: {
    content?: string[];
  };
}

export async function createCommentAction(
  context: CommentContext,
  _prevState: CommentActionState,
  formData: FormData,
): Promise<CommentActionState> {
  const session = await getSession();
  if (!session) redirect("/");
  const raw = { content: formData.get("content") as string };

  const fields = { content: raw.content };

  const parsed = createCommentSchema.safeParse(raw);

  if (!parsed.success) {
    return {
      success: false,
      fields,
      errors: parsed.error.flatten().fieldErrors,
    };
  }
  try {
    await prisma.comment.create({
      data: {
        feedbackId: context.feedbackId,
        content: raw.content,
        authorId: session.user.id,
      },
    });
    revalidatePath(`/${context.workspaceSlug}/${context.boardSlug}`);
    return { success: true };
  } catch (error) {
    return { success: false };
  }
}
interface DeleteCommentState {
  error?: string;
  message?: string;
  success?: boolean;
}
export const deleteCommentAction = async (
  context: {
    commentId: string;
    workspaceSlug: string;
    boardSlug: string;
  },
  prevState: DeleteCommentState,
  formData: FormData,
): Promise<DeleteCommentState> => {
  const session = await getSession();
  if (!session) redirect("/");
  try {
    const comment = await prisma.comment.findUnique({
      where: { id: context.commentId },
    });
    if (!comment) {
      return { success: false, message: "Comment not found" };
    }
    if (comment.authorId !== session.user.id) {
      return { success: false, message: "Unauthorize" };
    }

    await prisma.comment.delete({ where: { id: context.commentId } });
    revalidatePath(`/${context.workspaceSlug}/${context.boardSlug}`);
    return { success: true };
  } catch (e) {
    return { success: false };
  }
};
