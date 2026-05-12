"use client";

import {
  createWorkspaceAction,
  CreateWorkspaceState,
} from "@/app/actions/workspace";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { AlertCircle, CheckCircle2, Loader2 } from "lucide-react";
import { useActionState, useEffect, useRef } from "react";
import { toast } from "sonner";

function FieldError({ messages }: { messages?: string[] }) {
  if (!messages?.length) return null;
  return (
    <p
      className="flex items-center gap-1.5 text-sm text-destructive"
      role="alert"
    >
      <AlertCircle className="size-3.5 shrink-0" />
      {messages[0]}
    </p>
  );
}

function toSlug(value: string) {
  return value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .slice(0, 32);
}

const initialState: CreateWorkspaceState = { success: false };

export default function CreateWorkspaceModal({
  open,
  onOpenChange,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}) {
  const [state, action, isPending] = useActionState(
    createWorkspaceAction,
    initialState,
  );

  const slugRef = useRef<HTMLInputElement>(null);
  const slugEditedRef = useRef(false);

  // Close modal on success
  useEffect(() => {
    if (state.success) {
      onOpenChange(false);
    }
  }, [state.success]);

  // Reset slug edit tracking when modal reopens
  useEffect(() => {
    if (open) {
      slugEditedRef.current = false;
    }
  }, [open]);

  function handleNameChange(e: React.ChangeEvent<HTMLInputElement>) {
    if (!slugEditedRef.current && slugRef.current) {
      slugRef.current.value = toSlug(e.target.value);
    }
  }

  function handleSlugChange() {
    slugEditedRef.current = true;
  }

  function handleSlugBlur(e: React.FocusEvent<HTMLInputElement>) {
    if (!e.target.value) {
      slugEditedRef.current = false;
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-130 p-0 overflow-hidden border border-border rounded-sm">
        <div className="pointer-events-none absolute inset-0 opacity-[0.03] dark:opacity-[0.07]" />

        <div className="relative px-6 pb-6 pt-5 space-y-6">
          <DialogHeader className="space-y-0 gap-3">
            <div className="flex items-center gap-3">
              <div>
                <DialogTitle className="text-xl font-semibold  ">
                  Create workspace
                </DialogTitle>
              </div>
            </div>
          </DialogHeader>

          {!state.success && state.message && toast.error(state.message)}

          {/* Form */}
          <form action={action} noValidate className="space-y-4">
            {/* Workspace name */}
            <div className="space-y-1.5">
              <Label htmlFor="modal-name" className="text-xs  md:text-sm mb-2">
                Workspace name
              </Label>
              <Input
                id="modal-name"
                name="name"
                type="text"
                autoComplete="off"
                placeholder="Acme Inc"
                defaultValue={state.fields?.name}
                onChange={handleNameChange}
                aria-invalid={!!state.errors?.name}
                className={[
                  " rounded-sm h-9 bg-transparent!   border-border",
                  "placeholder:text-muted-foreground/50",
                  "focus-visible:ring-0 ",
                  "transition-colors",
                  state.errors?.name
                    ? "border-destructive focus-visible:ring-destructive"
                    : "",
                ]
                  .filter(Boolean)
                  .join(" ")}
              />
              <FieldError messages={state.errors?.name} />
            </div>

            {/* Slug */}
            <div className="space-y-1.5">
              <Label htmlFor="modal-slug" className="text-xs md:text-sm mb-2">
                Workspace URL
              </Label>

              <div
                className={[
                  "flex items-center rounded-sm border   overflow-hidden",
                  "focus-within:ring-0",
                  "transition-colors",
                  state.errors?.slug
                    ? "border-destructive focus-within:ring-destructive"
                    : "border-border",
                ]
                  .filter(Boolean)
                  .join(" ")}
              >
                <span className="pl-3 pr-1 text-xs text-muted-foreground/60 whitespace-nowrap select-none font-mono">
                  pulse.io/
                </span>
                <input
                  ref={slugRef}
                  id="modal-slug"
                  name="slug"
                  type="text"
                  autoComplete="off"
                  placeholder="acme-inc"
                  defaultValue={state.fields?.slug}
                  onChange={handleSlugChange}
                  onBlur={handleSlugBlur}
                  aria-invalid={!!state.errors?.slug}
                  className="flex-1 bg-transparent py-2 pr-3 text-sm outline-none placeholder:text-muted-foreground/40 font-mono h-9"
                />
              </div>

              {state.errors?.slug ? (
                <FieldError messages={state.errors.slug} />
              ) : (
                <p className="text-[11px] text-muted-foreground/60">
                  Lowercase letters, numbers, and hyphens only.
                </p>
              )}
            </div>

            {/* Actions */}
            <div className="flex items-center gap-2 pt-1">
              <Button
                type="button"
                variant="outline"
                size="sm"
                className="flex-1 cursor-pointer h-9 text-sm border-border dark:border-white/10 dark:hover:bg-white/5"
                onClick={() => onOpenChange(false)}
                disabled={isPending}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                size="sm"
                className="flex-1 cursor-pointer h-9 text-sm"
                disabled={isPending}
              >
                {isPending ? (
                  <>
                    <Loader2 className="size-3.5 animate-spin" />
                    Creating…
                  </>
                ) : (
                  <>
                    <CheckCircle2 className="size-3.5" />
                    Create workspace
                  </>
                )}
              </Button>
            </div>
          </form>
        </div>
      </DialogContent>
    </Dialog>
  );
}
