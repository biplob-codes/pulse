"use client";

import { useState } from "react";
import { X, Pin } from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import ActivityFeedHeader from "./ActivityFeedHeader";

interface Comment {
  id: string;
  author: {
    name: string;
    avatarUrl?: string;
  };
  content: string;
  createdAt: Date;
}

function Avatar({ name, avatarUrl }: { name: string; avatarUrl?: string }) {
  const initials = name
    .split(" ")
    .map((n) => n[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();

  if (avatarUrl) {
    return (
      <img
        src={avatarUrl}
        alt={name}
        className="h-8 w-8 rounded-full object-cover shrink-0"
      />
    );
  }

  return (
    <div className="h-8 w-8 rounded-full bg-muted flex items-center justify-center shrink-0">
      <span className="text-xs font-medium text-muted-foreground">
        {initials}
      </span>
    </div>
  );
}

function CommentItem({ comment }: { comment: Comment }) {
  return (
    <div className="flex gap-3 group py-4 ">
      {/* Avatar */}
      <Avatar name={comment.author.name} avatarUrl={comment.author.avatarUrl} />

      {/* Body */}
      <div className="flex-1 min-w-0">
        <div className="flex items-start justify-between gap-2">
          <span className="text-sm font-medium text-foreground leading-none">
            {comment.author.name}
          </span>

          {/* Delete button — visible on hover */}
          <button
            aria-label="Delete comment"
            className="shrink-0 text-muted-foreground hover:text-foreground"
          >
            <X size={15} />
          </button>
        </div>

        <p className="mt-1 text-sm text-gray-700 dark:text-muted-foreground leading-relaxed">
          {comment.content}
        </p>

        {/* Meta row */}
        <div className="mt-2 flex items-center gap-3 text-xs text-muted-foreground">
          <span>
            {formatDistanceToNow(comment.createdAt, { addSuffix: true })}
          </span>

          <span className="text-border">·</span>

          <button
            className={[
              "flex items-center gap-1 transition-colors duration-150",
            ].join(" ")}
          >
            <Pin size={11} />
            Pin comment
          </button>
        </div>
      </div>
    </div>
  );
}
interface Props {
  comments: Comment[];
}

export default function CommentList({ comments }: Props) {
  if (comments.length === 0) {
    return (
      <p className="py-6 text-center text-sm text-muted-foreground">
        No comments yet.
      </p>
    );
  }

  return (
    <div className="w-full">
      <ActivityFeedHeader />
      {comments.map((comment) => (
        <CommentItem key={comment.id} comment={comment} />
      ))}
    </div>
  );
}
