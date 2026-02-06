'use server';

import { prisma } from '@/lib/prisma';
import { revalidatePath } from 'next/cache';

export async function getProjectRFQs(projectId: number) {
    // Since RFQs are linked to MRs, and MRs to Projects, we fetch via relation
    // Or we can query RFQs where materialRequest.projectId matches
    const rfqs = await prisma.rFQ.findMany({
        where: { materialRequest: { projectId } },
        include: {
            items: true,
            quotations: {
                include: { supplier: true }
            }
        },
        orderBy: { createdAt: 'desc' }
    });

    return rfqs.map(rfq => ({
        ...rfq,
        items: rfq.items.map(i => ({ ...i, quantity: Number(i.quantity) })),
        quotations: rfq.quotations.map(q => ({
            ...q,
            totalAmount: Number(q.totalAmount),
            // items not fetched in this list view, but if they were, map them too
        }))
    }));
}

export async function createRFQ(data: { mrId?: number; title: string; dueDate: Date; items: any[], createdById: number }) {
    try {
        await prisma.rFQ.create({
            data: {
                mrId: data.mrId,
                title: data.title,
                dueDate: data.dueDate,
                createdById: data.createdById,
                items: {
                    create: data.items.map((i: any) => ({
                        materialName: i.materialName,
                        quantity: i.quantity,
                        unit: i.unit
                    }))
                }
            }
        });

        // We'd typically revalidate the project dashboard or a dedicated RFQ list
        return { success: true };
    } catch (e) {
        return { success: false, error: 'Failed to create RFQ' };
    }
}

export async function getRFQ(id: number) {
    try {
        const rfq = await prisma.rFQ.findUnique({
            where: { id },
            include: {
                items: true,
                quotations: {
                    include: {
                        supplier: true,
                        items: true
                    },
                    orderBy: { totalAmount: 'asc' }
                },
                materialRequest: { include: { project: true } }
            }
        });

        if (!rfq) return null;

        return {
            ...rfq,
            items: rfq.items.map(i => ({ ...i, quantity: Number(i.quantity) })),
            quotations: rfq.quotations.map(q => ({
                ...q,
                totalAmount: Number(q.totalAmount),
                items: q.items.map(qi => ({
                    ...qi,
                    quantity: Number(qi.quantity),
                    unitPrice: Number(qi.unitPrice),
                    totalPrice: Number(qi.totalPrice)
                }))
            })),
            materialRequest: rfq.materialRequest ? {
                ...rfq.materialRequest,
                project: rfq.materialRequest.project ? {
                    ...rfq.materialRequest.project,
                    budget: Number(rfq.materialRequest.project.budget)
                } : null
            } : null
        };
    } catch (e) {
        return null;
    }
}

export async function addQuotation(data: { rfqId: number; supplierId: number; items: any[], currency?: string }) {
    try {
        const totalAmount = data.items.reduce((sum: number, item: any) => sum + (item.quantity * item.unitPrice), 0);

        await prisma.supplierQuotation.create({
            data: {
                rfqId: data.rfqId,
                supplierId: data.supplierId,
                totalAmount,
                currency: data.currency || 'PHP',
                items: {
                    create: data.items.map((i: any) => ({
                        materialName: i.materialName,
                        quantity: i.quantity,
                        unitPrice: i.unitPrice,
                        totalPrice: i.quantity * i.unitPrice,
                        remarks: i.remarks
                    }))
                }
            }
        });
        revalidatePath(`/purchasing/rfq/${data.rfqId}`);
        return { success: true };
    } catch (e) {
        return { success: false, error: 'Failed to add quotation' };
    }
}

export async function awardQuotation(rfqId: number, quotationId: number) {
    try {
        await prisma.$transaction([
            // Mark all as not selected
            prisma.supplierQuotation.updateMany({
                where: { rfqId },
                data: { isSelected: false }
            }),
            // Mark selected
            prisma.supplierQuotation.update({
                where: { id: quotationId },
                data: { isSelected: true }
            }),
            // Update RFQ Status
            prisma.rFQ.update({
                where: { id: rfqId },
                data: { status: 'AWARDED' } // Use string if enum not imported, or import RfqStatus
            })
        ]);
        revalidatePath(`/purchasing/rfq/${rfqId}`);
        return { success: true };
    } catch (e) {
        return { success: false, error: 'Failed to award quotation' };
    }
}
