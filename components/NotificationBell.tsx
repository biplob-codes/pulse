"use client";

import { Bell } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

// Mock notifications — replace with real data later
const notifications = [
  {
    id: "1",
    text: 'New upvote on "Dark mode support"',
    time: "2m ago",
    read: false,
  },
  {
    id: "2",
    text: 'Ethan commented on "API rate limits"',
    time: "1h ago",
    read: false,
  },
  {
    id: "3",
    text: "Post status changed to In Progress",
    time: "3h ago",
    read: true,
  },
];

export function NotificationBell() {
  const unreadCount = notifications.filter((n) => !n.read).length;

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          className="relative h-8 w-8 rounded-full text-muted-foreground hover:text-foreground"
        >
          <Bell className="h-4 w-4" />
          {unreadCount > 0 && (
            <span className="absolute -right-0.5 -top-0.5 flex h-4 w-4 items-center justify-center rounded-full bg-red-500 text-[10px] font-semibold text-white">
              {unreadCount}
            </span>
          )}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-80">
        <DropdownMenuLabel className="font-semibold">
          Notifications
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        {notifications.map((n) => (
          <DropdownMenuItem
            key={n.id}
            className="flex flex-col items-start gap-0.5 px-3 py-2.5 cursor-pointer"
          >
            <div className="flex w-full items-start gap-2">
              {!n.read && (
                <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-blue-500" />
              )}
              <span
                className={`text-sm leading-snug ${
                  n.read ? "text-muted-foreground pl-3.5" : "text-foreground"
                }`}
              >
                {n.text}
              </span>
            </div>
            <span className="pl-3.5 text-xs text-muted-foreground">
              {n.time}
            </span>
          </DropdownMenuItem>
        ))}
        <DropdownMenuSeparator />
        <DropdownMenuItem className="justify-center text-xs text-muted-foreground cursor-pointer">
          Mark all as read
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
