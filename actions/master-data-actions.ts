'use server';

import { prisma } from '@/lib/prisma';
import { revalidatePath } from 'next/cache';

// --- Suppliers ---
export async function getSuppliers() {
    return await prisma.supplier.findMany({ orderBy: { name: 'asc' } });
}

export async function createSupplier(data: { name: string; contactPerson?: string; email?: string; phone?: string; address?: string }) {
    await prisma.supplier.create({ data });
    revalidatePath('/settings/master-data');
    return { success: true };
}

// --- Materials ---
export async function getMaterials() {
    return await prisma.material.findMany({ orderBy: { name: 'asc' } });
}

export async function createMaterial(data: { code: string; name: string; description?: string; unit: string; category?: string }) {
    try {
        await prisma.material.create({ data });
        revalidatePath('/settings/master-data');
        return { success: true };
    } catch (e) {
        return { success: false, error: 'Material creation failed (duplicate code?)' };
    }
}

// --- Warehouses ---
export async function getWarehouses() {
    return await prisma.warehouse.findMany({ orderBy: { name: 'asc' } });
}

export async function createWarehouse(data: { name: string; location?: string; type: string }) {
    await prisma.warehouse.create({ data });
    revalidatePath('/settings/master-data');
    return { success: true };
}
