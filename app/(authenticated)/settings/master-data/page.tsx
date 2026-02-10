'use client';

import React, { useState, useEffect } from 'react';
import { getUnits } from '@/actions/unit-actions';
import { getCategories } from '@/actions/category-actions';
import { generateEAN13 } from '@/lib/utils';
import { Package, Truck, Home, Plus, Search, RefreshCcw } from 'lucide-react';
import { getSuppliers, getMaterials, getWarehouses, createSupplier, createMaterial, createWarehouse } from '@/actions/master-data-actions';
import { Breadcrumbs } from '@/components/ui/Breadcrumbs';
import { Modal } from '@/components/ui/Modal';

export default function MasterDataPage() {
    const [activeTab, setActiveTab] = useState<'suppliers' | 'materials' | 'warehouses'>('suppliers');
    const [data, setData] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [showAddModal, setShowAddModal] = useState(false);

    // Dropdown Data
    const [units, setUnits] = useState<any[]>([]);
    const [categories, setCategories] = useState<any[]>([]);

    // Form states
    const [newItem, setNewItem] = useState<any>({});

    useEffect(() => {
        loadData();
    }, [activeTab]);

    useEffect(() => {
        // Fetch dropdown options on mount
        const fetchOptions = async () => {
            const [u, c] = await Promise.all([getUnits(), getCategories()]);
            setUnits(u);
            setCategories(c);
        };
        fetchOptions();
    }, []);

    const loadData = async () => {
        setLoading(true);
        let res;
        if (activeTab === 'suppliers') res = await getSuppliers();
        else if (activeTab === 'materials') res = await getMaterials();
        else if (activeTab === 'warehouses') res = await getWarehouses();
        setData(res || []);
        setLoading(false);
    };

    const handleAdd = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        if (activeTab === 'suppliers') await createSupplier(newItem);
        else if (activeTab === 'materials') await createMaterial(newItem);
        else if (activeTab === 'warehouses') await createWarehouse(newItem);

        setShowAddModal(false);
        setNewItem({});
        loadData();
    };

    const TabButton = ({ id, label, icon: Icon }: any) => (
        <button
            onClick={() => setActiveTab(id)}
            className={`flex items-center gap-2 px-4 py-3 border-b-2 transition-colors ${activeTab === id
                ? 'border-blue-500 text-blue-400'
                : 'border-transparent text-slate-400 hover:text-white'
                }`}
        >
            <Icon size={18} />
            {label}
        </button>
    );

    return (
        <div className="p-6 space-y-6">
            <Breadcrumbs />
            <header className="flex justify-between items-center">
                <h1 className="text-2xl font-bold text-white flex items-center gap-3">
                    <Package className="text-purple-500" /> Master Data
                </h1>
                <button
                    onClick={() => setShowAddModal(true)}
                    className="bg-blue-600 hover:bg-blue-500 text-white px-4 py-2 rounded-lg flex items-center gap-2"
                >
                    <Plus size={18} /> Add {activeTab.slice(0, -1)}
                </button>
            </header>

            <div className="flex border-b border-white/10">
                <TabButton id="suppliers" label="Suppliers" icon={Truck} />
                <TabButton id="materials" label="Materials" icon={Package} />
                <TabButton id="warehouses" label="Warehouses" icon={Home} />
            </div>

            <div className="bg-[#0a0a0f] border border-white/5 rounded-xl overflow-hidden min-h-[400px]">
                {loading ? (
                    <div className="p-8 text-center text-slate-500">Loading data...</div>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="w-full text-left text-slate-400">
                            <thead className="bg-white/5 text-slate-200 uppercase text-xs font-semibold">
                                <tr>
                                    {activeTab === 'suppliers' && (
                                        <>
                                            <th className="p-4">Name</th><th className="p-4">Contact</th><th className="p-4">Email</th>
                                        </>
                                    )}
                                    {activeTab === 'materials' && (
                                        <>
                                            <th className="p-4">Code</th><th className="p-4">Name</th><th className="p-4">Unit</th><th className="p-4">Category</th>
                                        </>
                                    )}
                                    {activeTab === 'warehouses' && (
                                        <>
                                            <th className="p-4">Name</th><th className="p-4">Location</th><th className="p-4">Type</th>
                                        </>
                                    )}
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-white/5">
                                {data.map((item: any) => (
                                    <tr key={item.id} className="hover:bg-white/5 transition-colors">
                                        {activeTab === 'suppliers' && (
                                            <>
                                                <td className="p-4 font-medium text-white">{item.name}</td>
                                                <td className="p-4">{item.contactPerson}</td>
                                                <td className="p-4">{item.email}</td>
                                            </>
                                        )}
                                        {activeTab === 'materials' && (
                                            <>
                                                <td className="p-4 font-mono text-cyan-400">{item.code}</td>
                                                <td className="p-4 font-medium text-white">{item.name}</td>
                                                <td className="p-4">{item.unit}</td>
                                                <td className="p-4 text-xs uppercase bg-white/5 inline-block m-2 rounded px-2">{item.category}</td>
                                            </>
                                        )}
                                        {activeTab === 'warehouses' && (
                                            <>
                                                <td className="p-4 font-medium text-white">{item.name}</td>
                                                <td className="p-4">{item.location}</td>
                                                <td className="p-4 text-xs">{item.type}</td>
                                            </>
                                        )}
                                    </tr>
                                ))}
                                {data.length === 0 && (
                                    <tr>
                                        <td colSpan={4} className="p-8 text-center opacity-50">No records found.</td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>

            {/* Simple Modal Implementation */}
            <Modal
                isOpen={showAddModal}
                onClose={() => setShowAddModal(false)}
                title={`Add New ${activeTab.slice(0, -1)}`}
            >
                <form onSubmit={handleAdd} className="space-y-4">
                    {activeTab === 'suppliers' && (
                        <>
                            <input placeholder="Company Name" className="w-full bg-black/20 border border-white/10 rounded p-2 text-white" value={newItem.name || ''} onChange={e => setNewItem({ ...newItem, name: e.target.value })} required />
                            <input placeholder="Contact Person" className="w-full bg-black/20 border border-white/10 rounded p-2 text-white" value={newItem.contactPerson || ''} onChange={e => setNewItem({ ...newItem, contactPerson: e.target.value })} />
                            <input placeholder="Email" className="w-full bg-black/20 border border-white/10 rounded p-2 text-white" value={newItem.email || ''} onChange={e => setNewItem({ ...newItem, email: e.target.value })} />
                        </>
                    )}
                    {activeTab === 'materials' && (
                        <>
                            <div className="flex gap-2">
                                <input
                                    placeholder="Material Code (Unique)"
                                    className="w-full bg-black/20 border border-white/10 rounded p-2 text-white"
                                    value={newItem.code || ''}
                                    onChange={e => setNewItem({ ...newItem, code: e.target.value })}
                                    required
                                />
                                <button
                                    type="button"
                                    onClick={() => setNewItem({ ...newItem, code: generateEAN13() })}
                                    className="px-3 bg-white/5 border border-white/10 rounded hover:bg-white/10 text-slate-400 hover:text-white transition-colors"
                                    title="Generate EAN-13"
                                >
                                    <RefreshCcw size={18} />
                                </button>
                            </div>
                            <input placeholder="Material Name" className="w-full bg-black/20 border border-white/10 rounded p-2 text-white" value={newItem.name || ''} onChange={e => setNewItem({ ...newItem, name: e.target.value })} required />

                            {/* Unit Dropdown */}
                            <select
                                className="w-full bg-black/20 border border-white/10 rounded p-2 text-white"
                                value={newItem.unit || ''}
                                onChange={e => setNewItem({ ...newItem, unit: e.target.value })}
                                required
                            >
                                <option value="">Select Unit</option>
                                {units.map((u: any) => (
                                    <option key={u.id} value={u.abbreviation}>{u.name} ({u.abbreviation})</option>
                                ))}
                            </select>

                            {/* Category Dropdown */}
                            <select
                                className="w-full bg-black/20 border border-white/10 rounded p-2 text-white"
                                value={newItem.category || ''}
                                onChange={e => setNewItem({ ...newItem, category: e.target.value })}
                            >
                                <option value="">Select Category</option>
                                {categories.map((c: any) => (
                                    <option key={c.id} value={c.name}>{c.name}</option>
                                ))}
                            </select>
                        </>
                    )}
                    {activeTab === 'warehouses' && (
                        <>
                            <input placeholder="Warehouse Name" className="w-full bg-black/20 border border-white/10 rounded p-2 text-white" value={newItem.name || ''} onChange={e => setNewItem({ ...newItem, name: e.target.value })} required />
                            <input placeholder="Location" className="w-full bg-black/20 border border-white/10 rounded p-2 text-white" value={newItem.location || ''} onChange={e => setNewItem({ ...newItem, location: e.target.value })} />
                            <select className="w-full bg-black/20 border border-white/10 rounded p-2 text-white" value={newItem.type || 'CENTRAL'} onChange={e => setNewItem({ ...newItem, type: e.target.value })}>
                                <option value="CENTRAL">Central</option>
                                <option value="SITE">Site</option>
                            </select>
                        </>
                    )}

                    <div className="flex justify-end gap-3 pt-4">
                        <button type="button" onClick={() => setShowAddModal(false)} className="px-4 py-2 text-slate-400 hover:text-white transition-colors">Cancel</button>
                        <button type="submit" className="bg-blue-600 px-6 py-2 rounded-lg text-white font-bold hover:bg-blue-500 shadow-lg shadow-blue-600/20 transition-all">Save</button>
                    </div>
                </form>
            </Modal>
        </div>
    );
}
