-- CreateEnum
CREATE TYPE "roles" AS ENUM ('ADMIN', 'USER');

-- CreateEnum
CREATE TYPE "verification_status" AS ENUM ('VERIFIED', 'PENDING', 'UNVERIFIED');

-- CreateEnum
CREATE TYPE "password_reset_status" AS ENUM ('PENDING', 'IDLE');

-- CreateTable
CREATE TABLE "User" (
    "id" TEXT NOT NULL,
    "names" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "telephone" TEXT,
    "password" TEXT NOT NULL,
    "profile" TEXT DEFAULT 'https://res.cloudinary.com/djxhcwowp/image/upload/v1623778853/avatars/avatar-1_ozxjxh.png',
    "role" "roles" NOT NULL DEFAULT 'USER',
    "verification_status" "verification_status" NOT NULL DEFAULT 'UNVERIFIED',
    "verificationCode" TEXT,
    "verificationExpires" TIMESTAMP(3),
    "password_reset_status" "password_reset_status" NOT NULL DEFAULT 'IDLE',
    "passwordResetCode" TEXT,
    "passwordResetExpires" TIMESTAMP(3),
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");
