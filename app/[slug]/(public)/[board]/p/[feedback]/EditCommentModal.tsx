"use client";

import { CommentState, updateComment } from "@/app/actions/comment";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { useActionState, useEffect, useState } from "react";
import { toast } from "sonner";

interface Props {
  commentId: string;
  initialContent: string;
}
export function EditCommentModal({ commentId, initialContent }: Props) {
  const [open, setOpen] = useState(false);
  const [content, setContent] = useState(initialContent);
  const router = useRouter();
  const boundAction = updateComment.bind(null, commentId);

  const [state, formAction, isPending] = useActionState<CommentState, FormData>(
    boundAction,
    { success: false } as CommentState,
  );
  useEffect(() => {
    if (state.success) {
      setOpen(false);
      router.refresh();
    }
    if (!state.success && state.message) {
      toast.error(state.message);
    }
  }, [state]);
  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className="transition-colors hover:text-zinc-700 dark:hover:text-zinc-300 cursor-pointer"
      >
        Edit Comment
      </button>

      <Dialog open={open} onOpenChange={(o) => !o && setOpen(false)}>
        <DialogContent
          onOpenAutoFocus={(e) => e.preventDefault()}
          className="sm:max-w-2xl p-0 gap-0 rounded-sm"
          showCloseButton={false}
        >
          <div className="p-6">
            <DialogHeader>
              <DialogTitle className="text-base font-semibold text-foreground">
                Edit Comment
              </DialogTitle>
            </DialogHeader>

            <form action={formAction} className="mt-4 flex flex-col gap-4">
              <input type="hidden" name="content" value={content} />

              <div className="flex flex-col gap-2">
                <Textarea
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  rows={5}
                  className="bg-transparent!  resize-none rounded-sm px-3 py-3 focus-visible:ring-0 focus-visible:border-border"
                  disabled={isPending}
                />
              </div>

              {state?.errors?.content && (
                <p className="text-xs text-destructive">
                  {state?.errors?.content[0]}
                </p>
              )}

              <div className="flex items-center justify-end gap-2 pt-1">
                <Button
                  variant="outline"
                  onClick={() => setOpen(false)}
                  disabled={isPending}
                  className="rounded-sm  cursor-pointer px-5"
                >
                  Cancel
                </Button>

                <Button
                  type="submit"
                  disabled={!content.trim() || isPending}
                  className="rounded-sm bg-indigo-600 text-white cursor-pointer px-7"
                >
                  {isPending && (
                    <Loader2 size={13} className="animate-spin mr-1.5" />
                  )}
                  Save
                </Button>
              </div>
            </form>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
