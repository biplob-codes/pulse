import { deleteCommentByUser } from "@/app/actions/comment";
import { DeleteModal } from "@/components/DeleteModal";
import UserAvatar from "@/components/UserAvatar";
import { formatCommentDate } from "@/lib/utils"; // your utility fn
import { X } from "lucide-react";
import { EditCommentModal } from "./EditCommentModal";

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
}
export function CommentItem({ comment, currentUserId }: Props) {
  const isAuthor = currentUserId === comment.author.id;
  const boundAction = deleteCommentByUser.bind(null, comment.id);
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
                  <EditCommentModal
                    commentId={comment.id}
                    initialContent={comment.content}
                  />
                </>
              )}
            </div>
          </div>

          {isAuthor && (
            <DeleteModal
              title="Delete Comment"
              description="Are you sure you want to delete this comment? This action cannot be undone."
              action={boundAction}
            >
              <X className="h-5 w-5 hover:text-gray-700  text-gray-500 dark:text-foreground dark:hover:text-gray-500" />
            </DeleteModal>
          )}
        </div>
      </div>
    </div>
  );
}
