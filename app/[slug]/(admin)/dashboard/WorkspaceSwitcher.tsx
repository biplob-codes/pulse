"use client";

import { useState } from "react";
import { Check, ChevronsUpDown, Plus } from "lucide-react";
import { cn } from "@/lib/utils";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

interface Props {
  workspaces: { id: string; name: string; slug: string }[];
}
export function WorkspaceSwitcher({ workspaces }: Props) {
  const [activeWorkspace, setActiveWorkspace] = useState(workspaces[0]);

  const handleNewWorkspace = () => {
    toast.info("Creating new workspaces isn't available yet.");
  };

  return (
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
          className="w-56"
          align="start"
          side="bottom"
          sideOffset={4}
        >
          {workspaces.map((ws) => (
            <DropdownMenuItem
              key={ws.id}
              className="flex items-center gap-3 cursor-pointer"
              onClick={() => setActiveWorkspace(ws)}
            >
              <span className="flex-1 truncate text-sm">{ws.name}</span>
              {activeWorkspace.id === ws.id && (
                <Check className="h-3.5 w-3.5 text-primary" />
              )}
            </DropdownMenuItem>
          ))}

          <DropdownMenuSeparator />

          <DropdownMenuItem
            className="cursor-pointer text-sm py-2 text-muted-foreground"
            onClick={handleNewWorkspace}
          >
            <Plus /> New workspace
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}
