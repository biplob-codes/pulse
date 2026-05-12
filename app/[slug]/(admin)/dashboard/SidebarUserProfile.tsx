"use client";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import UserAvatar from "@/components/UserAvatar";
import { LogOut, Settings } from "lucide-react";

interface Props {
  user: {
    name: string;
    email: string;
    image?: string | null;
  };
}

export function SidebarUserProfile({ user }: Props) {
  return (
    <div className="border-t border-border px-3 py-3">
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <button className="flex w-full items-center gap-2.5 rounded-md px-2 py-2 text-left text-sm transition-colors hover:bg-accent focus:outline-none">
            <UserAvatar user={user} />
            <div className="min-w-0 flex-1">
              <p className="truncate text-xs font-medium text-foreground leading-tight">
                {user.name}
              </p>
              <p className="truncate text-[11px] text-muted-foreground leading-tight mt-0.5">
                {user.email}
              </p>
            </div>
          </button>
        </DropdownMenuTrigger>

        <DropdownMenuContent
          className="w-56"
          align="end"
          side="top"
          sideOffset={8}
        >
          <div className="px-2 py-1.5">
            <p className="text-xs font-medium text-foreground">{user.name}</p>
            <p className="text-[11px] text-muted-foreground">{user.email}</p>
          </div>
          <DropdownMenuSeparator />
          <DropdownMenuItem className="gap-2 cursor-pointer text-sm">
            <Settings className="h-3.5 w-3.5" />
            Settings
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem className="gap-2 cursor-pointer text-sm text-red-500 focus:text-red-500">
            <LogOut className="h-3.5 w-3.5" />
            Log out
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}
