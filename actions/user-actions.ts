'use server';

import { prisma } from '@/lib/prisma';
import { UserRole } from '@prisma/client';
import { revalidatePath } from 'next/cache';

export async function createUser(data: any) {
    try {
        const { email, name, password, role } = data;

        // Basic validation
        if (!email || !name || !password || !role) {
            return { success: false, error: 'Missing required fields' };
        }

        // Check if user already exists
        const existingUser = await prisma.user.findUnique({
            where: { email },
        });

        if (existingUser) {
            return { success: false, error: 'User with this email already exists' };
        }

        await prisma.user.create({
            data: {
                email,
                name,
                password, // In a real app, you should hash this password!
                role: role as UserRole,
            },
        });

        revalidatePath('/settings');
        return { success: true };
    } catch (error) {
        console.error('Error creating user:', error);
        return { success: false, error: 'Failed to create user' };
    }
}

export async function updateUser(id: number, data: any) {
    try {
        const { email, name, password, role } = data;

        const updateData: any = {
            email,
            name,
            role: role as UserRole,
        };

        // Only update password if provided
        if (password && password.trim() !== '') {
            updateData.password = password; // In a real app, hash this!
        }

        await prisma.user.update({
            where: { id },
            data: updateData,
        });

        revalidatePath('/settings/users');
        return { success: true };
    } catch (error) {
        console.error('Error updating user:', error);
        return { success: false, error: 'Failed to update user' };
    }
}

export async function deleteUser(id: number) {
    try {
        await prisma.user.delete({
            where: { id },
        });

        revalidatePath('/settings/users');
        return { success: true };
    } catch (error) {
        console.error('Error deleting user:', error);
        return { success: false, error: 'Failed to delete user' };
    }
}
