"use client";

import { updateFeedbackStatus } from "@/app/actions/feedback";
import { FeedbackStatus } from "@/app/generated/prisma/enums";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { Check, ChevronDown } from "lucide-react";
import { useState, useTransition } from "react";
import { toast } from "sonner";
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
}

export function StatusChanger({
  feedbackId,
  currentStatus,
}: StatusChangerProps) {
  const [open, setOpen] = useState(false);
  const [optimisticStatus, setOptimisticStatus] = useState(currentStatus);
  const [, startTransition] = useTransition();

  function handleSelect(status: FeedbackStatus) {
    if (status === optimisticStatus) {
      setOpen(false);
      return;
    }
    const previousStatus = optimisticStatus;
    setOptimisticStatus(status);
    setOpen(false);

    startTransition(async () => {
      const result = await updateFeedbackStatus(feedbackId, status);
      if (!result?.success) {
        setOptimisticStatus(previousStatus);
        toast.error(result?.message);
      }
    });
  }

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild onClick={(e) => e.stopPropagation()}>
        <button className="flex items-center gap-1 group outline-none cursor-pointer">
          <>
            <StatusBadge status={optimisticStatus} />
            <ChevronDown className="h-3 w-3 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity" />
          </>
        </button>
      </PopoverTrigger>
      <PopoverContent
        className="w-44 p-1 shadow-md rounded-sm"
        align="start"
        sideOffset={6}
      >
        {STATUS_OPTIONS.map((opt) => (
          <button
            key={opt.value}
            onClick={(e) => {
              handleSelect(opt.value);
              e.stopPropagation();
            }}
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
