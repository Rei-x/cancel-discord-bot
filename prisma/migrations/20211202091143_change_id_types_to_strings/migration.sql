-- AlterTable
ALTER TABLE "Cancels" ALTER COLUMN "guildId" SET DATA TYPE TEXT,
ALTER COLUMN "cancelledUserId" SET DATA TYPE TEXT,
ALTER COLUMN "whoStartedId" SET DATA TYPE TEXT,
ALTER COLUMN "whoVotedForYes" SET DATA TYPE TEXT[],
ALTER COLUMN "whoVotedForNo" SET DATA TYPE TEXT[];
