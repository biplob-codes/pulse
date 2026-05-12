"use client";

import { useState } from "react";

import { cn } from "@/lib/utils";
import { TopBar } from "./TopBar";

interface DashboardLayoutProps {
  children: React.ReactNode;
  pageTitle?: string;
  Sidebar: React.ReactNode;
}

export function DashboardLayout({ children, Sidebar }: DashboardLayoutProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="flex h-screen w-full overflow-hidden bg-background">
      {/* Desktop sidebar — always visible on md+ */}
      <div className="hidden md:flex">{Sidebar}</div>

      {/* Mobile sidebar — slide in as overlay */}
      {sidebarOpen && (
        <div className="fixed inset-0 z-50 flex md:hidden">
          {/* Backdrop */}
          <div
            className="absolute inset-0 bg-black/40"
            onClick={() => setSidebarOpen(false)}
          />
          {/* Sidebar panel */}
          <div className="relative z-10 flex h-full">{Sidebar}</div>
        </div>
      )}

      {/* Main content area */}
      <div className="flex flex-1 flex-col overflow-hidden">
        <TopBar
          sidebarOpen={sidebarOpen}
          onToggleSidebar={() => setSidebarOpen((v) => !v)}
        />
        <main className={cn("flex-1 overflow-y-auto p-4 sm:p-6")}>
          {children}
        </main>
      </div>
    </div>
  );
}
