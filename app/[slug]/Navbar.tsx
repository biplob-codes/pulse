"use client";

import { NotificationBell } from "@/components/NotificationBell";
import { ThemeToggle } from "@/components/ThemeToggle";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { LayoutDashboard, Lightbulb, Map } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";

const MOCK_USER = {
  name: "Ethan Haunt",
  email: "ethan@example.com",
  image: "",
};
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
}

export function PublicNavbar({ workspaceName, user, isMember }: Props) {
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
      href: `/${workspaceSlug}/feedback`,
      label: "Feedback",
      icon: Lightbulb,
      isActive: pathname !== `/${workspaceSlug}`,
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
            <NotificationBell />
            {isMember && (
              <Button variant="outline" className="rounded-sm mx-2 font-normal">
                <LayoutDashboard />
                Manage workspace
              </Button>
            )}
            {user && (
              <Avatar className="ml-1 h-8 w-8 cursor-pointer">
                <AvatarImage src={MOCK_USER.image} alt={MOCK_USER.name} />
                <AvatarFallback className="text-xs bg-muted text-muted-foreground">
                  {user.name
                    .split(" ")
                    .map((n) => n[0])
                    .join("")
                    .slice(0, 2)
                    .toUpperCase()}
                </AvatarFallback>
              </Avatar>
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
                <Icon className="h-3.5 w-3.5" />
                {label}
              </Link>
            );
          })}
        </nav>
      </div>
    </header>
  );
}
