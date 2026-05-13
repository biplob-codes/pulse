"use client";

import { deleteCommentAction } from "@/app/actions/comment";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Loader2, X } from "lucide-react";
import { useActionState, useState } from "react";

interface ActionState {
  error?: string;
  success?: boolean;
  message?: string;
}
interface Props {
  commentId: string;
  workspaceSlug: string;
  boardSlug: string;
}
export function DeleteCommentModal({
  commentId,
  workspaceSlug,
  boardSlug,
}: Props) {
  const boundAction = deleteCommentAction.bind(null, {
    commentId,
    boardSlug,
    workspaceSlug,
  });
  const [open, setOpen] = useState(false);
  const [state, formAction, isPending] = useActionState<ActionState, FormData>(
    boundAction,
    {},
  );

  return (
    <>
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent
          showCloseButton={false}
          className="sm:max-w-2xl  rounded-lg p-8 gap-0"
        >
          <DialogHeader>
            <DialogTitle>Delete Comment</DialogTitle>
            <DialogDescription className="mt-3">
              Are you sure you want to delete this comment? This action cannot
              be undone.
            </DialogDescription>
          </DialogHeader>

          {state?.error && (
            <p className="text-xs text-destructive mt-2">{state.error}</p>
          )}

          <div className="flex justify-end gap-2 mt-6">
            <Button
              variant="outline"
              onClick={() => setOpen(false)}
              disabled={isPending}
              className="rounded-sm  cursor-pointer px-5"
            >
              Cancel
            </Button>
            <form action={formAction}>
              <Button
                type="submit"
                disabled={isPending}
                className="cursor-pointer rounded-sm px-5 bg-indigo-500 hover:bg-indigo-600 text-white"
              >
                {isPending && (
                  <Loader2 size={13} className="animate-spin mr-1.5" />
                )}
                Delete
              </Button>
            </form>
          </div>
        </DialogContent>
      </Dialog>

      <button
        onClick={() => setOpen(true)}
        className="transition-colors hover:text-gray-700  cursor-pointer text-gray-500 dark:text-foreground dark:hover:text-gray-500"
      >
        <X className="h-5 w-5" />
      </button>
    </>
  );
}
