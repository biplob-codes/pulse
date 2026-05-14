import { deleteCommentAction } from "@/app/actions/comment";
import { DeleteModal } from "@/components/DeleteModal";
import UserAvatar from "@/components/UserAvatar";
import { formatCommentDate } from "@/lib/utils";
import { Dot, X } from "lucide-react";
import CommentPinButton from "../../../../../../../components/CommentPinButton";
interface Comment {
  id: string;
  author: {
    id: string;
    name: string;
    image?: string | null;
  };
  content: string;
  createdAt: Date;
  isPinned: boolean;
}
const Comment = ({ comment }: { comment: Comment }) => {
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
              <Dot className="h-2 w-2 " />
              <CommentPinButton comment={comment} />
            </div>
          </div>

          <DeleteModal
            action={deleteCommentAction.bind(null, {
              commentId: comment.id,
            })}
            title="Delete Comment"
            description="This comment will be permanently deleted and cannot be recovered."
            refreshOnSuccess={true}
          >
            <X className="h-5 w-5 hover:text-gray-700  text-gray-500 dark:text-foreground dark:hover:text-gray-500" />
          </DeleteModal>
        </div>
      </div>
    </div>
  );
};

export default Comment;
