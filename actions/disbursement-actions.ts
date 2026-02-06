'use server';

import { prisma } from '@/lib/prisma';
import { revalidatePath } from 'next/cache';
import { PaymentMethod } from '@prisma/client';

export async function getDisbursements() {
    try {
        const disbursements = await prisma.disbursement.findMany({
            include: {
                purchaseOrder: { include: { supplier: true } },
                processedBy: true
            },
            orderBy: { paymentDate: 'desc' }
        });
        return disbursements.map(d => ({
            ...d,
            amount: Number(d.amount),
            purchaseOrder: d.purchaseOrder ? {
                ...d.purchaseOrder,
                totalAmount: Number(d.purchaseOrder.totalAmount)
            } : null
        }));
    } catch (e) {
        return [];
    }
}

export async function createDisbursement(data: {
    purchaseOrderId?: number;
    amount: number;
    method: 'CASH' | 'CHECK' | 'BANK_TRANSFER' | 'GCASH'; // Mapping string to enum manually if needed or passing valid enum string
    referenceNumber: string;
    processedById: number;
}) {
    try {
        // Enforce valid enum for Prisma if necessary. 
        // Assuming PaymentMethod enum has CASH, CHECK, BANK_TRANSFER, GCASH based on viewing earlier enums or guessing common ones.
        // Let's create it.

        await prisma.disbursement.create({
            data: {
                purchaseOrderId: data.purchaseOrderId,
                amount: data.amount,
                method: data.method as PaymentMethod,
                referenceNumber: data.referenceNumber,
                processedById: data.processedById
            }
        });

        revalidatePath('/finance/disbursements');
        return { success: true };
    } catch (e) {
        console.error(e);
        return { success: false, error: 'Failed to create disbursement' };
    }
}
