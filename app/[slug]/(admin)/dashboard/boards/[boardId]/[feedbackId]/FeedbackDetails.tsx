import { FeedbackStatus } from "@/app/generated/prisma/enums";
import UserAvatar from "@/components/UserAvatar";
import { formatDistanceToNow } from "date-fns";
import { Calendar, Link2, MessageSquare } from "lucide-react";
import Link from "next/link";
import { StatusDropdown } from "./StatusDropdown";
type Author = {
  id: string;
  name: string;
  email: string;
  image: string | null;
};

type CommentWithAuthor = {
  id: string;
  content: string;
  createdAt: Date;
  author: Author;
};

type FeedbackDetail = {
  id: string;
  title: string;
  slug: string;
  description: string | null;
  status: FeedbackStatus;
  createdAt: Date;
  author: Author;
  votes: { id: string }[];
  comments: CommentWithAuthor[];
  board: {
    id: string;
    slug: string;
    workspace: { slug: string };
  };
};

type Props = {
  feedback: FeedbackDetail;
};

function timeAgo(date: Date) {
  return formatDistanceToNow(new Date(date), { addSuffix: true });
}

export function FeedbackDetails({ feedback }: Props) {
  const publicLink = `/${feedback.board.workspace.slug}/${feedback.board.slug}/p/${feedback.slug}`;

  return (
    <div className="flex h-[calc(100vh-6rem)] overflow-hidden">
      <div className="flex flex-col flex-1 min-w-0 border-r border-zinc-200 dark:border-zinc-800">
        {/* Scrollable area */}
        <div className="flex-1 overflow-y-auto">
          {/* Feedback header */}
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
          <div className="px-2 mt-5">
            <h4 className="font-semibold mb-3">Replies</h4>
            {feedback.comments.length === 0 ? (
              <div className="py-12 text-center">
                <MessageSquare className="h-8 w-8 mx-auto text-zinc-300 dark:text-zinc-600 mb-2" />
                <p className="text-sm text-zinc-400 dark:text-zinc-500">
                  No replies yet. Be the first to respond.
                </p>
              </div>
            ) : (
              <div className="space-y-5">
                {feedback.comments.map((comment) => (
                  <div key={comment.id} className="flex gap-3">
                    <UserAvatar user={comment.author} />
                    <div className="flex-1 min-w-0">
                      <div className="flex items-baseline gap-2 mb-1">
                        <span className="text-sm font-medium text-zinc-800 dark:text-zinc-200">
                          {comment.author.name}
                        </span>
                        <span className="text-xs text-zinc-400 dark:text-zinc-500">
                          {timeAgo(comment.createdAt)}
                        </span>
                      </div>
                      <p className="text-sm text-zinc-700 dark:text-zinc-300 leading-relaxed whitespace-pre-wrap">
                        {comment.content}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="w-72 shrink-0 overflow-y-auto px-5 py-6 space-y-6">
        {/* Status */}
        <section>
          <p className=" font-semibold  0  mb-2">Status</p>
          <StatusDropdown
            feedbackId={feedback.id}
            currentStatus={feedback.status}
            workspaceSlug={feedback.board.workspace.slug}
            boardId={feedback.board.id}
          />
        </section>

        {/* Public link */}
        <section>
          <p className="font-semibold   mb-2">Public Link</p>
          <Link
            href={publicLink}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1.5 text-sm text-zinc-500 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-100 transition-colors group underline"
          >
            <Link2 className="h-3.5 w-3.5 shrink-0 group-hover:rotate-12 transition-transform" />
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

        {/* Created at */}
        <section>
          <p className=" font-semibold   mb-2">Created</p>
          <div className="flex items-center gap-1.5 text-sm text-zinc-500 dark:text-zinc-400">
            <Calendar className="h-4 w-4 shrink-0" />
            <span>
              {new Date(feedback.createdAt).toLocaleDateString("en-US", {
                year: "numeric",
                month: "short",
                day: "numeric",
              })}
            </span>
          </div>
        </section>

        {/* Stats */}
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
}
