"use client";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { CommentItem } from "./CommentItem";
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
  currentUserId?: string;
  workspaceSlug: string;
  boardSlug: string;
}
type SortOption = "newest" | "oldest";

const SORT_OPTIONS: { value: SortOption; label: string }[] = [
  { value: "newest", label: "Newest first" },
  { value: "oldest", label: "Oldest first" },
];
const CommentSection = ({
  comments,
  currentUserId,
  boardSlug,
  workspaceSlug,
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
      <div className="flex items-center justify-between py-3 ml-10">
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
        <CommentItem
          key={comment.id}
          comment={comment}
          currentUserId={currentUserId}
          boardSlug={boardSlug}
          workspaceSlug={workspaceSlug}
        />
      ))}
    </div>
  );
};

export default CommentSection;
