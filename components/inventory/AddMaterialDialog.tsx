'use client';

import React, { useState, useEffect } from 'react';
import { Modal } from '@/components/ui/Modal';
import { createInventoryItem } from '@/actions/inventory-actions';
import { getUnits } from '@/actions/unit-actions';
import { Loader2, AlertCircle } from 'lucide-react';

interface AddMaterialDialogProps {
    isOpen: boolean;
    onClose: () => void;
}

export default function AddMaterialDialog({ isOpen, onClose }: AddMaterialDialogProps) {
    const [isLoading, setIsLoading] = useState(false);
    const [units, setUnits] = useState<{ id: number; name: string; abbreviation: string }[]>([]);
    const [error, setError] = useState('');

    // Form State
    const [formData, setFormData] = useState({
        materialName: '',
        quantity: '',
        unit: '',
        projectId: '', // Optional: for future use
        warehouseId: '', // Optional
    });

    useEffect(() => {
        if (isOpen) {
            fetchUnits();
        }
    }, [isOpen]);

    async function fetchUnits() {
        try {
            const fetchedUnits = await getUnits();
            setUnits(fetchedUnits);
            if (fetchedUnits.length > 0) {
                // Default to first unit if none selected? Or keep empty.
            }
        } catch (err) {
            console.error('Failed to fetch units', err);
        }
    }

    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault();
        setError('');
        setIsLoading(true);

        try {
            if (!formData.materialName || !formData.quantity || !formData.unit) {
                throw new Error('Please fill in all required fields');
            }

            const result = await createInventoryItem({
                materialName: formData.materialName,
                quantity: Number(formData.quantity),
                unit: formData.unit,
                // projectId: formData.projectId ? Number(formData.projectId) : undefined,
            });

            if (result.success) {
                onClose();
                setFormData({ materialName: '', quantity: '', unit: '', projectId: '', warehouseId: '' });
            } else {
                throw new Error(result.error || 'Failed to create item');
            }
        } catch (err: any) {
            setError(err.message);
        } finally {
            setIsLoading(false);
        }
    }

    return (
        <Modal isOpen={isOpen} onClose={onClose} title="Add New Material">
            <form onSubmit={handleSubmit} className="space-y-6">
                {error && (
                    <div className="p-4 bg-red-500/10 border border-red-500/20 rounded-lg flex items-center gap-3 text-red-400">
                        <AlertCircle size={20} />
                        <p className="text-sm">{error}</p>
                    </div>
                )}

                <div className="space-y-2">
                    <label className="text-sm font-medium text-slate-300">Material Name *</label>
                    <input
                        type="text"
                        value={formData.materialName}
                        onChange={(e) => setFormData({ ...formData, materialName: e.target.value })}
                        className="w-full bg-[#0a0a0f] border border-white/10 rounded-lg px-4 py-3 text-slate-200 focus:outline-none focus:border-cyan-500/50 transition-colors"
                        placeholder="e.g. Cement, Steel Bar"
                    />
                </div>

                <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                        <label className="text-sm font-medium text-slate-300">Quantity *</label>
                        <input
                            type="number"
                            value={formData.quantity}
                            onChange={(e) => setFormData({ ...formData, quantity: e.target.value })}
                            className="w-full bg-[#0a0a0f] border border-white/10 rounded-lg px-4 py-3 text-slate-200 focus:outline-none focus:border-cyan-500/50 transition-colors"
                            placeholder="0.00"
                            step="0.01"
                        />
                    </div>
                    <div className="space-y-2">
                        <label className="text-sm font-medium text-slate-300">Unit *</label>
                        <select
                            value={formData.unit}
                            onChange={(e) => setFormData({ ...formData, unit: e.target.value })}
                            className="w-full bg-[#0a0a0f] border border-white/10 rounded-lg px-4 py-3 text-slate-200 focus:outline-none focus:border-cyan-500/50 transition-colors appearance-none"
                        >
                            <option value="">Select Unit</option>
                            {units.map((u) => (
                                <option key={u.id} value={u.abbreviation}>
                                    {u.name} ({u.abbreviation})
                                </option>
                            ))}
                        </select>
                    </div>
                </div>

                <div className="pt-4 flex justify-end gap-3">
                    <button
                        type="button"
                        onClick={onClose}
                        className="px-4 py-2 text-slate-400 hover:text-white transition-colors"
                        disabled={isLoading}
                    >
                        Cancel
                    </button>
                    <button
                        type="submit"
                        disabled={isLoading}
                        className="px-6 py-2 bg-gradient-to-r from-cyan-500 to-blue-500 text-white rounded-lg font-medium hover:from-cyan-400 hover:to-blue-400 focus:outline-none focus:ring-2 focus:ring-cyan-500/20 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                    >
                        {isLoading ? (
                            <>
                                <Loader2 size={18} className="animate-spin" />
                                <span>Saving...</span>
                            </>
                        ) : (
                            <span>Save Material</span>
                        )}
                    </button>
                </div>
            </form>
        </Modal>
    );
}
