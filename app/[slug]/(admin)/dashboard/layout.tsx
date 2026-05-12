import { ThemeToggle } from "@/components/ThemeToggle";
import { Separator } from "@/components/ui/separator";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { getSession } from "@/lib/auth-session";
import prisma from "@/lib/prisma";
import { cn } from "@/lib/utils";
import { notFound, redirect } from "next/navigation";
import React from "react";
import { SidebarUserProfile } from "./SidebarUserProfile";
import { WorkspaceSelector } from "./WorkspaceSelector";
import { Menu } from "lucide-react";
import { SidebarLinks } from "./SidebarLinks";

const layout = async ({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ slug: string }>;
}) => {
  const session = await getSession();
  if (!session) redirect("/");
  const { slug } = await params;

  const workspaceMember = await prisma.workspaceMember.findFirst({
    where: {
      userId: session.user.id,
      workspace: {
        slug,
      },
    },
    include: {
      workspace: {
        select: {
          boards: { select: { id: true, name: true } },
          name: true,
          slug: true,
          id: true,
        },
      },
    },
  });
  if (!workspaceMember) notFound();

  const ws = await prisma.workspaceMember.findMany({
    where: {
      userId: session.user.id,
    },
    select: {
      workspace: {
        select: {
          name: true,
          slug: true,
        },
      },
    },
  });

  const { workspace } = workspaceMember;
  const workspaces = ws.map((w) => w.workspace);
  return (
    <div className="flex h-screen w-full overflow-hidden bg-background">
      <div className="hidden md:flex">
        <aside className="flex h-full w-60 shrink-0 flex-col border-r border-border bg-background">
          <WorkspaceSelector workspaces={workspaces} />
          <Separator />
          <div className="flex-1 overflow-y-auto">
            <SidebarLinks boards={workspace.boards} />
          </div>
          <SidebarUserProfile user={session.user} />
        </aside>
      </div>

      <div className="flex flex-1 flex-col overflow-hidden">
        <header className="flex h-15 shrink-0 items-center gap-3 border-b border-border bg-background px-4">
          <Sheet>
            <SheetTrigger className="md:hidden">
              <Menu />
            </SheetTrigger>
            <SheetContent
              className="flex h-full w-60 shrink-0 flex-col border-r border-border bg-background"
              side="left"
              showCloseButton={false}
            >
              <WorkspaceSelector workspaces={workspaces} />
              <Separator />
              <div className="flex-1 overflow-y-auto">
                <SidebarLinks boards={workspace.boards} />
              </div>
              <SidebarUserProfile user={session.user} />
            </SheetContent>
          </Sheet>

          <div className="ml-auto flex items-center gap-1">
            <ThemeToggle />
          </div>
        </header>
        <main className={cn("flex-1 overflow-y-auto p-4 sm:p-6")}>
          {children}
        </main>
      </div>
    </div>
  );
};

export default layout;
