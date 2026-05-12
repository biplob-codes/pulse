"use server";

import { getSession } from "@/lib/auth-session";
import { redirect } from "next/navigation";
import prisma from "@/lib/prisma";
import { createBoardSchema } from "@/lib/schema";
import { revalidatePath } from "next/cache";

export type CreateBoardState = {
  success?: boolean;
  message?: string;
  fields?: {
    name?: string;
    slug?: string;
  };
  errors?: {
    name?: string[];
    slug?: string[];
  };
};

export async function createBoardAction(
  workspaceSlug: string,
  _prev: CreateBoardState,
  formData: FormData,
): Promise<CreateBoardState> {
  // 1. Auth check

  const raw = {
    name: formData.get("name") as string,
    slug: formData.get("slug") as string,
  };

  // 2. Validate
  const parsed = createBoardSchema.safeParse(raw);

  if (!parsed.success) {
    return {
      success: false,
      fields: raw,
      errors: parsed.error.flatten().fieldErrors,
    };
  }

  const { name, slug } = parsed.data;

  const session = await getSession();

  if (!session?.user) {
    redirect("/");
  }
  const workspace = await prisma.workspace.findUnique({
    where: { slug: workspaceSlug },
    select: {
      id: true,
      members: {
        where: { userId: session.user.id },
      },
    },
  });
  if (!workspace || workspace.members.length === 0) {
    return {
      success: false,
      fields: raw,
      message: "You do not have access to this workspace.",
    };
  }

  const existing = await prisma.board.findUnique({
    where: {
      slug_workspaceId: {
        slug,
        workspaceId: workspace.id,
      },
    },
  });

  if (existing) {
    return {
      success: false,
      fields: raw,
      errors: {
        slug: ["This slug is already taken. Try another one."],
      },
    };
  }

  // 3. Create board
  await prisma.board.create({
    data: {
      name,
      slug,
      workspaceId: workspace.id,
    },
  });
  revalidatePath(`/${workspaceSlug}/dashboard`);
  return {
    success: true,
    message: "Board created successfully.",
  };
}
