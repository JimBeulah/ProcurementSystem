'use client';

import React, { useState, useEffect, useRef } from 'react';
import { ArrowLeft, Save, ShoppingCart, Search, Plus, X } from 'lucide-react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { createPO } from '@/actions/po-actions';
import { getProjects } from '@/actions/project-actions';
import { getSuppliers, getMaterials } from '@/actions/master-data-actions';
import { getRFQ } from '@/actions/rfq-actions';

export default function CreatePoPage() {
    const searchParams = useSearchParams();
    const rfqId = searchParams.get('rfqId');
    const quoteId = searchParams.get('quoteId');

    const [projects, setProjects] = useState<any[]>([]);
    const [suppliers, setSuppliers] = useState<any[]>([]);
    const [materials, setMaterials] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    const [formData, setFormData] = useState({
        projectId: '',
        supplierId: '',
        remarks: ''
    });
    const [items, setItems] = useState<any[]>([]);

    // Item Entry State
    const [searchTerm, setSearchTerm] = useState('');
    const [showResults, setShowResults] = useState(false);
    const [filteredMaterials, setFilteredMaterials] = useState<any[]>([]);
    const searchRef = useRef<HTMLDivElement>(null);

    const [newItem, setNewItem] = useState({
        materialName: '',
        description: '',
        quantity: 0,
        unitPrice: 0,
        unit: 'pcs'
    });

    useEffect(() => {
        async function load() {
            setLoading(true);
            const [p, s, m] = await Promise.all([getProjects(), getSuppliers(), getMaterials()]);
            setProjects(p);
            setSuppliers(s);
            setMaterials(m);

            // Pre-fill from RFQ/Quote if present
            if (rfqId && quoteId) {
                const rfqData = await getRFQ(Number(rfqId));
                if (rfqData) {
                    const quote = rfqData.quotations.find((q: any) => q.id === Number(quoteId));
                    if (quote) {
                        setFormData(prev => ({
                            ...prev,
                            supplierId: quote.supplierId.toString(),
                            projectId: rfqData.materialRequest?.projectId?.toString() || ''
                        }));
                        setItems(quote.items.map((i: any) => ({
                            materialName: i.materialName,
                            quantity: Number(i.quantity),
                            unitPrice: Number(i.unitPrice),
                            unit: 'pcs', // Default if missing, ideally from RFQ item or mapped
                            description: i.remarks
                        })));
                    }
                }
            }
            setLoading(false);
        }
        load();
    }, [rfqId, quoteId]);

    // Click outside to close search results
    useEffect(() => {
        function handleClickOutside(event: MouseEvent) {
            if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
                setShowResults(false);
            }
        }
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    // Filter materials
    useEffect(() => {
        if (!searchTerm) {
            setFilteredMaterials([]);
            return;
        }
        const lower = searchTerm.toLowerCase();
        setFilteredMaterials(materials.filter(m =>
            m.name.toLowerCase().includes(lower) ||
            (m.code && m.code.toLowerCase().includes(lower))
        ).slice(0, 10)); // Limit to 10 results
    }, [searchTerm, materials]);

    const handleSelectMaterial = (mat: any) => {
        setNewItem(prev => ({
            ...prev,
            materialName: mat.name,
            unit: mat.unit || 'pcs',
            description: mat.description || ''
        }));
        setSearchTerm(mat.name);
        setShowResults(false);
    };

    const handleAddItem = () => {
        if (!newItem.materialName || newItem.quantity <= 0) return;

        setItems([...items, newItem]);
        setNewItem({
            materialName: '',
            description: '',
            quantity: 0,
            unitPrice: 0,
            unit: 'pcs'
        });
        setSearchTerm('');
    };

    const handleRemoveItem = (index: number) => {
        setItems(items.filter((_, i) => i !== index));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        await createPO({
            projectId: Number(formData.projectId),
            supplierId: Number(formData.supplierId),
            requesterId: 1, // TODO: Session
            items,
            remarks: formData.remarks,
            rfqId: rfqId ? Number(rfqId) : undefined
        });
        window.location.href = '/purchasing/orders';
    };

    if (loading) return <div className="p-12 text-center text-slate-500">Initializing PO...</div>;

    return (
        <div className="p-6 space-y-6 max-w-5xl mx-auto">
            <header className="flex items-center gap-4 pb-6 border-b border-white/5">
                <Link href="/purchasing/orders" className="p-2 hover:bg-white/10 rounded-full text-slate-400">
                    <ArrowLeft size={20} />
                </Link>
                <div>
                    <h1 className="text-2xl font-bold text-white">Create Purchase Order</h1>
                    <p className="text-slate-400">Issue a new order to supplier.</p>
                </div>
            </header>

            <form onSubmit={handleSubmit} className="space-y-6">
                <div className="bg-[#0a0a0f] border border-white/5 p-6 rounded-xl grid grid-cols-2 gap-6">
                    <div>
                        <label className="text-xs text-slate-400 uppercase font-bold mb-1 block">Project</label>
                        <select className="w-full bg-black/20 border border-white/10 rounded p-2 text-white" value={formData.projectId} onChange={e => setFormData({ ...formData, projectId: e.target.value })} required>
                            <option value="">Select Project...</option>
                            {projects.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}
                        </select>
                    </div>
                    <div>
                        <label className="text-xs text-slate-400 uppercase font-bold mb-1 block">Supplier</label>
                        <select className="w-full bg-black/20 border border-white/10 rounded p-2 text-white" value={formData.supplierId} onChange={e => setFormData({ ...formData, supplierId: e.target.value })} required>
                            <option value="">Select Supplier...</option>
                            {suppliers.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
                        </select>
                    </div>
                    <div className="col-span-2">
                        <label className="text-xs text-slate-400 uppercase font-bold mb-1 block">Remarks / Delivery Instructions</label>
                        <textarea className="w-full bg-black/20 border border-white/10 rounded p-2 text-white h-20" value={formData.remarks} onChange={e => setFormData({ ...formData, remarks: e.target.value })} />
                    </div>
                </div>

                <div className="bg-[#0a0a0f] border border-white/5 p-6 rounded-xl">
                    <h2 className="text-lg font-bold text-white mb-4">Order Items</h2>

                    {/* Add Item Form */}
                    <div className="bg-white/5 p-4 rounded-lg mb-6 border border-white/10 grid grid-cols-12 gap-4 items-end">
                        <div className="col-span-5 relative" ref={searchRef}>
                            <label className="text-xs text-slate-400 uppercase font-bold mb-1 block">Search Product</label>
                            <div className="relative">
                                <Search className="absolute left-3 top-2.5 text-slate-500" size={18} />
                                <input
                                    type="text"
                                    className="w-full bg-black/40 border border-white/10 rounded-lg pl-10 p-2 text-white placeholder:text-slate-600 focus:outline-none focus:border-blue-500 transition-colors"
                                    placeholder="Search by name or code..."
                                    value={searchTerm}
                                    onChange={e => { setSearchTerm(e.target.value); setShowResults(true); }}
                                    onFocus={() => setShowResults(true)}
                                />
                            </div>

                            {/* Search Results Dropdown */}
                            {showResults && searchTerm && (
                                <div className="absolute top-full left-0 right-0 mt-1 bg-[#1a1a20] border border-white/10 rounded-lg shadow-xl z-20 max-h-60 overflow-y-auto">
                                    {filteredMaterials.length > 0 ? (
                                        filteredMaterials.map(mat => (
                                            <button
                                                key={mat.id}
                                                type="button"
                                                onClick={() => handleSelectMaterial(mat)}
                                                className="w-full text-left p-3 hover:bg-white/5 flex flex-col border-b border-white/5 last:border-0"
                                            >
                                                <span className="text-white font-medium">{mat.name}</span>
                                                <div className="flex justify-between items-center w-full">
                                                    <span className="text-xs text-slate-500">{mat.code}</span>
                                                    <span className="text-xs bg-white/10 px-2 py-0.5 rounded text-slate-300">{mat.category || 'N/A'}</span>
                                                </div>
                                            </button>
                                        ))
                                    ) : (
                                        <div className="p-4 text-center text-slate-500 text-sm">No materials found</div>
                                    )}
                                </div>
                            )}
                        </div>

                        <div className="col-span-2">
                            <label className="text-xs text-slate-400 uppercase font-bold mb-1 block">Qty</label>
                            <input
                                type="number"
                                className="w-full bg-black/40 border border-white/10 rounded-lg p-2 text-white"
                                value={newItem.quantity || ''}
                                onChange={e => setNewItem({ ...newItem, quantity: parseFloat(e.target.value) })}
                            />
                        </div>
                        <div className="col-span-3">
                            <label className="text-xs text-slate-400 uppercase font-bold mb-1 block">Unit Price</label>
                            <input
                                type="number"
                                className="w-full bg-black/40 border border-white/10 rounded-lg p-2 text-white"
                                value={newItem.unitPrice || ''}
                                onChange={e => setNewItem({ ...newItem, unitPrice: parseFloat(e.target.value) })}
                            />
                        </div>
                        <div className="col-span-2">
                            <button
                                type="button"
                                onClick={handleAddItem}
                                disabled={!newItem.materialName || newItem.quantity <= 0}
                                className="w-full bg-emerald-600 hover:bg-emerald-500 disabled:opacity-50 disabled:cursor-not-allowed text-white p-2 rounded-lg font-bold flex items-center justify-center gap-2"
                            >
                                <Plus size={18} /> Add
                            </button>
                        </div>
                    </div>

                    <table className="w-full text-left text-sm text-slate-400">
                        <thead className="bg-white/5 text-slate-200 uppercase text-xs">
                            <tr>
                                <th className="p-3">Material</th>
                                <th className="p-3 text-right">Qty</th>
                                <th className="p-3 text-right">Unit Price</th>
                                <th className="p-3 text-right">Total</th>
                                <th className="p-3 w-10"></th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-white/5">
                            {items.map((item, idx) => (
                                <tr key={idx} className="hover:bg-white/5">
                                    <td className="p-3">
                                        <div className="text-white font-medium">{item.materialName}</div>
                                        <div className="text-xs">{item.description}</div>
                                    </td>
                                    <td className="p-3 text-right font-mono">{item.quantity}</td>
                                    <td className="p-3 text-right font-mono">{item.unitPrice.toLocaleString()}</td>
                                    <td className="p-3 text-right font-mono text-emerald-400 font-bold">{(item.quantity * item.unitPrice).toLocaleString()}</td>
                                    <td className="p-3 text-right">
                                        <button
                                            type="button"
                                            onClick={() => handleRemoveItem(idx)}
                                            className="text-slate-500 hover:text-red-400"
                                        >
                                            <X size={16} />
                                        </button>
                                    </td>
                                </tr>
                            ))}
                            {items.length === 0 && (
                                <tr>
                                    <td colSpan={5} className="p-8 text-center opacity-50">No items added yet. Search products above to add.</td>
                                </tr>
                            )}
                        </tbody>
                        <tfoot className="bg-white/5 font-bold text-white">
                            <tr>
                                <td colSpan={3} className="p-3 text-right">GRAND TOTAL</td>
                                <td className="p-3 text-right text-emerald-400 text-lg">
                                    {items.reduce((sum, i) => sum + (i.quantity * i.unitPrice), 0).toLocaleString(undefined, { style: 'currency', currency: 'PHP' })}
                                </td>
                                <td></td>
                            </tr>
                        </tfoot>
                    </table>
                </div>

                <div className="flex justify-end">
                    <button type="submit" className="bg-blue-600 hover:bg-blue-500 text-white px-8 py-3 rounded-lg font-bold flex items-center gap-2">
                        <Save size={18} /> Issue Purchase Order
                    </button>
                </div>
            </form>
        </div>
    );
}
