'use server';

import { prisma } from '@/lib/prisma';
import { revalidatePath } from 'next/cache';
import { serialize } from '@/lib/utils';

export async function getProjects() {
    try {
        const projects = await prisma.project.findMany({
            include: { client: true },
            orderBy: { createdAt: 'desc' }
        });
        return serialize(projects);
    } catch (e) {
        return [];
    }
}

export async function createProject(data: {
    name: string;
    clientId: number;
    location?: string;
    budget: number;
    status?: string;
    duration?: string;
    totalFloorArea?: number;
    carportArea?: number;
}) {
    try {
        await prisma.project.create({
            data: {
                ...data,
                budget: data.budget,
                totalFloorArea: data.totalFloorArea,
                carportArea: data.carportArea
            }
        });
        revalidatePath('/projects');
        return { success: true };
    } catch (error) {
        return { success: false, error: 'Failed to create project' };
    }
}

export async function getProject(id: number) {
    try {
        const project = await prisma.project.findUnique({
            where: { id },
            include: { client: true }
        });

        if (!project) return null;

        return serialize(project);
    } catch (e) {
        return null;
    }
}

export async function updateProjectAreas(id: number, data: { totalFloorArea: number; carportArea: number }) {
    try {
        await prisma.project.update({
            where: { id },
            data
        });
        revalidatePath(`/projects/${id}/boq`);
        return { success: true };
    } catch (e) {
        return { success: false, error: 'Failed to update project areas' };
    }
}
