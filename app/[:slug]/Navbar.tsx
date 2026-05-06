"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Map, Lightbulb } from "lucide-react";
import { cn } from "@/lib/utils";
import { ThemeToggle } from "@/components/ThemeToggle";
import { NotificationBell } from "@/components/NotificationBell";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

// TODO: Replace with real workspace name and user from session/context
const WORKSPACE_NAME = "AppX";
const MOCK_USER = {
  name: "Ethan Haunt",
  email: "ethan@example.com",
  image: "",
};

const navLinks = [
  { href: "/roadmap", label: "Roadmap", icon: Map },
  { href: "/feedback", label: "Feedback", icon: Lightbulb },
];

export function PublicNavbar() {
  const pathname = usePathname();

  return (
    <header className="sticky top-0 z-40 w-full border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="flex h-14 items-center px-4 sm:px-6">
        {/* Workspace name */}
        <Link
          href="/"
          className="mr-6 text-base font-semibold text-foreground tracking-tight"
        >
          {WORKSPACE_NAME}
        </Link>

        {/* Nav links */}
        <nav className="flex items-center gap-1">
          {navLinks.map(({ href, label, icon: Icon }) => {
            const isActive = pathname === href || pathname.startsWith(href);
            return (
              <Link
                key={href}
                href={href}
                className={cn(
                  "flex items-center gap-1.5 rounded-md px-3 py-1.5 text-sm transition-colors",
                  isActive
                    ? "text-foreground font-medium"
                    : "text-muted-foreground hover:text-foreground",
                )}
              >
                <Icon className="h-3.5 w-3.5" />
                {label}
              </Link>
            );
          })}
        </nav>

        {/* Right side */}
        <div className="ml-auto flex items-center gap-1">
          <ThemeToggle />
          <NotificationBell />
          <Avatar className="ml-1 h-8 w-8 cursor-pointer">
            <AvatarImage src={MOCK_USER.image} alt={MOCK_USER.name} />
            <AvatarFallback className="text-xs bg-muted text-muted-foreground">
              {MOCK_USER.name
                .split(" ")
                .map((n) => n[0])
                .join("")
                .slice(0, 2)
                .toUpperCase()}
            </AvatarFallback>
          </Avatar>
        </div>
      </div>
    </header>
  );
}
