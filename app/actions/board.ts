"use server";

import { requireUser, requireWorkspaceMember } from "@/lib/auth-utils";
import prisma from "@/lib/prisma";
import { createBoardSchema } from "@/lib/schema";
import { ActionState } from "@/lib/types";
import { getErrorMessage } from "@/lib/utils";
import { validateForm } from "@/lib/validation";
import { revalidatePath } from "next/cache";

export type CreateBoardState = ActionState<{ name: string; slug: string }>;

export async function createBoardAction(
  workspaceSlug: string,
  _prev: CreateBoardState,
  formData: FormData,
): Promise<CreateBoardState> {
  try {
    const user = await requireUser();
    const member = await requireWorkspaceMember(user.id, workspaceSlug);
    if (!member) throw new Error("Not Authorize to create board.");
    const raw = {
      name: formData.get("name") as string,
      slug: formData.get("slug") as string,
    };

    const parsed = validateForm(createBoardSchema, raw);
    if (!parsed.success) return parsed.state;

    const { name, slug } = parsed.data;

    const existing = await prisma.board.findUnique({
      where: { slug_workspaceId: { slug, workspaceId: member.workspaceId } },
    });

    if (existing) {
      return {
        success: false,
        fields: raw,
        errors: {
          slug: ["A board with this slug already exists in your workspace."],
        },
      };
    }

    await prisma.board.create({
      data: { name, slug, workspaceId: member.workspaceId },
    });

    revalidatePath(`/${workspaceSlug}/dashboard`);
    return { success: true, message: "Board created successfully." };
  } catch (error) {
    return { success: false, message: getErrorMessage(error) };
  }
}
