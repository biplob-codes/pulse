import React from "react";
import { VotersList } from "./VotersList";
import prisma from "@/lib/prisma";
import { FeedbackCard } from "./FeedbackCard";
import { getSession } from "@/lib/auth-session";
import CommentInput from "./CommentInput";
interface Props {
  params: Promise<{
    feedback: string;
    slug: string;
    board: string;
  }>;
}
const FeedbackDetailsPage = async ({ params }: Props) => {
  const { feedback: slug, slug: workspaceSlug, board } = await params;
  const feedback = await prisma.feedback.findUnique({
    where: {
      slug,
    },
    include: {
      votes: { include: { user: true } },
      author: { select: { id: true, name: true, image: true } },
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
          boardSlug={board}
          votes={feedback.votes}
        />
        <CommentInput
          isAuthenticated={!!session?.user}
          feedbackId={feedback.id}
        />
      </div>
    </div>
  );
};

export default FeedbackDetailsPage;
