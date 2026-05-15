"use client";

import { createAdminComment } from "@/app/actions/comment";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { LoaderCircleIcon } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import { toast } from "sonner";

type Props = {
  feedbackId: string;
};

export function AdminComment({ feedbackId }: Props) {
  const [value, setValue] = useState("");
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState("");
  const router = useRouter();
  function handleSubmit() {
    const trimmed = value.trim();
    if (!trimmed || isPending) return;
    startTransition(async () => {
      const result = await createAdminComment(feedbackId, trimmed);
      if (result.success) {
        setError("");
        setValue("");
        router.refresh();
      }
      if (!result.success) {
        setValue(result.fields?.content as string);
        if (result.errors && result.errors.content) {
          setError(result.errors.content[0]);
        }
        if (result.message) toast.error(result.message);
      }
    });
  }

  function handleKeyDown(e: React.KeyboardEvent<HTMLInputElement>) {
    if (e.key === "Enter") {
      e.preventDefault();
      handleSubmit();
    }
  }

  return (
    <div className="p-3">
      <div className="flex items-center gap-2">
        <Input
          value={value}
          onChange={(e) => setValue(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Leave a comment..."
          className="flex-1 text-sm focus-visible:ring-0 rounded-sm bg-transparent! lg:h-9"
        />
        <Button
          size="sm"
          onClick={handleSubmit}
          disabled={isPending}
          className="shrink-0 rounded-sm bg-indigo-500 hover:bg-indigo-600 text-white disabled:opacity-40 h-9 cursor-pointer"
        >
          Comment
          {isPending && <LoaderCircleIcon className="animate-spin" />}
        </Button>
      </div>
      {error && <p className="text-xs text-destructive mt-1 px-2">{error}</p>}
    </div>
  );
}
