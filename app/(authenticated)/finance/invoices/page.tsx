'use client';

import React, { useState, useEffect } from 'react';
import { FileText, Plus, CheckCircle2, AlertCircle } from 'lucide-react';
import Link from 'next/link';
import { getInvoices, matchInvoice } from '@/actions/finance-actions';

export default function InvoiceListPage() {
    const [invoices, setInvoices] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        loadData();
    }, []);

    const loadData = async () => {
        setLoading(true);
        const data = await getInvoices();
        setInvoices(data);
        setLoading(false);
    };

    const handleMatch = async (id: number) => {
        if (confirm('Perform 3-Way Match validation?')) {
            const res = await matchInvoice(id);
            if (res.success) {
                loadData();
            } else {
                alert(res.error);
            }
        }
    };

    return (
        <div className="p-6 space-y-6">
            <header className="flex justify-between items-center pb-6 border-b border-white/5">
                <div>
                    <h1 className="text-2xl font-bold text-white flex items-center gap-3">
                        <FileText className="text-emerald-500" /> Supplier Invoices
                    </h1>
                    <p className="text-slate-400">Manage payable invoices and 3-way matching.</p>
                </div>
                <Link href="/finance/invoices/create">
                    <button className="bg-emerald-600 hover:bg-emerald-500 text-white px-4 py-2 rounded-lg flex items-center gap-2">
                        <Plus size={18} /> Record Invoice
                    </button>
                </Link>
            </header>

            {loading ? <div className="text-center p-8 text-slate-500">Loading invoices...</div> : (
                <div className="overflow-x-auto bg-[#0a0a0f] border border-white/5 rounded-xl">
                    <table className="w-full text-left text-sm text-slate-400">
                        <thead className="bg-white/5 text-slate-200 uppercase text-xs">
                            <tr>
                                <th className="p-4">Invoice #</th>
                                <th className="p-4">Supplier</th>
                                <th className="p-4">Ref Docs</th>
                                <th className="p-4 text-right">Amount</th>
                                <th className="p-4 text-center">Status</th>
                                <th className="p-4 text-right">Action</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-white/5">
                            {invoices.map(inv => (
                                <tr key={inv.id} className="hover:bg-white/5">
                                    <td className="p-4 font-bold text-white">{inv.invoiceNumber}</td>
                                    <td className="p-4">{inv.supplier?.name}</td>
                                    <td className="p-4 text-xs space-y-1">
                                        {inv.purchaseOrderId ? <div className="text-blue-400">PO-{inv.purchaseOrderId}</div> : <div className="text-red-900/50">Missing PO</div>}
                                        {inv.receivingReportId ? <div className="text-orange-400">GRN-{inv.receivingReportId}</div> : <div className="text-slate-700">No GRN</div>}
                                    </td>
                                    <td className="p-4 text-right font-mono text-white">
                                        {Number(inv.totalAmount).toLocaleString(undefined, { minimumFractionDigits: 2 })}
                                    </td>
                                    <td className="p-4 text-center">
                                        <span className={`px-2 py-1 rounded text-xs border ${inv.status === 'MATCHED' ? 'border-emerald-500 text-emerald-500' :
                                                inv.status === 'PAID' ? 'border-blue-500 text-blue-500' :
                                                    'border-yellow-500 text-yellow-500'
                                            }`}>{inv.status}</span>
                                    </td>
                                    <td className="p-4 text-right">
                                        {inv.status === 'PENDING' && (
                                            <button
                                                onClick={() => handleMatch(inv.id)}
                                                className="text-emerald-400 hover:text-emerald-300 flex items-center gap-1 ml-auto"
                                                title="Perform 3-Way Match"
                                            >
                                                <CheckCircle2 size={16} /> Validate
                                            </button>
                                        )}
                                    </td>
                                </tr>
                            ))}
                            {invoices.length === 0 && (
                                <tr>
                                    <td colSpan={6} className="p-8 text-center opacity-50">No invoices recorded.</td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
}
