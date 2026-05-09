import React from "react";
import { VotersList } from "./VotersList";
import prisma from "@/lib/prisma";
interface Props {
  params: Promise<{
    feedback: string;
  }>;
}
const FeedbackDetailsPage = async ({ params }: Props) => {
  const { feedback: slug } = await params;
  const feedback = await prisma.feedback.findUnique({
    where: {
      slug,
    },
    include: {
      votes: { include: { user: true } },
    },
  });
  if (!feedback) {
    return <div>Feedback not found</div>;
  }
  const voters = feedback?.votes.map((v) => v.user);
  return (
    <div className="grid grid-cols-1 lg:grid-cols-3">
      <div className="  px-3 py-4">
        <div className="sticky top-25">
          <VotersList voters={voters} />
        </div>
      </div>
      <div className="col-span-2 px-6 py-4">details</div>
    </div>
  );
};

export default FeedbackDetailsPage;
