"use client";

import { useActionState, useRef, useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Paperclip, Loader2 } from "lucide-react";
import { createCommentAction } from "@/app/actions/comment";

interface CommentInputProps {
  feedbackId: string;
  isAuthenticated: boolean;
}

interface ActionState {
  error?: string;
  success?: boolean;
}

export default function CommentInput({
  feedbackId,
  isAuthenticated,
}: CommentInputProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [value, setValue] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  // Bind feedbackId into the server action via a context object
  const boundAction = createCommentAction.bind(null, { feedbackId });

  const [state, formAction, isPending] = useActionState<ActionState, FormData>(
    boundAction,
    {},
  );

  // Expand when user focuses or types; collapse when clicking outside with empty input
  const handleFocus = () => setIsExpanded(true);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (
        containerRef.current &&
        !containerRef.current.contains(e.target as Node) &&
        value.trim() === ""
      ) {
        setIsExpanded(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [value]);

  // Reset on success
  useEffect(() => {
    if (state?.success) {
      setValue("");
      setIsExpanded(false);
    }
  }, [state?.success]);

  return (
    <div ref={containerRef} className="w-full my-8 ml-10">
      <div
        className={[
          "rounded-xs border transition-all duration-200",
          " border-border",
          state?.error ? "border-destructive" : "",
        ].join(" ")}
      >
        <form action={formAction}>
          <input type="hidden" name="comment" value={value} />

          <Input
            ref={inputRef}
            value={value}
            onChange={(e) => setValue(e.target.value)}
            onFocus={handleFocus}
            placeholder="Leave a comment"
            disabled={!isAuthenticated || isPending}
            className={[
              "border-0 shadow-none focus-visible:ring-0 bg-transparent!",
              "placeholder:text-muted-foreground text-sm",
              "h-10 px-3",
            ].join(" ")}
          />

          {/* ── Action bar — slides in/out ── */}
          <div
            className={[
              "overflow-hidden transition-all duration-200 ease-in-out",
              isExpanded ? "max-h-16 opacity-100" : "max-h-0 opacity-0",
            ].join(" ")}
          >
            <div className="flex items-center justify-between border-t border-border px-2 py-5 gap-2">
              {/* Attachment icon */}
              <Button
                type="button"
                aria-label="Attach file"
                variant="outline"
                className={[
                  "inline-flex items-center justify-center",
                  "h-8 w-8 rounded-sm shrink-0",
                  "text-muted-foreground hover:text-foreground hover:bg-muted",
                  "transition-colors duration-150",
                ].join(" ")}
              >
                <Paperclip size={15} />
              </Button>

              <div className="flex items-center gap-3 ml-auto">
                {/* <span className="text-xs text-muted-foreground hidden sm:block">
                  The post author and voters will get an email.
                </span> */}

                <Button
                  type="submit"
                  disabled={!value.trim() || isPending || !isAuthenticated}
                  className="py-4 rounded-sm bg-indigo-500 hover:bg-indigo-600 text-white cursor-pointer"
                >
                  {isPending ? (
                    <Loader2 size={13} className="animate-spin mr-1.5" />
                  ) : null}
                  Submit
                </Button>
              </div>
            </div>
          </div>
        </form>
      </div>

      {/* ── Server error message ── */}
      {state?.error && (
        <p className="mt-1.5 text-xs text-destructive pl-1">{state.error}</p>
      )}

      {/* ── Unauthenticated hint ── */}
      {!isAuthenticated && (
        <p className="mt-1.5 text-xs text-muted-foreground pl-1">
          Please sign in to leave a comment.
        </p>
      )}
    </div>
  );
}
