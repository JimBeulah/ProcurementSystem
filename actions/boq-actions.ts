'use server';

import { prisma } from '@/lib/prisma';
import { revalidatePath } from 'next/cache';
import { serialize } from '@/lib/utils';
import { auth } from '@/auth';
import { canEdit } from '@/lib/rbac';

export async function getProjectBoq(projectId: number) {
    console.log(`[ACTION] Fetching BOQ for Project: ${projectId} (${typeof projectId})`);
    try {
        const id = Number(projectId);
        if (isNaN(id)) {
            console.error('[ACTION] Invalid Project ID:', projectId);
            return [];
        }
        const boqItems = await prisma.boqItem.findMany({
            where: { projectId: id },
            include: { boqComponents: true },
            orderBy: { itemDescription: 'asc' }
        });
        console.log(`[ACTION] Found ${boqItems.length} items in DB`);
        const serialized = serialize(boqItems);
        console.log(`[ACTION] Serialized ${Array.isArray(serialized) ? serialized.length : 'error'} items`);
        return serialized;
    } catch (e: any) {
        console.error('[ACTION] CRITICAL ERROR in getProjectBoq:', e);
        // Throwing so we can see it in the dev server logs or a toast if implemented
        throw new Error(`Failed to fetch BOQ: ${e.message}`);
    }
}

export async function createBoqItem(data: {
    projectId: number;
    itemDescription: string;
    unit: string;
    quantity: number;
    isCarport?: boolean;
    components?: {
        resourceType: 'MATERIAL' | 'LABOR' | 'EQUIPMENT';
        name: string;
        quantityFactor: number;
        unitRate: number;
    }[];
}) {
    const session = await auth();
    if (!canEdit(session?.user?.role, 'projects')) {
        return { success: false, error: 'Unauthorized: You do not have permission to modify BOQ' };
    }

    try {
        const components = data.components || [];

        // Calculate totals with explicit number conversion
        const materialCosts = components
            .filter(c => c.resourceType === 'MATERIAL')
            .reduce((sum, c) => sum + (Number(c.quantityFactor) * Number(c.unitRate)), 0);

        const laborCosts = components
            .filter(c => c.resourceType === 'LABOR' || c.resourceType === 'EQUIPMENT')
            .reduce((sum, c) => sum + (Number(c.quantityFactor) * Number(c.unitRate)), 0);

        const newItem = await prisma.boqItem.create({
            data: {
                projectId: Number(data.projectId),
                itemDescription: data.itemDescription,
                unit: data.unit,
                quantity: Number(data.quantity),
                isCarport: data.isCarport || false,
                materialUnitPrice: materialCosts,
                laborUnitPrice: laborCosts,
                boqComponents: {
                    create: components.map(c => ({
                        resourceType: c.resourceType,
                        name: c.name,
                        quantityFactor: Number(c.quantityFactor),
                        unitRate: Number(c.unitRate),
                        totalComponentCost: Number(c.quantityFactor) * Number(c.unitRate)
                    }))
                }
            }
        });

        console.log('Successfully created BOQ item:', newItem.id);
        revalidatePath(`/projects/${data.projectId}/boq`);
        return { success: true };
    } catch (error: any) {
        console.error('Error creating BOQ item:', error.message);
        return { success: false, error: error.message || 'Failed to add BOQ item' };
    }
}

export async function updateBoqItem(id: number, projectId: number, data: {
    itemDescription?: string;
    unit?: string;
    quantity?: number;
    isCarport?: boolean;
    components?: {
        id?: number;
        resourceType: 'MATERIAL' | 'LABOR' | 'EQUIPMENT';
        name: string;
        quantityFactor: number;
        unitRate: number;
    }[];
}) {
    const session = await auth();
    if (!canEdit(session?.user?.role, 'projects')) {
        return { success: false, error: 'Unauthorized: You do not have permission to modify BOQ' };
    }

    try {
        const components = data.components || [];

        // Calculate totals
        const materialCosts = components
            .filter(c => c.resourceType === 'MATERIAL')
            .reduce((sum, c) => sum + (c.quantityFactor * c.unitRate), 0);

        const laborCosts = components
            .filter(c => c.resourceType === 'LABOR' || c.resourceType === 'EQUIPMENT')
            .reduce((sum, c) => sum + (c.quantityFactor * c.unitRate), 0);

        await prisma.$transaction(async (tx) => {
            // Delete old components
            await tx.boqItemComponent.deleteMany({
                where: { boqItemId: id }
            });

            // Update item
            await tx.boqItem.update({
                where: { id },
                data: {
                    itemDescription: data.itemDescription,
                    unit: data.unit,
                    quantity: data.quantity,
                    isCarport: data.isCarport,
                    materialUnitPrice: materialCosts,
                    laborUnitPrice: laborCosts,
                    boqComponents: {
                        create: components.map(c => ({
                            resourceType: c.resourceType,
                            name: c.name,
                            quantityFactor: c.quantityFactor,
                            unitRate: c.unitRate,
                            totalComponentCost: c.quantityFactor * c.unitRate
                        }))
                    }
                }
            });
        });

        revalidatePath(`/projects/${projectId}/boq`);
        return { success: true };
    } catch (error: any) {
        console.error('Error updating BOQ item:', error);
        return { success: false, error: error.message || 'Failed to update BOQ item' };
    }
}
export async function bulkCreateBoqItems(projectId: number, items: any[]) {
    const session = await auth();
    if (!canEdit(session?.user?.role, 'projects')) {
        return { success: false, error: 'Unauthorized: You do not have permission to modify BOQ' };
    }

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
