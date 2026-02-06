'use client';

import React, { useState, useEffect, use } from 'react';
import { ArrowLeft, CheckCircle, Printer, Download, ShoppingCart } from 'lucide-react';
import Link from 'next/link';
import { getPO, approvePO } from '@/actions/po-actions';

interface PoDetailsProps {
    params: Promise<{ id: string }>;
}

export default function PoDetailsPage({ params }: PoDetailsProps) {
    const { id } = use(params);
    const poId = parseInt(id);
    const [po, setPo] = useState<any>(null);
    const [loading, setLoading] = useState(true);

    // Mock Current User for Approval
    const currentUser = { id: 2, role: 'PROJECT_MANAGER' };

    useEffect(() => {
        loadData();
    }, []);

    const loadData = async () => {
        setLoading(true);
        const data = await getPO(poId);
        setPo(data);
        setLoading(false);
    };

    const handleApprove = async () => {
        if (confirm('Approve this Purchase Order?')) {
            await approvePO(poId, currentUser.id);
            loadData();
        }
    };

    if (loading) return <div className="p-12 text-center text-slate-500">Loading PO...</div>;
    if (!po) return <div className="p-12 text-center text-red-500">PO Not Found</div>;

    return (
        <div className="p-6 space-y-6 max-w-5xl mx-auto">
            <header className="flex justify-between items-start pb-6 border-b border-white/5">
                <div className="flex items-center gap-4">
                    <Link href="/purchasing/orders" className="p-2 hover:bg-white/10 rounded-full text-slate-400">
                        <ArrowLeft size={20} />
                    </Link>
                    <div>
                        <h1 className="text-2xl font-bold text-white flex items-center gap-3">
                            PO-{po.id.toString().padStart(4, '0')}
                            <span className={`text-sm px-2 py-1 rounded border ${po.status === 'APPROVED' ? 'border-emerald-500 text-emerald-500' :
                                'border-orange-500 text-orange-500'
                                }`}>{po.status}</span>
                        </h1>
                        <p className="text-slate-400">Issued on {new Date(po.orderDate).toLocaleDateString()}</p>
                    </div>
                </div>
                <div className="flex gap-2">
                    <button className="bg-white/5 hover:bg-white/10 text-white px-4 py-2 rounded-lg flex items-center gap-2">
                        <Printer size={18} /> Print
                    </button>
                    {po.status === 'PENDING' && (
                        <button
                            onClick={handleApprove}
                            className="bg-emerald-600 hover:bg-emerald-500 text-white px-4 py-2 rounded-lg flex items-center gap-2"
                        >
                            <CheckCircle size={18} /> Approve PO
                        </button>
                    )}
                </div>
            </header>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-[#0a0a0f] border border-white/5 p-6 rounded-xl">
                    <h2 className="text-xs text-slate-500 uppercase font-bold mb-4">Supplier Details</h2>
                    <div className="text-white font-bold text-lg mb-1">{po.supplier?.name}</div>
                    <div className="text-slate-400 text-sm">{po.supplier?.address || 'No address'}</div>
                    <div className="text-slate-400 text-sm">{po.supplier?.contactPerson}</div>
                </div>
                <div className="bg-[#0a0a0f] border border-white/5 p-6 rounded-xl">
                    <h2 className="text-xs text-slate-500 uppercase font-bold mb-4">Delivery To</h2>
                    <div className="text-white font-bold text-lg mb-1">{po.project?.name}</div>
                    <div className="text-slate-400 text-sm">{po.project?.location}</div>
                </div>
            </div>

            <div className="bg-[#0a0a0f] border border-white/5 rounded-xl overflow-hidden">
                <table className="w-full text-left text-sm text-slate-400">
                    <thead className="bg-white/5 text-slate-200 uppercase text-xs">
                        <tr>
                            <th className="p-4">Item</th>
                            <th className="p-4 text-center">Qty</th>
                            <th className="p-4 text-right">Unit Price</th>
                            <th className="p-4 text-right">Total</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-white/5">
                        {po.items.map((item: any) => (
                            <tr key={item.id}>
                                <td className="p-4">
                                    <div className="text-white font-medium">{item.materialName}</div>
                                    <div className="text-xs">{item.description}</div>
                                </td>
                                <td className="p-4 text-center font-mono">{item.quantity}</td>
                                <td className="p-4 text-right font-mono">{Number(item.unitPrice).toLocaleString()}</td>
                                <td className="p-4 text-right font-mono text-white font-bold">
                                    {(Number(item.quantity) * Number(item.unitPrice)).toLocaleString()}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                    <tfoot className="bg-white/5 font-bold text-white">
                        <tr>
                            <td colSpan={3} className="p-4 text-right">TOTAL AMOUNT (PHP)</td>
                            <td className="p-4 text-right text-emerald-400 text-xl">
                                {Number(po.totalAmount).toLocaleString(undefined, { minimumFractionDigits: 2 })}
                            </td>
                        </tr>
                    </tfoot>
                </table>
            </div>

            {po.approver && (
                <div className="flex justify-end text-sm text-emerald-400 items-center gap-2">
                    <CheckCircle size={14} /> Approved by {po.approver.name}
                </div>
            )}
        </div>
    );
}
