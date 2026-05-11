"use client";

import { updateFeedbackStatusAction } from "@/app/actions/feedback";
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
  workspaceSlug: string;
  boardId: string;
};

export function StatusDropdown({
  feedbackId,
  currentStatus,
  workspaceSlug,
  boardId,
}: Props) {
  const [isPending, startTransition] = useTransition();
  const router = useRouter();

  function handleChange(value: FeedbackStatus) {
    startTransition(async () => {
      await updateFeedbackStatusAction(
        feedbackId,
        value,
        workspaceSlug,
        boardId,
      );
      router.refresh();
    });
  }

  return (
    <Select
      value={currentStatus}
      onValueChange={handleChange}
      disabled={isPending}
    >
      <SelectTrigger className="w-full">
        {isPending ? (
          <Loader2 className="h-3.5 w-3.5 animate-spin" />
        ) : (
          <SelectValue />
        )}
      </SelectTrigger>
      <SelectContent>
        {Object.entries(STATUS_LABELS).map(([value, label]) => (
          <SelectItem key={value} value={value}>
            <div className="flex items-center gap-2">{label}</div>
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}
