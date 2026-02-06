'use client';

import React, { useState } from 'react';
import Sidebar from '@/components/layout/Sidebar';
import { Menu } from 'lucide-react';

import { Breadcrumbs } from '@/components/ui/Breadcrumbs';

export default function DashboardShell({
    children,
}: {
    children: React.ReactNode;
}) {
    const [sidebarOpen, setSidebarOpen] = useState(false);

    return (
        <div className="flex min-h-screen bg-[#0a0a0f]">
            {/* Sidebar */}
            <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

            {/* Main Content Wrapper */}
            <div className="flex-1 flex flex-col md:pl-72 transition-all duration-300">
                {/* Mobile Header */}
                <header className="md:hidden sticky top-0 z-40 bg-[#0a0a0f]/80 backdrop-blur-lg border-b border-white/5 p-4 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <button
                            onClick={() => setSidebarOpen(true)}
                            className="p-2 -ml-2 rounded-lg hover:bg-white/5 text-slate-300"
                        >
                            <Menu size={24} />
                        </button>
                        <span className="font-bold text-white tracking-tight">ProcureFlow</span>
                    </div>
                    <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-blue-500 to-cyan-500" />
                </header>

                <main className="flex-1 p-4 md:p-10 relative z-10 w-full max-w-[100vw] overflow-x-hidden">
                    {/* Ambient Background Glows Reuse */}
                    <div className="fixed top-0 right-0 w-[500px] h-[500px] bg-blue-500/10 rounded-full blur-[100px] -z-10 pointer-events-none" />
                    <div className="fixed bottom-0 right-[20%] w-[400px] h-[400px] bg-purple-500/5 rounded-full blur-[100px] -z-10 pointer-events-none" />

                    <Breadcrumbs />
                    {children}
                </main>
            </div>
        </div>
    );
}
