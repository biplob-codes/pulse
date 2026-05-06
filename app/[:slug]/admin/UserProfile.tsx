"use client";

import { LogOut, Settings } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

// TODO: Replace with real user from session (next-auth or similar)
const MOCK_USER = {
  name: "Md.Biplob Talukdar",
  email: "biplob@example.com",
  image: "",
};

export function SidebarUserProfile() {
  const initials = MOCK_USER.name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

  return (
    <div className="border-t border-border px-3 py-3">
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <button className="flex w-full items-center gap-2.5 rounded-md px-2 py-2 text-left text-sm transition-colors hover:bg-accent focus:outline-none">
            <Avatar className="h-7 w-7 shrink-0">
              <AvatarImage src={MOCK_USER.image} alt={MOCK_USER.name} />
              <AvatarFallback className="text-[10px] bg-muted text-muted-foreground">
                {initials}
              </AvatarFallback>
            </Avatar>
            <div className="min-w-0 flex-1">
              <p className="truncate text-xs font-medium text-foreground leading-tight">
                {MOCK_USER.name}
              </p>
              <p className="truncate text-[11px] text-muted-foreground leading-tight mt-0.5">
                {MOCK_USER.email}
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
            <p className="text-xs font-medium text-foreground">
              {MOCK_USER.name}
            </p>
            <p className="text-[11px] text-muted-foreground">
              {MOCK_USER.email}
            </p>
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
