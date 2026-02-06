import React from 'react';
import { prisma } from '@/lib/prisma';
import { getPendingMRs } from '@/actions/mr-actions';
import PendingApprovalsClient from '@/components/purchasing/PendingApprovalsClient';

export const dynamic = 'force-dynamic';

async function getPendingPos() {
    try {
        const approvals = await prisma.purchaseOrder.findMany({
            where: {
                status: 'PENDING'
            },
            include: {
                project: true,
                requester: true,
            },
            orderBy: {
                createdAt: 'asc',
            }
        });

        // Serialize Decimal fields to avoid client component issues
        return approvals.map(po => ({
            ...po,
            totalAmount: Number(po.totalAmount),
            project: po.project ? {
                ...po.project,
                budget: Number(po.project.budget)
            } : null
        }));
    } catch (error) {
        console.error("Failed to fetch approvals:", error);
        return [];
    }
}

async function getFormattedMrs() {
    const mrs = await getPendingMRs();
    // Serialize Decimals in MRs
    return mrs.map(mr => ({
        ...mr,
        project: mr.project ? { ...mr.project, budget: Number(mr.project.budget) } : null,
        items: mr.items.map(i => ({
            ...i,
            quantity: Number(i.quantity)
        }))
    }));
}

export default async function ApprovalsPage() {
    const [pos, mrs] = await Promise.all([getPendingPos(), getFormattedMrs()]);

    return (
        <div className="p-8 max-w-[1600px] mx-auto">
            <div className="flex justify-between items-center mb-8">
                <div>
                    <h1 className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-white to-slate-400">
                        Pending Approvals
                    </h1>
                    <p className="text-slate-400 mt-1">Review and approve purchase requests and orders</p>
                </div>
            </div>

            <PendingApprovalsClient initialPos={pos} initialMrs={mrs} />
        </div>
    );
}
