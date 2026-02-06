'use client';

import React, { useState, useEffect } from 'react';
import { ShoppingCart, Plus, Calendar, MapPin, Search } from 'lucide-react';
import Link from 'next/link';
import { getPOs } from '@/actions/po-actions';

export default function PoListPage() {
    const [pos, setPos] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        loadData();
    }, []);

    const loadData = async () => {
        setLoading(true);
        const data = await getPOs();
        setPos(data);
        setLoading(false);
    };

    return (
        <div className="p-6 space-y-6">
            <header className="flex justify-between items-center pb-6 border-b border-white/5">
                <div>
                    <h1 className="text-2xl font-bold text-white flex items-center gap-3">
                        <ShoppingCart className="text-blue-500" /> Purchase Orders
                    </h1>
                    <p className="text-slate-400">Track and manage supplier orders.</p>
                </div>
                <Link href="/purchasing/orders/create">
                    <button className="bg-blue-600 hover:bg-blue-500 text-white px-4 py-2 rounded-lg flex items-center gap-2">
                        <Plus size={18} /> Create PO
                    </button>
                </Link>
            </header>

            {loading ? (
                <div className="text-center p-8 text-slate-500">Loading orders...</div>
            ) : (
                <div className="grid gap-4">
                    {pos.map(po => (
                        <Link href={`/purchasing/orders/${po.id}`} key={po.id}>
                            <div className="bg-[#0a0a0f] border border-white/5 p-4 rounded-xl hover:bg-white/5 transition-colors group">
                                <div className="flex justify-between items-start mb-2">
                                    <div className="flex items-center gap-3">
                                        <div className="p-2 bg-blue-500/10 rounded-lg text-blue-400 font-bold group-hover:text-blue-300">
                                            PO-{po.id.toString().padStart(4, '0')}
                                        </div>
                                        <div>
                                            <div className="text-white font-bold">{po.supplier?.name || 'Unknown Supplier'}</div>
                                            <div className="text-xs text-slate-500 flex items-center gap-2">
                                                <Calendar size={12} /> {new Date(po.orderDate).toLocaleDateString()}
                                            </div>
                                        </div>
                                    </div>
                                    <div className={`px-3 py-1 rounded-full text-xs font-bold ${po.status === 'APPROVED' ? 'bg-emerald-500/10 text-emerald-400' :
                                            po.status === 'PENDING' ? 'bg-orange-500/10 text-orange-400' : 'bg-slate-700 text-slate-400'
                                        }`}>
                                        {po.status}
                                    </div>
                                </div>
                                <div className="flex justify-between items-end mt-2">
                                    <div className="text-sm text-slate-400 flex items-center gap-2">
                                        <MapPin size={14} /> {po.project?.name}
                                    </div>
                                    <div className="text-lg font-mono font-bold text-white">
                                        {Number(po.totalAmount).toLocaleString(undefined, { minimumFractionDigits: 2, style: 'currency', currency: 'PHP' })}
                                    </div>
                                </div>
                            </div>
                        </Link>
                    ))}
                    {pos.length === 0 && (
                        <div className="text-center py-12 text-slate-500 bg-white/5 rounded-xl border border-dashed border-white/10">
                            No Purchase Orders found.
                        </div>
                    )}
                </div>
            )}
        </div>
    );
}
