import React from 'react';
import Link from 'next/link';
import { Settings, Users, Database, ChevronRight, Package, Building2 } from 'lucide-react';
import { Breadcrumbs } from '@/components/ui/Breadcrumbs';
import { LogoutButton } from '@/components/ui/LogoutButton';
import { Card } from '@/components/ui/Card';

export default function SettingsPage() {
    const menuItems = [
        {
            title: 'User Management',
            description: 'Manage system users, roles, and access permissions.',
            icon: Users,
            href: '/settings/users',
            color: 'text-blue-400',
            bg: 'bg-blue-500/10'
        },
        {
            title: 'Inventory Management',
            description: 'Configure inventory rules, stock alerts, and valuation.',
            icon: Package,
            href: '/settings/inventory',
            color: 'text-amber-400',
            bg: 'bg-amber-500/10'
        },
        {
            title: 'Backup & Recovery',
            description: 'Create database backups and restore system data.',
            icon: Database,
            href: '/settings/backup',
            color: 'text-emerald-400',
            bg: 'bg-emerald-500/10'
        },
        {
            title: 'System Configuration',
            description: 'Configure general settings, company details, and localization.',
            icon: Settings,
            href: '/settings/system',
            color: 'text-cyan-400',
            bg: 'bg-cyan-500/10'
        },

        {
            title: 'Master Data',
            description: 'Manage standard data lists and codes.',
            icon: Database,
            href: '/settings/master-data',
            color: 'text-rose-400',
            bg: 'bg-rose-500/10'
        },
        {
            title: 'Workflows',
            description: 'Configure process workflows and approvals.',
            icon: Settings,
            href: '/settings/workflows',
            color: 'text-indigo-400',
            bg: 'bg-indigo-500/10'
        }
    ];

    return (
        <div className="space-y-8">
            <div className="flex flex-col gap-2">
                <Breadcrumbs />
                <header className="pb-6 border-b border-white/5 flex justify-between items-end">
                    <div>
                        <h1 className="text-3xl font-bold text-white mb-2 font-[family-name:var(--font-outfit)] flex items-center gap-3">
                            <Settings className="text-cyan-500" /> System Settings
                        </h1>
                        <p className="text-slate-400">Select a category to manage your system.</p>
                    </div>
                    <LogoutButton />
                </header>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {menuItems.map((item) => {
                    const Icon = item.icon;
                    return (
                        <Link key={item.href} href={item.href}>
                            <Card hoverEffect className="h-full p-6 flex flex-col justify-between group cursor-pointer border-slate-700/50 bg-slate-800/20 hover:bg-slate-800/40 transition-all duration-300">
                                <div className="space-y-4">
                                    <div className={`w-12 h-12 rounded-xl ${item.bg} flex items-center justify-center ${item.color} group-hover:scale-110 transition-transform duration-300`}>
                                        <Icon size={24} />
                                    </div>
                                    <div>
                                        <h3 className="text-xl font-bold text-white mb-2 group-hover:text-cyan-400 transition-colors">
                                            {item.title}
                                        </h3>
                                        <p className="text-slate-400 text-sm leading-relaxed">
                                            {item.description}
                                        </p>
                                    </div>
                                </div>

                                <div className="mt-6 flex items-center text-sm font-medium text-slate-500 group-hover:text-cyan-400 transition-colors">
                                    Open Settings <ChevronRight size={16} className="ml-1 group-hover:translate-x-1 transition-transform" />
                                </div>
                            </Card>
                        </Link>
                    );
                })}
            </div>
        </div>
    );
}
