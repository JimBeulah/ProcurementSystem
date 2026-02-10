'use client';

import React, { useState, useEffect } from 'react';
import { Briefcase, Plus, MapPin, Calendar, DollarSign, Building } from 'lucide-react';
import { getProjects, createProject } from '@/actions/project-actions';
import { getClients } from '@/actions/client-actions';
import { Card } from '@/components/ui/Card';
import Link from 'next/link';
import { Modal } from '@/components/ui/Modal';

export default function ProjectsPage() {
    const [projects, setProjects] = useState<any[]>([]);
    const [clients, setClients] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);

    // Form
    const [formData, setFormData] = useState({
        name: '',
        clientId: '',
        location: '',
        budget: '',
        duration: '',
        status: 'ACTIVE'
    });

    useEffect(() => {
        loadData();
    }, []);

    const loadData = async () => {
        setLoading(true);
        const [pData, cData] = await Promise.all([getProjects(), getClients()]);
        setProjects(pData);
        setClients(cData);
        setLoading(false);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        await createProject({
            ...formData,
            clientId: Number(formData.clientId),
            budget: Number(formData.budget)
        });
        setShowModal(false);
        setFormData({ name: '', clientId: '', location: '', budget: '', duration: '', status: 'ACTIVE' });
        loadData();
    };

    return (
        <div className="p-6 space-y-6">
            <header className="flex justify-between items-center pb-6 border-b border-white/5">
                <div>
                    <h1 className="text-2xl font-bold text-white flex items-center gap-3">
                        <Briefcase className="text-cyan-500" /> Project Management
                    </h1>
                    <p className="text-slate-400">Track construction projects, budgets, and milestones.</p>
                </div>
                <button
                    onClick={() => setShowModal(true)}
                    className="bg-cyan-600 hover:bg-cyan-500 text-white px-4 py-2 rounded-lg flex items-center gap-2 shadow-lg shadow-cyan-500/20"
                >
                    <Plus size={18} /> Create Project
                </button>
            </header>

            {loading ? (
                <div className="text-slate-500 text-center p-8">Loading projects...</div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {projects.map(project => (
                        <Card key={project.id} hoverEffect className="group relative">
                            <Link href={`/projects/${project.id}`} className="absolute inset-0 z-10" />
                            <div className="flex justify-between items-start mb-4">
                                <div className="p-3 rounded-lg bg-cyan-500/10 text-cyan-400">
                                    <Briefcase size={24} />
                                </div>
                                <span className={`text-xs font-bold px-2 py-1 rounded ${project.status === 'ACTIVE' ? 'bg-emerald-500/20 text-emerald-400' : 'bg-slate-700 text-slate-400'}`}>
                                    {project.status}
                                </span>
                            </div>

                            <h3 className="text-xl font-bold text-white mb-2 group-hover:text-cyan-400 transition-colors">{project.name}</h3>

                            <div className="flex items-center gap-2 text-sm text-slate-400 mb-4 bg-white/5 p-2 rounded">
                                <Building size={14} />
                                <span className="font-medium text-slate-300">{project.client?.name || 'Internal'}</span>
                            </div>

                            <div className="space-y-3 pt-2 text-sm">
                                <div className="flex items-center gap-3 text-slate-400">
                                    <MapPin size={16} /> {project.location}
                                </div>
                                <div className="flex items-center gap-3 text-slate-400">
                                    <Calendar size={16} /> {project.duration || 'N/A'}
                                </div>
                                <div className="flex items-center gap-3 text-emerald-400 font-mono">
                                    <DollarSign size={16} /> {Number(project.budget).toLocaleString(undefined, { minimumFractionDigits: 2 })}
                                </div>
                            </div>
                        </Card>
                    ))}
                </div>
            )}

            {/* Modal */}
            <Modal
                isOpen={showModal}
                onClose={() => setShowModal(false)}
                title="Create New Project"
            >
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="text-xs text-slate-400 uppercase font-bold mb-1 block">Client</label>
                        <select className="w-full bg-black/20 border border-white/10 rounded p-2 text-white" value={formData.clientId} onChange={e => setFormData({ ...formData, clientId: e.target.value })} required>
                            <option value="">Select Client</option>
                            {clients.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                        </select>
                    </div>

                    <div>
                        <label className="text-xs text-slate-400 uppercase font-bold mb-1 block">Project Name</label>
                        <input className="w-full bg-black/20 border border-white/10 rounded p-2 text-white" value={formData.name} onChange={e => setFormData({ ...formData, name: e.target.value })} required />
                    </div>

                    <div>
                        <label className="text-xs text-slate-400 uppercase font-bold mb-1 block">Location</label>
                        <input className="w-full bg-black/20 border border-white/10 rounded p-2 text-white" value={formData.location} onChange={e => setFormData({ ...formData, location: e.target.value })} />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="text-xs text-slate-400 uppercase font-bold mb-1 block">Budget</label>
                            <input type="number" step="0.01" className="w-full bg-black/20 border border-white/10 rounded p-2 text-white" value={formData.budget} onChange={e => setFormData({ ...formData, budget: e.target.value })} required />
                        </div>
                        <div>
                            <label className="text-xs text-slate-400 uppercase font-bold mb-1 block">Duration</label>
                            <input placeholder="e.g. 12 Months" className="w-full bg-black/20 border border-white/10 rounded p-2 text-white" value={formData.duration} onChange={e => setFormData({ ...formData, duration: e.target.value })} />
                        </div>
                    </div>

                    <div className="flex justify-end gap-3 pt-4">
                        <button type="button" onClick={() => setShowModal(false)} className="px-4 py-2 text-slate-400 hover:text-white transition-colors">Cancel</button>
                        <button type="submit" className="bg-cyan-600 px-6 py-2 rounded-lg text-white font-bold hover:bg-cyan-500 shadow-lg shadow-cyan-600/20 transition-all">Create Project</button>
                    </div>
                </form>
            </Modal>
        </div>
    );
}
