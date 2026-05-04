import { getSession } from "@/lib/auth-session";
import prisma from "@/lib/prisma";
import { redirect } from "next/navigation";

const WorkspacePage = async ({ params }: { params: { slug: string } }) => {
  const session = await getSession();
  if (!session) redirect("/");
  const workspace = await prisma.workspaceMember.findFirst({
    where: {
      userId: session.user.id,
      workspace: {
        slug: params.slug,
      },
    },
  });

  if (!workspace) redirect("/");
  return (
    <div>
      WorkspacePage: You should see this page if you have selected a workspace.
    </div>
  );
};

export default WorkspacePage;
