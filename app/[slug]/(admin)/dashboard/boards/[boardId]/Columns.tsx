"use client";

import { ColumnDef } from "@tanstack/react-table";
import { ArrowUpDown, MessageSquare, ChevronUp } from "lucide-react";
import { Button } from "@/components/ui/button";
import { formatDistanceToNow } from "date-fns";
import { FeedbackStatus } from "@/app/generated/prisma/enums";
import { StatusChanger } from "./StatusChanger";

export type FeedbackRow = {
  id: string;
  title: string;
  slug: string;
  status: FeedbackStatus;
  author: { name: string; email: string };
  _count: { votes: number; comments: number };
  createdAt: Date;
  boardId: string;
  workspaceSlug: string;
};

export const columns: ColumnDef<FeedbackRow>[] = [
  {
    accessorKey: "title",
    header: ({ column }) => (
      <Button
        variant="ghost"
        className="-ml-3 h-8 text-xs font-semibold uppercase tracking-wider text-muted-foreground hover:text-foreground"
        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
      >
        Title
        <ArrowUpDown className="ml-2 h-3 w-3" />
      </Button>
    ),
    cell: ({ row }) => (
      <div className="max-w-[340px]">
        <p className="truncate font-medium text-sm text-foreground">
          {row.getValue("title")}
        </p>
      </div>
    ),
  },
  {
    accessorKey: "author",
    header: () => (
      <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
        Author
      </span>
    ),
    cell: ({ row }) => {
      const author = row.getValue("author") as FeedbackRow["author"];
      return (
        <div className="min-w-[120px]">
          <p className="text-sm font-medium text-foreground">{author.name}</p>
          <p className="text-xs text-muted-foreground truncate max-w-[160px]">
            {author.email}
          </p>
        </div>
      );
    },
  },
  {
    accessorKey: "_count",
    id: "votes",
    header: ({ column }) => (
      <Button
        variant="ghost"
        className="-ml-3 h-8 text-xs font-semibold uppercase tracking-wider text-muted-foreground hover:text-foreground"
        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
      >
        Votes
        <ArrowUpDown className="ml-2 h-3 w-3" />
      </Button>
    ),
    cell: ({ row }) => {
      const count = row.getValue("votes") as FeedbackRow["_count"];
      return (
        <div className="flex items-center gap-1.5 text-sm font-medium">
          <ChevronUp className="h-3.5 w-3.5 text-muted-foreground" />
          <span>{count.votes}</span>
        </div>
      );
    },
    sortingFn: (a, b) => {
      return a.original._count.votes - b.original._count.votes;
    },
  },
  {
    id: "comments",
    header: () => (
      <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
        Comments
      </span>
    ),
    cell: ({ row }) => (
      <div className="flex items-center gap-1.5 text-sm text-muted-foreground">
        <MessageSquare className="h-3.5 w-3.5" />
        <span>{row.original._count.comments}</span>
      </div>
    ),
  },
  {
    accessorKey: "status",
    header: () => (
      <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
        Status
      </span>
    ),
    cell: ({ row }) => (
      <StatusChanger
        feedbackId={row.original.id}
        currentStatus={row.original.status}
      />
    ),
    filterFn: (row, _, filterValue) => {
      if (!filterValue || filterValue === "ALL") return true;
      return row.original.status === filterValue;
    },
  },
  {
    accessorKey: "createdAt",
    header: ({ column }) => (
      <Button
        variant="ghost"
        className="-ml-3 h-8 text-xs font-semibold uppercase tracking-wider text-muted-foreground hover:text-foreground"
        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
      >
        Created
        <ArrowUpDown className="ml-2 h-3 w-3" />
      </Button>
    ),
    cell: ({ row }) => (
      <span className="text-sm text-muted-foreground whitespace-nowrap">
        {formatDistanceToNow(new Date(row.getValue("createdAt")), {
          addSuffix: true,
        })}
      </span>
    ),
  },
];
