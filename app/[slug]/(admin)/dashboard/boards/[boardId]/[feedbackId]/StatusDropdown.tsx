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
import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import { toast } from "sonner";

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
  const [optimisticStatus, setOptimisticStatus] = useState(currentStatus);
  const [, startTransition] = useTransition();
  const router = useRouter();

  function handleChange(value: FeedbackStatus) {
    const previousStatus = optimisticStatus;
    setOptimisticStatus(value);

    startTransition(async () => {
      const result = await updateFeedbackStatus(feedbackId, value);
      if (!result?.success) {
        setOptimisticStatus(previousStatus);
        toast.error(result?.message);
      }
      if (result?.success) router.refresh();
    });
  }

  return (
    <Select value={optimisticStatus} onValueChange={handleChange}>
      <SelectTrigger className="w-full rounded-sm cursor-pointer">
        <SelectValue />
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
