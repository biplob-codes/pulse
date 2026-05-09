import prisma from "@/lib/prisma";
import { BoardList } from "./BoardList";
import { FeedbackForm } from "./FeedbackForm";
import { FeedbackList } from "./FeedbackList";
import { redirect } from "next/navigation";
import { getSession } from "@/lib/auth-session";

const PublicFeedbackPage = async ({
  params,
}: {
  params: Promise<{ slug: string; board: string }>;
}) => {
  const param = await params;
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
    where: { boardId: board?.id },
    select: {
      id: true,
      title: true,
      slug: true,
      description: true,
      status: true,
      votes: true,
      comments: { select: { id: true } },
    },
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
