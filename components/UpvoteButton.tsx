"use client";

import { ChevronUp } from "lucide-react";
import { useTransition } from "react";
import { cn } from "@/lib/utils";
import { toggleVoteAction } from "@/app/actions/vote";

type Props = {
  feedbackId: string;
  count: number;
  hasVoted: boolean;
  isAuthenticated: boolean;
  workspaceSlug: string;
  boardSlug: string;
};

export function UpvoteButton({
  feedbackId,
  count,
  hasVoted,
  isAuthenticated,
  workspaceSlug,
  boardSlug,
}: Props) {
  const [isPending, startTransition] = useTransition();

  function handleClick() {
    if (!isAuthenticated) return; // AuthModal handles this case at the list level
    startTransition(async () => {
      await toggleVoteAction({ feedbackId, workspaceSlug, boardSlug });
    });
  }

  return (
    <button
      type="button"
      onClick={handleClick}
      disabled={isPending}
      aria-label={hasVoted ? "Remove vote" : "Upvote"}
      className={cn(
        "group flex shrink-0 flex-col items-center justify-center rounded-sm border px-2.5 py-2 text-xs font-medium transition-colors min-w-9.5 min-h-10 cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed",
        hasVoted
          ? "border-indigo-400 bg-indigo-50 text-indigo-600 dark:border-indigo-500 dark:bg-indigo-950/60 dark:text-indigo-400"
          : "border-border bg-background text-foreground hover:border-indigo-400 hover:text-indigo-600 dark:hover:border-indigo-500 dark:hover:text-indigo-400",
      )}
    >
      <ChevronUp className="h-3.5 w-3 transition-transform group-hover:-translate-y-0.5" />
      <span>{count}</span>
    </button>
  );
}
