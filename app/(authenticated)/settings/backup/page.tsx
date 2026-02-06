import React from 'react';
import BackupSettings from '@/components/settings/BackupSettings';
import { Database } from 'lucide-react';
import { Breadcrumbs } from '@/components/ui/Breadcrumbs';

export default function BackupPage() {
    return (
        <div className="space-y-6">
            <Breadcrumbs />
            <header className="pb-6 border-b border-white/5">
                <h1 className="text-2xl font-bold text-white mb-2 flex items-center gap-3">
                    <Database className="text-cyan-500" /> Backup & Recovery
                </h1>
                <p className="text-slate-400">Securely backup your database and restore from previous points.</p>
            </header>

            <BackupSettings />
        </div>
    );
}
