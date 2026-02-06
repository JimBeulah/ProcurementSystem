/*
  Warnings:

  - You are about to drop the column `materialName` on the `materialrequestitem` table. All the data in the column will be lost.
  - Added the required column `itemDescription` to the `MaterialRequestItem` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `materialrequestitem` DROP COLUMN `materialName`,
    ADD COLUMN `itemDescription` VARCHAR(191) NOT NULL,
    ADD COLUMN `laborUnitPrice` DECIMAL(10, 2) NOT NULL DEFAULT 0,
    ADD COLUMN `materialUnitPrice` DECIMAL(10, 2) NOT NULL DEFAULT 0;
