'use server';

import { prisma } from '@/lib/prisma';
import { revalidatePath } from 'next/cache';

export async function getReceivingReports() {
    try {
        const reports = await prisma.receivingReport.findMany({
            include: {
                purchaseOrder: { include: { supplier: true, project: true } },
                receivedBy: true,
                items: true
            },
            orderBy: { receivedDate: 'desc' }
        });
        return reports.map(rr => ({
            ...rr,
            purchaseOrder: {
                ...rr.purchaseOrder,
                totalAmount: Number(rr.purchaseOrder.totalAmount),
                project: rr.purchaseOrder.project ? {
                    ...rr.purchaseOrder.project,
                    budget: Number(rr.purchaseOrder.project.budget)
                } : null
            },
            items: rr.items.map(i => ({
                ...i,
                quantityReceived: Number(i.quantityReceived)
            }))
        }));
    } catch (e) {
        return [];
    }
}

export async function createReceivingReport(data: { purchaseOrderId: number; receivedById: number; items: any[]; deliveryNoteNo?: string; notes?: string }) {
    try {
        await prisma.$transaction(async (tx) => {
            // 1. Create Receiving Report
            const rr = await tx.receivingReport.create({
                data: {
                    purchaseOrderId: data.purchaseOrderId,
                    receivedById: data.receivedById,
                    deliveryNoteNo: data.deliveryNoteNo,
                    notes: data.notes,
                    items: {
                        create: data.items.map((i: any) => ({
                            materialName: i.materialName,
                            quantityReceived: i.quantityReceived,
                            status: i.status || 'GOOD'
                        }))
                    }
                }
            });

            // 2. Update Inventory for each item
            // We need the Project ID from the PO to assign stock to the project
            const po = await tx.purchaseOrder.findUnique({
                where: { id: data.purchaseOrderId },
                select: { projectId: true }
            });

            if (po?.projectId) {
                for (const item of data.items) {
                    // Skip if not GOOD? - Usually we receive into restricted stock or reject. 
                    // For simplicity, we only add GOOD items to available inventory.
                    if (item.status !== 'GOOD') continue;

                    const existingStock = await tx.inventoryItem.findFirst({
                        where: {
                            projectId: po.projectId,
                            materialName: item.materialName
                        }
                    });

                    if (existingStock) {
                        await tx.inventoryItem.update({
                            where: { id: existingStock.id },
                            data: { quantity: { increment: item.quantityReceived } }
                        });
                    } else {
                        await tx.inventoryItem.create({
                            data: {
                                materialName: item.materialName,
                                projectId: po.projectId,
                                quantity: item.quantityReceived,
                                unit: 'pcs' // Todo: Fetch unit from Master Data or PO Item
                            }
                        });
                    }
                }
            }
        });

        revalidatePath('/inventory/receiving');
        return { success: true };
    } catch (e) {
        console.error(e);
        return { success: false, error: 'Failed to create receiving report' };
    }
}
