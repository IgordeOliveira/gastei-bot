/*
  Warnings:

  - Changed the type of `sheet_id` on the `User` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- AlterTable
ALTER TABLE "User" DROP COLUMN "sheet_id",
ADD COLUMN     "sheet_id" INTEGER NOT NULL;
