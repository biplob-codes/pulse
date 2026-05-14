import { deleteFeedbackAction } from "@/app/actions/feedback";
import { Vote } from "@/app/generated/prisma/client";
import { FeedbackStatus } from "@/app/generated/prisma/enums";
import { DeleteModal } from "@/components/DeleteModal";
import FeedbackStatusBadge from "@/components/FeedbackStatus";
import { UpvoteButton } from "@/components/UpvoteButton";
import UserAvatar from "@/components/UserAvatar";
import { EditFeedback } from "./EditFeedback";
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
  const boundAction = deleteFeedbackAction.bind(null, { feedbackId: id });
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
                <EditFeedback id={id} title={title} description={description} />
                <span>·</span>
                <DeleteModal
                  action={boundAction}
                  title=" Are you sure you want to delete this post?"
                  description="  This action can't be undone, and all votes and comments will also
              be deleted."
                >
                  <span className=" hover:text-zinc-700 dark:hover:text-zinc-300 ">
                    Delete
                  </span>
                </DeleteModal>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
