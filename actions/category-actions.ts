'use server';

import { prisma } from '@/lib/prisma';
import { revalidatePath } from 'next/cache';

export async function getCategories() {
    try {
        const categories = await prisma.category.findMany({
            orderBy: { createdAt: 'desc' },
        });
        return categories;
    } catch (error) {
        console.error('Failed to fetch categories:', error);
        return [];
    }
}

export async function createCategory(data: { name: string; description?: string }) {
    try {
        const category = await prisma.category.create({
            data: {
                name: data.name,
                description: data.description,
            },
        });
        revalidatePath('/settings/inventory');
        return { success: true, data: category };
    } catch (error: any) {
        console.error('Failed to create category:', error);
        return { success: false, error: error.message };
    }
}

export async function updateCategory(id: number, data: { name: string; description?: string }) {
    try {
        const category = await prisma.category.update({
            where: { id },
            data: {
                name: data.name,
                description: data.description,
            },
        });
        revalidatePath('/settings/inventory');
        return { success: true, data: category };
    } catch (error: any) {
        console.error('Failed to update category:', error);
        return { success: false, error: error.message };
    }
}

export async function deleteCategory(id: number) {
    try {
        await prisma.category.delete({
            where: { id },
        });
        revalidatePath('/settings/inventory');
        return { success: true };
    } catch (error: any) {
        console.error('Failed to delete category:', error);
        return { success: false, error: error.message };
    }
}
