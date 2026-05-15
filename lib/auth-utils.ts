import { redirect } from "next/navigation";
import { getSession } from "./auth-session";
import prisma from "./prisma";

export async function requireUser() {
  const session = await getSession();
  if (!session?.user) redirect("/");
  return session.user;
}
export async function requireWorkspaceMember(
  userId: string,
  workspaceSlug: string,
) {
  const member = await prisma.workspaceMember.findFirst({
    where: {
      userId,
      workspace: { slug: workspaceSlug },
    },
  });
  if (!member) return null;
  return member;
}
