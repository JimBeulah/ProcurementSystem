'use client';

import React, { useState, useEffect } from 'react';
import { ArrowLeft, Save, Plus, Trash2 } from 'lucide-react';
import Link from 'next/link';
import { createRFQ } from '@/actions/rfq-actions';
import { getMaterials, getSuppliers } from '@/actions/master-data-actions';

export default function CreateRfqPage() {
    const [materials, setMaterials] = useState<any[]>([]);
    const [suppliers, setSuppliers] = useState<any[]>([]);
    const [items, setItems] = useState<any[]>([]);

    // Form
    const [title, setTitle] = useState('');
    const [dueDate, setDueDate] = useState('');

    // New Item State
    const [newItem, setNewItem] = useState({ materialName: '', quantity: 0, unit: '' });

    useEffect(() => {
        async function load() {
            const [m, s] = await Promise.all([getMaterials(), getSuppliers()]);
            setMaterials(m);
            setSuppliers(s);
        }
        load();
    }, []);

    const handleAddItem = () => {
        if (!newItem.materialName) return;
        setItems([...items, newItem]);
        setNewItem({ materialName: '', quantity: 0, unit: '' });
    };

    const handleMaterialSelect = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const mat = materials.find(m => m.name === e.target.value);
        if (mat) {
            setNewItem({ ...newItem, materialName: mat.name, unit: mat.unit });
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        await createRFQ({
            title,
            dueDate: new Date(dueDate),
            items,
            createdById: 1 // TODO: Get from session
        });
        // Redirect or show success
        alert('RFQ Created!');
    };

    return (
        <div className="p-6 space-y-6 max-w-4xl mx-auto">
            <header className="flex items-center gap-4 pb-6 border-b border-white/5">
                <Link href="/purchasing/rfq" className="p-2 hover:bg-white/10 rounded-full text-slate-400">
                    <ArrowLeft size={20} />
                </Link>
                <div>
                    <h1 className="text-2xl font-bold text-white">Create New RFQ</h1>
                    <p className="text-slate-400">Request pricing from suppliers.</p>
                </div>
            </header>

            <form onSubmit={handleSubmit} className="space-y-6">
                <div className="bg-[#0a0a0f] border border-white/5 p-6 rounded-xl space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="text-xs text-slate-400 uppercase font-bold mb-1 block">RFQ Title</label>
                            <input className="w-full bg-black/20 border border-white/10 rounded p-2 text-white" placeholder="e.g. Concrete for Project A" value={title} onChange={e => setTitle(e.target.value)} required />
                        </div>
                        <div>
                            <label className="text-xs text-slate-400 uppercase font-bold mb-1 block">Due Date</label>
                            <input type="date" className="w-full bg-black/20 border border-white/10 rounded p-2 text-white" value={dueDate} onChange={e => setDueDate(e.target.value)} required />
                        </div>
                    </div>
                </div>

                <div className="bg-[#0a0a0f] border border-white/5 p-6 rounded-xl space-y-4">
                    <h2 className="text-lg font-bold text-white mb-2">Items Required</h2>

                    {/* Item Entry */}
                    <div className="flex gap-2 items-end bg-white/5 p-3 rounded-lg">
                        <div className="flex-1">
                            <label className="text-xs text-slate-400 mb-1 block">Material</label>
                            <select className="w-full bg-black/20 border border-white/10 rounded p-2 text-white" value={newItem.materialName} onChange={handleMaterialSelect}>
                                <option value="">Select Material...</option>
                                {materials.map(m => <option key={m.id} value={m.name}>{m.name}</option>)}
                            </select>
                        </div>
                        <div className="w-24">
                            <label className="text-xs text-slate-400 mb-1 block">Qty</label>
                            <input type="number" className="w-full bg-black/20 border border-white/10 rounded p-2 text-white" value={newItem.quantity} onChange={e => setNewItem({ ...newItem, quantity: parseFloat(e.target.value) })} />
                        </div>
                        <div className="w-24">
                            <label className="text-xs text-slate-400 mb-1 block">Unit</label>
                            <input className="w-full bg-black/20 border border-white/10 rounded p-2 text-white" value={newItem.unit} onChange={e => setNewItem({ ...newItem, unit: e.target.value })} />
                        </div>
                        <button type="button" onClick={handleAddItem} className="bg-pink-600 hover:bg-pink-500 text-white p-2 rounded">
                            <Plus size={20} />
                        </button>
                    </div>

                    {/* List */}
                    <div className="space-y-2">
                        {items.map((item, idx) => (
                            <div key={idx} className="flex justify-between items-center bg-white/5 p-3 rounded border border-white/5">
                                <span className="text-white font-medium">{item.materialName}</span>
                                <div className="flex items-center gap-4">
                                    <span className="text-slate-400">{item.quantity} {item.unit}</span>
                                    <button type="button" onClick={() => setItems(items.filter((_, i) => i !== idx))} className="text-red-400 hover:text-red-300">
                                        <Trash2 size={16} />
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                <div className="flex justify-end">
                    <button type="submit" className="bg-emerald-600 hover:bg-emerald-500 text-white px-8 py-3 rounded-lg font-bold flex items-center gap-2">
                        <Save size={18} /> Save & Open RFQ
                    </button>
                </div>
            </form>
        </div>
    );
}
