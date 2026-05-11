import { getSession } from "@/lib/auth-session";
import prisma from "@/lib/prisma";
import { redirect } from "next/navigation";
import React from "react";
import { AdminLayout } from "./AdminLayout";
import { AdminSidebar } from "./Sidebar";

const layout = async ({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ slug: string }>;
}) => {
  const session = await getSession();
  if (!session) redirect("/");
  const slug = (await params).slug;

  const workspaces = await prisma.workspaceMember.findMany({
    where: {
      userId: session.user.id,
    },
    include: {
      workspace: {
        select: {
          boards: true,
          name: true,
          slug: true,
          id: true,
        },
      },
    },
  });

  if (workspaces.length === 0) redirect("/");

  const slugs = workspaces.map((wm) => wm.workspace.slug);

  if (!slugs.includes(slug)) redirect("/");

  const userObject = {
    ...session.user,
    image: session.user.image ? session.user.image : null,
  };

  return (
    <AdminLayout
      Sidebar={
        <AdminSidebar
          boards={workspaces[0]?.workspace.boards}
          user={userObject}
          workspaces={workspaces.map((wm) => wm.workspace)}
        />
      }
    >
      {children}
    </AdminLayout>
  );
};

export default layout;
