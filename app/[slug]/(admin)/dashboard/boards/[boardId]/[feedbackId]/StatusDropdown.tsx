"use client";

import { updateFeedbackStatus } from "@/app/actions/feedback";
import { FeedbackStatus } from "@/app/generated/prisma/enums";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { useTransition } from "react";

const STATUS_LABELS: Record<FeedbackStatus, string> = {
  OPEN: "Open",
  UNDER_REVIEW: "Under Review",
  PLANNED: "Planned",
  IN_PROGRESS: "In Progress",
  COMPLETED: "Completed",
  CLOSED: "Closed",
};

type Props = {
  feedbackId: string;
  currentStatus: FeedbackStatus;
};

export function StatusDropdown({ feedbackId, currentStatus }: Props) {
  const [isPending, startTransition] = useTransition();
  const router = useRouter();

  function handleChange(value: FeedbackStatus) {
    startTransition(async () => {
      await updateFeedbackStatus(feedbackId, value);
      router.refresh();
    });
  }

  return (
    <Select
      value={currentStatus}
      onValueChange={handleChange}
      disabled={isPending}
    >
      <SelectTrigger className="w-full rounded-sm cursor-pointer">
        {isPending ? (
          <Loader2 className="h-3.5 w-3.5 animate-spin" />
        ) : (
          <SelectValue />
        )}
      </SelectTrigger>
      <SelectContent className="rounded-sm" position="popper">
        {Object.entries(STATUS_LABELS).map(([value, label]) => (
          <SelectItem
            key={value}
            value={value}
            className="cursor-pointer rounded-sm transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground my-1"
          >
            {label}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}
