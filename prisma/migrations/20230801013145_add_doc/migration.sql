/*
  Warnings:

  - You are about to drop the column `sheet_id` on the `User` table. All the data in the column will be lost.
  - Added the required column `doc` to the `User` table without a default value. This is not possible if the table is not empty.
  - Added the required column `sheet` to the `User` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "User" DROP COLUMN "sheet_id",
ADD COLUMN     "doc" TEXT NOT NULL,
ADD COLUMN     "sheet" TEXT NOT NULL;
