'use client';

import React, { useState, useEffect } from 'react';
import { ArrowLeft, CheckSquare, Search } from 'lucide-react';
import Link from 'next/link';
import { createReceivingReport } from '@/actions/receiving-actions';
import { getPOs } from '@/actions/po-actions';

// We'll fetch APPROVED POs
// We need an action to get details of a specific PO if selected, including its items
import { getPO } from '@/actions/po-actions';

export default function CreateReceivingPage() {
    const [orders, setOrders] = useState<any[]>([]);
    const [selectedPoId, setSelectedPoId] = useState('');
    const [poDetails, setPoDetails] = useState<any>(null);
    const [items, setItems] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    // Form
    const [deliveryNote, setDeliveryNote] = useState('');
    const [notes, setNotes] = useState('');

    useEffect(() => {
        async function load() {
            const allPos = await getPOs();
            // Filter only APPROVED
            setOrders(allPos.filter((p: any) => p.status === 'APPROVED'));
            setLoading(false);
        }
        load();
    }, []);

    useEffect(() => {
        async function fetchDetails() {
            if (!selectedPoId) {
                setPoDetails(null);
                setItems([]);
                return;
            }
            const data = await getPO(parseInt(selectedPoId));
            if (data) {
                setPoDetails(data);
                // Initialize receiving items with FULL quantity from PO (assuming full delivery)
                // User can edit quantity down
                setItems(data.items.map((i: any) => ({
                    materialName: i.materialName,
                    quantityOrdered: Number(i.quantity),
                    quantityReceived: Number(i.quantity),
                    status: 'GOOD'
                })));
            }
        }
        fetchDetails();
    }, [selectedPoId]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!selectedPoId) return;

        await createReceivingReport({
            purchaseOrderId: parseInt(selectedPoId),
            receivedById: 1, // TODO: Session
            deliveryNoteNo: deliveryNote,
            notes,
            items: items.map(i => ({
                materialName: i.materialName,
                quantityReceived: i.quantityReceived,
                status: i.status
            }))
        });
        window.location.href = '/inventory/receiving';
    };

    if (loading) return <div className="p-12 text-center text-slate-500">Loading...</div>;

    return (
        <div className="p-6 space-y-6 max-w-4xl mx-auto">
            <header className="flex items-center gap-4 pb-6 border-b border-white/5">
                <Link href="/inventory/receiving" className="p-2 hover:bg-white/10 rounded-full text-slate-400">
                    <ArrowLeft size={20} />
                </Link>
                <div>
                    <h1 className="text-2xl font-bold text-white">Receive Goods</h1>
                    <p className="text-slate-400">Record delivery against Purchase Order.</p>
                </div>
            </header>

            <form onSubmit={handleSubmit} className="space-y-6">
                <div className="bg-[#0a0a0f] border border-white/5 p-6 rounded-xl space-y-4">
                    <div>
                        <label className="text-xs text-slate-400 uppercase font-bold mb-1 block">Select Purchase Order</label>
                        <select
                            className="w-full bg-black/20 border border-white/10 rounded p-2 text-white"
                            value={selectedPoId}
                            onChange={e => setSelectedPoId(e.target.value)}
                            required
                        >
                            <option value="">Select PO...</option>
                            {orders.map(po => (
                                <option key={po.id} value={po.id}>
                                    PO-{po.id.toString().padStart(4, '0')} — {po.supplier?.name} ({new Date(po.orderDate).toLocaleDateString()})
                                </option>
                            ))}
                        </select>
                    </div>

                    {poDetails && (
                        <div className="grid grid-cols-2 gap-4 pt-4 border-t border-white/5">
                            <div>
                                <label className="text-xs text-slate-400 uppercase font-bold mb-1 block">Delivery Note / Ref #</label>
                                <input className="w-full bg-black/20 border border-white/10 rounded p-2 text-white" value={deliveryNote} onChange={e => setDeliveryNote(e.target.value)} placeholder="e.g. DR-12345" />
                            </div>
                            <div>
                                <label className="text-xs text-slate-400 uppercase font-bold mb-1 block">Received Date</label>
                                <input type="date" className="w-full bg-black/20 border border-white/10 rounded p-2 text-white" defaultValue={new Date().toISOString().split('T')[0]} disabled={true} />
                            </div>
                            <div className="col-span-2">
                                <label className="text-xs text-slate-400 uppercase font-bold mb-1 block">Notes</label>
                                <input className="w-full bg-black/20 border border-white/10 rounded p-2 text-white" value={notes} onChange={e => setNotes(e.target.value)} />
                            </div>
                        </div>
                    )}
                </div>

                {poDetails && items.length > 0 && (
                    <div className="bg-[#0a0a0f] border border-white/5 p-6 rounded-xl">
                        <h2 className="text-lg font-bold text-white mb-4">Items to Receive</h2>
                        <div className="space-y-4">
                            {items.map((item, idx) => (
                                <div key={idx} className="flex gap-4 items-center bg-white/5 p-4 rounded-lg">
                                    <div className="flex-1">
                                        <div className="text-white font-medium">{item.materialName}</div>
                                        <div className="text-xs text-slate-500">Ordered: {item.quantityOrdered}</div>
                                    </div>
                                    <div className="w-32">
                                        <label className="text-xs text-slate-500 block mb-1">Received Qty</label>
                                        <input
                                            type="number"
                                            className="w-full bg-black/40 border border-white/10 rounded p-2 text-white font-mono text-center"
                                            value={item.quantityReceived}
                                            onChange={e => {
                                                const newItems = [...items];
                                                newItems[idx].quantityReceived = parseFloat(e.target.value);
                                                setItems(newItems);
                                            }}
                                            min="0"
                                            max={item.quantityOrdered}
                                        />
                                    </div>
                                    <div className="w-32">
                                        <label className="text-xs text-slate-500 block mb-1">Status</label>
                                        <select
                                            className="w-full bg-black/40 border border-white/10 rounded p-2 text-white text-sm"
                                            value={item.status}
                                            onChange={e => {
                                                const newItems = [...items];
                                                newItems[idx].status = e.target.value;
                                                setItems(newItems);
                                            }}
                                        >
                                            <option value="GOOD">Good</option>
                                            <option value="DAMAGED">Damaged</option>
                                            <option value="WRONG_ITEM">Wrong Item</option>
                                        </select>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                <div className="flex justify-end">
                    <button type="submit" disabled={!selectedPoId} className="bg-emerald-600 hover:bg-emerald-500 text-white px-8 py-3 rounded-lg font-bold flex items-center gap-2 disabled:opacity-50">
                        <CheckSquare size={18} /> Confirm Receipt
                    </button>
                </div>
            </form>
        </div>
    );
}
