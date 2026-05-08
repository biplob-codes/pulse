"use server";

import { getSession } from "@/lib/auth-session";
import prisma from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

export async function toggleVoteAction(context: {
  feedbackId: string;
  workspaceSlug: string;
  boardSlug: string;
}): Promise<{ success: boolean; message?: string }> {
  const session = await getSession();

  if (!session?.user) {
    redirect("/");
  }

  const { feedbackId, workspaceSlug, boardSlug } = context;
  const userId = session.user.id;

  const existing = await prisma.vote.findUnique({
    where: { feedbackId_userId: { feedbackId, userId } },
  });

  if (existing) {
    await prisma.vote.delete({
      where: { feedbackId_userId: { feedbackId, userId } },
    });
  } else {
    await prisma.vote.create({
      data: { feedbackId, userId },
    });
  }

  revalidatePath(`/${workspaceSlug}/${boardSlug}`);
  return { success: true };
}
