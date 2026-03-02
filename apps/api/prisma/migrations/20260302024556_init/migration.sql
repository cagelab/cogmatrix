-- CreateTable
CREATE TABLE "SessionSubject" (
    "sessionId" UUID NOT NULL,
    "subjectId" UUID NOT NULL,
    "createdAt" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "SessionSubject_pkey" PRIMARY KEY ("sessionId","subjectId")
);

-- CreateTable
CREATE TABLE "Session" (
    "id" UUID NOT NULL,
    "createdAt" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "startedAt" TIMESTAMPTZ NOT NULL,
    "endedAt" TIMESTAMPTZ NOT NULL,

    CONSTRAINT "Session_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Subject" (
    "id" UUID NOT NULL,
    "nickname" TEXT NOT NULL,

    CONSTRAINT "Subject_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "SessionSubject_subjectId_idx" ON "SessionSubject"("subjectId");

-- CreateIndex
CREATE INDEX "SessionSubject_sessionId_idx" ON "SessionSubject"("sessionId");

-- CreateIndex
CREATE UNIQUE INDEX "Subject_nickname_key" ON "Subject"("nickname");

-- AddForeignKey
ALTER TABLE "SessionSubject" ADD CONSTRAINT "SessionSubject_sessionId_fkey" FOREIGN KEY ("sessionId") REFERENCES "Session"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SessionSubject" ADD CONSTRAINT "SessionSubject_subjectId_fkey" FOREIGN KEY ("subjectId") REFERENCES "Subject"("id") ON DELETE CASCADE ON UPDATE CASCADE;
