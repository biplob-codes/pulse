import { Pin } from "lucide-react";
import { formatCommentDate } from "@/lib/utils"; // your import
import UserAvatar from "./UserAvatar";
import CommentPinButton from "@/components/CommentPinButton";

type Comment = {
  id: string;
  content: string;
  isPinned: boolean;
  isMemberReply: boolean;
  createdAt: Date;
  author: {
    id: string;
    name: string;
    image?: string | null;
  };
};

interface CommentCardProps {
  comment: Comment;
  currentUserId?: string;
  isAdmin?: boolean;
}

export function PinComment({
  comment,
  currentUserId,
  isAdmin = false,
}: CommentCardProps) {
  const isAuthor = currentUserId === comment.author.id;
  const initial = comment.author.name.charAt(0).toUpperCase();

  return (
    <div className="flex gap-3 py-4 pr-4">
      {/* Avatar */}
      <UserAvatar user={comment.author} />

      {/* Content */}
      <div className="flex-1 space-y-1">
        {/* Top row: name + pinned badge */}
        <div className="flex items-center justify-between gap-2">
          <span className="text-sm font-semibold text-foreground">
            {comment.author.name}
          </span>
          {comment.isPinned && (
            <span className="flex items-center gap-1 text-xs font-bold text-indigo-500">
              <Pin className="h-3 w-3" strokeWidth={3} />
              PINNED
            </span>
          )}
        </div>

        {/* Comment text */}
        <p className="text-sm text-foreground">{comment.content}</p>

        {/* Bottom row */}
        <div className="flex items-center gap-2 text-xs text-muted-foreground">
          <span>{formatCommentDate(comment.createdAt)}</span>

          {isAuthor && (
            <>
              <span>·</span>
              <button className="transition-colors hover:text-foreground">
                Edit Comment
              </button>
            </>
          )}

          {isAdmin && comment.isPinned && (
            <>
              <span>·</span>
              <CommentPinButton comment={comment} />
            </>
          )}
        </div>
      </div>
    </div>
  );
}
