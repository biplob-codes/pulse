"use client";

import { ChevronUp } from "lucide-react";
import { useState, useTransition } from "react";
import { cn } from "@/lib/utils";
import { toggleVoteAction } from "@/app/actions/vote";
import { Button } from "./ui/button";
import { AuthModal } from "./AuthModal";

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
  const [openAuthModal, setOpenAuthModal] = useState(false);
  function handleClick() {
    if (!isAuthenticated) {
      setOpenAuthModal(true);
      return;
    }
    startTransition(async () => {
      await toggleVoteAction({ feedbackId, workspaceSlug, boardSlug });
    });
  }

  return (
    <>
      <Button
        type="button"
        variant="outline"
        onClick={handleClick}
        disabled={isPending}
        aria-label={hasVoted ? "Remove vote" : "Upvote"}
        className={cn(
          "group flex shrink-0 flex-col items-center justify-center rounded-sm px-2.5 py-2 text-xs min-w-9.5 min-h-10 h-auto",
          hasVoted
            ? "border-indigo-400 bg-indigo-50 text-indigo-600 dark:border-indigo-500 dark:bg-indigo-950/60 dark:text-indigo-400"
            : "hover:border-indigo-400 hover:text-indigo-600 dark:hover:border-indigo-500 dark:hover:text-indigo-400",
        )}
      >
        <ChevronUp className="h-3.5 w-3 transition-transform group-hover:-translate-y-0.5" />
        <span>{count}</span>
      </Button>

      <AuthModal open={openAuthModal} onClose={() => setOpenAuthModal(false)} />
    </>
  );
}
