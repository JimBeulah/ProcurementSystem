'use server';

import { prisma } from '@/lib/prisma';
import { revalidatePath } from 'next/cache';
import { PoStatus } from '@prisma/client';
import { serialize } from '@/lib/utils';

export async function getPOs() {
    try {
        const pos = await prisma.purchaseOrder.findMany({
            include: { supplier: true, project: true },
            orderBy: { createdAt: 'desc' }
        });
        return serialize(pos);
    } catch (e) {
        return [];
    }
}

export async function getPO(id: number) {
    try {
        const po = await prisma.purchaseOrder.findUnique({
            where: { id },
            include: {
                supplier: true,
                project: true,
                items: true,
                requester: true,
                approver: true
            }
        });

        if (!po) return null;

        return serialize(po);
    } catch (e) {
        return null;
    }
}

export async function createPO(data: {
    projectId: number;
    supplierId: number;
    requesterId: number;
    items: any[];
    remarks?: string;
    rfqId?: number; // Optional link
}) {
    try {
        const totalAmount = data.items.reduce((sum, item) => sum + (item.quantity * item.unitPrice), 0);

        await prisma.purchaseOrder.create({
            data: {
                projectId: data.projectId,
                supplierId: data.supplierId,
                requesterId: data.requesterId,
                totalAmount,
                remarks: data.remarks,
                status: 'PENDING',
                items: {
                    create: data.items.map((i: any) => ({
                        materialName: i.materialName,
                        quantity: i.quantity,
                        unit: i.unit,
                        unitPrice: i.unitPrice,
                        totalPrice: i.quantity * i.unitPrice,
                        description: i.description
                    }))
                }
            }
        });

        revalidatePath('/purchasing/orders');
        return { success: true };
    } catch (e) {
        return { success: false, error: 'Failed to create PO' };
    }
}

export async function approvePO(id: number, approverId: number) {
    try {
        await prisma.purchaseOrder.update({
            where: { id },
            data: {
                status: 'APPROVED',
                approverId
            }
        });
        revalidatePath(`/purchasing/orders/${id}`);
        return { success: true };
    } catch (e) {
        return { success: false, error: 'Failed to approve PO' };
    }
}
