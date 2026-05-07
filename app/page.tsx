import { getSession } from "@/lib/auth-session";
import prisma from "@/lib/prisma";
import { redirect } from "next/navigation";
import LandingPage from "./LandingPage";

const page = async () => {
  const session = await getSession();
  if (!session) return <LandingPage />;
  const workspaces = await prisma.workspaceMember.findMany({
    where: {
      userId: session?.user.id,
    },
    select: {
      workspace: {
        select: {
          slug: true,
        },
      },
    },
  });
  if (workspaces.length > 1) redirect(`/workspaces`);
  if (workspaces.length === 1) redirect(`/${workspaces[0].workspace.slug}`);
  if (workspaces.length === 0) redirect(`/on-boarding`);
};

export default page;
