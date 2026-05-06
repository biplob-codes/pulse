"use client";

import { useState } from "react";
import { AdminSidebar } from "./Sidebar";

import { cn } from "@/lib/utils";
import { TopBar } from "./TopBar";

interface AdminLayoutProps {
  children: React.ReactNode;
  pageTitle?: string;
}

export function AdminLayout({ children, pageTitle }: AdminLayoutProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="flex h-screen w-full overflow-hidden bg-background">
      {/* Desktop sidebar — always visible on md+ */}
      <div className="hidden md:flex">
        <AdminSidebar />
      </div>

      {/* Mobile sidebar — slide in as overlay */}
      {sidebarOpen && (
        <div className="fixed inset-0 z-50 flex md:hidden">
          {/* Backdrop */}
          <div
            className="absolute inset-0 bg-black/40"
            onClick={() => setSidebarOpen(false)}
          />
          {/* Sidebar panel */}
          <div className="relative z-10 flex h-full">
            <AdminSidebar />
          </div>
        </div>
      )}

      {/* Main content area */}
      <div className="flex flex-1 flex-col overflow-hidden">
        <TopBar
          sidebarOpen={sidebarOpen}
          onToggleSidebar={() => setSidebarOpen((v) => !v)}
          title={pageTitle}
        />
        <main className={cn("flex-1 overflow-y-auto p-4 sm:p-6")}>
          {children}
        </main>
      </div>
    </div>
  );
}
