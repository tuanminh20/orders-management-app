-- CreateTable
CREATE TABLE "_OrderToTag" (
    "A" BIGINT NOT NULL,
    "B" INTEGER NOT NULL,
    CONSTRAINT "_OrderToTag_A_fkey" FOREIGN KEY ("A") REFERENCES "Order" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "_OrderToTag_B_fkey" FOREIGN KEY ("B") REFERENCES "Tag" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateIndex
CREATE UNIQUE INDEX "_OrderToTag_AB_unique" ON "_OrderToTag"("A", "B");

-- CreateIndex
CREATE INDEX "_OrderToTag_B_index" ON "_OrderToTag"("B");
