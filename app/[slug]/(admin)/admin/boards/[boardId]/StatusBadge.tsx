import { FeedbackStatus } from "@/app/generated/prisma/enums";
import { Badge } from "@/components/ui/badge";

const statusConfig: Record<
  FeedbackStatus,
  { label: string; className: string }
> = {
  OPEN: {
    label: "Open",
    className:
      "bg-zinc-100 text-zinc-700 border-zinc-200 dark:bg-zinc-800 dark:text-zinc-300 dark:border-zinc-700",
  },
  UNDER_REVIEW: {
    label: "Under Review",
    className:
      "bg-yellow-50 text-yellow-700 border-yellow-200 dark:bg-yellow-900/20 dark:text-yellow-400 dark:border-yellow-800",
  },
  PLANNED: {
    label: "Planned",
    className:
      "bg-blue-50 text-blue-700 border-blue-200 dark:bg-blue-900/20 dark:text-blue-400 dark:border-blue-800",
  },
  IN_PROGRESS: {
    label: "In Progress",
    className:
      "bg-purple-50 text-purple-700 border-purple-200 dark:bg-purple-900/20 dark:text-purple-400 dark:border-purple-800",
  },
  COMPLETED: {
    label: "Completed",
    className:
      "bg-green-50 text-green-700 border-green-200 dark:bg-green-900/20 dark:text-green-400 dark:border-green-800",
  },
  CLOSED: {
    label: "Closed",
    className:
      "bg-red-50 text-red-700 border-red-200 dark:bg-red-900/20 dark:text-red-400 dark:border-red-800",
  },
};

export function StatusBadge({ status }: { status: FeedbackStatus }) {
  const config = statusConfig[status];
  return (
    <Badge
      variant="outline"
      className={`text-xs font-medium px-2 py-0.5 ${config.className}`}
    >
      {config.label}
    </Badge>
  );
}
