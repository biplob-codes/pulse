import { WorkspaceSwitcher } from "./WorkspaceSwitcher";
import { SidebarNav } from "./SidebarNav";
import { SidebarUserProfile } from "./UserProfile";
import { Separator } from "@/components/ui/separator";

export function AdminSidebar() {
  return (
    <aside className="flex h-full w-60 shrink-0 flex-col border-r border-border bg-background">
      {/* Workspace switcher at top */}
      <WorkspaceSwitcher />

      <Separator />

      {/* Board nav links — scrollable if many boards */}
      <div className="flex-1 overflow-y-auto">
        <SidebarNav />
      </div>

      {/* User profile pinned to bottom */}
      <SidebarUserProfile />
    </aside>
  );
}
