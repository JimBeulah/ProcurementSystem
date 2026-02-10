'use client';

import React, { useState, useEffect, use } from 'react';
import { FileText, ArrowLeft, Plus, CheckCircle, Smartphone, Building2 } from 'lucide-react';
import Link from 'next/link';
import { getRFQ, addQuotation, awardQuotation } from '@/actions/rfq-actions';
import { getSuppliers } from '@/actions/master-data-actions';

interface RfqDetailsProps {
    params: Promise<{ id: string }>;
}

export default function RfqDetailsPage({ params }: RfqDetailsProps) {
    const { id } = use(params);
    const rfqId = parseInt(id);
    const [rfq, setRfq] = useState<any>(null);
    const [suppliers, setSuppliers] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [showQuoteModal, setShowQuoteModal] = useState(false);

    // Manual Quote Entry Form
    const [quoteForm, setQuoteForm] = useState({
        supplierId: '',
        prices: {} as Record<string, number>
    });

    useEffect(() => {
        loadData();
    }, []);

    const loadData = async () => {
        setLoading(true);
        const [rfqData, suppData] = await Promise.all([
            getRFQ(rfqId),
            getSuppliers()
        ]);
        setRfq(rfqData);
        setSuppliers(suppData);
        setLoading(false);
    };

    const handleSubmitQuote = async (e: React.FormEvent) => {
        e.preventDefault();
        const items = rfq.items.map((item: any) => ({
            materialName: item.materialName,
            quantity: Number(item.quantity),
            unitPrice: Number(quoteForm.prices[item.id] || 0),
            remarks: 'Manual Entry'
        }));

        await addQuotation({
            rfqId,
            supplierId: Number(quoteForm.supplierId),
            items
        });
        setShowQuoteModal(false);
        setQuoteForm({ supplierId: '', prices: {} });
        loadData();
    };

    const handleAward = async (quoteId: number) => {
        if (confirm('Are you sure you want to award this supplier? This will close the RFQ.')) {
            await awardQuotation(rfqId, quoteId);
            loadData();
        }
    };

    if (loading) return <div className="p-12 text-center text-slate-500">Loading RFQ details...</div>;
    if (!rfq) return <div className="p-12 text-center text-red-500">RFQ not found</div>;

    return (
        <div className="p-6 space-y-6">
            <header className="flex items-center justify-between pb-6 border-b border-white/5">
                <div className="flex items-center gap-4">
                    <Link href="/purchasing/rfq" className="p-2 hover:bg-white/10 rounded-full text-slate-400">
                        <ArrowLeft size={20} />
                    </Link>
                    <div>
                        <h1 className="text-2xl font-bold text-white flex items-center gap-3">
                            {rfq.title}
                            <span className={`text-sm px-2 py-1 rounded border ${rfq.status === 'OPEN' ? 'border-cyan-500 text-cyan-500' :
                                rfq.status === 'AWARDED' ? 'border-emerald-500 text-emerald-500' :
                                    'border-slate-500 text-slate-500'
                                }`}>{rfq.status}</span>
                        </h1>
                        <p className="text-slate-400 text-sm">Created on {new Date(rfq.createdAt).toLocaleDateString()} • Due {new Date(rfq.dueDate).toLocaleDateString()}</p>
                    </div>
                </div>
                {rfq.status === 'OPEN' && (
                    <button
                        onClick={() => setShowQuoteModal(true)}
                        className="bg-cyan-600 hover:bg-cyan-500 text-white px-4 py-2 rounded-lg flex items-center gap-2"
                    >
                        <Plus size={18} /> Add Quotation
                    </button>
                )}
            </header>

            {/* Content Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

                {/* Left: RFQ Items */}
                <div className="bg-[#0a0a0f] border border-white/5 rounded-xl p-6 h-fit">
                    <h2 className="text-lg font-bold text-white mb-4">Requested Items</h2>
                    <div className="space-y-4">
                        {rfq.items.map((item: any) => (
                            <div key={item.id} className="flex justify-between items-center bg-white/5 p-4 rounded-lg">
                                <div>
                                    <div className="text-white font-medium">{item.materialName}</div>
                                    <div className="text-xs text-slate-500">{item.quantity} {item.unit}</div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Right: Quotation Comparison */}
                <div className="lg:col-span-2 space-y-4">
                    <h2 className="text-lg font-bold text-white">Received Quotations</h2>

                    {/* Comparison Table */}
                    <div className="overflow-x-auto bg-[#0a0a0f] border border-white/5 rounded-xl">
                        <table className="w-full text-left text-sm text-slate-400">
                            <thead className="bg-white/5 text-slate-200 uppercase text-xs">
                                <tr>
                                    <th className="p-4">Supplier</th>
                                    <th className="p-4 text-center">Total Amount (PHP)</th>
                                    <th className="p-4 text-center">Date</th>
                                    <th className="p-4 text-center">Status</th>
                                    <th className="p-4 text-right">Action</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-white/5">
                                {rfq.quotations.map((quote: any) => (
                                    <tr key={quote.id} className={`hover:bg-white/5 ${quote.isSelected ? 'bg-emerald-500/5' : ''}`}>
                                        <td className="p-4">
                                            <div className="font-bold text-white flex items-center gap-2">
                                                <Building2 size={16} className="text-slate-500" />
                                                {quote.supplier.name}
                                            </div>
                                            <div className="text-xs text-slate-500">{quote.items.length} items quoted</div>
                                        </td>
                                        <td className="p-4 text-center font-mono text-white text-base">
                                            {Number(quote.totalAmount).toLocaleString(undefined, { minimumFractionDigits: 2 })}
                                        </td>
                                        <td className="p-4 text-center">
                                            {new Date(quote.quoteDate).toLocaleDateString()}
                                        </td>
                                        <td className="p-4 text-center">
                                            {quote.isSelected ? (
                                                <span className="text-emerald-400 font-bold flex items-center justify-center gap-1">
                                                    <CheckCircle size={14} /> AWARDED
                                                </span>
                                            ) : (
                                                <span className="text-slate-500">Submitted</span>
                                            )}
                                        </td>
                                        <td className="p-4 text-right">
                                            {rfq.status === 'OPEN' && !quote.isSelected && (
                                                <button
                                                    onClick={() => handleAward(quote.id)}
                                                    className="bg-emerald-600/20 hover:bg-emerald-600/40 text-emerald-400 hover:text-emerald-300 px-3 py-1.5 rounded-lg text-xs font-bold transition-colors"
                                                >
                                                    Award Purchase Order
                                                </button>
                                            )}
                                            {quote.isSelected && (
                                                <Link href={`/purchasing/orders/create?rfqId=${rfqId}&quoteId=${quote.id}`}>
                                                    <button className="bg-emerald-600 hover:bg-emerald-500 text-white px-3 py-1.5 rounded-lg text-xs font-bold transition-colors">
                                                        Create PO
                                                    </button>
                                                </Link>
                                            )}
                                        </td>
                                    </tr>
                                ))}
                                {rfq.quotations.length === 0 && (
                                    <tr>
                                        <td colSpan={5} className="p-8 text-center opacity-50">No quotations received yet.</td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>

            </div>

            {/* Add Quote Modal */}
            {showQuoteModal && (
                <div className="fixed inset-0 flex items-center justify-center z-50 p-4">
                    {/* Backdrop */}
                    <div
                        className="absolute inset-0 bg-black/40 backdrop-blur-md transition-opacity"
                        onClick={() => setShowQuoteModal(false)}
                    />

                    {/* Modal Content */}
                    <div className="relative z-10 bg-[#1a1a20]/80 backdrop-blur-xl p-6 rounded-xl w-full max-w-lg border border-white/10 space-y-4 max-h-[90vh] overflow-y-auto shadow-2xl">
                        <h2 className="text-xl font-bold text-white">Enter Supplier Quotation</h2>
                        <form onSubmit={handleSubmitQuote} className="space-y-4">
                            <div>
                                <label className="text-xs text-slate-400 uppercase font-bold mb-1 block">Supplier</label>
                                <select
                                    className="w-full bg-black/20 border border-white/10 rounded p-2 text-white"
                                    value={quoteForm.supplierId}
                                    onChange={e => setQuoteForm({ ...quoteForm, supplierId: e.target.value })}
                                    required
                                >
                                    <option value="">Select Supplier...</option>
                                    {suppliers.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
                                </select>
                            </div>

                            <div className="bg-white/5 rounded-lg p-4 space-y-4">
                                <h3 className="text-white font-bold text-sm">Unit Prices (PHP)</h3>
                                {rfq.items.map((item: any) => (
                                    <div key={item.id} className="flex items-center gap-4">
                                        <div className="flex-1 text-sm text-slate-300">
                                            {item.materialName} <span className="text-slate-500">({item.quantity} {item.unit})</span>
                                        </div>
                                        <input
                                            type="number"
                                            placeholder="Unit Price"
                                            className="w-32 bg-black/40 border border-white/10 rounded p-2 text-right text-white font-mono"
                                            onChange={e => setQuoteForm({
                                                ...quoteForm,
                                                prices: { ...quoteForm.prices, [item.id]: parseFloat(e.target.value) }
                                            })}
                                            required
                                        />
                                    </div>
                                ))}
                            </div>

                            <div className="flex justify-end gap-3 pt-4">
                                <button type="button" onClick={() => setShowQuoteModal(false)} className="px-4 py-2 text-slate-400 hover:text-white">Cancel</button>
                                <button type="submit" className="bg-emerald-600 px-4 py-2 rounded text-white font-medium hover:bg-emerald-500">Submit Quotation</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}
