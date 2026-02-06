'use client';

import React, { useState } from 'react';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Card } from '@/components/ui/Card';
import { Trash2, Plus, ShoppingCart } from 'lucide-react';

// Demo DUPA data
const MOCK_DUPA = {
    '1': [
        { id: 1, name: 'Cement', unit: 'bags', price: 250, remaining: 950 },
        { id: 2, name: 'Steel Bar 10mm', unit: 'pcs', price: 180, remaining: 4900 },
    ],
    '2': [
        { id: 3, name: 'Cement', unit: 'bags', price: 260, remaining: 500 },
    ]
};

export function PurchaseRequestForm({ projects }: { projects: any[] }) {
    const [selectedProject, setSelectedProject] = useState('');
    const [items, setItems] = useState<{ name: string, quantity: number, price: number }[]>([]);
    const [newItem, setNewItem] = useState({ name: '', quantity: 0 });

    const availableMaterials = selectedProject ? (MOCK_DUPA as any)[selectedProject] || [] : [];

    const addItem = () => {
        if (!newItem.name || newItem.quantity <= 0) return;

        const mat = availableMaterials.find((m: any) => m.name === newItem.name);
        if (!mat) return;

        if (newItem.quantity > mat.remaining) {
            alert(`Exceeds DUPA limit! Only ${mat.remaining} remaining.`);
            return;
        }

        setItems([...items, { ...newItem, price: mat.price }]);
        setNewItem({ name: '', quantity: 0 });
    };

    const removeItem = (idx: number) => {
        setItems(items.filter((_, i) => i !== idx));
    };

    const total = items.reduce((acc, item) => acc + (item.quantity * item.price), 0);

    return (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-6">
                <Card>
                    <div className="flex items-center gap-2 mb-6 p-2 bg-blue-500/10 w-fit rounded-lg border border-blue-500/20">
                        <span className="w-2 h-2 rounded-full bg-blue-400 animate-pulse"></span>
                        <span className="text-xs font-bold text-blue-300 uppercase tracking-widest">Step 1</span>
                    </div>
                    <h3 className="text-xl font-bold text-white mb-6">Project Details</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <label className="block text-xs font-bold text-slate-500 mb-2 uppercase tracking-wider">Select Project</label>
                            <select
                                value={selectedProject}
                                onChange={(e) => setSelectedProject(e.target.value)}
                                className="w-full bg-[#0a0a0f] border border-white/10 rounded-xl px-4 py-3 text-slate-200 focus:outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 transition-all shadow-inner"
                            >
                                <option value="">-- Choose Project --</option>
                                {projects.map(p => (
                                    <option key={p.id} value={p.id}>{p.name}</option>
                                ))}
                            </select>
                        </div>
                        <Input label="Date Needed" type="date" />
                    </div>
                </Card>

                <Card className={!selectedProject ? 'opacity-50 pointer-events-none grayscale' : ''}>
                    <div className="flex items-center gap-2 mb-6 p-2 bg-cyan-500/10 w-fit rounded-lg border border-cyan-500/20">
                        <span className="w-2 h-2 rounded-full bg-cyan-400"></span>
                        <span className="text-xs font-bold text-cyan-300 uppercase tracking-widest">Step 2: Add Items</span>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-end mb-8 bg-white/5 p-4 rounded-xl border border-white/5">
                        <div className="md:col-span-1">
                            <label className="block text-xs font-bold text-slate-500 mb-2 uppercase tracking-wider">Material (DUPA)</label>
                            <select
                                value={newItem.name}
                                onChange={(e) => setNewItem({ ...newItem, name: e.target.value })}
                                className="w-full bg-[#0a0a0f] border border-white/10 rounded-xl px-4 py-3 text-slate-200 focus:outline-none focus:border-cyan-500 shadow-inner"
                                disabled={!selectedProject}
                            >
                                <option value="">Select Material</option>
                                {availableMaterials.map((m: any) => (
                                    <option key={m.id} value={m.name}>{m.name} (Max: {m.remaining})</option>
                                ))}
                            </select>
                        </div>
                        <div>
                            <Input
                                label="Quantity"
                                type="number"
                                value={newItem.quantity}
                                onChange={(e) => setNewItem({ ...newItem, quantity: parseFloat(e.target.value) })}
                            />
                        </div>
                        <Button onClick={addItem} type="button" disabled={!newItem.name} className="h-[46px]">
                            <Plus size={16} className="mr-2 inline" /> Add to List
                        </Button>
                    </div>

                    {items.length > 0 && (
                        <div className="overflow-hidden rounded-xl border border-white/10">
                            <table className="w-full text-sm text-left text-slate-400">
                                <thead className="text-xs text-slate-400 uppercase bg-white/5 font-bold">
                                    <tr>
                                        <th className="px-6 py-4">Item</th>
                                        <th className="px-6 py-4 text-right">Qty</th>
                                        <th className="px-6 py-4 text-right">Price</th>
                                        <th className="px-6 py-4 text-right">Total</th>
                                        <th className="px-6 py-4"></th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-white/5">
                                    {items.map((item, idx) => (
                                        <tr key={idx} className="hover:bg-white/5 transition-colors">
                                            <td className="px-6 py-4 font-medium text-white">{item.name}</td>
                                            <td className="px-6 py-4 text-right">{item.quantity}</td>
                                            <td className="px-6 py-4 text-right">₱{item.price.toLocaleString()}</td>
                                            <td className="px-6 py-4 text-right text-cyan-400 font-bold">₱{(item.quantity * item.price).toLocaleString()}</td>
                                            <td className="px-6 py-4 text-right">
                                                <button onClick={() => removeItem(idx)} className="text-red-400 hover:text-red-300 p-2 hover:bg-red-500/10 rounded-lg transition-colors">
                                                    <Trash2 size={16} />
                                                </button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}
                </Card>
            </div>

            <div>
                <Card className="sticky top-8 bg-gradient-to-b from-[#0a0a0f] to-slate-900 border-cyan-500/20 shadow-2xl shadow-cyan-900/10">
                    <h3 className="text-lg font-bold text-white mb-6 font-[family-name:var(--font-outfit)]">Request Summary</h3>

                    <div className="space-y-4 mb-8">
                        <div className="flex justify-between items-center text-sm">
                            <span className="text-slate-400">Total Items</span>
                            <span className="font-bold text-white bg-white/10 px-2 py-1 rounded">{items.length}</span>
                        </div>
                        <div className="flex justify-between items-center text-sm">
                            <span className="text-slate-400">Tax Estimation (12%)</span>
                            <span className="text-slate-500">₱{(total * 0.12).toLocaleString()}</span>
                        </div>
                        <div className="my-4 h-px bg-gradient-to-r from-transparent via-white/10 to-transparent" />
                        <div className="flex justify-between items-end">
                            <span className="text-slate-400 font-medium">Grand Total</span>
                            <span className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-emerald-400">
                                ₱{total.toLocaleString()}
                            </span>
                        </div>
                    </div>

                    <Button className="w-full py-4 text-base shadow-xl shadow-cyan-500/20 hover:shadow-cyan-500/30 hover:scale-[1.02] transition-all" disabled={items.length === 0}>
                        <span className="font-bold">Submit Request</span> <ShoppingCart className="ml-2 inline" size={20} />
                    </Button>

                    <p className="text-xs text-center text-slate-500 mt-4">
                        Requires approval from <span className="text-slate-400">Sir Raymond</span>
                    </p>
                </Card>
            </div>
        </div>
    );
}
