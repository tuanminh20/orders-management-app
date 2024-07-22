/*
  Warnings:

  - You are about to drop the `_OrderToTag` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the column `customerId` on the `Order` table. All the data in the column will be lost.
  - You are about to drop the column `paymentGateway` on the `Order` table. All the data in the column will be lost.
  - Added the required column `paymentGatewayNames` to the `Order` table without a default value. This is not possible if the table is not empty.

*/
-- DropIndex
DROP INDEX "_OrderToTag_B_index";

-- DropIndex
DROP INDEX "_OrderToTag_AB_unique";

-- DropTable
PRAGMA foreign_keys=off;
DROP TABLE "_OrderToTag";
PRAGMA foreign_keys=on;

-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Order" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "orderNumber" INTEGER NOT NULL,
    "totalPrice" TEXT NOT NULL DEFAULT '0',
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "paymentGatewayNames" TEXT NOT NULL
);
INSERT INTO "new_Order" ("createdAt", "id", "orderNumber", "totalPrice") SELECT "createdAt", "id", "orderNumber", "totalPrice" FROM "Order";
DROP TABLE "Order";
ALTER TABLE "new_Order" RENAME TO "Order";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
