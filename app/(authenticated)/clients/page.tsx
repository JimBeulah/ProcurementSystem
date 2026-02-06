'use client';

import React, { useState, useEffect } from 'react';
import { Users, Plus, Search, Building2, Phone, FileText } from 'lucide-react';
import { getClients, createClient } from '@/actions/client-actions';
import { Card } from '@/components/ui/Card';

export default function ClientsPage() {
    const [clients, setClients] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');

    // New Client Form
    const [formData, setFormData] = useState({
        name: '',
        contactPerson: '',
        contractType: 'Lump Sum',
        paymentTerms: '30 Days'
    });

    useEffect(() => {
        loadData();
    }, []);

    const loadData = async () => {
        setLoading(true);
        const data = await getClients();
        setClients(data);
        setLoading(false);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        await createClient(formData);
        setShowModal(false);
        setFormData({ name: '', contactPerson: '', contractType: 'Lump Sum', paymentTerms: '30 Days' });
        loadData();
    };

    const filtered = clients.filter(c =>
        c.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        c.contactPerson?.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="p-6 space-y-6">
            <header className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 pb-6 border-b border-white/5">
                <div>
                    <h1 className="text-2xl font-bold text-white flex items-center gap-3">
                        <Users className="text-blue-500" /> Client Management
                    </h1>
                    <p className="text-slate-400">Manage client profiles, contracts, and billing terms.</p>
                </div>
                <button
                    onClick={() => setShowModal(true)}
                    className="bg-blue-600 hover:bg-blue-500 text-white px-4 py-2 rounded-lg flex items-center gap-2 shadow-lg shadow-blue-500/20"
                >
                    <Plus size={18} /> Add New Client
                </button>
            </header>

            {/* Search */}
            <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500 w-4 h-4" />
                <input
                    type="text"
                    placeholder="Search clients..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10 pr-4 py-3 bg-[#0a0a0f] border border-white/10 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-blue-500/50 w-full md:w-1/3"
                />
            </div>

            {loading ? (
                <div className="text-slate-500 text-center p-8">Loading clients...</div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {filtered.map(client => (
                        <Card key={client.id} hoverEffect className="group">
                            <div className="flex justify-between items-start mb-4">
                                <div className="p-3 rounded-lg bg-blue-500/10 text-blue-400">
                                    <Building2 size={24} />
                                </div>
                                <span className="text-xs font-mono text-slate-500 bg-white/5 px-2 py-1 rounded">
                                    ID: {client.id}
                                </span>
                            </div>

                            <h3 className="text-xl font-bold text-white mb-1">{client.name}</h3>
                            <div className="text-sm text-slate-400 mb-4 flex items-center gap-2">
                                <Phone size={14} /> {client.contactPerson || 'No contact'}
                            </div>

                            <div className="space-y-2 pt-4 border-t border-white/5">
                                <div className="flex justify-between text-sm">
                                    <span className="text-slate-500">Contract</span>
                                    <span className="text-white font-medium">{client.contractType}</span>
                                </div>
                                <div className="flex justify-between text-sm">
                                    <span className="text-slate-500">Terms</span>
                                    <span className="text-white font-medium">{client.paymentTerms}</span>
                                </div>
                                <div className="flex justify-between text-sm">
                                    <span className="text-slate-500">Active Projects</span>
                                    <span className="text-cyan-400 font-bold">{client._count?.projects || 0}</span>
                                </div>
                            </div>
                        </Card>
                    ))}
                </div>
            )}

            {/* Add Modal */}
            {showModal && (
                <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4">
                    <div className="bg-[#1a1a20] p-6 rounded-xl w-full max-w-md border border-white/10 space-y-4">
                        <h2 className="text-xl font-bold text-white">Add New Client</h2>
                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div>
                                <label className="text-xs text-slate-400 uppercase font-bold mb-1 block">Client Name</label>
                                <input className="w-full bg-black/20 border border-white/10 rounded p-2 text-white" value={formData.name} onChange={e => setFormData({ ...formData, name: e.target.value })} required />
                            </div>

                            <div>
                                <label className="text-xs text-slate-400 uppercase font-bold mb-1 block">Contact Person</label>
                                <input className="w-full bg-black/20 border border-white/10 rounded p-2 text-white" value={formData.contactPerson} onChange={e => setFormData({ ...formData, contactPerson: e.target.value })} />
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="text-xs text-slate-400 uppercase font-bold mb-1 block">Contract Type</label>
                                    <select className="w-full bg-black/20 border border-white/10 rounded p-2 text-white" value={formData.contractType} onChange={e => setFormData({ ...formData, contractType: e.target.value })}>
                                        <option>Lump Sum</option>
                                        <option>Cost Plus</option>
                                        <option>Unit Price</option>
                                    </select>
                                </div>
                                <div>
                                    <label className="text-xs text-slate-400 uppercase font-bold mb-1 block">Payment Terms</label>
                                    <input className="w-full bg-black/20 border border-white/10 rounded p-2 text-white" value={formData.paymentTerms} onChange={e => setFormData({ ...formData, paymentTerms: e.target.value })} />
                                </div>
                            </div>

                            <div className="flex justify-end gap-3 pt-4">
                                <button type="button" onClick={() => setShowModal(false)} className="px-4 py-2 text-slate-400 hover:text-white">Cancel</button>
                                <button type="submit" className="bg-blue-600 px-4 py-2 rounded text-white font-medium hover:bg-blue-500">Create Client</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}
