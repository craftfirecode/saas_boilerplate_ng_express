/*
  Warnings:

  - A unique constraint covering the columns `[deleteAccountToken]` on the table `User` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "User" ADD COLUMN "deleteAccountToken" TEXT;
ALTER TABLE "User" ADD COLUMN "deleteAccountTokenExpiry" DATETIME;

-- CreateIndex
CREATE UNIQUE INDEX "User_deleteAccountToken_key" ON "User"("deleteAccountToken");
