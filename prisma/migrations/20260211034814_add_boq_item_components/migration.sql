-- CreateTable
CREATE TABLE `BoqItemComponent` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `boqItemId` INTEGER NOT NULL,
    `resourceType` ENUM('MATERIAL', 'LABOR', 'EQUIPMENT') NOT NULL,
    `name` VARCHAR(191) NOT NULL,
    `quantityFactor` DECIMAL(10, 4) NOT NULL,
    `unitRate` DECIMAL(10, 2) NOT NULL,
    `totalComponentCost` DECIMAL(15, 2) NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `BoqItemComponent` ADD CONSTRAINT `BoqItemComponent_boqItemId_fkey` FOREIGN KEY (`boqItemId`) REFERENCES `BoqItem`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
