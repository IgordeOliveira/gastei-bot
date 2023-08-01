/*
  Warnings:

  - You are about to drop the column `doc` on the `User` table. All the data in the column will be lost.
  - You are about to drop the column `sheet` on the `User` table. All the data in the column will be lost.
  - Added the required column `document_id` to the `User` table without a default value. This is not possible if the table is not empty.
  - Added the required column `sheet_id` to the `User` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "User" DROP COLUMN "doc",
DROP COLUMN "sheet",
ADD COLUMN     "document_id" TEXT NOT NULL,
ADD COLUMN     "sheet_id" TEXT NOT NULL;
