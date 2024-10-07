/*
  Warnings:

  - You are about to drop the column `address` on the `User` table. All the data in the column will be lost.
  - You are about to drop the column `email` on the `User` table. All the data in the column will be lost.
  - You are about to drop the column `name` on the `User` table. All the data in the column will be lost.
  - You are about to drop the column `password` on the `User` table. All the data in the column will be lost.
  - You are about to drop the column `phone_number` on the `User` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[username]` on the table `User` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `health_data_RC4` to the `User` table without a default value. This is not possible if the table is not empty.
  - Added the required column `income_DES` to the `User` table without a default value. This is not possible if the table is not empty.
  - Added the required column `password_AES` to the `User` table without a default value. This is not possible if the table is not empty.
  - Added the required column `username` to the `User` table without a default value. This is not possible if the table is not empty.
  - Added the required column `des_iv` to the `UserFiles` table without a default value. This is not possible if the table is not empty.
  - Added the required column `rc4_iv` to the `UserFiles` table without a default value. This is not possible if the table is not empty.

*/
-- DropIndex
DROP INDEX "User_email_key";

-- AlterTable
ALTER TABLE "User" DROP COLUMN "address",
DROP COLUMN "email",
DROP COLUMN "name",
DROP COLUMN "password",
DROP COLUMN "phone_number",
ADD COLUMN     "health_data_RC4" TEXT NOT NULL,
ADD COLUMN     "income_DES" TEXT NOT NULL,
ADD COLUMN     "password_AES" TEXT NOT NULL,
ADD COLUMN     "username" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "UserFiles" ADD COLUMN     "des_iv" BYTEA NOT NULL,
ADD COLUMN     "rc4_iv" BYTEA NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "User_username_key" ON "User"("username");
