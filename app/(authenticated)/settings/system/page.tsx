import React from 'react';
import SystemSettings from '@/components/settings/SystemSettings';
import { Settings } from 'lucide-react';
import { Breadcrumbs } from '@/components/ui/Breadcrumbs';

export default function SystemPage() {
    return (
        <div className="space-y-6">
            <Breadcrumbs />
            <header className="pb-6 border-b border-white/5">
                <h1 className="text-2xl font-bold text-white mb-2 flex items-center gap-3">
                    <Settings className="text-cyan-500" /> System Configuration
                </h1>
                <p className="text-slate-400">Configure general system preferences and localization settings.</p>
            </header>

            <SystemSettings />
        </div>
    );
}
