"use client";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useState } from "react";

type SortOption = "newest" | "oldest" | "top";

const SORT_OPTIONS: { value: SortOption; label: string }[] = [
  { value: "newest", label: "Newest first" },
  { value: "oldest", label: "Oldest first" },
  { value: "top", label: "Top voted" },
];

interface ActivityFeedHeaderProps {
  onSortChange?: (value: SortOption) => void;
}

export default function ActivityFeedHeader({
  onSortChange,
}: ActivityFeedHeaderProps) {
  const [sort, setSort] = useState<SortOption>("newest");

  const handleChange = (value: SortOption) => {
    setSort(value);
    onSortChange?.(value);
  };

  return (
    <div className="flex items-center justify-between py-3 ml-10">
      <span className="text-sm font-medium text-foreground">Activity Feed</span>

      <div className="flex items-center gap-2">
        <span className="text-sm text-muted-foreground">Sort by</span>
        <Select value={sort} onValueChange={handleChange}>
          <SelectTrigger className="h-8 text-sm w-36 rounded-md">
            <SelectValue />
          </SelectTrigger>
          <SelectContent position="popper">
            {SORT_OPTIONS.map((opt) => (
              <SelectItem key={opt.value} value={opt.value}>
                {opt.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
    </div>
  );
}
