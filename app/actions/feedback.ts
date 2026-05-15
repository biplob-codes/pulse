"use server";

import { requireUser, requireWorkspaceMember } from "@/lib/auth-utils";
import prisma from "@/lib/prisma";
import { createFeedbackSchema } from "@/lib/schema";
import { ActionState } from "@/lib/types";
import { generateSlug, getErrorMessage } from "@/lib/utils";
import { validateForm } from "@/lib/validation";
import { PrismaClientKnownRequestError } from "@prisma/client/runtime/client";
import { revalidatePath } from "next/cache";
import { FeedbackStatus } from "../generated/prisma/enums";

export type FeedbackState = ActionState<{
  title?: string;
  description?: string;
}>;

export async function createFeedback(
  ctx: { workspaceSlug: string; boardSlug: string },
  _prev: FeedbackState,
  formData: FormData,
): Promise<FeedbackState> {
  try {
    const user = await requireUser();
    const { workspaceSlug, boardSlug } = ctx;
    const raw = {
      title: formData.get("title") as string,
      description: formData.get("description") as string,
    };

    const parsed = validateForm(createFeedbackSchema, raw);
    if (!parsed.success) return parsed.state;

    const { title, description } = parsed.data;

    const board = await prisma.board.findFirst({
      where: { slug: boardSlug, workspace: { slug: workspaceSlug } },
    });
    if (!board) throw new Error("Board or workspace not found");
    for (let i = 1; i <= 3; i++) {
      try {
        await prisma.feedback.create({
          data: {
            title,
            description,
            boardId: board.id,
            authorId: user.id,
            slug: generateSlug(title),
          },
        });

        break;
      } catch (error) {
        if (
          error instanceof PrismaClientKnownRequestError &&
          error.code === "P2002"
        ) {
          if (i === 3) {
            return {
              success: false,
              message: "An error occurred while creating the feedback.",
            };
          }
          continue; // Slug collision, try again
        }
      }
    }
    revalidatePath(`/${workspaceSlug}/${boardSlug}`);
    return {
      success: true,
      message: "Feedback created successfully.",
    };
  } catch (error) {
    return { success: false, message: getErrorMessage(error) };
  }
}

export async function updateFeedback(
  feedbackId: string,
  _prevState: FeedbackState,
  formData: FormData,
): Promise<FeedbackState> {
  try {
    const user = await requireUser();
    const raw = {
      title: formData.get("title") as string,
      description: formData.get("description") as string,
    };
    const parsed = validateForm(createFeedbackSchema, raw);
    if (!parsed.success) return parsed.state;

    const { title, description } = parsed.data;
    const feedback = await prisma.feedback.findUnique({
      where: { id: feedbackId, authorId: user.id },
    });
    if (!feedback) throw new Error("Feedback not found");

    await prisma.feedback.update({
      where: { id: feedbackId },
      data: {
        title,
        description,
      },
    });

    return { success: true };
  } catch (error) {
    return { success: false, message: getErrorMessage(error) };
  }
}

export async function deleteFeedback(
  feedbackId: string,
): Promise<FeedbackState> {
  try {
    const user = await requireUser();

    const feedback = await prisma.feedback.findUnique({
      where: { id: feedbackId, authorId: user.id },
      select: {
        board: {
          select: { slug: true, workspace: { select: { slug: true } } },
        },
      },
    });
    if (!feedback) throw new Error("Feedback not found");

    await prisma.feedback.delete({
      where: { id: feedbackId },
    });
    revalidatePath(`/${feedback.board.workspace.slug}/${feedback.board.slug}`);
    return { success: true };
  } catch (error) {
    return { success: false, message: getErrorMessage(error) };
  }
}
//TODO: Learn How the UI part uses this action and make suer that they show proper error
export async function updateFeedbackStatus(
  feedbackId: string,
  status: FeedbackStatus,
) {
  try {
    const user = await requireUser();

    const feedback = await prisma.feedback.findUnique({
      where: { id: feedbackId },
      select: {
        board: { select: { id: true, workspace: { select: { slug: true } } } },
      },
    });
    if (!feedback) throw new Error("Feedback not found");
    const workspaceMember = await requireWorkspaceMember(
      user.id,
      feedback.board.workspace.slug,
    );
    if (!workspaceMember) throw new Error("Unathorize");

    await prisma.feedback.update({
      where: { id: feedbackId },
      data: { status },
    });

    revalidatePath(
      `/${feedback.board.workspace.slug}/dashboard/boards/${feedback.board.id}`,
    );
  } catch (error) {
    return { success: false, message: getErrorMessage(error) };
  }
}
