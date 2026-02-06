'use server';

import { prisma } from '@/lib/prisma';
import { revalidatePath } from 'next/cache';

export async function getUnits() {
    try {
        return await prisma.unit.findMany({
            orderBy: { name: 'asc' }
        });
    } catch (e) {
        return [];
    }
}

export async function createUnit(data: { name: string; abbreviation: string }) {
    console.log('Creating unit:', data);
    try {
        const result = await prisma.unit.create({ data });
        console.log('Unit created:', result);
        revalidatePath('/settings/inventory');
        return { success: true };
    } catch (e: any) {
        console.error('Failed to create unit:', e);
        if (e.code === 'P2002') {
            return { success: false, error: 'A unit with this abbreviation already exists.' };
        }
        return { success: false, error: 'Failed to create unit: ' + (e.message || 'Unknown error') };
    }
}

export async function deleteUnit(id: number) {
    try {
        await prisma.unit.delete({ where: { id } });
        revalidatePath('/settings/inventory');
        return { success: true };
    } catch (e) {
        return { success: false, error: 'Failed to delete unit' };
    }
}

export async function updateUnit(id: number, data: { name: string; abbreviation: string }) {
    console.log('Updating unit:', id, data);
    try {
        await prisma.unit.update({
            where: { id },
            data,
        });
        revalidatePath('/settings/inventory');
        return { success: true };
    } catch (e: any) {
        console.error('Failed to update unit:', e);
        if (e.code === 'P2002') {
            return { success: false, error: 'A unit with this abbreviation already exists.' };
        }
        return { success: false, error: 'Failed to update unit: ' + (e.message || 'Unknown error') };
    }
}
