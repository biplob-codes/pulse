import { cn } from "@/lib/utils";
import { FeedbackStatus } from "@/app/generated/prisma/enums";

const STATUS_CONFIG: Record<
  FeedbackStatus,
  { label: string; className: string }
> = {
  OPEN: { label: "Open", className: "text-sky-400 dark:text-sky-400" },
  UNDER_REVIEW: {
    label: "Under Review",
    className: "text-amber-400 dark:text-amber-400",
  },
  PLANNED: { label: "Planned", className: "text-blue-400 dark:text-blue-400" },
  IN_PROGRESS: {
    label: "In Progress",
    className: "text-violet-400 dark:text-violet-400",
  },
  COMPLETED: {
    label: "Completed",
    className: "text-emerald-400 dark:text-emerald-400",
  },
  CLOSED: { label: "Closed", className: "text-zinc-500 dark:text-zinc-400" },
};

const FeedbackStatusBadge = ({ status }: { status: FeedbackStatus }) => {
  const statusCfg = STATUS_CONFIG[status];
  return (
    <span
      className={cn(
        "text-xs font-bold uppercase tracking-wide",
        statusCfg.className,
      )}
    >
      {statusCfg.label}
    </span>
  );
};

export default FeedbackStatusBadge;
