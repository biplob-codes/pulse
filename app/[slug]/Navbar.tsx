"use client";

import { ThemeToggle } from "@/components/ThemeToggle";
import { Button } from "@/components/ui/button";
import UserAvatar from "@/components/UserAvatar";
import { cn } from "@/lib/utils";
import { LayoutDashboard, Lightbulb, Map } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Board } from "../generated/prisma/client";

interface Props {
  workspaceName: string;
  user?: {
    id: string;
    createdAt: Date;
    updatedAt: Date;
    email: string;
    name: string;
    image?: string | null;
    emailVerified: boolean;
  };
  isMember: boolean;
  board: Board;
}

export function PublicNavbar({ workspaceName, user, isMember, board }: Props) {
  const pathname = usePathname();
  const workspaceSlug = pathname.split("/")[1];

  const navLinks = [
    {
      href: `/${workspaceSlug}`,
      label: "Roadmap",
      icon: Map,
      isActive: pathname === `/${workspaceSlug}`,
    },
    {
      href: `/${workspaceSlug}/${board.slug}`,
      label: "Feedback",
      icon: Lightbulb,
      isActive: pathname.startsWith(`/${workspaceSlug}/${board.slug}`),
    },
  ];

  return (
    <header className="sticky top-0 z-40 w-full border-b border-border  backdrop-blur supports-backdrop-filter:bg-background/60 ">
      <div className="max-w-6xl mx-auto px-6 ">
        <div className="flex h-14 items-center ">
          {/* Workspace name */}
          <Link
            href={`/${workspaceSlug}`}
            className="mr-6 text-xl font-semibold text-foreground tracking-tight"
          >
            {workspaceName}
          </Link>

          <div className="ml-auto flex items-center gap-1">
            <ThemeToggle />

            {isMember && (
              <Button variant="outline" className="rounded-sm mx-2 font-normal">
                <LayoutDashboard />
                Manage workspace
              </Button>
            )}
            {user && <UserAvatar user={user} />}
            {!user && (
              <div className="ml-2">
                <Link href="/signin">
                  <Button
                    variant="outline"
                    className="rounded-sm font-normal cursor-pointer"
                  >
                    Log in
                  </Button>
                </Link>
                <Link href="/register" className="ml-2">
                  <Button className="rounded-sm bg-indigo-600 hover:bg-indigo-700 text-white cursor-pointer">
                    Sign up
                  </Button>
                </Link>
              </div>
            )}
          </div>
        </div>
        <nav className="flex items-center gap-1">
          {navLinks.map(({ href, label, icon: Icon, isActive }) => {
            return (
              <Link
                key={href}
                href={href}
                className={cn(
                  "flex items-center gap-1.5 rounded-md px-3 py-1.5 text-sm transition-colors",
                  isActive
                    ? "text-indigo-700 font-medium"
                    : "text-muted-foreground hover:text-foreground",
                )}
              >
                <Icon className="h-4 w-4" />
                {label}
              </Link>
            );
          })}
        </nav>
      </div>
    </header>
  );
}
