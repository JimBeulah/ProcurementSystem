import React from 'react';
import { prisma } from '@/lib/prisma';
import Link from 'next/link';
import {
    Trash2,
    CheckCircle,
    XCircle,
    RefreshCcw,
    Ban,
    Plus,
    FileText
} from 'lucide-react';

export const dynamic = 'force-dynamic';

async function getPurchaseRequests() {
    try {
        const requests = await prisma.purchaseOrder.findMany({
            where: {
                // Assuming "Intended" / "Requests" are primarily PENDING, 
                // but showing all for transparency or filtering as needed.
                // For now, let's fetch all so the table is populated.
            },
            include: {
                project: true,
                requester: true,
            },
            orderBy: {
                createdAt: 'desc',
            }
        });
        return requests;
    } catch (error) {
        console.error("Failed to fetch purchase requests:", error);
        return [];
    }
}

export default async function PurchaseRequestsPage() {
    const requests = await getPurchaseRequests();

    return (
        <div className="p-8 max-w-[1600px] mx-auto">
            <div className="flex justify-between items-center mb-8">
                <div>
                    <h1 className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-white to-slate-400">
                        Purchase Requests
                    </h1>
                    <p className="text-slate-400 mt-1">Manage intended purchases and approvals</p>
                </div>
                <Link
                    href="/purchasing/requests/new"
                    className="flex items-center gap-2 bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-500 hover:to-cyan-500 text-white px-4 py-2.5 rounded-lg active:scale-95 transition-all shadow-lg shadow-blue-500/20 font-medium"
                >
                    <Plus size={18} />
                    New Request
                </Link>
            </div>

            <div className="bg-[#0a0a0f]/50 backdrop-blur-xl border border-white/5 rounded-2xl overflow-hidden shadow-xl">
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="border-b border-white/5 bg-white/5">
                                <th className="p-4 text-xs font-semibold text-slate-400 uppercase tracking-widest">Request ID</th>
                                <th className="p-4 text-xs font-semibold text-slate-400 uppercase tracking-widest">Project Name</th>
                                <th className="p-4 text-xs font-semibold text-slate-400 uppercase tracking-widest">Status</th>
                                <th className="p-4 text-xs font-semibold text-slate-400 uppercase tracking-widest">Date</th>
                                <th className="p-4 text-xs font-semibold text-slate-400 uppercase tracking-widest">Total Amount</th>
                                <th className="p-4 text-xs font-semibold text-slate-400 uppercase tracking-widest text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-white/5">
                            {requests.length === 0 ? (
                                <tr>
                                    <td colSpan={6} className="p-8 text-center text-slate-500">
                                        <div className="flex flex-col items-center gap-3">
                                            <div className="w-12 h-12 rounded-full bg-slate-800/50 flex items-center justify-center">
                                                <FileText className="text-slate-600" size={24} />
                                            </div>
                                            <p>No purchase requests found.</p>
                                        </div>
                                    </td>
                                </tr>
                            ) : (
                                requests.map((request) => (
                                    <tr key={request.id} className="hover:bg-white/5 transition-colors group">
                                        <td className="p-4">
                                            <span className="font-mono text-sm text-slate-300">#{request.id.toString().padStart(6, '0')}</span>
                                        </td>
                                        <td className="p-4">
                                            <div className="flex items-center gap-2">
                                                <div className="w-2 h-2 rounded-full bg-cyan-500/50" />
                                                <span className="font-medium text-slate-200">{request.project?.name || 'N/A'}</span>
                                            </div>
                                        </td>
                                        <td className="p-4">
                                            <StatusBadge status={request.status} />
                                        </td>
                                        <td className="p-4 text-slate-400 text-sm">
                                            {new Date(request.createdAt).toLocaleDateString()}
                                        </td>
                                        <td className="p-4 font-medium text-slate-200">
                                            ₱{Number(request.totalAmount).toLocaleString('en-PH', { minimumFractionDigits: 2 })}
                                        </td>
                                        <td className="p-4 text-right">
                                            <div className="flex items-center justify-end gap-1 opacity-100 transition-opacity">
                                                <ActionButton
                                                    icon={<CheckCircle size={16} />}
                                                    tooltip="Approve"
                                                    className="text-emerald-400 hover:text-emerald-300 hover:bg-emerald-500/10"
                                                />
                                                <ActionButton
                                                    icon={<XCircle size={16} />}
                                                    tooltip="Disapprove"
                                                    className="text-amber-400 hover:text-amber-300 hover:bg-amber-500/10"
                                                />
                                                <ActionButton
                                                    icon={<Ban size={16} />}
                                                    tooltip="Void"
                                                    className="text-red-400 hover:text-red-300 hover:bg-red-500/10"
                                                />
                                                <div className="w-px h-4 bg-white/10 mx-1" />
                                                <ActionButton
                                                    icon={<RefreshCcw size={16} />}
                                                    tooltip="Reorder"
                                                    className="text-blue-400 hover:text-blue-300 hover:bg-blue-500/10"
                                                />
                                                <ActionButton
                                                    icon={<Trash2 size={16} />}
                                                    tooltip="Delete"
                                                    className="text-slate-400 hover:text-red-400 hover:bg-red-500/10"
                                                />
                                            </div>
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

function StatusBadge({ status }: { status: string }) {
    const styles = {
        PENDING: "bg-amber-500/10 text-amber-500 border-amber-500/20",
        APPROVED: "bg-emerald-500/10 text-emerald-500 border-emerald-500/20",
        DECLINED: "bg-red-500/10 text-red-500 border-red-500/20",
        COMPLETED: "bg-blue-500/10 text-blue-500 border-blue-500/20",
        CANCELLED: "bg-slate-500/10 text-slate-500 border-slate-500/20",
    };

    const style = styles[status as keyof typeof styles] || styles.PENDING;

    return (
        <span className={`px-2.5 py-1 rounded-full text-xs font-medium border ${style}`}>
            {status}
        </span>
    );
}

function ActionButton({ icon, tooltip, className }: { icon: React.ReactNode, tooltip: string, className: string }) {
    return (
        <button
            title={tooltip}
            className={`p-2 rounded-lg transition-all ${className}`}
        >
            {icon}
        </button>
    );
}
