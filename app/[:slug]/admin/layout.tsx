import { getSession } from "@/lib/auth-session";
import prisma from "@/lib/prisma";
import { redirect } from "next/navigation";
import React from "react";
import { AdminLayout } from "./AdminLayout";

const layout = async ({
  children,
  params,
}: {
  children: React.ReactNode;
  params: { slug: string };
}) => {
  const session = await getSession();
  if (!session) redirect("/");
  const slug = await params.slug;
  const workspace = await prisma.workspaceMember.findFirst({
    where: {
      userId: session.user.id,
      workspace: {
        slug,
      },
    },
  });

  if (!workspace) redirect("/");
  return <AdminLayout>{children}</AdminLayout>;
};

export default layout;
