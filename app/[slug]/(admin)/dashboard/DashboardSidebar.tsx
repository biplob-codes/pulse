import { WorkspaceSwitcher } from "./WorkspaceSwitcher";
import { SidebarNav } from "./SidebarNav";
import { SidebarUserProfile } from "./UserProfile";
import { Separator } from "@/components/ui/separator";
import { User } from "@/app/generated/prisma/client";
interface Props {
  boards: { id: string; name: string; slug: string }[];
  user: User;
  workspaces: { id: string; name: string; slug: string }[];
}
export function DashboardSidebar({ boards, user, workspaces }: Props) {
  return (
    <aside className="flex h-full w-60 shrink-0 flex-col border-r border-border bg-background">
      {/* Workspace switcher at top */}
      <WorkspaceSwitcher workspaces={workspaces} />

      <Separator />

      {/* Board nav links — scrollable if many boards */}
      <div className="flex-1 overflow-y-auto">
        <SidebarNav boards={boards} />
      </div>

      {/* User profile pinned to bottom */}
      <SidebarUserProfile user={user} />
    </aside>
  );
}
