import { ChevronUp, MessageSquare } from "lucide-react";
import { UpvoteButton } from "@/components/UpvoteButton";
import { FeedbackStatus } from "@/app/generated/prisma/browser";
import { Vote } from "@/app/generated/prisma/client";
import { cn } from "@/lib/utils";
import { AuthModal } from "@/components/AuthModal";

type FeedbackItem = {
  id: string;
  title: string;
  description: string | null;
  status: FeedbackStatus;
  votes: Vote[];
  comments: { id: string }[];
};

type Props = {
  feedbacks: FeedbackItem[];
  user: {
    id: string;
  } | null;
  workspaceSlug: string;
  boardSlug: string;
};

const STATUS_LABELS: Partial<Record<FeedbackStatus, string>> = {
  IN_PROGRESS: "In Progress",
  PLANNED: "Planned",
  UNDER_REVIEW: "Under Review",
  COMPLETED: "Completed",
  CLOSED: "Closed",
};

const STATUS_STYLES: Partial<Record<FeedbackStatus, string>> = {
  IN_PROGRESS:
    "bg-violet-100 text-violet-600 dark:bg-violet-900/30 dark:text-violet-400",
  PLANNED: "bg-blue-100 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400",
  UNDER_REVIEW:
    "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400",
  COMPLETED:
    "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400",
  CLOSED: "bg-zinc-100 text-zinc-500 dark:bg-zinc-800 dark:text-zinc-400",
};

export function FeedbackList({
  feedbacks,
  user,
  workspaceSlug,
  boardSlug,
}: Props) {
  return (
    <div className="rounded-sm border border-border bg-background">
      {/* Header bar */}
      <div className="flex items-center justify-between border-b border-border px-4 py-3">
        <div className="flex items-center gap-1.5 text-sm text-muted-foreground">
          <span>Showing</span>
          <button className="flex items-center gap-1 font-medium text-foreground hover:underline">
            Trending
            <ChevronUp className="h-3.5 w-3.5 rotate-180" />
          </button>
          <span>posts</span>
        </div>
        <div className="flex items-center gap-2 rounded-md border border-border px-3 py-1.5 text-sm text-muted-foreground">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="14"
            height="14"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <circle cx="11" cy="11" r="8" />
            <path d="m21 21-4.3-4.3" />
          </svg>
          <input
            type="text"
            placeholder="Search..."
            className="w-40 bg-transparent outline-none placeholder:text-muted-foreground"
          />
        </div>
      </div>

      {/* Feedback rows */}
      {feedbacks.length === 0 ? (
        <div className="px-4 py-10 text-center text-sm text-muted-foreground">
          No posts yet. Be the first to submit feedback!
        </div>
      ) : (
        <ul className="divide-y divide-border">
          {feedbacks.map((item) => (
            <li
              key={item.id}
              className="flex items-start justify-between gap-4 px-4 py-4 hover:bg-accent/40 transition-colors"
            >
              {/* Text */}
              <div className="flex flex-col gap-1 min-w-0">
                <p className="text-sm font-semibold text-foreground truncate">
                  {item.title}
                </p>
                {item.description && (
                  <p className="text-sm text-muted-foreground line-clamp-1">
                    {item.description}
                  </p>
                )}
                <div className="flex items-center gap-2 text-xs text-muted-foreground mt-0.5">
                  <span className="flex items-center gap-1">
                    <MessageSquare className="h-3 w-3" />
                    {item.comments.length}
                  </span>
                  {item.status !== "OPEN" && STATUS_LABELS[item.status] && (
                    <>
                      <span>·</span>
                      <span
                        className={`rounded-full px-2 py-0.5 text-xs font-medium ${STATUS_STYLES[item.status]}`}
                      >
                        {STATUS_LABELS[item.status]}
                      </span>
                    </>
                  )}
                </div>
              </div>

              {user?.id ? (
                <UpvoteButton
                  feedbackId={item.id}
                  count={item.votes.length}
                  hasVoted={
                    user?.id
                      ? item.votes.some((v) => v.userId === user.id)
                      : false
                  }
                  isAuthenticated={!!user}
                  workspaceSlug={workspaceSlug}
                  boardSlug={boardSlug}
                />
              ) : (
                <AuthModal
                  trigger={
                    <button
                      type="button"
                      className={cn(
                        "group flex shrink-0 flex-col items-center justify-center rounded-sm border px-2.5 py-2 text-xs font-medium transition-colors min-w-9.5 min-h-10 cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed border-border bg-background text-foreground hover:border-indigo-400 hover:text-indigo-600 dark:hover:border-indigo-500 dark:hover:text-indigo-400",
                      )}
                    >
                      <ChevronUp className="h-3.5 w-3 transition-transform group-hover:-translate-y-0.5" />
                      <span>{item.votes.length}</span>
                    </button>
                  }
                />
              )}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
