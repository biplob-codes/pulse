import { Vote } from "@/app/generated/prisma/client";
import { FeedbackStatus } from "@/app/generated/prisma/enums";
import FeedbackStatusBadge from "@/components/FeedbackStatus";
import { UpvoteButton } from "@/components/UpvoteButton";
import UserAvatar from "@/components/UserAvatar";
interface Props {
  id: string;
  title: string;
  description: string | null;
  status: FeedbackStatus;
  author: {
    id: string;
    name: string;
    image: string | null;
  };
  votes: Vote[];
  createdAt: Date;
  currentUser?: {
    id: string;
  };
  workspaceSlug: string;
  boardSlug: string;
}
export function FeedbackCard({
  id,
  title,
  description,
  status,
  author,
  votes,
  createdAt,
  currentUser,
  workspaceSlug,
  boardSlug,
}: Props) {
  return (
    <div className=" dark:border-zinc-800 dark:bg-zinc-950">
      {/* Top row */}
      <div className="flex items-start gap-4">
        <div>
          <UpvoteButton
            feedbackId={id}
            count={votes.length}
            hasVoted={
              currentUser?.id
                ? votes.some((v) => v.userId === currentUser.id)
                : false
            }
            isAuthenticated={!!currentUser}
            workspaceSlug={workspaceSlug}
            boardSlug={boardSlug}
          />
        </div>

        {/* Title + status */}
        <div className="flex flex-col gap-0.5 pt-0.5">
          <h3 className="text-xl font-semibold leading-snug text-zinc-900 dark:text-zinc-50">
            {title}
          </h3>

          <FeedbackStatusBadge status={status} />
        </div>
      </div>

      {/* Feedback row */}
      <div className="flex items-start gap-5 mt-6">
        <UserAvatar user={author} />

        <div className="flex flex-col gap-2">
          <p className="text-sm font-semibold text-zinc-900 dark:text-zinc-50">
            {author.name}
          </p>
          <p className="text-sm text-zinc-500 dark:text-zinc-400">
            {description}
          </p>
          <div className="mt-1 flex flex-wrap items-center gap-x-2 text-[12px] text-zinc-400 dark:text-zinc-500">
            <span>
              {createdAt.toLocaleDateString("en-US", {
                month: "long",
                day: "numeric",
                year: "numeric",
              })}
            </span>
            {currentUser && currentUser.id === author.id && (
              <>
                <span>·</span>
                <button className="transition-colors hover:text-zinc-700 dark:hover:text-zinc-300">
                  Edit Post
                </button>
                <span>·</span>
                <button className="transition-colors hover:text-red-500 dark:hover:text-red-400">
                  Delete
                </button>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
