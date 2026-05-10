"use client";

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { ChevronDown } from "lucide-react";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";

const SORT_OPTIONS = [
  { value: "newest", label: "Newest" },
  { value: "top", label: "Top" },
  { value: "oldest", label: "Oldest" },
] as const;

const FILTER_OPTIONS = [
  { value: "UNDER_REVIEW", label: "Under Review" },
  { value: "PLANNED", label: "Planned" },
  { value: "IN_PROGRESS", label: "In Progress" },
  { value: "COMPLETED", label: "Completed" },
  { value: "CLOSED", label: "Closed" },
] as const;

type SortValue = (typeof SORT_OPTIONS)[number]["value"];
type FilterValue = (typeof FILTER_OPTIONS)[number]["value"];
type Selection =
  | { kind: "sort"; value: SortValue }
  | { kind: "filter"; value: FilterValue };

function getLabel(selection: Selection) {
  if (selection.kind === "sort") {
    return SORT_OPTIONS.find((o) => o.value === selection.value)?.label;
  }
  return FILTER_OPTIONS.find((o) => o.value === selection.value)?.label;
}

export default function FeedbackFilter() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [open, setOpen] = useState(false);

  // Determine active selection from URL
  const sortParam = (searchParams.get("sort") ?? "newest") as SortValue;
  const statusParam = searchParams.get("status") as FilterValue | null;

  const active: Selection =
    statusParam && FILTER_OPTIONS.some((o) => o.value === statusParam)
      ? { kind: "filter", value: statusParam }
      : {
          kind: "sort",
          value: SORT_OPTIONS.some((o) => o.value === sortParam)
            ? sortParam
            : "newest",
        };

  const select = (next: Selection) => {
    const params = new URLSearchParams();
    if (next.kind === "sort") {
      params.set("sort", next.value);
    } else {
      params.set("status", next.value);
    }
    router.push(`?${params.toString()}`);
    setOpen(false);
  };

  return (
    <div className="flex items-center gap-2  text-foreground">
      <span className="text-[16px] text-muted-foreground">Showing</span>
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <button className="flex items-center gap-0.5 border-b border-border hover:border-gray-500 cursor-pointer transition-colors text-lg">
            {getLabel(active)}
            <ChevronDown
              className="h-5 w-5 mt-0.5 text-muted-foreground"
              strokeWidth={2.7}
            />
          </button>
        </PopoverTrigger>
        <PopoverContent
          align="start"
          className="p-0 w-auto rounded-md shadow-md border border-border"
        >
          <div className="flex divide-x divide-border">
            {/* Sort */}
            <div className="flex flex-col py-2 min-w-28">
              <span className="px-3 py-2 text-[12px] font-semibold uppercase tracking-widest text-foreground text-center">
                Sort
              </span>
              {SORT_OPTIONS.map((opt) => {
                const isActive =
                  active.kind === "sort" && active.value === opt.value;
                return (
                  <button
                    key={opt.value}
                    onClick={() => select({ kind: "sort", value: opt.value })}
                    className={cn(
                      "flex items-center gap-2.5 px-3 py-1.5  transition-colors cursor-pointer text-[16px] text-gray-700",
                      isActive
                        ? "text-indigo-500 dark:text-indigo-400"
                        : "dark:text-muted-foreground hover:bg-accent",
                    )}
                  >
                    <span
                      className={cn(
                        "h-1.5 w-1.5 rounded-full shrink-0",
                        isActive
                          ? "bg-indigo-500 dark:bg-indigo-400"
                          : "bg-transparent",
                      )}
                    />
                    {opt.label}
                  </button>
                );
              })}
            </div>

            {/* Filter */}
            <div className="flex flex-col py-2 min-w-36">
              <span className="px-3 py-2 text-[12px] font-semibold uppercase tracking-widest text-foreground text-center">
                Filter
              </span>
              {FILTER_OPTIONS.map((opt) => {
                const isActive =
                  active.kind === "filter" && active.value === opt.value;
                return (
                  <button
                    key={opt.value}
                    onClick={() => select({ kind: "filter", value: opt.value })}
                    className={cn(
                      "flex items-center gap-2.5 px-3 py-1.5  transition-colors cursor-pointer text-[16px] text-gray-700",
                      isActive
                        ? "text-indigo-500 dark:text-indigo-400"
                        : " dark:text-muted-foreground hover:bg-accent",
                    )}
                  >
                    <span
                      className={cn(
                        "h-1.5 w-1.5 rounded-full shrink-0",
                        isActive
                          ? "bg-indigo-500 dark:bg-indigo-400"
                          : "bg-transparent",
                      )}
                    />
                    {opt.label}
                  </button>
                );
              })}
            </div>
          </div>
        </PopoverContent>
      </Popover>
      <span className="text-[16px] text-muted-foreground">posts</span>
    </div>
  );
}
