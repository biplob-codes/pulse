"use server";

import { requireUser } from "@/lib/auth-utils";
import prisma from "@/lib/prisma";
import { commentSchema } from "@/lib/schema";
import { ActionState } from "@/lib/types";
import { getErrorMessage } from "@/lib/utils";
import { validateForm } from "@/lib/validation";
import { revalidatePath } from "next/cache";

export type CommentState = ActionState<{ content: string }>;

export async function createComment(
  feedbackId: string,
  _prevState: CommentState,
  formData: FormData,
): Promise<CommentState> {
  try {
    const user = await requireUser();
    const raw = { content: formData.get("content") as string };
    const parsed = validateForm(commentSchema, raw);
    if (!parsed.success) return parsed.state;
    const comment = await prisma.comment.create({
      data: {
        feedbackId,
        content: raw.content,
        authorId: user.id,
      },
      select: {
        id: true,
        authorId: true,
        feedback: {
          select: {
            board: {
              select: { slug: true, workspace: { select: { slug: true } } },
            },
          },
        },
      },
    });

    revalidatePath(
      `/${comment.feedback.board.workspace.slug}/${comment.feedback.board.slug}`,
    );
    return { success: true };
  } catch (error) {
    return { success: false, message: getErrorMessage(error) };
  }
}

export const deleteCommentByUser = async (
  commentId: string,
  prevState: ActionState,
  formData: FormData,
): Promise<ActionState> => {
  try {
    const user = await requireUser();
    const comment = await prisma.comment.findUnique({
      where: { id: commentId },
      select: {
        id: true,
        authorId: true,
        feedback: {
          select: {
            board: {
              select: { slug: true, workspace: { select: { slug: true } } },
            },
          },
        },
      },
    });
    if (!comment) {
      return { success: false, message: "Comment not found" };
    }

    if (comment.authorId !== user.id) throw new Error("Unauthorized.");

    await prisma.comment.delete({ where: { id: commentId } });

    revalidatePath(
      `/${comment.feedback.board.workspace.slug}/${comment.feedback.board.slug}`,
    );
    return { success: true };
  } catch (error) {
    return { success: false, message: getErrorMessage(error) };
  }
};
//TODO: Refactor UI component to use server action without formData
export const deleteCommentByAdmin = async (
  commentId: string,
  prevState: ActionState,
  formData: FormData,
): Promise<ActionState> => {
  try {
    const user = await requireUser();
    const comment = await prisma.comment.findUnique({
      where: { id: commentId },
      include: {
        feedback: {
          select: {
            id: true,
            board: {
              select: {
                id: true,
                workspace: {
                  select: {
                    slug: true,
                    members: {
                      where: { userId: user.id },
                    },
                  },
                },
              },
            },
          },
        },
      },
    });

    if (!comment) throw new Error("Comment not found");

    const member = comment.feedback.board.workspace.members[0];
    if (!member) throw new Error("Unathorize");

    await prisma.comment.delete({ where: { id: commentId } });

    revalidatePath(
      `/${comment.feedback.board.workspace.slug}/dashboard/boards/${comment.feedback.board.id}/${comment.feedback.id}`,
    );
    return { success: true };
  } catch (error) {
    return { success: false, message: getErrorMessage(error) };
  }
};

export async function updateComment(
  commentId: string,
  _prevState: CommentState,
  formData: FormData,
): Promise<CommentState> {
  try {
    const user = await requireUser();
    const raw = { content: formData.get("content") as string };
    const parsed = validateForm(commentSchema, raw);
    if (!parsed.success) return parsed.state;
    const comment = await prisma.comment.findUnique({
      where: { id: commentId },
      select: { authorId: true, id: true },
    });

    if (comment?.authorId !== user.id) throw new Error("Unathorize");

    await prisma.comment.update({
      where: { id: commentId },
      data: {
        content: raw.content,
      },
    });
    return { success: true };
  } catch (error) {
    return { success: false, message: getErrorMessage(error) };
  }
}

export async function togglePinComment(commentId: string) {
  try {
    const user = await requireUser();
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
                      where: { userId: user.id },
                    },
                  },
                },
              },
            },
          },
        },
      },
    });

    if (!comment) throw new Error("Comment not found");

    const member = comment.feedback.board.workspace.members[0];
    if (!member) throw new Error("Unathorize");

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
    };
  } catch (error) {
    return { success: false, message: getErrorMessage(error) };
  }
}

export async function createAdminComment(
  feedbackId: string,
  content: string,
): Promise<CommentState> {
  try {
    const user = await requireUser();
    const feedback = await prisma.feedback.findUnique({
      where: {
        id: feedbackId,
        board: { workspace: { members: { some: { userId: user.id } } } },
      },
    });
    if (!feedback) throw new Error("Feedback not found");

    const raw = { content };
    const parsed = validateForm(commentSchema, raw);
    if (!parsed.success) return parsed.state;

    await prisma.comment.create({
      data: {
        feedbackId,
        content: raw.content,
        authorId: user.id,
        isMemberReply: true,
      },
    });

    return { success: true };
  } catch (error) {
    return { success: false, message: getErrorMessage(error) };
  }
}
