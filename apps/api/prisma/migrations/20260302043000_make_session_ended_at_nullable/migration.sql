-- AlterTable
ALTER TABLE "Session"
ALTER COLUMN "endedAt" DROP NOT NULL;

-- AddConstraint
ALTER TABLE "Session"
ADD CONSTRAINT "Session_endedAt_after_startedAt_chk"
CHECK ("endedAt" IS NULL OR "endedAt" > "startedAt");
