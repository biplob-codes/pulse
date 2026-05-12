-- AlterTable
ALTER TABLE "comment" ADD COLUMN     "isMemberReply" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "isPinned" BOOLEAN NOT NULL DEFAULT false;
