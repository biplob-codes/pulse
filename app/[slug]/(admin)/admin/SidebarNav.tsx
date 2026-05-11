"use client";

import Link from "next/link";
import { useParams, usePathname } from "next/navigation";
import { Lightbulb, Map, Plus } from "lucide-react";
import { cn } from "@/lib/utils";

interface Props {
  boards: { id: string; name: string; slug: string }[];
}
export function SidebarNav({ boards }: Props) {
  const pathname = usePathname();
  const slug = useParams()["slug"];
  console.log("params:", useParams());
  const staticLinks = [
    { href: `/${slug}/admin/roadmap`, label: "Roadmap", icon: Map },
    { href: `/${slug}/admin/create-board`, label: "Create Board", icon: Plus },
  ];
  return (
    <nav className="flex flex-col gap-0.5 px-3 py-2">
      {/* Static links */}
      {staticLinks.map(({ href, label, icon: Icon }) => {
        const isActive = pathname === href;
        return (
          <Link
            key={href}
            href={href}
            className={cn(
              "flex items-center gap-2.5 rounded-md px-2 py-1.5 text-sm transition-colors",
              isActive
                ? "bg-accent text-foreground font-medium"
                : "text-muted-foreground hover:bg-accent hover:text-foreground",
            )}
          >
            <Icon className="h-3.5 w-3.5 shrink-0" />
            {label}
          </Link>
        );
      })}

      {/* Boards section */}
      <div className="mt-3">
        <p className="mb-1 px-2 text-[10px] font-semibold uppercase tracking-widest text-muted-foreground/60">
          Boards
        </p>
        {boards.map((board) => {
          const href = `/${slug}/admin/boards/${board.id}`;
          const isActive = pathname === href;
          return (
            <Link
              key={board.id}
              href={href}
              className={cn(
                "flex items-center gap-2.5 rounded-md px-2 py-1.5 text-sm transition-colors",
                isActive
                  ? "bg-accent text-foreground font-medium"
                  : "text-muted-foreground hover:bg-accent hover:text-foreground",
              )}
            >
              <Lightbulb className="h-3.5 w-3.5 shrink-0" />
              {board.name}
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
