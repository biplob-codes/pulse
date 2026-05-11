import { notFound } from "next/navigation";
import { LayoutGrid } from "lucide-react";
import prisma from "@/lib/prisma";
import { FeedbackTable } from "./FeedbackTable";

interface BoardDetailPageProps {
  params: {
    slug: string; // workspace slug
    boardId: string;
  };
}

export default async function BoardDetailPage({
  params,
}: BoardDetailPageProps) {
  const { boardId, slug } = await params;
  const board = await prisma.board.findFirst({
    where: {
      id: boardId,
      workspace: { slug },
    },
    include: {
      workspace: { select: { name: true, slug: true } },
      feedbacks: {
        orderBy: { createdAt: "desc" },
        include: {
          author: { select: { name: true, email: true } },
          _count: { select: { votes: true, comments: true } },
        },
      },
    },
  });

  if (!board) notFound();

  const statusCounts = board.feedbacks.reduce(
    (acc, f) => {
      acc[f.status] = (acc[f.status] ?? 0) + 1;
      return acc;
    },
    {} as Record<string, number>,
  );

  return (
    <div className=" max-w-6xl mx-auto space-y-6">
      <div className="flex items-center gap-2">
        <LayoutGrid className="h-5 w-5 text-muted-foreground" />
        <h1 className="text-xl font-semibold text-foreground">{board.name}</h1>
      </div>

      {/* Stats row */}
      <div className="grid grid-cols-3 sm:grid-cols-6 gap-3">
        {[
          { label: "Total", value: board.feedbacks.length, dimmed: false },
          { label: "Open", value: statusCounts["OPEN"] ?? 0, dimmed: true },
          {
            label: "Under Review",
            value: statusCounts["UNDER_REVIEW"] ?? 0,
            dimmed: true,
          },
          {
            label: "Planned",
            value: statusCounts["PLANNED"] ?? 0,
            dimmed: true,
          },
          {
            label: "In Progress",
            value: statusCounts["IN_PROGRESS"] ?? 0,
            dimmed: true,
          },
          {
            label: "Completed",
            value: statusCounts["COMPLETED"] ?? 0,
            dimmed: true,
          },
        ].map((stat) => (
          <div
            key={stat.label}
            className="rounded-lg border border-border bg-card px-3 py-2.5 space-y-0.5"
          >
            <p className="text-xs text-muted-foreground">{stat.label}</p>
            <p className="text-lg font-semibold text-foreground">
              {stat.value}
            </p>
          </div>
        ))}
      </div>

      {/* Table */}
      <FeedbackTable data={board.feedbacks} />
    </div>
  );
}
