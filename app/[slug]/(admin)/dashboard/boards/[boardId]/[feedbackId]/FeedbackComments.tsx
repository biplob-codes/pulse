"use client";
import { DeleteCommentModal } from "@/app/[slug]/(public)/[board]/p/[feedback]/DeleteCommentModal";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import UserAvatar from "@/components/UserAvatar";
import { formatCommentDate } from "@/lib/utils";
import { Dot } from "lucide-react";
import { useEffect, useState } from "react";
interface Comment {
  id: string;
  author: {
    id: string;
    name: string;
    image?: string | null;
  };
  content: string;
  createdAt: Date;
}
interface Props {
  comments: Comment[];
  //   currentUserId?: string;
  //   workspaceSlug: string;
  //   boardSlug: string;
}
type SortOption = "newest" | "oldest";

const SORT_OPTIONS: { value: SortOption; label: string }[] = [
  { value: "newest", label: "Newest first" },
  { value: "oldest", label: "Oldest first" },
];
const FeedbackComments = ({
  comments,
  //   currentUserId,
  //   boardSlug,
  //   workspaceSlug,
}: Props) => {
  const [sort, setSort] = useState<SortOption>("newest");
  const [localComments, setLocalComments] = useState<Comment[]>(comments);
  useEffect(() => {
    setLocalComments(comments);
  }, [comments]);
  const sorted = [...localComments].sort((a, b) =>
    sort === "oldest"
      ? a.createdAt.getTime() - b.createdAt.getTime()
      : b.createdAt.getTime() - a.createdAt.getTime(),
  );
  return (
    <div>
      <div className="flex items-center justify-between my-4">
        <span className="text-sm  text-muted-foreground">Activity Feed</span>

        <div className="flex items-center gap-2">
          <span className=" text-sm text-muted-foreground">Sort by</span>
          <Select value={sort} onValueChange={(v: SortOption) => setSort(v)}>
            <SelectTrigger className="h-8 text-sm w-36 rounded-sm cursor-pointer focus:ring-0">
              <SelectValue />
            </SelectTrigger>
            <SelectContent position="popper" className="p-1 rounded-sm">
              {SORT_OPTIONS.map((opt) => (
                <SelectItem
                  key={opt.value}
                  value={opt.value}
                  className="my-1 rounded-sm py-2 cursor-pointer
                  focus:bg-indigo-100
                  focus:text-indigo-500
                  data-[state=checked]:bg-indigo-100 
                  data-[state=checked]:text-indigo-500"
                >
                  {opt.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>
      {comments.length === 0 && (
        <p className="py-6 text-center text-sm text-muted-foreground">
          No comments yet.
        </p>
      )}
      {sorted.map((comment) => (
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
                  <span>Pin Comment</span>
                </div>
              </div>

              <DeleteCommentModal
                commentId={comment.id}
                boardSlug={"boardSlug"}
                workspaceSlug={"workspaceSlug"}
              />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default FeedbackComments;
