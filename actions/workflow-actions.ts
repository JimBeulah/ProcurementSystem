'use server';

import { prisma } from '@/lib/prisma';
import { UserRole } from '@prisma/client';
import { revalidatePath } from 'next/cache';

export async function getWorkflowRules() {
    try {
        const rules = await prisma.workflowRule.findMany({ orderBy: { minAmount: 'asc' } });
        return rules.map(rule => ({
            ...rule,
            minAmount: Number(rule.minAmount),
            maxAmount: rule.maxAmount ? Number(rule.maxAmount) : null,
        }));
    } catch (e) {
        return [];
    }
}

export async function createWorkflowRule(data: { processType: string; minAmount: number; maxAmount?: number; approverRole: UserRole; stepOrder?: number }) {
    try {
        await prisma.workflowRule.create({ data });
        revalidatePath('/settings/workflows');
        return { success: true };
    } catch (error) {
        return { success: false, error: 'Failed to create workflow rule' };
    }
}

export async function deleteWorkflowRule(id: number) {
    try {
        await prisma.workflowRule.delete({ where: { id } });
        revalidatePath('/settings/workflows');
        return { success: true };
    } catch (error) {
        return { success: false, error: 'Failed to delete rule' };
    }
}
