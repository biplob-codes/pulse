import { getSession } from "@/lib/auth-session";
import prisma from "@/lib/prisma";
import { redirect } from "next/navigation";
import { PublicNavbar } from "../Navbar";

const WorkspacePage = async ({ params }: { params: Promise<{ slug: string }> }) => {
  const session = await getSession();
  if (!session) redirect("/");
  const slug = (await params).slug;
  const workspace = await prisma.workspaceMember.findFirst({
    where: {
      userId: session.user.id,
      workspace: {
        slug,
      },
    },
  });

  if (!workspace) redirect("/");
  return (
    <>
      <div className="min-h-screen bg-background">
        <PublicNavbar />
        <main className="mx-auto max-w-4xl px-4 py-6 sm:px-6">
          <div className="flex flex-col gap-4">
            <h2 className="text-lg font-semibold text-foreground">Overview</h2>
            <p className="text-sm text-muted-foreground">
              Select a board from the sidebar to manage feedback.
            </p>
          </div>
        </main>
      </div>
    </>
  );
};

export default WorkspacePage;
