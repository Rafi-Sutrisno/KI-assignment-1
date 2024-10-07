/*
  Warnings:

  - You are about to drop the column `rc4_iv` on the `UserFiles` table. All the data in the column will be lost.
  - Added the required column `aes_iv` to the `User` table without a default value. This is not possible if the table is not empty.
  - Added the required column `des_iv` to the `User` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "User" ADD COLUMN     "aes_iv" BYTEA NOT NULL,
ADD COLUMN     "des_iv" BYTEA NOT NULL;

-- AlterTable
ALTER TABLE "UserFiles" DROP COLUMN "rc4_iv";
