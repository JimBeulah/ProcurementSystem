import React from 'react';
import { Package } from 'lucide-react';
import { Breadcrumbs } from '@/components/ui/Breadcrumbs';
import InventorySettingsWrapper from '@/components/settings/InventorySettingsWrapper';

export default function InventoryPage() {
    return (
        <div className="space-y-6">
            <Breadcrumbs />
            <header className="pb-6 border-b border-white/5">
                <h1 className="text-2xl font-bold text-white mb-2 flex items-center gap-3">
                    <Package className="text-cyan-500" /> Inventory Management
                </h1>
                <p className="text-slate-400">Configure inventory rules, stock alerts, and valuation.</p>
            </header>

            <InventorySettingsWrapper />
        </div>
    );
}
