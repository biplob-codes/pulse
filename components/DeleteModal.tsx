"use client";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { ReactNode, useActionState, useEffect, useState } from "react";
import { toast } from "sonner";

interface ActionState {
  error?: string;
  success?: boolean;
  message?: string;
}
interface Props {
  title: string;
  description: string;
  action: (prevState: ActionState, formData: FormData) => Promise<ActionState>;
  children: ReactNode;
  refreshOnSuccess?: boolean;
  redirectTo?: string;
}
export function DeleteModal({
  title,
  description,
  action,
  children,
  refreshOnSuccess = false,
  redirectTo,
}: Props) {
  const [open, setOpen] = useState(false);
  const router = useRouter();
  const [state, formAction, isPending] = useActionState<ActionState, FormData>(
    action,
    {} as ActionState,
  );
  useEffect(() => {
    if (state.success && refreshOnSuccess) {
      setOpen(false);
      router.refresh();
    }
    if (state.success && redirectTo) {
      setOpen(false);
      router.push(redirectTo);
    }
    if (!state.success && state.message) toast.error(state.message);
  }, [state]);

  return (
    <>
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent
          showCloseButton={false}
          className="sm:max-w-2xl  rounded-sm p-8 gap-0"
        >
          <DialogHeader>
            <DialogTitle>{title}</DialogTitle>
            <DialogDescription className="mt-3">
              {description}
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
        className="cursor-pointer transition-colors"
      >
        {children}
      </button>
    </>
  );
}
