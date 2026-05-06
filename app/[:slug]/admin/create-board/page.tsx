"use client";

import { createBoardAction } from "@/app/actions/board";
import { Button } from "@/components/ui/button";
import { generateSlug } from "@/lib/schema";
import { useParams } from "next/navigation";
import { useActionState, useEffect, useRef } from "react";

type FieldErrors = {
  name?: string[];
  slug?: string[];
};

type ActionState = {
  errors?: FieldErrors;
  message?: string;
  success?: boolean;
  workspaceSlug?: string;
};

const initialState: ActionState = {};

export default function CreateBoardForm() {
  const workspaceSlug = useParams()[":slug"] as string;
  const action = createBoardAction.bind(null, workspaceSlug);
  const [state, formAction, isPending] = useActionState(action, initialState);

  const nameRef = useRef<HTMLInputElement>(null);
  const slugRef = useRef<HTMLInputElement>(null);

  // Auto-generate slug from name as user types
  function handleNameChange(e: React.ChangeEvent<HTMLInputElement>) {
    if (slugRef.current) {
      slugRef.current.value = generateSlug(e.target.value);
    }
  }

  // Focus first error field after submission
  useEffect(() => {
    if (state.errors?.name) nameRef.current?.focus();
    else if (state.errors?.slug) slugRef.current?.focus();
  }, [state.errors]);

  return (
    <div className="w-xl">
      {/* Page header */}
      <div className="  px-5 py-3">
        <h1 className="text-xl font-medium mb-2 text-foreground">
          Create board
        </h1>
        <p className=" text-muted-foreground mt-0.5">
          A board lets users post and vote on ideas for a specific topic.
        </p>
      </div>

      {/* Form body */}
      <form action={formAction}>
        <div className="px-5 py-3 space-y-5 max-w-xl">
          {/* Name */}
          <div className="space-y-1.5">
            <label
              htmlFor="name"
              className="text-xs font-medium uppercase tracking-widest text-muted-foreground"
            >
              Name
            </label>
            <input
              ref={nameRef}
              id="name"
              name="name"
              type="text"
              placeholder="Feature Requests"
              onChange={handleNameChange}
              aria-describedby={state.errors?.name ? "name-error" : undefined}
              aria-invalid={!!state.errors?.name}
              className={`
                w-full rounded-md border bg-background px-3 py-2 text-sm text-foreground
                placeholder:text-muted-foreground/40
                outline-none transition-colors
                focus:border-foreground/25 focus:ring-2 focus:ring-foreground/8
                ${state.errors?.name ? "border-destructive" : "border-border"}
              `}
            />
            {state.errors?.name && (
              <p id="name-error" className="text-xs text-destructive">
                {state.errors.name[0]}
              </p>
            )}
          </div>

          {/* URL */}
          <div className="space-y-1.5">
            <label
              htmlFor="slug"
              className="text-xs font-medium uppercase tracking-widest text-muted-foreground"
            >
              URL
            </label>
            <div
              className={`
                flex items-center rounded-md border bg-background
                transition-colors focus-within:border-foreground/25 focus-within:ring-2 focus-within:ring-foreground/8
                ${state.errors?.slug ? "border-destructive" : "border-border"}
              `}
            >
              <span className="pl-3 pr-0.5 text-sm text-muted-foreground select-none whitespace-nowrap">
                {workspaceSlug}.upvote.io/
              </span>
              <input
                ref={slugRef}
                id="slug"
                name="slug"
                type="text"
                placeholder="feature-requests"
                aria-describedby={state.errors?.slug ? "slug-error" : undefined}
                aria-invalid={!!state.errors?.slug}
                className="
                  flex-1 bg-transparent py-2 pr-3 text-sm text-foreground
                  placeholder:text-muted-foreground/40
                  outline-none
                "
              />
            </div>
            {state.errors?.slug && (
              <p id="slug-error" className="text-xs text-destructive">
                {state.errors.slug[0]}
              </p>
            )}
          </div>

          {/* Global error */}
          {state.message && !state.success && (
            <p className="text-xs text-destructive">{state.message}</p>
          )}
        </div>

        {/* Footer — button pinned right */}
        <div className=" px-8 py-4 flex items-center justify-end">
          <Button type="submit" disabled={isPending}>
            {isPending ? "Creating…" : "Create board"}
          </Button>
        </div>
      </form>
    </div>
  );
}
