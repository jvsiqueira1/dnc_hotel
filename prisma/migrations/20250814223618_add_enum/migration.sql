/*
  Warnings:

  - You are about to drop the column `approved` on the `reservations` table. All the data in the column will be lost.

*/
-- CreateEnum
CREATE TYPE "public"."ReservationStatus" AS ENUM ('PENDING', 'CONFIRMED', 'CANCELLED');

-- AlterTable
ALTER TABLE "public"."reservations" DROP COLUMN "approved",
ADD COLUMN     "status" "public"."ReservationStatus" NOT NULL DEFAULT 'PENDING';
