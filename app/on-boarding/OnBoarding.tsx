"use client";

import { useActionState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertCircle, Loader2, Building2, CheckCircle2 } from "lucide-react";
import { createWorkspaceAction, OnboardingState } from "../actions/workspace";

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

const initialState: OnboardingState = { success: false };

export default function OnBoarding() {
  const [state, action, isPending] = useActionState(
    createWorkspaceAction,
    initialState,
  );

  const slugRef = useRef<HTMLInputElement>(null);
  const slugEditedRef = useRef(false);

  // Auto-generate slug from name unless user has manually edited it
  function handleNameChange(e: React.ChangeEvent<HTMLInputElement>) {
    if (!slugEditedRef.current && slugRef.current) {
      slugRef.current.value = toSlug(e.target.value);
    }
  }

  function handleSlugChange() {
    slugEditedRef.current = true;
  }

  // If the user clears the slug field, allow auto-generation again
  function handleSlugBlur(e: React.FocusEvent<HTMLInputElement>) {
    if (!e.target.value) {
      slugEditedRef.current = false;
    }
  }

  return (
    <div className="min-h-dvh bg-background flex items-center justify-center p-4">
      {/* Subtle background grid */}
      <div
        className="pointer-events-none fixed inset-0 opacity-[0.03] dark:opacity-[0.06]"
        style={{
          backgroundImage:
            "linear-gradient(to right, currentColor 1px, transparent 1px), linear-gradient(to bottom, currentColor 1px, transparent 1px)",
          backgroundSize: "48px 48px",
        }}
      />

      <div className="relative w-full max-w-sm space-y-8">
        {/* Brand */}
        <div className="flex items-center gap-2">
          <span className="text-sm font-semibold">UpVote</span>
        </div>

        {/* Icon + Heading */}
        <div className="space-y-3">
          <div className="size-10 rounded-xl bg-foreground/5 dark:bg-foreground/10 border border-border flex items-center justify-center">
            <Building2 className="size-5 text-foreground/70" />
          </div>
          <div className="space-y-1">
            <h1 className="text-2xl font-semibold tracking-tight">
              Create your workspace
            </h1>
            <p className="text-sm text-muted-foreground">
              A workspace holds all your boards and feedback. You can create
              more later.
            </p>
          </div>
        </div>

        {/* Global error */}
        {!state.success && state.message && (
          <Alert variant="destructive">
            <AlertCircle className="size-4" />
            <AlertDescription>{state.message}</AlertDescription>
          </Alert>
        )}

        {/* Form */}
        <form action={action} noValidate className="space-y-5">
          {/* Workspace name */}
          <div className="space-y-1.5">
            <Label htmlFor="name">Workspace name</Label>
            <Input
              id="name"
              name="name"
              type="text"
              autoComplete="off"
              placeholder="Acme Inc"
              defaultValue={state.fields?.name}
              onChange={handleNameChange}
              aria-invalid={!!state.errors?.name}
              className={
                state.errors?.name
                  ? "border-destructive focus-visible:ring-destructive"
                  : ""
              }
            />
            <FieldError messages={state.errors?.name} />
          </div>

          {/* Slug */}
          <div className="space-y-1.5">
            <Label htmlFor="slug">Workspace URL</Label>

            {/* URL preview row */}
            <div className="flex items-center rounded-md border border-input bg-muted/40 focus-within:border-ring focus-within:ring-1 focus-within:ring-ring overflow-hidden">
              <span className="pl-3 pr-1 text-sm text-muted-foreground whitespace-nowrap select-none">
                upvote.com/
              </span>
              <input
                ref={slugRef}
                id="slug"
                name="slug"
                type="text"
                autoComplete="off"
                placeholder="acme-inc"
                defaultValue={state.fields?.slug}
                onChange={handleSlugChange}
                onBlur={handleSlugBlur}
                aria-invalid={!!state.errors?.slug}
                className="flex-1 bg-transparent py-2 pr-3 text-sm outline-none placeholder:text-muted-foreground"
              />
            </div>

            {state.errors?.slug ? (
              <FieldError messages={state.errors.slug} />
            ) : (
              <p className="text-xs text-muted-foreground">
                Only lowercase letters, numbers, and hyphens.
              </p>
            )}
          </div>

          <Button
            type="submit"
            className="w-full cursor-pointer"
            disabled={isPending}
          >
            {isPending ? (
              <>
                <Loader2 className="size-4 animate-spin" />
                Creating workspace…
              </>
            ) : (
              <>
                <CheckCircle2 className="size-4" />
                Create workspace
              </>
            )}
          </Button>
        </form>
      </div>
    </div>
  );
}
