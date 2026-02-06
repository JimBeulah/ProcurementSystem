'use server';

import { prisma } from '@/lib/prisma';
import { revalidatePath } from 'next/cache';

export async function getProjectCostSummary() {
    try {
        const projects = await prisma.project.findMany({
            include: {
                purchaseOrders: {
                    where: { status: { notIn: ['DECLINED', 'CANCELLED'] } }
                },
                client: true
            }
        });

        // We also need disbursements to calculate "Paid" amount
        // Since disbursements are linked to PO, we can aggregate them via PO or fetch all
        // Fetching all disbursements might be heavy, but let's do it for now or query per project if needed.
        // Better: Aggregate in JS for now as dataset is small.

        const disbursements = await prisma.disbursement.findMany({
            where: { status: 'RELEASED' } // Only count released payments
        });

        const invoices = await prisma.supplierInvoice.findMany({
            where: { status: { not: 'CANCELLED' } }
        });

        const summary = projects.map(p => {
            const budget = Number(p.budget) || 0;

            // Committed: Total of Issued POs
            const committed = p.purchaseOrders.reduce((sum, po) => sum + Number(po.totalAmount), 0);

            // Invoiced: Total of Invoices linked to this Project's POs
            // We need to match invoices to project. Invoice -> PO -> Project
            const projectPoIds = p.purchaseOrders.map(po => po.id);
            const projectInvoices = invoices.filter(inv => inv.purchaseOrderId && projectPoIds.includes(inv.purchaseOrderId));
            const invoiced = projectInvoices.reduce((sum, inv) => sum + Number(inv.totalAmount), 0);

            // Paid: Total Disbursements linked to this Project's POs
            const projectDisbursements = disbursements.filter(d => d.purchaseOrderId && projectPoIds.includes(d.purchaseOrderId));
            const paid = projectDisbursements.reduce((sum, d) => sum + Number(d.amount), 0);

            const remaining = budget - committed;
            const progress = budget > 0 ? (committed / budget) * 100 : 0;

            return {
                id: p.id,
                name: p.name,
                clientName: p.client?.name || 'Internal',
                status: p.status,
                budget,
                committed,
                invoiced,
                paid,
                remaining,
                progress
            };
        });

        return summary.sort((a, b) => b.committed - a.committed);
    } catch (e) {
        console.error(e);
        return [];
    }
}
