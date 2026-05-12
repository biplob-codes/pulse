"use client";

import { useActionState, useEffect, useRef, useState } from "react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { createFeedbackAction, FeedbackState } from "@/app/actions/feedback";
import { AuthModal } from "@/components/AuthModal";
import { toast } from "sonner";

const initialState: FeedbackState = {};
interface Props {
  context: { workspaceSlug: string; boardSlug: string };
  isAuthenticated?: boolean;
}
export function FeedbackForm({ context, isAuthenticated }: Props) {
  const action = createFeedbackAction.bind(null, context);
  const [state, formAction, isPending] = useActionState(action, initialState);
  const formRef = useRef<HTMLFormElement>(null);
  const [openAuthModal, setOpenAuthModal] = useState(false);
  useEffect(() => {
    if (!state.success && state.message) toast.error(state.message);
  }, [state]);
  return (
    <div className="rounded-sm border border-gray-150 bg-background mb-5">
      <form ref={formRef} action={formAction}>
        {/* Title field */}
        <div className="px-4 pt-4">
          <input
            name="title"
            type="text"
            placeholder="Short, descriptive title"
            className={cn(
              "w-full bg-transparent text-foreground placeholder:text-muted-foreground outline-none placeholder:text-lg mb-3 ",
              state.errors?.title && "placeholder:text-destructive/60",
            )}
          />
          {state.errors?.title && (
            <p className="mt-1 text-xs text-destructive">
              {state.errors.title[0]}
            </p>
          )}
        </div>

        {/* Details field */}
        <div className="px-4">
          <p className="mb-1.5  font-medium text-foreground">Details</p>
          <textarea
            name="description"
            placeholder="Any additional details..."
            rows={3}
            className={cn(
              "w-full resize-none bg-transparent text-sm text-foreground placeholder:text-muted-foreground outline-none",
            )}
          />
          {state.errors?.description && (
            <p className="mt-1 text-xs text-destructive">
              {state.errors.description[0]}
            </p>
          )}
        </div>

        {/* Actions */}
        <div className="flex items-center justify-end gap-2 border-t border-border px-4 py-3">
          <Button
            type="button"
            onClick={() => formRef.current?.reset()}
            className="rounded-sm "
            variant="outline"
          >
            Cancel
          </Button>

          <Button
            type="submit"
            disabled={isPending}
            onClick={(e) => {
              if (!isAuthenticated) {
                e.preventDefault();
                setOpenAuthModal(true);
              }
            }}
            className="rounded-sm bg-indigo-600 text-white cursor-pointer"
          >
            {isPending ? "Creating..." : "Create Post"}
          </Button>
        </div>
      </form>
      <AuthModal open={openAuthModal} onClose={() => setOpenAuthModal(false)} />
    </div>
  );
}
