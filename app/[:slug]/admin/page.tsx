import { getSession } from "@/lib/auth-session";
import prisma from "@/lib/prisma";
import { redirect } from "next/navigation";

const AdminPage = async ({ params }: { params: { slug: string } }) => {
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
    <div className="flex flex-col gap-4">
      <h2 className="text-lg font-semibold text-foreground">Overview</h2>
      <p className="text-sm text-muted-foreground">
        Select a board from the sidebar to manage feedback.
      </p>
    </div>
  );
};

export default AdminPage;
