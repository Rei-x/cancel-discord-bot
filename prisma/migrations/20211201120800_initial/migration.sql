-- CreateTable
CREATE TABLE "Cancels" (
    "id" SERIAL NOT NULL,
    "timestamp" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "guildId" INTEGER NOT NULL,
    "cancelledUserId" INTEGER NOT NULL,
    "whoStartedId" INTEGER NOT NULL,
    "whoVotedForYes" INTEGER[],
    "whoVotedForNo" INTEGER[],

    CONSTRAINT "Cancels_pkey" PRIMARY KEY ("id")
);
