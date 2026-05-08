import prisma from "@/lib/prisma";
import Link from "next/link";

const WorkspacePage = async ({
  params,
}: {
  params: Promise<{ slug: string }>;
}) => {
  const slug = (await params).slug;
  const boards = (
    await prisma.workspace.findFirst({
      where: { slug },
      select: {
        boards: {
          select: {
            id: true,
            name: true,
            slug: true,
            _count: { select: { feedbacks: true } },
          },
        },
      },
    })
  )?.boards;
  return (
    <div className="min-h-screen bg-background">
      <h1 className="text-lg font-semibold  mb-5">Boards</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {boards?.map((board) => (
          <Link href={`/${slug}/${board.slug}`} key={board.id}>
            <div
              key={board.id}
              className="border border-border flex rounded-sm p-3 justify-between items-center"
            >
              <h2 className="font-medium">{board.name}</h2>
              {board._count.feedbacks > 0 && (
                <p className="text-gray-600 font-semibold">
                  {board._count.feedbacks}
                </p>
              )}
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default WorkspacePage;
