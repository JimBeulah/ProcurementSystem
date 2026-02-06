'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { CheckCircle, XCircle, FileText, Clock, AlertCircle } from 'lucide-react';
import { approvePO } from '@/actions/po-actions';
import { approveMR, declineMR } from '@/actions/mr-actions';

interface ApprovalsClientProps {
    initialPos: any[];
    initialMrs: any[];
}

export default function PendingApprovalsClient({ initialPos, initialMrs }: ApprovalsClientProps) {
    const [pos, setPos] = useState(initialPos);
    const [mrs, setMrs] = useState(initialMrs);
    const [loading, setLoading] = useState(false);

    const handleApprovePO = async (id: number) => {
        if (!confirm('Approve this Purchase Order?')) return;
        setLoading(true);
        // Assuming user ID 2 for now (approver)
        await approvePO(id, 2);
        setPos(pos.filter(p => p.id !== id));
        setLoading(false);
    };

    const handleApproveMR = async (id: number) => {
        if (!confirm('Approve this Material Request?')) return;
        setLoading(true);
        await approveMR(id, 2);
        setMrs(mrs.filter(m => m.id !== id));
        setLoading(false);
    };

    const handleDeclineMR = async (id: number) => {
        if (!confirm('Decline this Material Request?')) return;
        setLoading(true);
        await declineMR(id, 2);
        setMrs(mrs.filter(m => m.id !== id));
        setLoading(false);
    };

    return (
        <div className="space-y-8">
            {/* Purchase Orders Section */}
            <section>
                <div className="flex items-center gap-2 mb-4">
                    <div className="w-2 h-8 bg-cyan-500 rounded-full"></div>
                    <h2 className="text-xl font-bold text-white">Purchase Orders</h2>
                    <span className="bg-white/10 text-xs px-2 py-1 rounded-full text-slate-400">{pos.length} Pending</span>
                </div>

                <div className="bg-[#0a0a0f]/50 backdrop-blur-xl border border-white/5 rounded-2xl overflow-hidden shadow-xl">
                    <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="border-b border-white/5 bg-white/5">
                                    <th className="p-4 text-xs font-semibold text-slate-400 uppercase tracking-widest pl-6">PO #</th>
                                    <th className="p-4 text-xs font-semibold text-slate-400 uppercase tracking-widest">Project Name</th>
                                    <th className="p-4 text-xs font-semibold text-slate-400 uppercase tracking-widest">Requester</th>
                                    <th className="p-4 text-xs font-semibold text-slate-400 uppercase tracking-widest">Date</th>
                                    <th className="p-4 text-xs font-semibold text-slate-400 uppercase tracking-widest">Amount</th>
                                    <th className="p-4 text-xs font-semibold text-slate-400 uppercase tracking-widest text-right pr-6">Action</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-white/5">
                                {pos.length === 0 ? (
                                    <tr>
                                        <td colSpan={6} className="p-8 text-center text-slate-500">No pending purchase orders.</td>
                                    </tr>
                                ) : (
                                    pos.map((po) => (
                                        <tr key={po.id} className="hover:bg-white/5 transition-colors group">
                                            <td className="p-4 pl-6 font-mono text-cyan-400">PO-{po.id.toString().padStart(4, '0')}</td>
                                            <td className="p-4 text-slate-200">{po.project?.name}</td>
                                            <td className="p-4 text-slate-300">{po.requester?.name}</td>
                                            <td className="p-4 text-slate-400 text-sm">{new Date(po.createdAt).toLocaleDateString()}</td>
                                            <td className="p-4 font-medium text-slate-200">
                                                ₱{Number(po.totalAmount).toLocaleString('en-PH', { minimumFractionDigits: 2 })}
                                            </td>
                                            <td className="p-4 text-right pr-6">
                                                <div className="flex items-center justify-end gap-2">
                                                    <Link href={`/purchasing/orders/${po.id}`}>
                                                        <button className="flex items-center gap-2 px-3 py-1.5 bg-blue-500/10 text-blue-400 hover:bg-blue-500/20 rounded-lg transition-colors text-sm font-medium">
                                                            <FileText size={14} />
                                                            View
                                                        </button>
                                                    </Link>
                                                    <button
                                                        onClick={() => handleApprovePO(po.id)}
                                                        disabled={loading}
                                                        className="flex items-center gap-2 px-3 py-1.5 bg-emerald-500/10 text-emerald-400 hover:bg-emerald-500/20 rounded-lg transition-colors text-sm font-medium"
                                                    >
                                                        <CheckCircle size={14} />
                                                        Approve
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </section>

            {/* Material Requests Section */}
            <section>
                <div className="flex items-center gap-2 mb-4">
                    <div className="w-2 h-8 bg-orange-500 rounded-full"></div>
                    <h2 className="text-xl font-bold text-white">Material Requests</h2>
                    <span className="bg-white/10 text-xs px-2 py-1 rounded-full text-slate-400">{mrs.length} Pending</span>
                </div>

                <div className="bg-[#0a0a0f]/50 backdrop-blur-xl border border-white/5 rounded-2xl overflow-hidden shadow-xl">
                    <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="border-b border-white/5 bg-white/5">
                                    <th className="p-4 text-xs font-semibold text-slate-400 uppercase tracking-widest pl-6">MR #</th>
                                    <th className="p-4 text-xs font-semibold text-slate-400 uppercase tracking-widest">Project Name</th>
                                    <th className="p-4 text-xs font-semibold text-slate-400 uppercase tracking-widest">Requester</th>
                                    <th className="p-4 text-xs font-semibold text-slate-400 uppercase tracking-widest">Date</th>
                                    <th className="p-4 text-xs font-semibold text-slate-400 uppercase tracking-widest">Items</th>
                                    <th className="p-4 text-xs font-semibold text-slate-400 uppercase tracking-widest text-right pr-6">Action</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-white/5">
                                {mrs.length === 0 ? (
                                    <tr>
                                        <td colSpan={6} className="p-8 text-center text-slate-500">No pending material requests.</td>
                                    </tr>
                                ) : (
                                    mrs.map((mr) => (
                                        <tr key={mr.id} className="hover:bg-white/5 transition-colors group">
                                            <td className="p-4 pl-6 font-mono text-orange-400">MR-{mr.id.toString().padStart(4, '0')}</td>
                                            <td className="p-4 text-slate-200">{mr.project?.name}</td>
                                            <td className="p-4 text-slate-300">{mr.requester?.name}</td>
                                            <td className="p-4 text-slate-400 text-sm">{new Date(mr.requestDate).toLocaleDateString()}</td>
                                            <td className="p-4 font-medium text-slate-200">
                                                {mr.items?.length || 0} items
                                            </td>
                                            <td className="p-4 text-right pr-6">
                                                <div className="flex items-center justify-end gap-2">
                                                    {/* Assuming View MR Link */}
                                                    <Link href={`/projects/${mr.projectId}/material-requests`}>
                                                        <button className="flex items-center gap-2 px-3 py-1.5 bg-blue-500/10 text-blue-400 hover:bg-blue-500/20 rounded-lg transition-colors text-sm font-medium">
                                                            <FileText size={14} />
                                                            View
                                                        </button>
                                                    </Link>
                                                    <button
                                                        onClick={() => handleApproveMR(mr.id)}
                                                        disabled={loading}
                                                        className="flex items-center gap-2 px-3 py-1.5 bg-emerald-500/10 text-emerald-400 hover:bg-emerald-500/20 rounded-lg transition-colors text-sm font-medium"
                                                    >
                                                        <CheckCircle size={14} />
                                                        Approve
                                                    </button>
                                                    <button
                                                        onClick={() => handleDeclineMR(mr.id)}
                                                        disabled={loading}
                                                        className="flex items-center gap-2 px-3 py-1.5 bg-red-500/10 text-red-400 hover:bg-red-500/20 rounded-lg transition-colors text-sm font-medium"
                                                    >
                                                        <XCircle size={14} />
                                                        Decline
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </section>
        </div>
    );
}
