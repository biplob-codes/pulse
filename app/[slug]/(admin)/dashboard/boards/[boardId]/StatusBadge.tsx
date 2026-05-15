import { FeedbackStatus } from "@/app/generated/prisma/enums";
import { Badge } from "@/components/ui/badge";

const statusConfig: Record<
  FeedbackStatus,
  { label: string; className: string; dotClassName: string }
> = {
  OPEN: {
    label: "Open",
    className:
      "border-none rounded-sm bg-zinc-100 text-zinc-600 dark:bg-zinc-800 dark:text-zinc-400",
    dotClassName: "bg-zinc-600 dark:bg-zinc-400",
  },
  UNDER_REVIEW: {
    label: "Under Review",
    className:
      "border-none rounded-sm bg-yellow-100 text-yellow-600 dark:bg-yellow-900 dark:text-yellow-400",
    dotClassName: "bg-yellow-600 dark:bg-yellow-400",
  },
  PLANNED: {
    label: "Planned",
    className:
      "border-none rounded-sm bg-blue-100 text-blue-600 dark:bg-blue-900 dark:text-blue-400",
    dotClassName: "bg-blue-600 dark:bg-blue-400",
  },
  IN_PROGRESS: {
    label: "In Progress",
    className:
      "border-none rounded-sm bg-purple-100 text-purple-600 dark:bg-purple-900 dark:text-purple-400",
    dotClassName: "bg-purple-600 dark:bg-purple-400",
  },
  COMPLETED: {
    label: "Completed",
    className:
      "border-none rounded-sm bg-green-100 text-green-600 dark:bg-green-900 dark:text-green-400",
    dotClassName: "bg-green-600 dark:bg-green-400",
  },
  CLOSED: {
    label: "Closed",
    className:
      "border-none rounded-sm bg-red-100 text-red-600 dark:bg-red-900 dark:text-red-400",
    dotClassName: "bg-red-600 dark:bg-red-400",
  },
};

export function StatusBadge({ status }: { status: FeedbackStatus }) {
  const config = statusConfig[status];
  return (
    <Badge className={`text-xs font-medium px-2 py-0.5 ${config.className}`}>
      <span
        className={`size-1.5 rounded-full ${config.dotClassName}`}
        aria-hidden="true"
      />
      {config.label}
    </Badge>
  );
}
