-- AlterTable
ALTER TABLE `boqitem` ADD COLUMN `isCarport` BOOLEAN NOT NULL DEFAULT false;

-- AlterTable
ALTER TABLE `project` ADD COLUMN `carportArea` DECIMAL(10, 2) NULL,
    ADD COLUMN `totalFloorArea` DECIMAL(10, 2) NULL;
