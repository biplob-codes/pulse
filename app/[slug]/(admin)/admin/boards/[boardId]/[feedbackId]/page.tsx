import prisma from "@/lib/prisma";
import { FeedbackDetails } from "./FeedbackDetails";
interface PageProps {
  params: Promise<{
    feedbackId: string;
  }>;
}
const page = async ({ params }: PageProps) => {
  const { feedbackId } = await params;

  const feedback = await prisma.feedback.findFirst({
    where: {
      id: feedbackId,
    },
    include: {
      author: true,
      votes: { select: { id: true } },
      comments: {
        include: { author: true },
        orderBy: { createdAt: "asc" },
      },
      board: {
        include: {
          workspace: { select: { slug: true } },
        },
      },
    },
  });
  if (!feedback) return <div>Feedback not found</div>;

  return (
    <>
      <FeedbackDetails feedback={feedback} />
    </>
  );
};

export default page;
