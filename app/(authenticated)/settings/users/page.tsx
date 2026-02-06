import React from 'react';
import { prisma } from '@/lib/prisma';
import UserManagementClient from '@/components/settings/UserManagementClient';
import { Breadcrumbs } from '@/components/ui/Breadcrumbs';
import { Users } from 'lucide-react';

export default async function AdminUsersPage() {
    const users = await prisma.user.findMany({
        orderBy: { createdAt: 'desc' },
    });

    return (
        <div className="space-y-6 p-6">
            <div className="flex flex-col gap-2">
                <Breadcrumbs />
                <header className="pb-6 border-b border-white/5">
                    <h1 className="text-2xl font-bold text-white mb-2 flex items-center gap-3">
                        <Users className="text-cyan-500" /> User Management
                    </h1>
                    <p className="text-slate-400">Manage system users, roles, and access permissions.</p>
                </header>
            </div>

            <UserManagementClient users={users} />
        </div>
    );
}
