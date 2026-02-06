'use client';

import React, { useState, useEffect } from 'react';
import { Card } from '@/components/ui/Card';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { Save, AlertTriangle, Plus, Trash2, Ruler, RefreshCw, Loader2, Edit, X, Grid } from 'lucide-react';
import { getUnits, createUnit, deleteUnit, updateUnit } from '@/actions/unit-actions';
import { getCategories, createCategory, deleteCategory, updateCategory } from '@/actions/category-actions';

export default function InventorySettings() {
    const [units, setUnits] = useState<any[]>([]);
    const [newUnit, setNewUnit] = useState({ name: '', abbreviation: '' });
    const [categories, setCategories] = useState<any[]>([]);
    const [newCategory, setNewCategory] = useState({ name: '', description: '' });
    const [loading, setLoading] = useState(false);
    const [editingUnitId, setEditingUnitId] = useState<number | null>(null);
    const [editingCategoryId, setEditingCategoryId] = useState<number | null>(null);

    useEffect(() => {
        loadUnits();
        loadCategories();
    }, []);

    const loadUnits = async () => {
        setLoading(true);
        const data = await getUnits();
        setUnits(data);
        setLoading(false);
    };

    const loadCategories = async () => {
        setLoading(true);
        const data = await getCategories();
        setCategories(data);
        setLoading(false);
    };

    const handleSaveUnit = async () => {
        if (!newUnit.name || !newUnit.abbreviation) return;
        setLoading(true);

        let result;
        if (editingUnitId) {
            result = await updateUnit(editingUnitId, newUnit);
        } else {
            result = await createUnit(newUnit);
        }

        if (!result?.success) {
            alert(result?.error || 'Failed to save unit. If this persists, please restart the server.');
            setLoading(false);
            return;
        }

        if (editingUnitId) setEditingUnitId(null);
        setNewUnit({ name: '', abbreviation: '' });
        await loadUnits();
    };

    const handleSaveCategory = async () => {
        if (!newCategory.name) return;
        setLoading(true);

        let result;
        if (editingCategoryId) {
            result = await updateCategory(editingCategoryId, newCategory);
        } else {
            result = await createCategory(newCategory);
        }

        if (!result?.success) {
            alert(result?.error || 'Failed to save category. If this persists, please restart the server.');
            setLoading(false);
            return;
        }

        if (editingCategoryId) setEditingCategoryId(null);
        setNewCategory({ name: '', description: '' });
        await loadCategories();
    };

    const handleEditUnitClick = (unit: any) => {
        setNewUnit({ name: unit.name, abbreviation: unit.abbreviation });
        setEditingUnitId(unit.id);
    };

    const handleEditCategoryClick = (category: any) => {
        setNewCategory({ name: category.name, description: category.description || '' });
        setEditingCategoryId(category.id);
    };

    const handleCancelEditUnit = () => {
        setNewUnit({ name: '', abbreviation: '' });
        setEditingUnitId(null);
    };

    const handleCancelEditCategory = () => {
        setNewCategory({ name: '', description: '' });
        setEditingCategoryId(null);
    };

    const handleDeleteUnit = async (id: number) => {
        if (confirm('Are you sure you want to delete this unit?')) {
            setLoading(true);
            await deleteUnit(id);
            await loadUnits();
        }
    };

    const handleDeleteCategory = async (id: number) => {
        if (confirm('Are you sure you want to delete this category?')) {
            setLoading(true);
            await deleteCategory(id);
            await loadCategories();
        }
    };

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-xl font-bold text-white mb-2">Inventory Configuration</h2>
                    <p className="text-slate-400">Manage stock thresholds, valuation methods, and units.</p>
                </div>
                <Button className="bg-cyan-600 hover:bg-cyan-500 text-white">
                    <Save className="w-4 h-4 mr-2" /> Save Changes
                </Button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Card className="p-6 space-y-6 bg-slate-800/20 border-slate-700/50">
                    <h3 className="font-bold text-white border-b border-white/5 pb-2">Stock Control</h3>

                    <div className="space-y-4">
                        <div className="space-y-2">
                            <label className="text-sm font-medium text-slate-300">Low Stock Threshold (Default)</label>
                            <Input type="number" placeholder="10" defaultValue="10" />
                            <p className="text-xs text-slate-500">Items below this quantity will trigger alerts.</p>
                        </div>

                        <div className="space-y-2">
                            <label className="text-sm font-medium text-slate-300">Negative Stock</label>
                            <div className="flex items-center gap-3 p-3 rounded-lg bg-white/5 border border-white/10">
                                <input type="checkbox" className="w-4 h-4 rounded border-white/10 bg-slate-800 text-cyan-500 focus:ring-cyan-500/50" />
                                <span className="text-sm text-slate-300">Allow negative stock quantities</span>
                            </div>
                        </div>
                    </div>
                </Card>

                <Card className="p-6 space-y-6 bg-slate-800/20 border-slate-700/50">
                    <h3 className="font-bold text-white border-b border-white/5 pb-2">Valuation</h3>

                    <div className="space-y-4">
                        <div className="space-y-2">
                            <label className="text-sm font-medium text-slate-300">Valuation Method</label>
                            <select className="w-full h-10 px-3 rounded-lg bg-white/5 border border-white/10 text-white focus:outline-none focus:ring-2 focus:ring-cyan-500">
                                <option>FIFO (First In, First Out)</option>
                                <option>LIFO (Last In, First Out)</option>
                                <option>Weighted Average</option>
                            </select>
                        </div>

                        <div className="p-3 rounded-lg bg-amber-500/10 border border-amber-500/20 flex gap-3 items-start">
                            <AlertTriangle className="w-5 h-5 text-amber-500 flex-shrink-0" />
                            <p className="text-xs text-amber-200/80">Changing valuation methods may affect historical financial reports. Proceed with caution.</p>
                        </div>
                    </div>
                </Card>

                {/* Units of Measurement Section */}
                <Card className="p-6 space-y-6 bg-slate-800/20 border-slate-700/50 md:col-span-2">
                    <h3 className="font-bold text-white border-b border-white/5 pb-2 flex items-center gap-2">
                        <Ruler className="text-purple-500" size={20} /> Units of Measurement
                    </h3>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        {/* Form Section */}
                        <div className="md:col-span-1 space-y-4">
                            <h4 className="text-sm font-bold text-slate-300 uppercase">
                                {editingUnitId ? 'Edit Unit' : 'Add New Unit'}
                            </h4>
                            <div className="space-y-3">
                                <Input
                                    placeholder="Unit Name (e.g. Pieces)"
                                    value={newUnit.name}
                                    onChange={(e) => setNewUnit({ ...newUnit, name: e.target.value })}
                                />
                                <Input
                                    placeholder="Abbreviation (e.g. PCS)"
                                    value={newUnit.abbreviation}
                                    onChange={(e) => setNewUnit({ ...newUnit, abbreviation: e.target.value })}
                                />
                                <div className="flex gap-2">
                                    <Button
                                        onClick={handleSaveUnit}
                                        className={`flex-1 text-white ${editingUnitId ? 'bg-amber-600 hover:bg-amber-500' : 'bg-purple-600 hover:bg-purple-500'}`}
                                        disabled={!newUnit.name || !newUnit.abbreviation || loading}
                                    >
                                        {loading ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : (editingUnitId ? <Save className="w-4 h-4 mr-2" /> : <Plus className="w-4 h-4 mr-2" />)}
                                        {editingUnitId ? 'Update Unit' : 'Add Unit'}
                                    </Button>
                                    {editingUnitId && (
                                        <Button onClick={handleCancelEditUnit} variant="outline" className="text-slate-400 border-slate-600 hover:text-white">
                                            <X className="w-4 h-4" />
                                        </Button>
                                    )}
                                </div>
                            </div>
                        </div>

                        {/* Table Section */}
                        <div className="md:col-span-2">
                            <div className="flex justify-between items-center mb-4">
                                <h4 className="text-sm font-bold text-slate-300 uppercase">Active Units</h4>
                                <button
                                    onClick={loadUnits}
                                    className="text-slate-500 hover:text-white transition-colors"
                                    title="Refresh List"
                                >
                                    <RefreshCw size={16} className={loading ? "animate-spin" : ""} />
                                </button>
                            </div>

                            <div className="overflow-x-auto bg-[#0a0a0f] border border-white/5 rounded-lg">
                                <table className="w-full text-left text-sm text-slate-400">
                                    <thead className="bg-white/5 text-slate-200 uppercase text-xs">
                                        <tr>
                                            <th className="p-3">Unit ID</th>
                                            <th className="p-3">Unit Name</th>
                                            <th className="p-3">Abbreviation</th>
                                            <th className="p-3 text-right">Action</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-white/5">
                                        {units.map(unit => (
                                            <tr key={unit.id} className={`hover:bg-white/5 transition-colors ${editingUnitId === unit.id ? 'bg-white/10' : ''}`}>
                                                <td className="p-3 font-mono text-xs">{unit.id}</td>
                                                <td className="p-3">{unit.name}</td>
                                                <td className="p-3 font-bold text-white">{unit.abbreviation}</td>
                                                <td className="p-3 text-right flex justify-end gap-2">
                                                    <button
                                                        onClick={() => handleEditUnitClick(unit)}
                                                        className="text-slate-600 hover:text-amber-500 transition-colors"
                                                        title="Edit Unit"
                                                        disabled={loading}
                                                    >
                                                        <Edit size={16} />
                                                    </button>
                                                    <button
                                                        onClick={() => handleDeleteUnit(unit.id)}
                                                        className="text-slate-600 hover:text-red-500 transition-colors"
                                                        title="Delete Unit"
                                                        disabled={loading}
                                                    >
                                                        <Trash2 size={16} />
                                                    </button>
                                                </td>
                                            </tr>
                                        ))}
                                        {units.length === 0 && !loading && (
                                            <tr>
                                                <td colSpan={4} className="p-8 text-center text-slate-600 italic">
                                                    No units defined yet.
                                                </td>
                                            </tr>
                                        )}
                                        {loading && units.length === 0 && (
                                            <tr>
                                                <td colSpan={4} className="p-8 text-center text-slate-500">
                                                    Loading units...
                                                </td>
                                            </tr>
                                        )}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                </Card>

                {/* Inventory Categories Section */}
                <Card className="p-6 space-y-6 bg-slate-800/20 border-slate-700/50 md:col-span-2">
                    <h3 className="font-bold text-white border-b border-white/5 pb-2 flex items-center gap-2">
                        <Grid className="text-emerald-500" size={20} /> Inventory Categories
                    </h3>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        {/* Form Section */}
                        <div className="md:col-span-1 space-y-4">
                            <h4 className="text-sm font-bold text-slate-300 uppercase">
                                {editingCategoryId ? 'Edit Category' : 'Add New Category'}
                            </h4>
                            <div className="space-y-3">
                                <Input
                                    placeholder="Category Name (e.g. Raw Materials)"
                                    value={newCategory.name}
                                    onChange={(e) => setNewCategory({ ...newCategory, name: e.target.value })}
                                />
                                <Input
                                    placeholder="Description (Optional)"
                                    value={newCategory.description}
                                    onChange={(e) => setNewCategory({ ...newCategory, description: e.target.value })}
                                />
                                <div className="flex gap-2">
                                    <Button
                                        onClick={handleSaveCategory}
                                        className={`flex-1 text-white ${editingCategoryId ? 'bg-amber-600 hover:bg-amber-500' : 'bg-emerald-600 hover:bg-emerald-500'}`}
                                        disabled={!newCategory.name || loading}
                                    >
                                        {loading ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : (editingCategoryId ? <Save className="w-4 h-4 mr-2" /> : <Plus className="w-4 h-4 mr-2" />)}
                                        {editingCategoryId ? 'Update Category' : 'Add Category'}
                                    </Button>
                                    {editingCategoryId && (
                                        <Button onClick={handleCancelEditCategory} variant="outline" className="text-slate-400 border-slate-600 hover:text-white">
                                            <X className="w-4 h-4" />
                                        </Button>
                                    )}
                                </div>
                            </div>
                        </div>

                        {/* Table Section */}
                        <div className="md:col-span-2">
                            <div className="flex justify-between items-center mb-4">
                                <h4 className="text-sm font-bold text-slate-300 uppercase">Active Categories</h4>
                                <button
                                    onClick={loadCategories}
                                    className="text-slate-500 hover:text-white transition-colors"
                                    title="Refresh List"
                                >
                                    <RefreshCw size={16} className={loading ? "animate-spin" : ""} />
                                </button>
                            </div>

                            <div className="overflow-x-auto bg-[#0a0a0f] border border-white/5 rounded-lg">
                                <table className="w-full text-left text-sm text-slate-400">
                                    <thead className="bg-white/5 text-slate-200 uppercase text-xs">
                                        <tr>
                                            <th className="p-3">ID</th>
                                            <th className="p-3">Category Name</th>
                                            <th className="p-3">Description</th>
                                            <th className="p-3 text-right">Action</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-white/5">
                                        {categories.map(category => (
                                            <tr key={category.id} className={`hover:bg-white/5 transition-colors ${editingCategoryId === category.id ? 'bg-white/10' : ''}`}>
                                                <td className="p-3 font-mono text-xs">{category.id}</td>
                                                <td className="p-3">{category.name}</td>
                                                <td className="p-3 text-slate-500">{category.description || '-'}</td>
                                                <td className="p-3 text-right flex justify-end gap-2">
                                                    <button
                                                        onClick={() => handleEditCategoryClick(category)}
                                                        className="text-slate-600 hover:text-amber-500 transition-colors"
                                                        title="Edit Category"
                                                        disabled={loading}
                                                    >
                                                        <Edit size={16} />
                                                    </button>
                                                    <button
                                                        onClick={() => handleDeleteCategory(category.id)}
                                                        className="text-slate-600 hover:text-red-500 transition-colors"
                                                        title="Delete Category"
                                                        disabled={loading}
                                                    >
                                                        <Trash2 size={16} />
                                                    </button>
                                                </td>
                                            </tr>
                                        ))}
                                        {categories.length === 0 && !loading && (
                                            <tr>
                                                <td colSpan={4} className="p-8 text-center text-slate-600 italic">
                                                    No categories defined yet.
                                                </td>
                                            </tr>
                                        )}
                                        {loading && categories.length === 0 && (
                                            <tr>
                                                <td colSpan={4} className="p-8 text-center text-slate-500">
                                                    Loading categories...
                                                </td>
                                            </tr>
                                        )}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                </Card>
            </div>
        </div>
    );
}
