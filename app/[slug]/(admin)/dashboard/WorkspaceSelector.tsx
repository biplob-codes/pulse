"use client";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Check, ChevronsUpDown, Plus } from "lucide-react";
import { usePathname, useRouter } from "next/navigation";
import { useState } from "react";
import CreateWorkspaceModal from "./CreateWorkspaceModal";

interface Props {
  workspaces: { name: string; slug: string }[];
}
export function WorkspaceSelector({ workspaces }: Props) {
  const pathname = usePathname();
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const activeWorkspace = workspaces.find((ws) =>
    pathname?.startsWith(`/${ws.slug}/dashboard`),
  )!;

  return (
    <>
      {" "}
      <div className="px-3 py-3">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="ghost"
              className="w-full justify-between px-2 h-9 font-semibold text-sm text-foreground cursor-pointer hover:bg-accent"
            >
              <div className="flex items-center gap-2 min-w-0">
                <span className="truncate">{activeWorkspace.name}</span>
              </div>
              <ChevronsUpDown className="h-3.5 w-3.5 shrink-0 text-muted-foreground" />
            </Button>
          </DropdownMenuTrigger>

          <DropdownMenuContent
            className="w-56 rounded-sm"
            align="start"
            side="bottom"
            sideOffset={4}
          >
            {workspaces.map((ws) => (
              <DropdownMenuItem
                key={ws.slug}
                className="flex items-center gap-3 cursor-pointer"
                onClick={() => router.push(`/${ws.slug}/dashboard`)}
              >
                <span className="flex-1 truncate text-sm">{ws.name}</span>
                {activeWorkspace.slug === ws.slug && (
                  <Check className="h-3.5 w-3.5 text-primary" />
                )}
              </DropdownMenuItem>
            ))}

            <DropdownMenuSeparator />

            <DropdownMenuItem
              className="gap-1.5 hover:text-gray-100  cursor-pointer w-full rounded-sm py-1 "
              onSelect={() => setOpen(true)}
            >
              <Plus className="size-4" />
              New Workspace
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
      <CreateWorkspaceModal open={open} onOpenChange={setOpen} />
    </>
  );
}
