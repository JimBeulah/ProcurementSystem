'use client';

import React, { useState, useEffect } from 'react';
import { CreditCard, Plus, ArrowUpRight } from 'lucide-react';
import Link from 'next/link';
import { getDisbursements } from '@/actions/disbursement-actions';

export default function DisbursementListPage() {
    const [payments, setPayments] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        loadData();
    }, []);

    const loadData = async () => {
        setLoading(true);
        const data = await getDisbursements();
        setPayments(data);
        setLoading(false);
    };

    return (
        <div className="p-6 space-y-6">
            <header className="flex justify-between items-center pb-6 border-b border-white/5">
                <div>
                    <h1 className="text-2xl font-bold text-white flex items-center gap-3">
                        <CreditCard className="text-red-500" /> Disbursements
                    </h1>
                    <p className="text-slate-400">Track outgoing payments and releases.</p>
                </div>
                <Link href="/finance/disbursements/create">
                    <button className="bg-red-600 hover:bg-red-500 text-white px-4 py-2 rounded-lg flex items-center gap-2">
                        <Plus size={18} /> Process Payment
                    </button>
                </Link>
            </header>

            {loading ? <div className="text-center p-8 text-slate-500">Loading payments...</div> : (
                <div className="grid gap-4">
                    {payments.map(pay => (
                        <div key={pay.id} className="bg-[#0a0a0f] border border-white/5 p-4 rounded-xl flex justify-between items-center hover:bg-white/5">
                            <div className="flex items-center gap-4">
                                <div className="p-3 bg-red-500/10 rounded-lg text-red-500">
                                    <ArrowUpRight size={24} />
                                </div>
                                <div>
                                    <div className="text-white font-bold text-lg">
                                        {Number(pay.amount).toLocaleString(undefined, { style: 'currency', currency: 'PHP' })}
                                    </div>
                                    <div className="text-xs text-slate-400">Paid via {pay.method} • Ref: {pay.referenceNumber}</div>
                                    <div className="text-xs text-slate-500 mt-1">
                                        {pay.purchaseOrder ? `For PO-${pay.purchaseOrder.id} (${pay.purchaseOrder.supplier?.name})` : 'Direct Payment'}
                                    </div>
                                </div>
                            </div>
                            <div className="text-right">
                                <span className="text-xs px-2 py-1 rounded bg-slate-800 text-slate-400 border border-slate-700">{pay.status}</span>
                                <div className="text-xs text-slate-500 mt-2">{new Date(pay.paymentDate).toLocaleDateString()}</div>
                            </div>
                        </div>
                    ))}
                    {payments.length === 0 && (
                        <div className="text-center py-12 text-slate-500 bg-white/5 rounded-xl border border-dashed border-white/10">
                            No disbursements recorded.
                        </div>
                    )}
                </div>
            )}
        </div>
    );
}
