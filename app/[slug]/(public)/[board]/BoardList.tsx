"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { cn } from "@/lib/utils";

type Board = {
  id: string;
  name: string;
  slug: string;
};

type Props = {
  boards: Board[];
};

export function BoardList({ boards }: Props) {
  const params = useParams<{ slug: string; board: string }>();
  const { slug, board } = params;

  return (
    <aside className="px-5">
      <p className="mb-2 px-3 text-xs font-semibold uppercase tracking-widest text-muted-foreground">
        Boards
      </p>
      <ul className="flex flex-col gap-0.5">
        {boards.map((b) => {
          const isActive = b.slug === board;
          return (
            <li key={b.id}>
              <Link
                href={`/${slug}/${b.slug}`}
                className={cn(
                  "block rounded-sm px-3 py-2 text-sm transition-colors",
                  isActive
                    ? "bg-accent text-foreground font-medium"
                    : "text-muted-foreground hover:bg-accent/50 hover:text-foreground",
                )}
              >
                {b.name}
              </Link>
            </li>
          );
        })}
      </ul>
    </aside>
  );
}
