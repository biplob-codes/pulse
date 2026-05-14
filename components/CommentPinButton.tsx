"use client";
import { togglePinComment } from "@/app/actions/comment";
import { Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { useTransition } from "react";
import { toast } from "sonner";

interface Props {
  comment: {
    id: string;
    isPinned: boolean;
  };
}
const CommentPinButton = ({ comment }: Props) => {
  const [isPending, startTransition] = useTransition();
  const router = useRouter();
  const handleTogglePin = (commentId: string) => {
    startTransition(async () => {
      const result = await togglePinComment(commentId);
      if (result.success) {
        router.refresh();
      } else {
        toast.error(result.message);
      }
    });
  };
  return (
    <button
      onClick={() => handleTogglePin(comment.id)}
      disabled={isPending}
      className="cursor-pointer"
    >
      {isPending ? (
        <Loader2 className="animate-spin h-3 w-3" />
      ) : comment.isPinned ? (
        "Unpin comment"
      ) : (
        "Pin comment"
      )}
    </button>
  );
};

export default CommentPinButton;
