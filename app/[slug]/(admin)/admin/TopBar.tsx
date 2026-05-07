"use client";

import { ThemeToggle } from "@/components/ThemeToggle";
import { NotificationBell } from "@/components/NotificationBell";
import { PanelLeftClose, PanelLeftOpen } from "lucide-react";
import { Button } from "@/components/ui/button";

interface TopbarProps {
  sidebarOpen: boolean;
  onToggleSidebar: () => void;
  title?: string;
}

export function TopBar({ sidebarOpen, onToggleSidebar, title }: TopbarProps) {
  return (
    <header className="flex h-15 shrink-0 items-center gap-3 border-b border-border bg-background px-4">
      {/* Mobile sidebar toggle */}
      <Button
        variant="ghost"
        size="icon"
        className="h-8 w-8 text-muted-foreground hover:text-foreground md:hidden"
        onClick={onToggleSidebar}
      >
        {sidebarOpen ? (
          <PanelLeftClose className="h-4 w-4" />
        ) : (
          <PanelLeftOpen className="h-4 w-4" />
        )}
      </Button>

      {title && (
        <h1 className="text-sm font-semibold text-foreground">{title}</h1>
      )}

      <div className="ml-auto flex items-center gap-1">
        <ThemeToggle />
        <NotificationBell />
      </div>
    </header>
  );
}
