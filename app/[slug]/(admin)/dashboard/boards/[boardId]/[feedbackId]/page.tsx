import UserAvatar from "@/components/UserAvatar";
import prisma from "@/lib/prisma";
import { formatDate } from "@/lib/utils";
import { Calendar, Link as PublicLink } from "lucide-react";
import Link from "next/link";
import FeedbackComments from "./FeedbackComments";
import { StatusDropdown } from "./StatusDropdown";
interface PageProps {
  params: Promise<{
    feedbackId: string;
  }>;
}
const page = async ({ params }: PageProps) => {
  const { feedbackId } = await params;

  const feedback = await prisma.feedback.findFirst({
    where: {
      id: feedbackId,
    },
    include: {
      author: true,
      votes: { select: { id: true } },
      comments: {
        include: { author: true },
        orderBy: { createdAt: "asc" },
      },
      board: {
        include: {
          workspace: { select: { slug: true } },
        },
      },
    },
  });
  if (!feedback) return <div>Feedback not found</div>;

  const publicLink = `/${feedback.board.workspace.slug}/${feedback.board.slug}/p/${feedback.slug}`;

  return (
    <div className="flex h-[calc(100vh-6rem)] overflow-hidden">
      <div className="flex flex-col flex-1 min-w-0 border-r border-zinc-200 dark:border-zinc-800">
        {/* Scrollable area */}
        <div className="flex-1 overflow-y-auto">
          <div className="p-2 ">
            <h1 className="text-xl font-semibold text-zinc-900 dark:text-zinc-50 leading-snug mb-3">
              {feedback.title}
            </h1>

            {feedback.description && (
              <p className="mt-2 text-sm text-zinc-700 dark:text-zinc-300 leading-relaxed whitespace-pre-wrap">
                {feedback.description}
              </p>
            )}
          </div>

          {/* Comments */}
          <div className="pr-4 mt-5">
            <FeedbackComments comments={feedback.comments} />
          </div>
        </div>
      </div>

      <div className="w-72 shrink-0 overflow-y-auto px-5  space-y-6">
        <section>
          <p className=" font-semibold mb-4">Status</p>
          <StatusDropdown
            feedbackId={feedback.id}
            currentStatus={feedback.status}
            workspaceSlug={feedback.board.workspace.slug}
            boardId={feedback.board.id}
          />
        </section>

        <section>
          <p className="font-semibold mb-3">Public Link</p>
          <Link
            href={publicLink}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1.5 text-sm text-zinc-500 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-100 transition-colors group underline"
          >
            <PublicLink className="h-3.5 w-3.5 shrink-0 group-hover:rotate-12 transition-transform" />
            <span className="truncate">{publicLink}</span>
          </Link>
        </section>

        {/* Submitted by */}
        <section>
          <p className="text font-semibold mb-2">Submitted By</p>
          <div className="flex items-center gap-2">
            <UserAvatar user={feedback.author} />
            <div className="min-w-0">
              <p className="text-sm font-medium text-zinc-800 dark:text-zinc-200 truncate">
                {feedback.author.name}
              </p>
              <p className="text-xs text-zinc-400 dark:text-zinc-500 truncate">
                {feedback.author.email}
              </p>
            </div>
          </div>
        </section>

        <section>
          <p className=" font-semibold   mb-2">Created At</p>
          <div className="flex items-center gap-1.5 text-sm text-zinc-500 dark:text-zinc-400">
            <Calendar className="h-4 w-4 shrink-0" />
            <span>{formatDate(feedback.createdAt)}</span>
          </div>
        </section>

        <section>
          <p className=" font-semibold  mb-2">Activity</p>
          <div className="space-y-1.5">
            <div className="flex items-center justify-between text-sm">
              <span className="text-zinc-500 dark:text-zinc-400">Votes</span>
              <span className="font-semibold text-zinc-800 dark:text-zinc-200">
                {feedback.votes.length}
              </span>
            </div>
            <div className="flex items-center justify-between text-sm">
              <span className="text-zinc-500 dark:text-zinc-400">Replies</span>
              <span className="font-semibold text-zinc-800 dark:text-zinc-200">
                {feedback.comments.length}
              </span>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
};

export default page;
