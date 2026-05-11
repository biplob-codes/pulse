"use client";

import { useState, useTransition } from "react";
import { Check, Loader2, ChevronDown } from "lucide-react";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { FeedbackStatus } from "@/app/generated/prisma/enums";
import { updateFeedbackStatusAction } from "@/app/actions/feedback";
import { StatusBadge } from "./StatusBadge";

const STATUS_OPTIONS: { label: string; value: FeedbackStatus }[] = [
  { label: "Open", value: "OPEN" },
  { label: "Under Review", value: "UNDER_REVIEW" },
  { label: "Planned", value: "PLANNED" },
  { label: "In Progress", value: "IN_PROGRESS" },
  { label: "Completed", value: "COMPLETED" },
  { label: "Closed", value: "CLOSED" },
];

interface StatusChangerProps {
  feedbackId: string;
  currentStatus: FeedbackStatus;
  workspaceSlug: string;
  boardId: string;
}

export function StatusChanger({
  feedbackId,
  currentStatus,
  workspaceSlug,
  boardId,
}: StatusChangerProps) {
  const [open, setOpen] = useState(false);
  const [optimisticStatus, setOptimisticStatus] = useState(currentStatus);
  const [isPending, startTransition] = useTransition();

  function handleSelect(status: FeedbackStatus) {
    if (status === optimisticStatus) {
      setOpen(false);
      return;
    }

    setOptimisticStatus(status);
    setOpen(false);

    startTransition(async () => {
      await updateFeedbackStatusAction(
        feedbackId,
        status,
        workspaceSlug,
        boardId,
      );
    });
  }

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <button
          className="flex items-center gap-1 group outline-none cursor-pointer"
          disabled={isPending}
        >
          {isPending ? (
            <Loader2 className="h-3.5 w-3.5 animate-spin text-muted-foreground" />
          ) : (
            <>
              <StatusBadge status={optimisticStatus} />
              <ChevronDown className="h-3 w-3 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity" />
            </>
          )}
        </button>
      </PopoverTrigger>
      <PopoverContent
        className="w-44 p-1 shadow-md"
        align="start"
        sideOffset={6}
      >
        {STATUS_OPTIONS.map((opt) => (
          <button
            key={opt.value}
            onClick={() => handleSelect(opt.value)}
            className={cn(
              "w-full flex items-center justify-between px-2.5 py-1.5 rounded-md text-sm transition-colors cursor-pointer",
              "hover:bg-muted text-left",
              opt.value === optimisticStatus
                ? "text-foreground"
                : "text-muted-foreground",
            )}
          >
            {opt.label}
            {opt.value === optimisticStatus && (
              <Check className="h-3.5 w-3.5 text-foreground" />
            )}
          </button>
        ))}
      </PopoverContent>
    </Popover>
  );
}
