import React from 'react';
import { prisma } from '@/lib/prisma';
import {
    Package,
    Truck,
    Calendar,
    Search,
    Filter,
    ClipboardList
} from 'lucide-react';

export const dynamic = 'force-dynamic';

async function getReceivingReports() {
    try {
        const reports = await prisma.receivingReport.findMany({
            include: {
                purchaseOrder: {
                    include: {
                        project: true,
                        supplier: true,
                    }
                },
                receivedBy: true,
                items: true,
            },
            orderBy: {
                receivedDate: 'desc',
            }
        });
        return reports;
    } catch (error) {
        console.error("Failed to fetch receiving reports:", error);
        return [];
    }
}

export default async function ReceivingPage() {
    const reports = await getReceivingReports();

    return (
        <div className="p-8 max-w-[1600px] mx-auto">
            <div className="flex justify-between items-center mb-8">
                <div>
                    <h1 className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-white to-slate-400">
                        Receiving
                    </h1>
                    <p className="text-slate-400 mt-1">Track delivered items and receiving reports</p>
                </div>
            </div>

            <div className="flex gap-4 mb-6">
                <div className="relative flex-1 max-w-md">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" size={18} />
                    <input
                        type="text"
                        placeholder="Search receiving reports..."
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
                                <th className="p-4 text-xs font-semibold text-slate-400 uppercase tracking-widest pl-6">RR ID</th>
                                <th className="p-4 text-xs font-semibold text-slate-400 uppercase tracking-widest">PO Reference</th>
                                <th className="p-4 text-xs font-semibold text-slate-400 uppercase tracking-widest">Project</th>
                                <th className="p-4 text-xs font-semibold text-slate-400 uppercase tracking-widest">Received By</th>
                                <th className="p-4 text-xs font-semibold text-slate-400 uppercase tracking-widest">Date Received</th>
                                <th className="p-4 text-xs font-semibold text-slate-400 uppercase tracking-widest">Items</th>
                                <th className="p-4 text-xs font-semibold text-slate-400 uppercase tracking-widest text-right pr-6">Status</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-white/5">
                            {reports.length === 0 ? (
                                <tr>
                                    <td colSpan={7} className="p-8 text-center text-slate-500">
                                        <div className="flex flex-col items-center gap-3">
                                            <div className="w-12 h-12 rounded-full bg-slate-800/50 flex items-center justify-center">
                                                <Truck className="text-slate-600" size={24} />
                                            </div>
                                            <p>No receiving reports found.</p>
                                        </div>
                                    </td>
                                </tr>
                            ) : (
                                reports.map((report) => (
                                    <tr key={report.id} className="hover:bg-white/5 transition-colors group">
                                        <td className="p-4 pl-6">
                                            <span className="font-mono text-cyan-400 font-medium">#{report.id.toString().padStart(6, '0')}</span>
                                        </td>
                                        <td className="p-4">
                                            <div className="flex flex-col">
                                                <span className="font-mono text-xs text-slate-400">PO-{report.purchaseOrder?.id.toString().padStart(6, '0')}</span>
                                                <span className="text-sm text-slate-300">{report.purchaseOrder?.supplier?.name || '-'}</span>
                                            </div>
                                        </td>
                                        <td className="p-4">
                                            <span className="font-medium text-slate-200">{report.purchaseOrder?.project?.name || 'N/A'}</span>
                                        </td>
                                        <td className="p-4">
                                            <span className="text-slate-300">{report.receivedBy?.name || 'Unknown'}</span>
                                        </td>
                                        <td className="p-4 text-slate-400 text-sm">
                                            <div className="flex items-center gap-2">
                                                <Calendar size={14} />
                                                {new Date(report.receivedDate).toLocaleDateString()}
                                            </div>
                                        </td>
                                        <td className="p-4">
                                            <div className="flex items-center gap-2 text-slate-300">
                                                <ClipboardList size={16} />
                                                <span>{report.items.length} items</span>
                                            </div>
                                        </td>
                                        <td className="p-4 text-right pr-6">
                                            <span className="px-2.5 py-1 rounded-full text-xs font-medium border bg-emerald-500/10 text-emerald-500 border-emerald-500/20">
                                                RECEIVED
                                            </span>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}
