import React from "react";
import { VotersList } from "./VotersList";
import prisma from "@/lib/prisma";
import { FeedbackCard } from "./FeedbackCard";
import { getSession } from "@/lib/auth-session";
import CommentInput from "./CommentInput";
import CommentList from "./CommentList";
interface Props {
  params: Promise<{
    feedback: string;
    slug: string;
    board: string;
  }>;
}
const FeedbackDetailsPage = async ({ params }: Props) => {
  const {
    feedback: feedbackSlug,
    slug: workspaceSlug,
    board: boardSlug,
  } = await params;
  const feedback = await prisma.feedback.findUnique({
    where: {
      slug: feedbackSlug,
    },
    include: {
      votes: { include: { user: true } },
      author: { select: { id: true, name: true, image: true } },
      comments: {
        orderBy: { createdAt: "desc" },
        include: { author: { select: { id: true, name: true, image: true } } },
      },
    },
  });
  if (!feedback) {
    return <div>Feedback not found</div>;
  }
  const voters = feedback?.votes.map((v) => v.user);
  const session = await getSession();
  return (
    <div className="grid grid-cols-1 lg:grid-cols-3">
      <div className="  px-3 py-4">
        <div className="sticky top-25">
          <VotersList voters={voters} />
        </div>
      </div>
      <div className="col-span-2 px-6 py-4">
        <FeedbackCard
          id={feedback.id}
          title={feedback.title}
          description={feedback.description}
          status={feedback.status}
          author={feedback.author}
          createdAt={feedback.createdAt}
          currentUser={session?.user}
          workspaceSlug={workspaceSlug}
          boardSlug={boardSlug}
          votes={feedback.votes}
        />
        <CommentInput
          isAuthenticated={!!session?.user}
          feedbackId={feedback.id}
          boardSlug={boardSlug}
          workspaceSlug={workspaceSlug}
        />
        <CommentList comments={feedback.comments} />
      </div>
    </div>
  );
};

export default FeedbackDetailsPage;
