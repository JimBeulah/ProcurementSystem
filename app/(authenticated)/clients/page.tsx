'use client';

import React, { useState, useEffect } from 'react';
import {
    Users,
    Plus,
    Search,
    Building2,
    Phone,
    FileText,
    Filter,
    LayoutGrid,
    List as ListIcon,
    TrendingUp,
    ShieldCheck,
    CreditCard,
    X,
    Loader2,
    ChevronRight,
} from 'lucide-react';
import { getClients, createClient } from '@/actions/client-actions';
import { Card } from '@/components/ui/Card';
import { ClientCard } from '@/components/clients/ClientCard';
import { motion, AnimatePresence } from 'framer-motion';
import { Modal } from '@/components/ui/Modal';

interface Client {
    id: string | number;
    name: string;
    contactPerson?: string;
    contractType: string;
    paymentTerms: string;
    _count?: {
        projects: number;
    };
}

export default function ClientsPage() {
    const [clients, setClients] = useState<Client[]>([]);
    const [loading, setLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');
    const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
    const [filterType, setFilterType] = useState<string>('All');
    const [submitting, setSubmitting] = useState(false);

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
        try {
            const data = await getClients();
            setClients(data);
        } catch (error) {
            console.error('Failed to load clients:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setSubmitting(true);
        try {
            await createClient(formData);
            setShowModal(false);
            setFormData({ name: '', contactPerson: '', contractType: 'Lump Sum', paymentTerms: '30 Days' });
            await loadData();
        } catch (error) {
            console.error('Failed to create client:', error);
        } finally {
            setSubmitting(false);
        }
    };

    const filtered = clients.filter(c => {
        const matchesSearch = c.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            c.contactPerson?.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesFilter = filterType === 'All' || c.contractType === filterType;
        return matchesSearch && matchesFilter;
    });

    // Stats calculations
    const activeContracts = clients.filter(c => (c._count?.projects || 0) > 0).length;
    const lsumContracts = clients.filter(c => c.contractType === 'Lump Sum').length;

    return (
        <div className="p-4 md:p-6 space-y-6 max-w-7xl mx-auto">
            {/* Header Section */}
            <header className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                    <h1 className="text-2xl font-extrabold text-foreground tracking-tight flex items-center gap-2">
                        <Users className="text-blue-500" size={24} /> Client Management
                    </h1>
                    <p className="text-muted mt-0.5 text-sm font-medium">Manage client profiles, contracts, and billing terms.</p>
                </div>
                <motion.button
                    whileHover={{ scale: 1.01 }}
                    whileTap={{ scale: 0.99 }}
                    onClick={() => setShowModal(true)}
                    className="w-full md:w-auto bg-blue-600 hover:bg-blue-500 text-white px-5 py-2.5 rounded-xl flex items-center justify-center gap-2 shadow-xl shadow-blue-500/10 font-bold transition-all text-sm"
                >
                    <Plus size={18} /> Add New Client
                </motion.button>
            </header>

            {/* Stats Overview */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <StatCard
                    title="Total Clients"
                    value={clients.length.toString()}
                    icon={<Users className="text-blue-400" size={20} />}
                    trend="Registered"
                    color="from-blue-500/10"
                />
                <StatCard
                    title="Active Contracts"
                    value={activeContracts.toString()}
                    icon={<TrendingUp className="text-emerald-400" size={20} />}
                    trend="In Progress"
                    color="from-emerald-500/10"
                />
                <StatCard
                    title="Lump Sum Terms"
                    value={lsumContracts.toString()}
                    icon={<ShieldCheck className="text-orange-400" size={20} />}
                    trend="Standard"
                    color="from-orange-500/10"
                />
            </div>

            {/* Controls Bar */}
            <div className="flex flex-col md:flex-row gap-3 items-center justify-between p-1.5 bg-foreground/[0.03] border border-border rounded-xl backdrop-blur-md">
                <div className="relative w-full md:w-80">
                    <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-muted" size={16} />
                    <input
                        type="text"
                        placeholder="Search by name or contact..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full pl-10 pr-3 py-2 bg-background/50 border-none rounded-lg text-foreground placeholder-muted focus:ring-1 focus:ring-blue-500/50 transition-all text-sm font-medium"
                    />
                </div>
                <div className="flex items-center gap-2 w-full md:w-auto px-1">
                    <select
                        value={filterType}
                        onChange={(e) => setFilterType(e.target.value)}
                        className="flex-1 md:flex-none bg-transparent text-muted hover:text-foreground transition-colors text-xs font-bold border border-border rounded-lg hover:bg-foreground/[0.05] px-3 py-1.5 outline-none cursor-pointer appearance-none"
                    >
                        <option value="All" className="bg-background text-foreground">All Types</option>
                        <option value="Lump Sum" className="bg-background text-foreground">Lump Sum</option>
                        <option value="Cost Plus" className="bg-background text-foreground">Cost Plus</option>
                        <option value="Unit Price" className="bg-background text-foreground">Unit Price</option>
                    </select>
                    <div className="h-5 w-px bg-border mx-1 hidden md:block" />
                    <div className="flex items-center bg-foreground/[0.03] p-0.5 rounded-lg border border-border">
                        <button
                            onClick={() => setViewMode('grid')}
                            className={`p-1.5 rounded-md transition-all scale-90 ${viewMode === 'grid' ? 'bg-blue-600 text-white shadow-lg shadow-blue-500/10' : 'text-muted hover:text-foreground'}`}
                        >
                            <LayoutGrid size={16} />
                        </button>
                        <button
                            onClick={() => setViewMode('list')}
                            className={`p-1.5 rounded-md transition-all scale-90 ${viewMode === 'list' ? 'bg-blue-600 text-white shadow-lg shadow-blue-500/10' : 'text-muted hover:text-foreground'}`}
                        >
                            <ListIcon size={16} />
                        </button>
                    </div>
                </div>
            </div>

            {/* Clients Grid */}
            {loading ? (
                <div className="flex flex-col items-center justify-center py-24 text-muted gap-4">
                    <Loader2 className="animate-spin text-blue-500" size={40} />
                    <p className="font-bold text-lg">Synchronizing clients...</p>
                </div>
            ) : filtered.length === 0 ? (
                <div className="text-center py-24 border-2 border-dashed border-border rounded-3xl">
                    <div className="bg-foreground/[0.03] w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6">
                        <Users className="text-muted" size={40} />
                    </div>
                    <h3 className="text-xl font-bold text-foreground mb-2">No clients found</h3>
                    <p className="text-muted max-w-sm mx-auto">
                        Try adjusting your search or add a new client to get started.
                    </p>
                </div>
            ) : viewMode === 'grid' ? (
                <motion.div
                    className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-4"
                    initial="hidden"
                    animate="visible"
                    variants={{
                        hidden: { opacity: 0 },
                        visible: {
                            opacity: 1,
                            transition: {
                                staggerChildren: 0.05
                            }
                        }
                    }}
                >
                    <AnimatePresence mode="popLayout">
                        {filtered.map(client => (
                            <ClientCard key={client.id} client={client} />
                        ))}
                    </AnimatePresence>
                </motion.div>
            ) : (
                <div className="space-y-2">
                    <AnimatePresence mode="popLayout">
                        {filtered.map(client => (
                            <motion.div
                                key={client.id}
                                layout
                                initial={{ opacity: 0, x: -10 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, scale: 0.98 }}
                                className="flex items-center justify-between p-3 bg-foreground/[0.02] border border-border rounded-xl hover:bg-foreground/[0.05] transition-all group"
                            >
                                <div className="flex items-center gap-3">
                                    <div className="p-2 rounded-lg bg-blue-500/10 text-blue-400 border border-blue-500/20">
                                        <Building2 size={16} />
                                    </div>
                                    <div>
                                        <h3 className="text-sm font-bold text-foreground group-hover:text-blue-400 transition-colors">
                                            {client.name}
                                        </h3>
                                        <p className="text-[10px] text-muted font-medium">ID: {client.id} • {client.contactPerson || 'No contact'}</p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-6">
                                    <div className="hidden md:block text-right">
                                        <p className="text-[10px] text-muted uppercase font-black">Contract</p>
                                        <p className="text-xs font-bold text-foreground opacity-80">{client.contractType}</p>
                                    </div>
                                    <div className="hidden md:block text-right">
                                        <p className="text-[10px] text-muted uppercase font-black">Terms</p>
                                        <p className="text-xs font-bold text-foreground opacity-80">{client.paymentTerms}</p>
                                    </div>
                                    <div className="w-8 h-8 rounded-full flex items-center justify-center text-muted group-hover:text-foreground transition-colors">
                                        <ChevronRight size={16} />
                                    </div>
                                </div>
                            </motion.div>
                        ))}
                    </AnimatePresence>
                </div>
            )}

            {/* Modern Modal */}
            <Modal
                isOpen={showModal}
                onClose={() => setShowModal(false)}
                title="New Client"
            >
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="space-y-1.5">
                        <label className="text-[10px] text-muted uppercase font-black tracking-widest ml-1">Company Name</label>
                        <input
                            className="w-full bg-foreground/[0.03] border border-border rounded-lg p-3 text-sm text-foreground focus:ring-1 focus:ring-blue-500/50 outline-none transition-all placeholder:text-muted/50"
                            placeholder="e.g. Acme Corp"
                            value={formData.name}
                            onChange={e => setFormData({ ...formData, name: e.target.value })}
                            required
                        />
                    </div>

                    <div className="space-y-1.5">
                        <label className="text-[10px] text-muted uppercase font-black tracking-widest ml-1">Contact Person</label>
                        <input
                            className="w-full bg-foreground/[0.03] border border-border rounded-lg p-3 text-sm text-foreground focus:ring-1 focus:ring-blue-500/50 outline-none transition-all placeholder:text-muted/50"
                            placeholder="Full name of representative"
                            value={formData.contactPerson}
                            onChange={e => setFormData({ ...formData, contactPerson: e.target.value })}
                        />
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                        <div className="space-y-1.5">
                            <label className="text-[10px] text-muted uppercase font-black tracking-widest ml-1">Contract Type</label>
                            <select
                                className="w-full bg-foreground/[0.03] border border-border rounded-lg p-3 text-sm text-foreground focus:ring-1 focus:ring-blue-500/50 outline-none transition-all appearance-none cursor-pointer"
                                value={formData.contractType}
                                onChange={e => setFormData({ ...formData, contractType: e.target.value })}
                            >
                                <option className="bg-card text-foreground">Lump Sum</option>
                                <option className="bg-card text-foreground">Cost Plus</option>
                                <option className="bg-card text-foreground">Unit Price</option>
                            </select>
                        </div>
                        <div className="space-y-1.5">
                            <label className="text-[10px] text-muted uppercase font-black tracking-widest ml-1">Payment Terms</label>
                            <input
                                className="w-full bg-foreground/[0.03] border border-border rounded-lg p-3 text-sm text-foreground focus:ring-1 focus:ring-blue-500/50 outline-none transition-all placeholder:text-muted/50"
                                placeholder="e.g. 30 Days"
                                value={formData.paymentTerms}
                                onChange={e => setFormData({ ...formData, paymentTerms: e.target.value })}
                            />
                        </div>
                    </div>

                    <div className="flex flex-col gap-2 pt-2">
                        <motion.button
                            whileHover={{ scale: 1.01 }}
                            whileTap={{ scale: 0.99 }}
                            type="submit"
                            disabled={submitting}
                            className="w-full bg-blue-600 py-3 rounded-xl text-white font-bold hover:bg-blue-500 shadow-xl shadow-blue-500/20 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 text-sm"
                        >
                            {submitting ? <Loader2 className="animate-spin" size={16} /> : 'Establish Client'}
                        </motion.button>
                        <button
                            type="button"
                            onClick={() => setShowModal(false)}
                            className="w-full py-2 text-muted hover:text-foreground font-bold transition-colors text-xs"
                        >
                            Dismiss
                        </button>
                    </div>
                </form>
            </Modal>
        </div>
    );
}

interface StatCardProps {
    title: string;
    value: string;
    icon: React.ReactNode;
    trend: string;
    color: string;
}

function StatCard({ title, value, icon, trend, color }: StatCardProps) {
    return (
        <Card className="relative overflow-hidden group border-none bg-foreground/[0.03] p-1.5">
            <div className={`absolute -right-6 -top-6 w-20 h-20 bg-gradient-to-br ${color} to-transparent rounded-full blur-2xl opacity-40 group-hover:opacity-80 transition-opacity pointer-events-none`} />

            <div className="relative z-10 p-1.5">
                <div className="flex justify-between items-center mb-3">
                    <div className="p-2.5 bg-foreground/[0.03] rounded-xl border border-border shadow-inner group-hover:border-foreground/20 transition-colors">
                        {icon}
                    </div>
                    <span className="text-[9px] font-black text-muted uppercase tracking-widest bg-foreground/[0.03] px-1.5 py-0.5 rounded">
                        {trend}
                    </span>
                </div>
                <h3 className="text-2xl font-black text-foreground mb-0.5 tracking-tight">{value}</h3>
                <p className="text-[10px] font-bold text-muted uppercase tracking-widest">{title}</p>
            </div>
        </Card>
    );
}
