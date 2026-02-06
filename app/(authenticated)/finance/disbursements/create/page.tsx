'use client';

import React, { useState, useEffect } from 'react';
import { ArrowLeft, Save } from 'lucide-react';
import Link from 'next/link';
import { createDisbursement } from '@/actions/disbursement-actions';
import { getPOs } from '@/actions/po-actions';

export default function CreateDisbursementPage() {
    const [orders, setOrders] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    // Form
    const [poId, setPoId] = useState('');
    const [amount, setAmount] = useState(0);
    const [method, setMethod] = useState('CHECK');
    const [reference, setReference] = useState('');

    useEffect(() => {
        async function load() {
            setLoading(true);
            const data = await getPOs();
            // Filter POs needing payment (APPROVED)
            setOrders(data.filter((p: any) => p.status === 'APPROVED'));
            setLoading(false);
        }
        load();
    }, []);

    // Auto-fill amount from PO
    useEffect(() => {
        if (poId) {
            const po = orders.find(p => p.id === Number(poId));
            if (po) setAmount(Number(po.totalAmount));
        }
    }, [poId]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        await createDisbursement({
            purchaseOrderId: poId ? Number(poId) : undefined,
            amount,
            method: method as any,
            referenceNumber: reference,
            processedById: 1 // TODO: Session
        });
        window.location.href = '/finance/disbursements';
    };

    return (
        <div className="p-6 space-y-6 max-w-lg mx-auto">
            <header className="flex items-center gap-4 pb-6 border-b border-white/5">
                <Link href="/finance/disbursements" className="p-2 hover:bg-white/10 rounded-full text-slate-400">
                    <ArrowLeft size={20} />
                </Link>
                <div>
                    <h1 className="text-2xl font-bold text-white">Process Payment</h1>
                    <p className="text-slate-400">Release funds for purchase order.</p>
                </div>
            </header>

            <form onSubmit={handleSubmit} className="space-y-4">
                <div className="bg-[#0a0a0f] border border-white/5 p-6 rounded-xl space-y-4">
                    <div>
                        <label className="text-xs text-slate-400 uppercase font-bold mb-1 block">Link Purchase Order</label>
                        <select className="w-full bg-black/20 border border-white/10 rounded p-2 text-white" value={poId} onChange={e => setPoId(e.target.value)}>
                            <option value="">Select PO...</option>
                            {orders.map(o => (
                                <option key={o.id} value={o.id}>PO-{o.id} - {o.supplier?.name} ({Number(o.totalAmount).toLocaleString()})</option>
                            ))}
                        </select>
                    </div>

                    <div>
                        <label className="text-xs text-slate-400 uppercase font-bold mb-1 block">Payment Amount</label>
                        <input type="number" step="0.01" className="w-full bg-black/20 border border-white/10 rounded p-2 text-white font-mono text-lg" value={amount} onChange={e => setAmount(parseFloat(e.target.value))} required />
                    </div>

                    <div>
                        <label className="text-xs text-slate-400 uppercase font-bold mb-1 block">Payment Method</label>
                        <select className="w-full bg-black/20 border border-white/10 rounded p-2 text-white" value={method} onChange={e => setMethod(e.target.value)}>
                            <option value="CHECK">Check</option>
                            <option value="CASH">Cash</option>
                            <option value="BANK_TRANSFER">Bank Transfer</option>
                            <option value="GCASH">GCash</option>
                        </select>
                    </div>

                    <div>
                        <label className="text-xs text-slate-400 uppercase font-bold mb-1 block">Reference / Check No.</label>
                        <input className="w-full bg-black/20 border border-white/10 rounded p-2 text-white" value={reference} onChange={e => setReference(e.target.value)} required placeholder="e.g. C-123456" />
                    </div>
                </div>

                <div className="flex justify-end">
                    <button type="submit" className="bg-red-600 hover:bg-red-500 text-white px-8 py-3 rounded-lg font-bold flex items-center gap-2 w-full justify-center">
                        <Save size={18} /> Process Disbursement
                    </button>
                </div>
            </form>
        </div>
    );
}
