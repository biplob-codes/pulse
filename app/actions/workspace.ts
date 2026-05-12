"use server";

import { getSession } from "@/lib/auth-session";
import { redirect } from "next/navigation";
import prisma from "@/lib/prisma";
import { onboardingSchema } from "@/lib/schema";

export type OnboardingState = {
  success: boolean;
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

export async function createWorkspaceAction(
  _prev: OnboardingState,
  formData: FormData,
): Promise<OnboardingState> {
  // 1. Auth check
  const session = await getSession();

  if (!session?.user) {
    redirect("/signin");
  }

  const raw = {
    name: formData.get("name") as string,
    slug: formData.get("slug") as string,
  };

  // 2. Validate
  const parsed = onboardingSchema.safeParse(raw);

  if (!parsed.success) {
    return {
      success: false,
      fields: raw,
      errors: parsed.error.flatten().fieldErrors,
    };
  }

  const { name, slug } = parsed.data;

  // 3. Check slug is not taken
  const existing = await prisma.workspace.findUnique({ where: { slug } });

  if (existing) {
    return {
      success: false,
      fields: raw,
      errors: {
        slug: ["This slug is already taken. Try another one."],
      },
    };
  }

  // 4. Create workspace + add user as OWNER in a transaction
  await prisma.$transaction(async (tx) => {
    const workspace = await tx.workspace.create({
      data: {
        name,
        slug,
      },
    });

    await tx.workspaceMember.create({
      data: {
        userId: session.user.id,
        workspaceId: workspace.id,
        role: "OWNER",
      },
    });
  });

  // 5. Redirect to the new workspace
  redirect(`/${slug}/dashboard`);
}
