'use client';

import React, { useState, useEffect } from 'react';
import { Shield, Plus, Trash2, ArrowRight } from 'lucide-react';
import { getWorkflowRules, createWorkflowRule, deleteWorkflowRule } from '@/actions/workflow-actions';
import { Breadcrumbs } from '@/components/ui/Breadcrumbs';

export default function WorkflowsPage() {
    const [rules, setRules] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);

    // New Rule Form
    const [formData, setFormData] = useState({
        processType: 'PO',
        minAmount: 0,
        maxAmount: '',
        approverRole: 'PROJECT_MANAGER'
    });

    useEffect(() => {
        loadRules();
    }, []);

    const loadRules = async () => {
        setLoading(true);
        const data = await getWorkflowRules();
        setRules(data);
        setLoading(false);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        const payload = {
            ...formData,
            maxAmount: formData.maxAmount ? parseFloat(formData.maxAmount) : undefined,
            minAmount: Number(formData.minAmount)
        };

        await createWorkflowRule(payload as any);
        setShowModal(false);
        setFormData({ processType: 'PO', minAmount: 0, maxAmount: '', approverRole: 'PROJECT_MANAGER' });
        loadRules();
    };

    const handleDelete = async (id: number) => {
        if (confirm('Delete this rule?')) {
            await deleteWorkflowRule(id);
            loadRules();
        }
    };

    return (
        <div className="p-6 space-y-6">
            <Breadcrumbs />
            <header className="flex justify-between items-center pb-6 border-b border-white/5">
                <div>
                    <h1 className="text-2xl font-bold text-white flex items-center gap-3">
                        <Shield className="text-emerald-500" /> Approval Workflows
                    </h1>
                    <p className="text-slate-400">Configure approval hierarchy and spending limits.</p>
                </div>
                <button
                    onClick={() => setShowModal(true)}
                    className="bg-emerald-600 hover:bg-emerald-500 text-white px-4 py-2 rounded-lg flex items-center gap-2"
                >
                    <Plus size={18} /> Add Rule
                </button>
            </header>

            <div className="grid gap-4">
                {['PO', 'RFQ', 'PAYMENT'].map(type => {
                    const typeRules = rules.filter(r => r.processType === type);
                    if (typeRules.length === 0) return null;

                    return (
                        <div key={type} className="bg-[#0a0a0f] border border-white/5 rounded-xl p-6">
                            <h2 className="text-lg font-bold text-white mb-4 border-l-4 border-emerald-500 pl-3">{type} Approval Flow</h2>
                            <div className="space-y-3">
                                {typeRules.map((rule, idx) => (
                                    <div key={rule.id} className="flex items-center bg-white/5 p-4 rounded-lg group">
                                        <div className="w-8 h-8 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center font-bold text-sm mr-4">
                                            {idx + 1}
                                        </div>
                                        <div className="flex-1">
                                            <div className="text-sm text-slate-400 mb-1">Condition</div>
                                            <div className="font-mono text-white">
                                                {Number(rule.minAmount).toLocaleString()}
                                                <span className="text-slate-500 mx-2">-</span>
                                                {rule.maxAmount ? Number(rule.maxAmount).toLocaleString() : 'Unlimited'}
                                            </div>
                                        </div>
                                        <ArrowRight className="text-slate-600 mx-6" />
                                        <div className="flex-1">
                                            <div className="text-sm text-slate-400 mb-1">Required Approver</div>
                                            <span className="inline-block px-3 py-1 rounded-full bg-blue-500/10 text-blue-400 text-xs font-semibold border border-blue-500/20">
                                                {rule.approverRole}
                                            </span>
                                        </div>
                                        <button
                                            onClick={() => handleDelete(rule.id)}
                                            className="opacity-0 group-hover:opacity-100 p-2 text-red-400 hover:bg-red-500/10 rounded-lg transition-all"
                                        >
                                            <Trash2 size={16} />
                                        </button>
                                    </div>
                                ))}
                            </div>
                        </div>
                    );
                })}
                {rules.length === 0 && !loading && (
                    <div className="text-center p-12 text-slate-500 bg-white/5 rounded-xl border border-dashed border-white/10">
                        No approval rules configured. Add one to start.
                    </div>
                )}
            </div>

            {/* Add Modal */}
            {showModal && (
                <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4">
                    <div className="bg-[#1a1a20] p-6 rounded-xl w-full max-w-md border border-white/10 space-y-4">
                        <h2 className="text-xl font-bold text-white">Add Approval Rule</h2>
                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div>
                                <label className="text-xs text-slate-400 uppercase font-bold mb-1 block">Module</label>
                                <select
                                    className="w-full bg-black/20 border border-white/10 rounded p-2 text-white"
                                    value={formData.processType}
                                    onChange={e => setFormData({ ...formData, processType: e.target.value })}
                                >
                                    <option value="PO">Purchase Order (PO)</option>
                                    <option value="RFQ">Request for Quotation (RFQ)</option>
                                    <option value="PAYMENT">Payment / Disbursement</option>
                                </select>
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="text-xs text-slate-400 uppercase font-bold mb-1 block">Min Amount</label>
                                    <input type="number" className="w-full bg-black/20 border border-white/10 rounded p-2 text-white" value={formData.minAmount} onChange={e => setFormData({ ...formData, minAmount: Number(e.target.value) })} />
                                </div>
                                <div>
                                    <label className="text-xs text-slate-400 uppercase font-bold mb-1 block">Max Amount</label>
                                    <input type="number" placeholder="Unlimited" className="w-full bg-black/20 border border-white/10 rounded p-2 text-white" value={formData.maxAmount} onChange={e => setFormData({ ...formData, maxAmount: e.target.value })} />
                                </div>
                            </div>

                            <div>
                                <label className="text-xs text-slate-400 uppercase font-bold mb-1 block">Approver Role</label>
                                <select
                                    className="w-full bg-black/20 border border-white/10 rounded p-2 text-white"
                                    value={formData.approverRole}
                                    onChange={e => setFormData({ ...formData, approverRole: e.target.value })}
                                >
                                    <option value="PROJECT_MANAGER">Project Manager</option>
                                    <option value="PROCUREMENT_OFFICER">Procurement Officer</option>
                                    <option value="FINANCE">Finance</option>
                                    <option value="AUDITOR">Auditor</option>
                                    <option value="HEAD_OF_ADMIN">Head of Admin</option>
                                    <option value="ADMIN">Admin</option>
                                </select>
                            </div>

                            <div className="flex justify-end gap-3 pt-4">
                                <button type="button" onClick={() => setShowModal(false)} className="px-4 py-2 text-slate-400 hover:text-white">Cancel</button>
                                <button type="submit" className="bg-emerald-600 px-4 py-2 rounded text-white font-medium hover:bg-emerald-500">Save Rule</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}
