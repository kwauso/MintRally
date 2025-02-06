-- CreateTable
CREATE TABLE "eventgroup" (
    "id" SERIAL NOT NULL,
    "name" TEXT,
    "master_address" TEXT,

    CONSTRAINT "eventgroup_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "event" (
    "id" SERIAL NOT NULL,
    "eventGroupId" INTEGER NOT NULL,
    "name" TEXT,
    "description" TEXT NOT NULL,
    "date" TIMESTAMP(3) NOT NULL,
    "pass" TEXT,
    "creator_address" TEXT,
    "nftEnabled" BOOLEAN NOT NULL DEFAULT false,
    "nftTokenURI" TEXT,

    CONSTRAINT "event_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "user" (
    "id" SERIAL NOT NULL,
    "name" TEXT,
    "address" TEXT,
    "pass" TEXT,

    CONSTRAINT "user_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "NFT" (
    "id" SERIAL NOT NULL,
    "tokenId" INTEGER NOT NULL,
    "eventId" INTEGER NOT NULL,
    "owner" TEXT NOT NULL,
    "tokenURI" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "NFT_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "eventgroup_name_key" ON "eventgroup"("name");

-- CreateIndex
CREATE UNIQUE INDEX "user_name_key" ON "user"("name");

-- CreateIndex
CREATE UNIQUE INDEX "user_address_key" ON "user"("address");

-- CreateIndex
CREATE UNIQUE INDEX "NFT_tokenId_key" ON "NFT"("tokenId");

-- AddForeignKey
ALTER TABLE "event" ADD CONSTRAINT "event_eventGroupId_fkey" FOREIGN KEY ("eventGroupId") REFERENCES "eventgroup"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "NFT" ADD CONSTRAINT "NFT_eventId_fkey" FOREIGN KEY ("eventId") REFERENCES "event"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
