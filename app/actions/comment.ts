"use server";

import { getSession } from "@/lib/auth-session";
import prisma from "@/lib/prisma";
import { redirect } from "next/navigation";

interface CommentContext {
  feedbackId: string;
}

interface ActionState {
  error?: string;
  success?: boolean;
}

/**
 * addComment — server action called by CommentInput.
 *
 * The component binds `context` (containing feedbackId) via .bind(), so
 * Next.js will pass it as the first argument before `_prevState` and `formData`.
 *
 * Usage in the component:
 *   const boundAction = addComment.bind(null, { feedbackId });
 *   const [state, formAction, isPending] = useActionState(boundAction, {});
 */
export async function createCommentAction(
  context: CommentContext,
  _prevState: ActionState,
  formData: FormData,
): Promise<ActionState> {
  const session = await getSession();
  if (!session) redirect("/");
  const comment = formData.get("comment");

  if (!comment || typeof comment !== "string" || !comment.trim()) {
    return { error: "Comment cannot be empty." };
  }

  if (comment.trim().length < 3) {
    return { error: "Comment is too short." };
  }
  try {
    await prisma.comment.create({
      data: {
        feedbackId: context.feedbackId,
        content: comment,
        authorId: session.user.id,
      },
    });
    return { success: true };
  } catch (error) {
    return { success: false };
  }
}
