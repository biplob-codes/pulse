"use client";

import { ChevronUp } from "lucide-react";

type Props = {
  feedbackId: string;
  count: number;
};

export function UpvoteButton({ feedbackId, count }: Props) {
  return (
    <button
      type="button"
      className="flex shrink-0 flex-col items-center justify-center rounded-md border border-border bg-background px-2.5 py-1.5 text-xs font-medium text-foreground transition-colors hover:border-primary hover:text-primary min-w-[42px]"
      aria-label="Upvote"
    >
      <ChevronUp className="h-3.5 w-3.5" />
      <span>{count}</span>
    </button>
  );
}
