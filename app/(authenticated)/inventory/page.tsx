import React from 'react';
import AddMaterialButton from '@/components/inventory/AddMaterialButton';
import { prisma } from '@/lib/prisma';
import {
    Package,
    Search,
    MapPin,
    Calendar,
    Filter
} from 'lucide-react';

export const dynamic = 'force-dynamic';

async function getInventoryItems() {
    try {
        const inventory = await prisma.inventoryItem.findMany({
            include: {
                project: true,
            },
            orderBy: {
                materialName: 'asc',
            }
        });
        return inventory;
    } catch (error) {
        console.error("Failed to fetch inventory:", error);
        return [];
    }
}

export default async function InventoryPage() {
    const inventory = await getInventoryItems();

    return (
        <div className="p-8 max-w-[1600px] mx-auto">
            <div className="flex justify-between items-center mb-8">
                <div>
                    <h1 className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-white to-slate-400">
                        Inventory
                    </h1>
                    <p className="text-slate-400 mt-1">Track materials across all projects and warehouses</p>
                </div>
                <AddMaterialButton />
            </div>


            {/* Search and Filter Bar */}
            <div className="flex gap-4 mb-6">
                <div className="relative flex-1 max-w-md">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" size={18} />
                    <input
                        type="text"
                        placeholder="Search materials..."
                        className="w-full pl-10 pr-4 py-2.5 bg-[#0a0a0f]/50 border border-white/5 rounded-lg text-slate-200 placeholder:text-slate-500 focus:outline-none focus:border-cyan-500/50 transition-colors"
                    />
                </div>
                <button className="flex items-center gap-2 px-4 py-2.5 bg-[#0a0a0f]/50 border border-white/5 rounded-lg text-slate-400 hover:text-white hover:bg-white/5 transition-colors">
                    <Filter size={18} />
                    <span>Filter</span>
                </button>
            </div>

            <div className="bg-[#0a0a0f]/50 backdrop-blur-xl border border-white/5 rounded-2xl overflow-hidden shadow-xl">
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="border-b border-white/5 bg-white/5">
                                <th className="p-4 text-xs font-semibold text-slate-400 uppercase tracking-widest pl-6">Material Name</th>
                                <th className="p-4 text-xs font-semibold text-slate-400 uppercase tracking-widest">Project / Location</th>
                                <th className="p-4 text-xs font-semibold text-slate-400 uppercase tracking-widest text-right">Quantity</th>
                                <th className="p-4 text-xs font-semibold text-slate-400 uppercase tracking-widest">Unit</th>
                                <th className="p-4 text-xs font-semibold text-slate-400 uppercase tracking-widest text-right pr-6">Last Updated</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-white/5">
                            {inventory.length === 0 ? (
                                <tr>
                                    <td colSpan={5} className="p-8 text-center text-slate-500">
                                        <div className="flex flex-col items-center gap-3">
                                            <div className="w-12 h-12 rounded-full bg-slate-800/50 flex items-center justify-center">
                                                <Package className="text-slate-600" size={24} />
                                            </div>
                                            <p>No inventory items found.</p>
                                        </div>
                                    </td>
                                </tr>
                            ) : (
                                inventory.map((item) => (
                                    <tr key={item.id} className="hover:bg-white/5 transition-colors group">
                                        <td className="p-4 pl-6">
                                            <div className="font-medium text-slate-200">{item.materialName}</div>
                                        </td>
                                        <td className="p-4">
                                            <div className="flex items-center gap-2 text-slate-400">
                                                <MapPin size={14} className="text-slate-600" />
                                                <span>{item.project?.name || 'Central Warehouse'}</span>
                                            </div>
                                        </td>
                                        <td className="p-4 text-right">
                                            <div className="font-mono text-cyan-400 font-medium">
                                                {Number(item.quantity).toLocaleString()}
                                            </div>
                                        </td>
                                        <td className="p-4 text-slate-500 text-sm">
                                            {item.unit}
                                        </td>
                                        <td className="p-4 text-right pr-6">
                                            <div className="flex items-center justify-end gap-2 text-slate-500 text-sm">
                                                <Calendar size={14} />
                                                {new Date(item.lastUpdated).toLocaleDateString()}
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div >
    );
}
