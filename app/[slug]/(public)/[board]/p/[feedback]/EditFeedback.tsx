"use client";

import { useActionState, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Paperclip, Loader2 } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { updateFeedback } from "@/app/actions/feedback";
import { toast } from "sonner";

interface EditFeedbackProps {
  id: string;
  title: string;
  description: string | null;
}

export function EditFeedback({
  id,
  title: initialTitle,
  description: initialDescription,
}: EditFeedbackProps) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [title, setTitle] = useState(initialTitle);
  const [description, setDescription] = useState(initialDescription ?? "");

  const boundAction = updateFeedback.bind(null, id);

  const [state, formAction, isPending] = useActionState(boundAction, {});
  useEffect(() => {
    if (state.success) {
      (setOpen(false), router.refresh());
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
        Edit Post
      </button>

      <Dialog open={open} onOpenChange={(o) => !o && setOpen(false)}>
        <DialogContent
          onOpenAutoFocus={(e) => e.preventDefault()}
          className="sm:max-w-2xl p-0 gap-0 rounded-sm"
        >
          <div className="p-6">
            <DialogHeader>
              <DialogTitle className="text-base font-semibold text-foreground">
                Edit Post
              </DialogTitle>
            </DialogHeader>

            <form action={formAction} className="mt-4 flex flex-col gap-4">
              <input type="hidden" name="title" value={title} />
              <input type="hidden" name="description" value={description} />

              <div className="flex flex-col gap-2">
                <Label className="text-[12px] font-bold uppercase  text-foreground">
                  Title
                </Label>
                <Input
                  value={title}
                  autoFocus={false}
                  onChange={(e) => setTitle(e.target.value)}
                  className="bg-transparent!   rounded-sm px-3 py-5 focus-visible:ring-0 focus-visible:border-border"
                  disabled={isPending}
                />
              </div>

              <div className="flex flex-col gap-2">
                <Label className="text-[12px] font-bold uppercase  text-foreground">
                  Details
                </Label>
                <Textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  rows={5}
                  className="bg-transparent!  resize-none rounded-sm px-3 py-3 focus-visible:ring-0 focus-visible:border-border"
                  disabled={isPending}
                />
              </div>

              <div className="flex items-center justify-between pt-1">
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  aria-label="Attach file"
                  className="h-8 w-8 p-0 rounded-sm"
                  disabled={isPending}
                >
                  <Paperclip size={14} />
                </Button>

                <Button
                  type="submit"
                  disabled={!title.trim() || isPending}
                  className="rounded-sm bg-indigo-600 text-white cursor-pointer px-5"
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
