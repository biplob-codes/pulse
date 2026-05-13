"use client";

import UserAvatar from "@/components/UserAvatar";
import { formatCommentDate } from "@/lib/utils"; // your utility fn
import { DeleteCommentModal } from "./DeleteCommentModal";

interface Props {
  comment: {
    id: string;
    author: {
      id: string;
      name: string;
      image?: string | null;
    };
    content: string;
    createdAt: Date;
  };
  currentUserId?: string;
  workspaceSlug: string;
  boardSlug: string;
}
export function CommentItem({
  comment,
  currentUserId,
  boardSlug,
  workspaceSlug,
}: Props) {
  const isAuthor = currentUserId === comment.author.id;

  return (
    <div className="flex items-start gap-3 py-3">
      <UserAvatar user={comment.author} />

      <div className="flex-1 min-w-0">
        <div className="flex items-start justify-between gap-2">
          <div className="flex-1">
            <p className="text-sm font-semibold text-foreground mb-0.5">
              {comment.author.name}
            </p>
            <p className="text-sm text-gray-900 dark:text-zinc-300">
              {comment.content}
            </p>

            <div className="flex items-center gap-1.5 mt-1.5 text-xs text-muted-foreground">
              <span>{formatCommentDate(comment.createdAt)}</span>
              {isAuthor && (
                <>
                  <span>·</span>
                  <button
                    // onClick={onEdit}
                    className="hover:text-foreground transition-colors"
                  >
                    Edit Comment
                  </button>
                </>
              )}
            </div>
          </div>

          {isAuthor && (
            <DeleteCommentModal
              commentId={comment.id}
              boardSlug={boardSlug}
              workspaceSlug={workspaceSlug}
            />
          )}
        </div>
      </div>
    </div>
  );
}
