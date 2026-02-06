'use client';

import React, { useState, useEffect } from 'react';
import { ClipboardCheck, Plus, Package, Truck } from 'lucide-react';
import Link from 'next/link';
import { getReceivingReports } from '@/actions/receiving-actions';

export default function ReceivingListPage() {
    const [reports, setReports] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        loadData();
    }, []);

    const loadData = async () => {
        setLoading(true);
        const data = await getReceivingReports();
        setReports(data);
        setLoading(false);
    };

    return (
        <div className="p-6 space-y-6">
            <header className="flex justify-between items-center pb-6 border-b border-white/5">
                <div>
                    <h1 className="text-2xl font-bold text-white flex items-center gap-3">
                        <ClipboardCheck className="text-orange-500" /> Goods Receipt (GRN)
                    </h1>
                    <p className="text-slate-400">Track received materials and deliveries.</p>
                </div>
                <Link href="/inventory/receiving/create">
                    <button className="bg-orange-600 hover:bg-orange-500 text-white px-4 py-2 rounded-lg flex items-center gap-2">
                        <Plus size={18} /> Receive Goods
                    </button>
                </Link>
            </header>

            {loading ? (
                <div className="text-center p-8 text-slate-500">Loading history...</div>
            ) : (
                <div className="grid gap-4">
                    {reports.map(rr => (
                        <div key={rr.id} className="bg-[#0a0a0f] border border-white/5 p-4 rounded-xl flex justify-between items-center hover:bg-white/5">
                            <div className="flex items-center gap-4">
                                <div className="p-3 bg-orange-500/10 rounded-lg text-orange-500">
                                    <Package size={24} />
                                </div>
                                <div>
                                    <div className="text-white font-bold text-lg">GRN-{rr.id.toString().padStart(4, '0')}</div>
                                    <div className="text-xs text-slate-400">Received on {new Date(rr.receivedDate).toLocaleDateString()}</div>
                                    <div className="text-xs text-slate-500 mt-1 flex items-center gap-2">
                                        <Truck size={12} /> PO-{rr.purchaseOrder?.id.toString().padStart(4, '0')} • {rr.purchaseOrder?.supplier?.name}
                                    </div>
                                </div>
                            </div>
                            <div className="text-right">
                                <div className="text-2xl font-bold text-white font-mono">{rr.items.length}</div>
                                <div className="text-xs text-slate-500 uppercase">Items</div>
                            </div>
                        </div>
                    ))}
                    {reports.length === 0 && (
                        <div className="text-center py-12 text-slate-500 bg-white/5 rounded-xl border border-dashed border-white/10">
                            No receiving reports found.
                        </div>
                    )}
                </div>
            )}
        </div>
    );
}
