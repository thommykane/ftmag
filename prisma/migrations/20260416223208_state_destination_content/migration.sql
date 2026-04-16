-- CreateTable
CREATE TABLE "StateDestinationContent" (
    "slug" TEXT NOT NULL,
    "payload" JSONB NOT NULL,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "StateDestinationContent_pkey" PRIMARY KEY ("slug")
);
