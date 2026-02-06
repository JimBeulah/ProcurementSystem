'use server';

import { prisma } from '@/lib/prisma';
import { revalidatePath } from 'next/cache';

export async function getClients() {
    try {
        return await prisma.client.findMany({
            orderBy: { name: 'asc' },
            include: { _count: { select: { projects: true } } }
        });
    } catch (e) {
        return [];
    }
}

export async function createClient(data: { name: string; contactPerson?: string; contractType?: string; paymentTerms?: string }) {
    try {
        await prisma.client.create({ data });
        revalidatePath('/clients');
        return { success: true };
    } catch (error) {
        return { success: false, error: 'Failed to create client' };
    }
}

export async function updateClient(id: number, data: any) {
    try {
        await prisma.client.update({ where: { id }, data });
        revalidatePath('/clients');
        return { success: true };
    } catch (error) {
        return { success: false, error: 'Failed to update client' };
    }
}
