import React from "react";
import { PublicNavbar } from "../Navbar";
import { getSession } from "@/lib/auth-session";
import prisma from "@/lib/prisma";
import { redirect } from "next/navigation";

const layout = async ({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ slug: string }>;
}) => {
  const session = await getSession();
  const slug = (await params).slug;
  const workspace = await prisma.workspace.findFirst({
    where: { slug },
    select: {
      boards: true,
      name: true,
      members: {
        select: { userId: true },
      },
    },
  });
  if (!workspace) redirect("/");
  const isMember = workspace.members.some(
    (member) => member.userId === session?.user.id,
  );
  return (
    <div className="min-h-screen bg-background">
      <PublicNavbar
        workspaceName={workspace?.name}
        user={session?.user}
        isMember={isMember}
      />
      <main className="max-w-6xl mx-auto px-6 py-6">{children}</main>
    </div>
  );
};

export default layout;
