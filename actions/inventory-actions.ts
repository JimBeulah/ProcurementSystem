'use server';

import { prisma } from '@/lib/prisma';
import { revalidatePath } from 'next/cache';

export async function createInventoryItem(data: {
    materialName: string;
    quantity: number;
    unit: string;
    projectId?: number;
    warehouseId?: number;
}) {
    try {
        console.log('Creating inventory item:', data);

        await prisma.inventoryItem.create({
            data: {
                materialName: data.materialName,
                quantity: data.quantity,
                unit: data.unit,
                projectId: data.projectId || null,
                warehouseId: data.warehouseId || null,
            }
        });

        revalidatePath('/inventory');
        return { success: true };
    } catch (error: any) {
        console.error('Failed to create inventory item:', error);
        return { success: false, error: error.message };
    }
}
