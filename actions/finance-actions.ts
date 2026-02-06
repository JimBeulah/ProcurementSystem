'use server';

import { prisma } from '@/lib/prisma';
import { revalidatePath } from 'next/cache';

export async function getInvoices() {
    try {
        const invoices = await prisma.supplierInvoice.findMany({
            include: {
                supplier: true,
                purchaseOrder: true,
                receivingReport: true
            },
            orderBy: { invoiceDate: 'desc' }
        });
        return invoices.map(inv => ({
            ...inv,
            totalAmount: Number(inv.totalAmount),
            purchaseOrder: inv.purchaseOrder ? {
                ...inv.purchaseOrder,
                totalAmount: Number(inv.purchaseOrder.totalAmount)
            } : null
        }));
    } catch (e) {
        return [];
    }
}

export async function createInvoice(data: {
    invoiceNumber: string;
    invoiceDate: Date;
    supplierId: number;
    purchaseOrderId?: number;
    receivingReportId?: number;
    totalAmount: number;
}) {
    try {
        await prisma.supplierInvoice.create({
            data: {
                invoiceNumber: data.invoiceNumber,
                invoiceDate: data.invoiceDate,
                supplierId: data.supplierId,
                purchaseOrderId: data.purchaseOrderId,
                receivingReportId: data.receivingReportId,
                totalAmount: data.totalAmount,
                status: 'PENDING'
            }
        });

        revalidatePath('/finance/invoices');
        return { success: true };
    } catch (e) {
        return { success: false, error: 'Failed to create invoice' };
    }
}

export async function matchInvoice(id: number) {
    try {
        // Logic for 2-way or 3-way matching
        // For now, we assume if PO and RR are linked, we can mark as MATCHED

        const invoice = await prisma.supplierInvoice.findUnique({ where: { id } });

        if (!invoice) return { success: false, error: 'Invoice not found' };

        // 3-way match condition: Needs both PO and RR linked (or just PO for 2-way)
        // Let's enforce linkage
        if (!invoice.purchaseOrderId) {
            return { success: false, error: 'Cannot match: Missing Purchase Order link.' };
        }

        // Update status
        await prisma.supplierInvoice.update({
            where: { id },
            data: { status: 'MATCHED' }
        });

        revalidatePath('/finance/invoices');
        return { success: true };
    } catch (e) {
        return { success: false, error: 'Matching failed' };
    }
}
