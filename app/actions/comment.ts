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
  message?: string;
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
    workspaceSlug?: string;
    boardSlug?: string;
  },
  prevState: DeleteCommentState,
  formData: FormData,
): Promise<DeleteCommentState> => {
  const session = await getSession();
  if (!session) redirect("/");
  try {
    const comment = await prisma.comment.findUnique({
      where: { id: context.commentId },
      select: {
        authorId: true,
        feedback: {
          select: {
            board: {
              select: {
                workspace: {
                  select: { members: { select: { userId: true } } },
                },
              },
            },
          },
        },
      },
    });
    if (!comment) {
      return { success: false, message: "Comment not found" };
    }
    const isWorkSpaceMember = comment.feedback.board.workspace.members.find(
      (u) => u.userId === session.user.id,
    );

    if (comment.authorId !== session.user.id && !isWorkSpaceMember) {
      return { success: false, message: "Unauthorize" };
    }

    await prisma.comment.delete({ where: { id: context.commentId } });

    if (context.workspaceSlug && context.boardSlug) {
      revalidatePath(`/${context.workspaceSlug}/${context.boardSlug}`);
    }
    return { success: true };
  } catch (e) {
    return { success: false };
  }
};

export async function updateCommentAction(
  context: {
    commentId: string;
    workspaceSlug: string;
    boardSlug: string;
  },
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
    const comment = await prisma.comment.findUnique({
      where: { id: context.commentId },
    });
    if (comment?.authorId !== session.user.id)
      return { success: false, message: "Unauthorize" };

    await prisma.comment.update({
      where: { id: context.commentId },
      data: {
        content: raw.content,
      },
    });
    revalidatePath(`/${context.workspaceSlug}/${context.boardSlug}`);
    return { success: true };
  } catch (error) {
    return { success: false };
  }
}

export async function togglePinComment(commentId: string) {
  try {
    const session = await getSession();
    if (!session) return { success: false, message: "Unauthorized" };

    // check if the user is an admin/owner of the workspace
    const comment = await prisma.comment.findUnique({
      where: { id: commentId },
      include: {
        feedback: {
          select: {
            board: {
              select: {
                workspace: {
                  select: {
                    members: {
                      where: { userId: session.user.id },
                    },
                  },
                },
              },
            },
          },
        },
      },
    });

    if (!comment) return { success: false, message: "Comment not found" };

    const member = comment.feedback.board.workspace.members[0];
    if (!member)
      return { success: false, message: "Not authorize to pin comments" };

    // if trying to pin, unpin the current pinned one first
    if (!comment.isPinned) {
      await prisma.$transaction([
        prisma.comment.updateMany({
          where: { feedbackId: comment.feedbackId, isPinned: true },
          data: { isPinned: false },
        }),
        prisma.comment.update({
          where: { id: commentId },
          data: { isPinned: true },
        }),
      ]);
    } else {
      // just unpin
      await prisma.comment.update({
        where: { id: commentId },
        data: { isPinned: false },
      });
    }

    return {
      success: true,
      message: comment.isPinned ? "Comment unpinned" : "Comment pinned",
    };
  } catch {
    return { success: false, message: "Something went wrong" };
  }
}
