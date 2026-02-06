'use client';

import React, { useState, useEffect } from 'react';
import { ArrowLeft, Save } from 'lucide-react';
import Link from 'next/link';
import { createInvoice } from '@/actions/finance-actions';
import { getSuppliers } from '@/actions/master-data-actions';
import { getPOs } from '@/actions/po-actions';
import { getReceivingReports } from '@/actions/receiving-actions';

export default function CreateInvoicePage() {
    const [suppliers, setSuppliers] = useState<any[]>([]);
    const [orders, setOrders] = useState<any[]>([]);
    const [grns, setGrns] = useState<any[]>([]);

    // Form
    const [invoiceNo, setInvoiceNo] = useState('');
    const [supplierId, setSupplierId] = useState('');
    const [poId, setPoId] = useState('');
    const [grnId, setGrnId] = useState('');
    const [amount, setAmount] = useState(0);

    useEffect(() => {
        async function load() {
            const [s, o, g] = await Promise.all([
                getSuppliers(),
                getPOs(),
                getReceivingReports()
            ]);
            setSuppliers(s);
            // Open/Approved POs only ideally
            setOrders(o);
            setGrns(g);
        }
        load();
    }, []);

    // Filter POs and GRNs by selected supplier
    const filteredOrders = supplierId ? orders.filter(o => o.supplierId === Number(supplierId)) : orders;
    const filteredGrns = poId ? grns.filter(g => g.purchaseOrderId === Number(poId)) : (supplierId ? grns.filter(g => g.purchaseOrder?.supplierId === Number(supplierId)) : grns);

    // Auto-fill amount if PO selected (optional helper)
    useEffect(() => {
        if (poId) {
            const po = orders.find(o => o.id === Number(poId));
            if (po) setAmount(Number(po.totalAmount));
        }
    }, [poId]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        await createInvoice({
            invoiceNumber: invoiceNo,
            invoiceDate: new Date(),
            supplierId: Number(supplierId),
            purchaseOrderId: poId ? Number(poId) : undefined,
            receivingReportId: grnId ? Number(grnId) : undefined,
            totalAmount: amount
        });
        window.location.href = '/finance/invoices';
    };

    return (
        <div className="p-6 space-y-6 max-w-lg mx-auto">
            <header className="flex items-center gap-4 pb-6 border-b border-white/5">
                <Link href="/finance/invoices" className="p-2 hover:bg-white/10 rounded-full text-slate-400">
                    <ArrowLeft size={20} />
                </Link>
                <div>
                    <h1 className="text-2xl font-bold text-white">Record Invoice</h1>
                    <p className="text-slate-400">Enter supplier invoice details.</p>
                </div>
            </header>

            <form onSubmit={handleSubmit} className="space-y-4">
                <div className="bg-[#0a0a0f] border border-white/5 p-6 rounded-xl space-y-4">
                    <div>
                        <label className="text-xs text-slate-400 uppercase font-bold mb-1 block">Invoice Number</label>
                        <input className="w-full bg-black/20 border border-white/10 rounded p-2 text-white" value={invoiceNo} onChange={e => setInvoiceNo(e.target.value)} required placeholder="e.g. INV-2024-001" />
                    </div>

                    <div>
                        <label className="text-xs text-slate-400 uppercase font-bold mb-1 block">Supplier</label>
                        <select className="w-full bg-black/20 border border-white/10 rounded p-2 text-white" value={supplierId} onChange={e => { setSupplierId(e.target.value); setPoId(''); setGrnId(''); }} required>
                            <option value="">Select Supplier...</option>
                            {suppliers.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
                        </select>
                    </div>

                    <div>
                        <label className="text-xs text-slate-400 uppercase font-bold mb-1 block">Link Purchase Order</label>
                        <select className="w-full bg-black/20 border border-white/10 rounded p-2 text-white" value={poId} onChange={e => { setPoId(e.target.value); setGrnId(''); }} disabled={!supplierId}>
                            <option value="">Select PO...</option>
                            {filteredOrders.map((o: any) => <option key={o.id} value={o.id}>PO-{o.id} ({Number(o.totalAmount).toLocaleString()})</option>)}
                        </select>
                    </div>

                    <div>
                        <label className="text-xs text-slate-400 uppercase font-bold mb-1 block">Link Receiving Report (GRN)</label>
                        <select className="w-full bg-black/20 border border-white/10 rounded p-2 text-white" value={grnId} onChange={e => setGrnId(e.target.value)} disabled={!supplierId}>
                            <option value="">Select GRN...</option>
                            {filteredGrns.map((g: any) => <option key={g.id} value={g.id}>GRN-{g.id} ({new Date(g.receivedDate).toLocaleDateString()})</option>)}
                        </select>
                    </div>

                    <div>
                        <label className="text-xs text-slate-400 uppercase font-bold mb-1 block">Invoice Amount</label>
                        <input type="number" step="0.01" className="w-full bg-black/20 border border-white/10 rounded p-2 text-white font-mono text-lg" value={amount} onChange={e => setAmount(parseFloat(e.target.value))} required />
                    </div>
                </div>

                <div className="flex justify-end">
                    <button type="submit" className="bg-emerald-600 hover:bg-emerald-500 text-white px-8 py-3 rounded-lg font-bold flex items-center gap-2 w-full justify-center">
                        <Save size={18} /> Save Invoice
                    </button>
                </div>
            </form>
        </div>
    );
}
