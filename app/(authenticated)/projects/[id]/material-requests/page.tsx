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

            <div className="grid gap-4">
                {requests.map(mr => (
                    <div key={mr.id} className="bg-[#0a0a0f] border border-white/5 p-6 rounded-xl">
                        <div className="flex justify-between items-start mb-4">
                            <div>
                                <h3 className="text-lg font-bold text-white flex items-center gap-3">
                                    MR #{mr.id}
                                    <span className={`text-xs px-2 py-1 rounded border ${mr.status === 'PENDING' ? 'border-yellow-500 text-yellow-500' :
                                        mr.status === 'APPROVED' ? 'border-emerald-500 text-emerald-500' :
                                            'border-slate-500 text-slate-500'
                                        }`}>{mr.status}</span>
                                </h3>
                                <p className="text-sm text-slate-400">Requested by {mr.requester?.name} on {new Date(mr.requestDate).toLocaleDateString()}</p>
                            </div>
                            {mr.status === 'PENDING' && (
                                <div className="text-xs text-orange-400 flex items-center gap-1">
                                    <AlertCircle size={12} /> Awaiting Approval
                                </div>
                            )}
                        </div>

                        <div className="bg-white/5 rounded-lg overflow-x-auto">
                            <table className="w-full text-sm text-left text-slate-300 border-collapse">
                                <thead className="bg-white/5 text-slate-500 uppercase text-[10px] font-bold">
                                    <tr>
                                        <th className="p-3 border-r border-white/10 min-w-[200px]">Item Description</th>
                                        <th className="p-3 border-r border-white/10 text-center">Unit</th>
                                        <th className="p-3 border-r border-white/10 text-center">Qty</th>
                                        <th className="p-3 border-r border-white/10 text-right">Mat. Unit</th>
                                        <th className="p-3 border-r border-white/10 text-right">Mat. Total</th>
                                        <th className="p-3 border-r border-white/10 text-right">Lab. Unit</th>
                                        <th className="p-3 border-r border-white/10 text-right">Lab. Total</th>
                                        <th className="p-3 text-right">Total</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {mr.items.map((item: any) => {
                                        const matTotal = (Number(item.materialUnitPrice) || 0) * Number(item.quantity);
                                        const labTotal = (Number(item.laborUnitPrice) || 0) * Number(item.quantity);
                                        const rowTotal = matTotal + labTotal;
                                        return (
                                            <tr key={item.id} className="border-t border-white/5 text-xs">
                                                <td className="p-3 border-r border-white/5 text-white">{item.itemDescription}</td>
                                                <td className="p-3 border-r border-white/5 text-center">{item.unit}</td>
                                                <td className="p-3 border-r border-white/5 text-center font-mono text-cyan-400">{item.quantity}</td>
                                                <td className="p-3 border-r border-white/5 text-right font-mono italic">
                                                    {Number(item.materialUnitPrice).toLocaleString(undefined, { minimumFractionDigits: 2 })}
                                                </td>
                                                <td className="p-3 border-r border-white/5 text-right font-mono">
                                                    {matTotal.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                                                </td>
                                                <td className="p-3 border-r border-white/5 text-right font-mono italic text-slate-500">
                                                    {Number(item.laborUnitPrice).toLocaleString(undefined, { minimumFractionDigits: 2 })}
                                                </td>
                                                <td className="p-3 border-r border-white/5 text-right font-mono text-slate-500">
                                                    {labTotal.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                                                </td>
                                                <td className="p-3 text-right font-mono text-emerald-400 font-bold">
                                                    {rowTotal.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                                                </td>
                                            </tr>
                                        );
                                    })}
                                </tbody>
                            </table>
                        </div>
                        {mr.remarks && <div className="mt-3 text-sm text-slate-500 italic">"{mr.remarks}"</div>}
                    </div>
                ))}
            </div>

            {/* Create MR Modal */}
            {showModal && (
                <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4">
                    <div className="bg-[#1a1a20] p-6 rounded-xl w-full max-w-lg border border-white/10 space-y-4">
                        <h2 className="text-xl font-bold text-white">New Material Request</h2>

                        {/* Item Entry */}
                        <div className="bg-black/20 p-4 rounded-lg space-y-3">
                            <div>
                                <label className="text-xs text-slate-400 uppercase font-bold mb-1 block">Item Description</label>
                                <input
                                    list="boq-item-suggestions"
                                    className="w-full bg-[#1a1a20] border border-white/10 rounded p-2 text-white text-sm"
                                    value={selectedMaterial}
                                    onChange={handleMaterialSelect}
                                    placeholder="Type or select material..."
                                    required
                                />
                                <datalist id="boq-item-suggestions">
                                    {boqItems.map(item => (
                                        <option key={item.id} value={item.itemDescription}>
                                            Budget: {Number(item.quantity).toLocaleString()} {item.unit}
                                        </option>
                                    ))}
                                </datalist>
                            </div>
                            <div className="border-b border-white/5 pb-2 mb-2">
                                <h3 className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-2">
                                    <FileText size={14} className="text-purple-400" /> Item Details
                                </h3>
                                <p className="text-[10px] text-slate-500">Specify quantity and unit for the selected material.</p>
                            </div>
                            <div className="flex gap-3">
                                <div className="flex-1">
                                    <label className="text-xs text-slate-400 uppercase font-bold mb-1 block">Quantity</label>
                                    <input type="number" step="0.01" className="w-full bg-[#1a1a20] border border-white/10 rounded p-2 text-white" value={requestQty || ''} onChange={e => setRequestQty(parseFloat(e.target.value))} />
                                </div>
                                <div className="w-1/3">
                                    <label className="text-xs text-slate-400 uppercase font-bold mb-1 block">Unit</label>
                                    <input className="w-full bg-[#1a1a20] border border-white/10 rounded p-2 text-white" value={requestUnit} onChange={e => setRequestUnit(e.target.value)} />
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-3">
                                <div>
                                    <label className="text-[10px] text-slate-400 uppercase font-bold mb-1 block">Mat. Unit Cost</label>
                                    <input type="number" step="0.01" className="w-full bg-[#1a1a20] border border-white/10 rounded p-2 text-white text-sm" value={materialUnitPrice || ''} onChange={e => setMaterialUnitPrice(parseFloat(e.target.value))} />
                                </div>
                                <div>
                                    <label className="text-[10px] text-slate-400 uppercase font-bold mb-1 block">Lab. Unit Cost</label>
                                    <input type="number" step="0.01" className="w-full bg-[#1a1a20] border border-white/10 rounded p-2 text-white text-sm" value={laborUnitPrice || ''} onChange={e => setLaborUnitPrice(parseFloat(e.target.value))} />
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-3 opacity-60">
                                <div>
                                    <label className="text-[10px] text-slate-500 uppercase font-bold mb-1 block">Mat. Total Cost</label>
                                    <div className="w-full bg-black/20 border border-white/10 rounded p-2 text-white text-xs font-mono h-[38px] flex items-center">
                                        ₱ {((requestQty || 0) * (materialUnitPrice || 0)).toLocaleString(undefined, { minimumFractionDigits: 2 })}
                                    </div>
                                </div>
                                <div>
                                    <label className="text-[10px] text-slate-500 uppercase font-bold mb-1 block">Lab. Total Cost</label>
                                    <div className="w-full bg-black/20 border border-white/10 rounded p-2 text-white text-xs font-mono h-[38px] flex items-center">
                                        ₱ {((requestQty || 0) * (laborUnitPrice || 0)).toLocaleString(undefined, { minimumFractionDigits: 2 })}
                                    </div>
                                </div>
                            </div>

                            <button type="button" onClick={addToCart} className="w-full bg-purple-600 hover:bg-purple-500 text-white py-3 rounded-lg font-bold text-xs uppercase transition-all active:scale-95 shadow-lg shadow-purple-600/20">
                                Add Item to Request
                            </button>
                        </div>

                        {/* Cart (Added Items) */}
                        <div className="border border-white/5 rounded-lg overflow-x-auto">
                            <table className="w-full text-[10px] text-left">
                                <thead className="bg-white/5 text-slate-500 uppercase font-bold">
                                    <tr>
                                        <th className="p-2 pl-3">Item Description</th>
                                        <th className="p-2 text-center">Qty</th>
                                        <th className="p-2 text-right">Mat.</th>
                                        <th className="p-2 text-right">Lab.</th>
                                        <th className="p-2 text-right">Total</th>
                                        <th className="p-2 text-center w-8"></th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-white/5 bg-white/[0.02]">
                                    {cart.map((item, idx) => {
                                        const total = ((item.materialUnitPrice || 0) + (item.laborUnitPrice || 0)) * item.quantity;
                                        return (
                                            <tr key={idx}>
                                                <td className="p-2 pl-3 text-white truncate max-w-[120px]">{item.itemDescription}</td>
                                                <td className="p-2 text-center text-cyan-400">{item.quantity}</td>
                                                <td className="p-2 text-right text-slate-400">{Number(item.materialUnitPrice).toLocaleString()}</td>
                                                <td className="p-2 text-right text-slate-500">{Number(item.laborUnitPrice).toLocaleString()}</td>
                                                <td className="p-2 text-right text-purple-400 font-mono">{total.toLocaleString(undefined, { minimumFractionDigits: 2 })}</td>
                                                <td className="p-2 text-center">
                                                    <button
                                                        onClick={() => setCart(cart.filter((_, i) => i !== idx))}
                                                        className="text-slate-500 hover:text-red-400 transition-colors font-bold"
                                                    >
                                                        &times;
                                                    </button>
                                                </td>
                                            </tr>
                                        );
                                    })}
                                </tbody>
                            </table>
                            {cart.length === 0 && <div className="text-center text-slate-600 text-[10px] py-4 uppercase font-bold tracking-widest bg-white/[0.02]">No items added yet</div>}
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
