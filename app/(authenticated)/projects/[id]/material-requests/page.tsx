'use client';

import React, { useState, useEffect, use } from 'react';
import { FileText, Plus, Truck, AlertCircle } from 'lucide-react';
import { getProjectMRs, createMR } from '@/actions/mr-actions';
import { getProjectBoq } from '@/actions/boq-actions';

interface MrPageProps {
    params: Promise<{ id: string }>;
}

export default function ProjectMrPage({ params }: MrPageProps) {
    const { id } = use(params);
    const projectId = parseInt(id);

    // Mock user for now (Requester) - In real app, get from session
    const currentUserId = 1;

    // State
    const [requests, setRequests] = useState<any[]>([]);
    const [boqItems, setBoqItems] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);

    // New MR Form
    const [selectedMaterial, setSelectedMaterial] = useState('');
    const [requestQty, setRequestQty] = useState(0);
    const [requestUnit, setRequestUnit] = useState('');
    const [materialUnitPrice, setMaterialUnitPrice] = useState(0);
    const [laborUnitPrice, setLaborUnitPrice] = useState(0);
    const [remarks, setRemarks] = useState('');
    const [cart, setCart] = useState<any[]>([]);

    useEffect(() => {
        loadData();
    }, [projectId]);

    const loadData = async () => {
        setLoading(true);
        const [mrData, boqData] = await Promise.all([
            getProjectMRs(projectId),
            getProjectBoq(projectId)
        ]);
        setRequests(mrData);
        setBoqItems(boqData);
        setLoading(false);
    };

    const addToCart = () => {
        if (!selectedMaterial || requestQty <= 0) return;

        setCart([...cart, {
            itemDescription: selectedMaterial,
            quantity: requestQty,
            unit: requestUnit,
            materialUnitPrice: materialUnitPrice,
            laborUnitPrice: laborUnitPrice
        }]);

        // Reset inputs
        setSelectedMaterial('');
        setRequestQty(0);
        setRequestUnit('');
        setMaterialUnitPrice(0);
        setLaborUnitPrice(0);
    };

    const handleSubmit = async () => {
        if (cart.length === 0) return;

        await createMR({
            projectId,
            requesterId: currentUserId,
            items: cart,
            remarks
        });

        setShowModal(false);
        setCart([]);
        setRemarks('');
        loadData();
    };

    const handleMaterialSelect = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const matName = e.target.value;
        setSelectedMaterial(matName);
        const boqItem = boqItems.find(b => b.itemDescription === matName);
        if (boqItem) {
            setRequestUnit(boqItem.unit);
            setMaterialUnitPrice(Number(boqItem.materialUnitPrice));
            setLaborUnitPrice(Number(boqItem.laborUnitPrice));
        }
    };

    return (
        <div className="p-6 space-y-6">
            <header className="flex justify-between items-center pb-6 border-b border-white/5">
                <div>
                    <h1 className="text-2xl font-bold text-white flex items-center gap-3">
                        <Truck className="text-purple-500" /> Material Requests
                    </h1>
                    <p className="text-slate-400">Request materials from warehouse or procurement.</p>
                </div>
                <button
                    onClick={() => setShowModal(true)}
                    className="bg-purple-600 hover:bg-purple-500 text-white px-4 py-2 rounded-lg flex items-center gap-2"
                >
                    <Plus size={18} /> Creates Request
                </button>
            </header>

            <div className="bg-[#0a0a0f] border border-white/5 rounded-xl overflow-hidden shadow-2xl">
                <table className="w-full text-left text-slate-300 border-collapse">
                    <thead className="bg-white/5 text-slate-500 uppercase text-[10px] font-bold tracking-wider sticky top-0 z-10">
                        <tr>
                            <th className="p-4 border-b border-white/10 min-w-[250px]">Item Description</th>
                            <th className="p-4 border-b border-white/10 text-center">Unit</th>
                            <th className="p-4 border-b border-white/10 text-center">Qty</th>
                            <th className="p-4 border-b border-white/10 text-right">Mat. Unit</th>
                            <th className="p-4 border-b border-white/10 text-right">Mat. Total</th>
                            <th className="p-4 border-b border-white/10 text-right">Lab. Unit</th>
                            <th className="p-4 border-b border-white/10 text-right">Lab. Total</th>
                            <th className="p-4 border-b border-white/10 text-right">Total</th>
                        </tr>
                    </thead>
                    <tbody>
                        {requests.map(mr => (
                            <React.Fragment key={mr.id}>
                                {/* Parent MR Row / Header */}
                                <tr className="bg-purple-600/10 border-b border-white/5">
                                    <td colSpan={8} className="p-4">
                                        <div className="flex justify-between items-center">
                                            <div className="flex items-center gap-4">
                                                <span className="text-purple-400 font-black text-sm uppercase tracking-widest">MR #{mr.id}</span>
                                                <span className="text-slate-500 text-[10px] font-medium">| Request Date: {new Date(mr.requestDate).toLocaleDateString()}</span>
                                                <span className="text-slate-500 text-[10px] font-medium">| Requested by: {mr.requester?.name}</span>
                                                {mr.remarks && (
                                                    <span className="text-slate-600 text-[10px] italic truncate max-w-sm">"{mr.remarks}"</span>
                                                )}
                                            </div>
                                            <span className={`text-[10px] px-2 py-0.5 rounded font-bold border ${mr.status === 'PENDING' ? 'border-yellow-500/50 text-yellow-500 bg-yellow-500/5' :
                                                mr.status === 'APPROVED' ? 'border-emerald-500/50 text-emerald-500 bg-emerald-500/5' :
                                                    'border-slate-500/50 text-slate-500 bg-slate-500/5'
                                                }`}>
                                                {mr.status}
                                            </span>
                                        </div>
                                    </td>
                                </tr>
                                {/* Child Material Rows */}
                                {mr.items.map((item: any) => {
                                    const matTotal = (Number(item.materialUnitPrice) || 0) * Number(item.quantity);
                                    const labTotal = (Number(item.laborUnitPrice) || 0) * Number(item.quantity);
                                    const rowTotal = matTotal + labTotal;
                                    return (
                                        <tr key={item.id} className="border-b border-white/[0.02] hover:bg-white/[0.02] transition-colors group">
                                            <td className="p-4 pl-8 text-white relative">
                                                <div className="absolute left-4 top-1/2 -translate-y-1/2 w-2 h-2 border-l border-b border-white/10 rounded-bl-sm"></div>
                                                {item.itemDescription}
                                            </td>
                                            <td className="p-4 text-center text-slate-400 text-xs uppercase">{item.unit}</td>
                                            <td className="p-4 text-center font-mono text-cyan-400">{item.quantity}</td>
                                            <td className="p-4 text-right font-mono text-[11px] italic text-slate-500">
                                                {Number(item.materialUnitPrice).toLocaleString(undefined, { minimumFractionDigits: 2 })}
                                            </td>
                                            <td className="p-4 text-right font-mono text-slate-300">
                                                {matTotal.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                                            </td>
                                            <td className="p-4 text-right font-mono text-[11px] italic text-slate-600">
                                                {Number(item.laborUnitPrice).toLocaleString(undefined, { minimumFractionDigits: 2 })}
                                            </td>
                                            <td className="p-4 text-right font-mono text-slate-500">
                                                {labTotal.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                                            </td>
                                            <td className="p-4 text-right font-mono text-emerald-400 font-bold">
                                                {rowTotal.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                                            </td>
                                        </tr>
                                    );
                                })}
                            </React.Fragment>
                        ))}
                    </tbody>
                </table>
                {requests.length === 0 && !loading && (
                    <div className="p-20 text-center">
                        <Truck size={48} className="mx-auto text-slate-800 mb-4" />
                        <p className="text-slate-600 uppercase tracking-widest font-bold">No Material Requests Found</p>
                    </div>
                )}
            </div>

            {/* Create MR Modal */}
            {showModal && (
                <div className="fixed inset-0 flex items-center justify-center z-50 p-4">
                    {/* Backdrop */}
                    <div
                        className="absolute inset-0 bg-black/40 backdrop-blur-md transition-opacity"
                        onClick={() => setShowModal(false)}
                    />

                    {/* Modal Content */}
                    <div className="relative z-10 bg-[#1a1a20]/80 backdrop-blur-xl p-6 rounded-xl w-full max-w-lg border border-white/10 space-y-4 shadow-2xl">
                        <h2 className="text-xl font-bold text-white">New Material Request</h2>

                        {/* Horizontal Item Entry Row */}
                        <div className="bg-white/5 border border-white/10 rounded-lg p-4 transition-all hover:bg-white/[0.07]">
                            <div className="grid grid-cols-1 md:grid-cols-4 lg:grid-cols-7 gap-3 items-end">
                                <div className="md:col-span-2 lg:col-span-3">
                                    <label className="text-[10px] text-slate-400 uppercase font-bold mb-1 block tracking-wider">Item Description</label>
                                    <input
                                        list="boq-item-suggestions"
                                        className="w-full bg-[#0a0a0f] border border-white/10 rounded p-2 text-white text-xs focus:border-purple-500 focus:outline-none transition-colors h-9"
                                        value={selectedMaterial}
                                        onChange={handleMaterialSelect}
                                        placeholder="Type or select material..."
                                    />
                                    <datalist id="boq-item-suggestions">
                                        {boqItems.map(item => (
                                            <option key={item.id} value={item.itemDescription}>
                                                Budget: {Number(item.quantity).toLocaleString()} {item.unit}
                                            </option>
                                        ))}
                                    </datalist>
                                </div>
                                <div className="lg:col-span-1">
                                    <label className="text-[10px] text-slate-400 uppercase font-bold mb-1 block tracking-wider">Unit</label>
                                    <input className="w-full bg-[#0a0a0f] border border-white/10 rounded p-2 text-white text-xs h-9" value={requestUnit} onChange={e => setRequestUnit(e.target.value)} />
                                </div>
                                <div className="lg:col-span-1">
                                    <label className="text-[10px] text-slate-400 uppercase font-bold mb-1 block tracking-wider">Qty</label>
                                    <input type="number" step="0.01" className="w-full bg-[#0a0a0f] border border-white/10 rounded p-2 text-white text-xs h-9" value={requestQty || ''} onChange={e => setRequestQty(parseFloat(e.target.value))} />
                                </div>
                                <div className="lg:col-span-1">
                                    <label className="text-[10px] text-slate-400 uppercase font-bold mb-1 block tracking-wider">Mat. Unit</label>
                                    <input type="number" step="0.01" className="w-full bg-[#0a0a0f] border border-white/10 rounded p-2 text-white text-xs h-9" value={materialUnitPrice || ''} onChange={e => setMaterialUnitPrice(parseFloat(e.target.value))} />
                                </div>
                                <div className="lg:col-span-1">
                                    <label className="text-[10px] text-slate-400 uppercase font-bold mb-1 block tracking-wider">Lab. Unit</label>
                                    <input type="number" step="0.01" className="w-full bg-[#0a0a0f] border border-white/10 rounded p-2 text-white text-xs h-9" value={laborUnitPrice || ''} onChange={e => setLaborUnitPrice(parseFloat(e.target.value))} />
                                </div>
                            </div>

                            <div className="flex justify-between items-center mt-4 pt-4 border-t border-white/5">
                                <div className="flex gap-6">
                                    <div>
                                        <span className="text-[9px] text-slate-500 uppercase block font-black">Mat. Total</span>
                                        <span className="text-xs font-mono text-slate-300">₱ {((requestQty || 0) * (materialUnitPrice || 0)).toLocaleString(undefined, { minimumFractionDigits: 2 })}</span>
                                    </div>
                                    <div>
                                        <span className="text-[9px] text-slate-500 uppercase block font-black">Lab. Total</span>
                                        <span className="text-xs font-mono text-slate-300">₱ {((requestQty || 0) * (laborUnitPrice || 0)).toLocaleString(undefined, { minimumFractionDigits: 2 })}</span>
                                    </div>
                                    <div className="border-l border-white/10 pl-6">
                                        <span className="text-[9px] text-purple-400 uppercase block font-black">Row Total</span>
                                        <span className="text-sm font-black font-mono text-purple-400">₱ {((requestQty || 0) * ((materialUnitPrice || 0) + (laborUnitPrice || 0))).toLocaleString(undefined, { minimumFractionDigits: 2 })}</span>
                                    </div>
                                </div>
                                <button type="button" onClick={addToCart} className="bg-purple-600 hover:bg-purple-500 text-white px-6 py-2 rounded font-black text-[10px] uppercase transition-all active:scale-95 shadow-lg shadow-purple-600/20">
                                    Add Line Item
                                </button>
                            </div>
                        </div>

                        {/* Cart (Draft Items) */}
                        <div className="border border-white/5 rounded-lg overflow-x-auto bg-black/20">
                            <table className="w-full text-[10px] text-left">
                                <thead className="bg-white/5 text-slate-500 uppercase font-black tracking-widest text-[9px]">
                                    <tr>
                                        <th className="p-3 pl-4">Material / Item</th>
                                        <th className="p-3 text-center">Unit</th>
                                        <th className="p-3 text-center">Qty</th>
                                        <th className="p-3 text-right">Mat. Total</th>
                                        <th className="p-3 text-right">Lab. Total</th>
                                        <th className="p-3 text-right">Total</th>
                                        <th className="p-3 text-center w-8"></th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-white/[0.03]">
                                    {cart.map((item, idx) => {
                                        const matTotal = (item.materialUnitPrice || 0) * item.quantity;
                                        const labTotal = (item.laborUnitPrice || 0) * item.quantity;
                                        const total = matTotal + labTotal;
                                        return (
                                            <tr key={idx} className="hover:bg-white/[0.02] transition-colors">
                                                <td className="p-3 pl-4 text-white font-medium">{item.itemDescription}</td>
                                                <td className="p-3 text-center text-slate-500">{item.unit}</td>
                                                <td className="p-3 text-center text-cyan-400 font-mono">{item.quantity}</td>
                                                <td className="p-3 text-right text-slate-400 font-mono">{matTotal.toLocaleString(undefined, { minimumFractionDigits: 2 })}</td>
                                                <td className="p-3 text-right text-slate-500 font-mono">{labTotal.toLocaleString(undefined, { minimumFractionDigits: 2 })}</td>
                                                <td className="p-3 text-right text-purple-400 font-black font-mono">{total.toLocaleString(undefined, { minimumFractionDigits: 2 })}</td>
                                                <td className="p-3 text-center">
                                                    <button
                                                        onClick={() => setCart(cart.filter((_, i) => i !== idx))}
                                                        className="text-slate-600 hover:text-red-400 transition-colors font-bold text-base"
                                                    >
                                                        &times;
                                                    </button>
                                                </td>
                                            </tr>
                                        );
                                    })}
                                </tbody>
                            </table>
                            {cart.length === 0 && <div className="text-center text-slate-600 text-[10px] py-10 uppercase font-black tracking-[0.2em] opacity-30">Draft is Empty</div>}
                        </div>

                        <div>
                            <label className="text-xs text-slate-400 uppercase font-bold mb-1 block">Remarks</label>
                            <textarea className="w-full bg-black/20 border border-white/10 rounded p-2 text-white h-20" value={remarks} onChange={e => setRemarks(e.target.value)}></textarea>
                        </div>

                        <div className="flex justify-end gap-3 pt-4">
                            <button onClick={() => setShowModal(false)} className="px-4 py-2 text-slate-400 hover:text-white">Cancel</button>
                            <button onClick={handleSubmit} disabled={cart.length === 0} className="bg-purple-600 px-4 py-2 rounded text-white font-medium hover:bg-purple-500 disabled:opacity-50">Submit Request</button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
