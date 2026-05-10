import prisma from "@/lib/prisma";
import { BoardList } from "./BoardList";
import { FeedbackForm } from "./FeedbackForm";
import { FeedbackList } from "./FeedbackList";
import { redirect } from "next/navigation";
import { getSession } from "@/lib/auth-session";
import { parseSort, parseStatus } from "@/lib/feedback-params";

const PublicFeedbackPage = async ({
  params,
  searchParams,
}: {
  params: Promise<{ slug: string; board: string }>;
  searchParams: Promise<{ sort?: string; status?: string }>;
}) => {
  const param = await params;
  const { sort: rawSort, status: rawStatus } = await searchParams;

  const sort = parseSort(rawSort);
  const status = parseStatus(rawStatus);

  const boards = (
    await prisma.workspace.findFirst({
      where: { slug: param.slug },
      select: {
        boards: {
          select: {
            id: true,
            name: true,
            slug: true,
          },
        },
      },
    })
  )?.boards;
  if (!boards) redirect("/");
  const board = boards.find((b) => b.slug === param.board);
  const feedbacks = await prisma.feedback.findMany({
    where: { boardId: board?.id, ...(status && { status }) },
    select: {
      id: true,
      title: true,
      slug: true,
      description: true,
      status: true,
      votes: true,
      comments: { select: { id: true } },
    },
    orderBy:
      sort === "top"
        ? { votes: { _count: "desc" } }
        : sort === "oldest"
          ? { createdAt: "asc" }
          : { createdAt: "desc" },
  });
  const session = await getSession();
  return (
    <div className="grid grid-cols-1 lg:grid-cols-3">
      <div className="  px-3 py-4">
        <div className="sticky top-25">
          <BoardList boards={boards} />
        </div>
      </div>
      <div className="col-span-2 px-6 py-4">
        <h2 className="mb-5 font-semibold">{board?.name}</h2>
        <FeedbackForm
          context={{ workspaceSlug: param.slug, boardSlug: param.board }}
          isAuthenticated={!!session}
        />
        <FeedbackList
          feedbacks={feedbacks}
          boardSlug={param.board}
          workspaceSlug={param.slug}
          user={session?.user ? { id: session.user.id } : null}
        />
      </div>
    </div>
  );
};

export default PublicFeedbackPage;
