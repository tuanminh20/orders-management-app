/*
  Warnings:

  - The primary key for the `Customer` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to alter the column `id` on the `Customer` table. The data in that column could be lost. The data in that column will be cast from `Int` to `BigInt`.
  - Added the required column `customerId` to the `Order` table without a default value. This is not possible if the table is not empty.

*/
-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Customer" (
    "id" BIGINT NOT NULL PRIMARY KEY,
    "firstName" TEXT,
    "lastName" TEXT,
    "email" TEXT,
    "address" TEXT NOT NULL
);
INSERT INTO "new_Customer" ("address", "email", "firstName", "id", "lastName") SELECT "address", "email", "firstName", "id", "lastName" FROM "Customer";
DROP TABLE "Customer";
ALTER TABLE "new_Customer" RENAME TO "Customer";
CREATE TABLE "new_Order" (
    "id" BIGINT NOT NULL PRIMARY KEY,
    "orderNumber" INTEGER NOT NULL,
    "totalPrice" TEXT NOT NULL DEFAULT '0',
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "paymentGatewayNames" TEXT NOT NULL DEFAULT '',
    "customerId" BIGINT NOT NULL,
    CONSTRAINT "Order_customerId_fkey" FOREIGN KEY ("customerId") REFERENCES "Customer" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_Order" ("createdAt", "id", "orderNumber", "paymentGatewayNames", "totalPrice", "updatedAt") SELECT "createdAt", "id", "orderNumber", coalesce("paymentGatewayNames", '') AS "paymentGatewayNames", "totalPrice", "updatedAt" FROM "Order";
DROP TABLE "Order";
ALTER TABLE "new_Order" RENAME TO "Order";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
