'use server';

import { prisma } from '@/lib/prisma';
import { revalidatePath } from 'next/cache';

export async function getProjectBoq(projectId: number) {
    try {
        const boqItems = await prisma.boqItem.findMany({
            where: { projectId },
            orderBy: { itemDescription: 'asc' }
        });
        return boqItems.map(item => ({
            ...item,
            quantity: Number(item.quantity),
            materialUnitPrice: Number(item.materialUnitPrice),
            laborUnitPrice: Number(item.laborUnitPrice)
        }));
    } catch (e: any) {
        console.error('Error fetching BOQ:', e);
        return [];
    }
}

export async function createBoqItem(data: {
    projectId: number;
    itemDescription: string;
    unit: string;
    materialUnitPrice: number;
    laborUnitPrice: number;
    quantity: number;
    isCarport?: boolean;
}) {
    try {
        await prisma.boqItem.create({
            data: {
                ...data,
                isCarport: data.isCarport || false
            }
        });
        revalidatePath(`/projects/${data.projectId}/boq`);
        return { success: true };
    } catch (error: any) {
        console.error('Error creating BOQ item:', error);
        return { success: false, error: error.message || 'Failed to add BOQ item' };
    }
}

export async function updateBoqItem(id: number, projectId: number, data: any) {
    try {
        await prisma.boqItem.update({
            where: { id },
            data
        });
        revalidatePath(`/projects/${projectId}/boq`);
        return { success: true };
    } catch (error: any) {
        console.error('Error updating BOQ item:', error);
        return { success: false, error: error.message || 'Failed to update BOQ item' };
    }
}
export async function bulkCreateBoqItems(projectId: number, items: any[]) {
    try {
        await prisma.$transaction(
            items.map(item => prisma.boqItem.upsert({
                where: {
                    projectId_itemDescription: {
                        projectId,
                        itemDescription: item.itemDescription
                    }
                },
                update: {
                    unit: item.unit,
                    materialUnitPrice: item.materialUnitPrice,
                    laborUnitPrice: item.laborUnitPrice,
                    quantity: item.quantity,
                    isCarport: item.isCarport || false
                },
                create: {
                    projectId,
                    itemDescription: item.itemDescription,
                    unit: item.unit,
                    materialUnitPrice: item.materialUnitPrice,
                    laborUnitPrice: item.laborUnitPrice,
                    quantity: item.quantity,
                    isCarport: item.isCarport || false
                }
            }))
        );
        revalidatePath(`/projects/${projectId}/boq`);
        return { success: true };
    } catch (error: any) {
        console.error('Error bulk creating BOQ items:', error);
        return { success: false, error: error.message || 'Failed to bulk add BOQ items' };
    }
}
