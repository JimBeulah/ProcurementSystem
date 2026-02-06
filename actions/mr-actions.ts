'use server';

import { prisma } from '@/lib/prisma';
import { revalidatePath } from 'next/cache';
import { MrStatus } from '@prisma/client';

export async function getProjectMRs(projectId: number) {
    try {
        const mrs = await prisma.materialRequest.findMany({
            where: { projectId },
            include: {
                items: true,
                requester: { select: { name: true } }
            },
            orderBy: { requestDate: 'desc' }
        });
        return mrs.map(mr => ({
            ...mr,
            items: mr.items.map(i => ({
                ...i,
                quantity: Number(i.quantity),
                materialUnitPrice: Number(i.materialUnitPrice || 0),
                laborUnitPrice: Number(i.laborUnitPrice || 0)
            }))
        }));
    } catch (e) {
        return [];
    }
}

export async function createMR(data: { projectId: number; requesterId: number; items: any[]; remarks?: string }) {
    try {
        // Transaction to create MR and Items
        await prisma.$transaction(async (tx) => {
            const mr = await tx.materialRequest.create({
                data: {
                    projectId: data.projectId,
                    requesterId: data.requesterId,
                    remarks: data.remarks,
                    status: 'PENDING'
                }
            });

            if (data.items && data.items.length > 0) {
                await tx.materialRequestItem.createMany({
                    data: data.items.map((item: any) => ({
                        materialRequestId: mr.id,
                        itemDescription: item.itemDescription,
                        quantity: parseFloat(item.quantity),
                        unit: item.unit,
                        materialUnitPrice: parseFloat(item.materialUnitPrice || 0),
                        laborUnitPrice: parseFloat(item.laborUnitPrice || 0)
                    }))
                });
            }
        });

        revalidatePath(`/projects/${data.projectId}/material-requests`);
        return { success: true };
    } catch (error) {
        console.error(error);
        return { success: false, error: 'Failed to create Material Request' };
    }
}

export async function approveMR(id: number, approverId: number) {
    try {
        await prisma.materialRequest.update({
            where: { id },
            data: { status: 'APPROVED', approverId }
        });
        revalidatePath('/purchasing/approvals');
        return { success: true };
    } catch (e) {
        return { success: false, error: 'Failed to approve MR' };
    }
}

export async function declineMR(id: number, approverId: number) {
    try {
        await prisma.materialRequest.update({
            where: { id },
            data: { status: 'REJECTED', approverId }
        });
        revalidatePath('/purchasing/approvals');
        return { success: true };
    } catch (e) {
        return { success: false, error: 'Failed to decline MR' };
    }
}

export async function getPendingMRs() {
    try {
        const mrs = await prisma.materialRequest.findMany({
            where: { status: 'PENDING' },
            include: {
                project: true,
                requester: true,
                items: true
            },
            orderBy: { requestDate: 'asc' }
        });
        return mrs.map(mr => ({
            ...mr,
            project: mr.project ? { ...mr.project, budget: Number(mr.project.budget) } : null,
            items: mr.items.map(i => ({
                ...i,
                quantity: Number(i.quantity),
                materialUnitPrice: Number(i.materialUnitPrice || 0),
                laborUnitPrice: Number(i.laborUnitPrice || 0)
            }))
        }));
    } catch (e) {
        return [];
    }
}
