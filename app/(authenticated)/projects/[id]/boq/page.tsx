'use client';

import React, { useState, useEffect, use } from 'react';
import { ClipboardList, Plus, Save, RefreshCcw, Upload, FileDown, Search, ChevronDown, ChevronUp } from 'lucide-react';
import { getProjectBoq, createBoqItem, bulkCreateBoqItems } from '@/actions/boq-actions';
import { getMaterials } from '@/actions/master-data-actions';
import { getUnits } from '@/actions/unit-actions';
import { getProject, updateProjectAreas } from '@/actions/project-actions';
import { LayoutGrid, Home, Car } from 'lucide-react';

interface BoqPageProps {
    params: Promise<{ id: string }>;
}

export default function ProjectBoqPage({ params }: BoqPageProps) {
    // Correctly unwrap params using React.use() if necessary in Next.js 15+, but for now treating as async prop or params access
    // If params is a Promise in newer Next.js versions, we must await it. 
    // Assuming standard Next.js 14/15 behavior where params is available.

    // Safety check for ID
    const { id } = use(params);
    const projectId = parseInt(id);

    const [items, setItems] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [materials, setMaterials] = useState<any[]>([]);
    const [units, setUnits] = useState<any[]>([]);
    const [project, setProject] = useState<any>(null);
    const [searchQuery, setSearchQuery] = useState('');
    const [isFormOpen, setIsFormOpen] = useState(true);

    // Add Form
    const [newItem, setNewItem] = useState({
        itemDescription: '',
        unit: '',
        materialUnitPrice: 0,
        laborUnitPrice: 0,
        quantity: 0,
        isCarport: false
    });

    useEffect(() => {
        loadData();
    }, [projectId]);

    const loadData = async () => {
        setLoading(true);
        const [boqData, matData, unitData, projectData] = await Promise.all([
            getProjectBoq(projectId),
            getMaterials(),
            getUnits(),
            getProject(projectId)
        ]);
        setItems(boqData);
        setMaterials(matData);
        setUnits(unitData);
        setProject(projectData);
        setLoading(false);
    };

    const handleMaterialSelect = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const mat = materials.find(m => m.name === e.target.value);
        if (mat) {
            setNewItem({
                ...newItem,
                itemDescription: mat.name,
                unit: mat.unit
            });
        } else {
            setNewItem({ ...newItem, itemDescription: e.target.value });
        }
    };

    const handleAdd = async (e: React.FormEvent) => {
        e.preventDefault();
        await createBoqItem({
            projectId,
            ...newItem,
            materialUnitPrice: Number(newItem.materialUnitPrice),
            laborUnitPrice: Number(newItem.laborUnitPrice),
            quantity: Number(newItem.quantity)
        });
        setNewItem({
            itemDescription: '',
            unit: '',
            materialUnitPrice: 0,
            laborUnitPrice: 0,
            quantity: 0,
            isCarport: false
        });
        loadData();
    };

    const handleUpdateAreas = async (floorArea: number, carportArea: number) => {
        const res = await updateProjectAreas(projectId, { totalFloorArea: floorArea, carportArea });
        if (res.success) {
            loadData();
        } else {
            alert(res.error);
        }
    };

    const totalMaterialCost = items.reduce((sum, item) => sum + (Number(item.materialUnitPrice) * Number(item.quantity)), 0);
    const totalLaborCost = items.reduce((sum, item) => sum + (Number(item.laborUnitPrice || 0) * Number(item.quantity)), 0);
    const totalMaterialUnitCost = items.reduce((sum, item) => sum + Number(item.materialUnitPrice), 0);
    const totalLaborUnitCost = items.reduce((sum, item) => sum + Number(item.laborUnitPrice || 0), 0);
    const totalConstructionCost = totalMaterialCost + totalLaborCost;

    // Area Metrics Calculations (Including 10% profit)
    const baseCarportAmount = items.filter(i => i.isCarport).reduce((sum, i) => sum + ((Number(i.materialUnitPrice) + Number(i.laborUnitPrice || 0)) * Number(i.quantity)), 0);
    const amountOfCarport = baseCarportAmount * 1.1;
    const amountWithoutCarport = (totalConstructionCost * 1.1) - amountOfCarport;

    const floorArea = project?.totalFloorArea || 0;
    const carportArea = project?.carportArea || 0;

    const amountPerSqmBuilding = floorArea > 0 ? amountWithoutCarport / floorArea : 0;
    const amountPerSqmCarport = carportArea > 0 ? amountOfCarport / carportArea : 0;

    const downloadTemplate = () => {
        const headers = ['NO', 'ITEM DESCRIPTION', 'UNIT', 'QUANTITY', 'MATERIAL UNIT COST', 'MATERIAL TOTAL COST', 'LABOR UNIT COST', 'LABOR TOTAL COST'];
        const rows = [
            ['1', 'GENERAL REQUIREMENTS', 'lot', '1.00', '', '28500.00', '', '0.00'],
            ['2', 'FORMWORKS / EARTH WORKS', 'lot', '1.00', '', '81022.00', '', '40448.80'],
            ['3', 'CONCRETE / STRUCTURAL', 'lot', '1.00', '', '275959.00', '', '110383.60']
        ];
        const csvContent = [headers.join(','), ...rows.map(r => r.join(','))].join('\n');
        const blob = new Blob([csvContent], { type: 'text/csv' });
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'boq_template.csv';
        a.click();
    };

    const handleBulkUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        const reader = new FileReader();
        reader.onload = async (event) => {
            // Remove UTF-8 BOM if present
            const text = (event.target?.result as string).replace(/^\uFEFF/, '');
            if (!text) {
                alert("File is empty");
                return;
            }

            const lines = text.split(/\r?\n/).filter(line => line.trim() !== '');
            if (lines.length < 2) {
                alert("CSV must contain at least a header and one data row.");
                return;
            }

            // Detect delimiter (comma or semicolon)
            const firstLine = lines[0];
            const delimiter = firstLine.includes(';') && !firstLine.includes(',') ? ';' : ',';

            const splitLine = (line: string) => {
                const result = [];
                let cell = "";
                let inQuotes = false;
                for (let i = 0; i < line.length; i++) {
                    const char = line[i];
                    if (char === '"') inQuotes = !inQuotes;
                    else if (char === delimiter && !inQuotes) {
                        result.push(cell.trim());
                        cell = "";
                    } else {
                        cell += char;
                    }
                }
                result.push(cell.trim());
                return result;
            };

            const csvHeaders = splitLine(lines[0]).map(h => h.toUpperCase().replace(/["']/g, '').trim());

            const data = lines.slice(1).map((line) => {
                const values = splitLine(line);
                const row: any = {};
                csvHeaders.forEach((header, index) => {
                    row[header] = values[index];
                });

                const qty = parseFloat(String(row['QUANTITY'] || '1').replace(/,/g, '')) || 1;

                // Flexible header matching - prioritize ITEM DESCRIPTION but fallback to name
                // Also ensure we don't accidentally pick up the "NO" column value if it's numeric
                let rawName = row['ITEM DESCRIPTION'] || row['DESCRIPTION'] || row['ITEM'] || row['MATERIAL NAME'] || '';

                // If the picked rawName is just a number (like an index 1, 2, 3) or empty, look for a text candidate
                const isNumeric = (val: string) => !val || (!isNaN(Number(val)) && String(val).length < 6);

                if (isNumeric(rawName)) {
                    // Try to find the first non-numeric value that contains letters in the row
                    const textCandidate = values.find(v => v && /[a-zA-Z]/.test(String(v)));
                    if (textCandidate) rawName = textCandidate;
                }

                // Smart mapping based on Excel headers (handling commas in numbers)
                const matUnit = parseFloat(String(row['MATERIAL UNIT COST'] || '0').replace(/,/g, ''));
                const matTotal = parseFloat(String(row['MATERIAL TOTAL COST'] || '0').replace(/,/g, ''));
                const finalMatUnit = isNaN(matUnit) || matUnit === 0 ? (qty > 0 ? matTotal / qty : 0) : matUnit;

                const labUnit = parseFloat(String(row['LABOR UNIT COST'] || '0').replace(/,/g, ''));
                const labTotal = parseFloat(String(row['LABOR TOTAL COST'] || '0').replace(/,/g, ''));
                const finalLabUnit = isNaN(labUnit) || labUnit === 0 ? (qty > 0 ? labTotal / qty : 0) : labUnit;

                return {
                    itemDescription: rawName || 'Unnamed Item',
                    unit: row['UNIT'] || 'lot',
                    materialUnitPrice: finalMatUnit || 0,
                    laborUnitPrice: finalLabUnit || 0,
                    quantity: qty
                };
            }).filter(item => item.itemDescription && item.itemDescription !== 'Unnamed Item');

            if (data.length > 0) {
                setLoading(true);
                const res = await bulkCreateBoqItems(projectId, data);
                if (res.success) {
                    loadData();
                    alert(`Successfully imported ${data.length} items.`);
                } else {
                    alert(`Failed to import: ${res.error}`);
                }
                setLoading(false);
            } else {
                alert(`No valid items found. Headers found: ${csvHeaders.join(', ')}. Ensure 'ITEM DESCRIPTION' is one of them.`);
            }
        };
        reader.onerror = () => alert("Error reading file.");
        reader.readAsText(file);
        e.target.value = '';
    };

    const filteredItems = items.filter(item =>
        item.itemDescription.toLowerCase().includes(searchQuery.toLowerCase())
    );

    return (
        <div className="p-6 space-y-6">
            <header className="pb-6 border-b border-white/5">
                <h1 className="text-2xl font-bold text-white flex items-center gap-3">
                    <ClipboardList className="text-orange-500" /> Bill of Quantities (BOQ)
                </h1>
                <p className="text-slate-400">Define project material, labor requirements and budget limits.</p>
                <div className="flex items-center gap-3 mt-4">
                    <div className="relative group flex-1 max-w-md">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-cyan-500 transition-colors" size={16} />
                        <input
                            type="text"
                            placeholder="Find BOQ items..."
                            className="w-full bg-black/40 border border-white/10 rounded-lg pl-10 pr-4 py-2 text-white text-sm focus:border-cyan-500/50 outline-none transition-all"
                            value={searchQuery}
                            onChange={e => setSearchQuery(e.target.value)}
                        />
                    </div>

                    <div className="flex items-center gap-2 border-l border-white/5 pl-3">
                        <button
                            onClick={loadData}
                            disabled={loading}
                            className="p-2 text-slate-400 hover:text-white hover:bg-white/5 rounded-lg transition-colors flex items-center gap-2 text-xs"
                            title="Refresh Data"
                        >
                            <RefreshCcw size={16} className={loading ? 'animate-spin' : ''} />
                            <span className="hidden sm:inline">Refresh</span>
                        </button>

                        <button
                            onClick={downloadTemplate}
                            className="p-2 text-slate-400 hover:text-white hover:bg-white/5 rounded-lg transition-colors flex items-center gap-2 text-xs"
                            title="Download CSV Template"
                        >
                            <FileDown size={16} />
                            <span className="hidden sm:inline">Template</span>
                        </button>

                        <label className="bg-cyan-600/10 hover:bg-cyan-600/20 border border-cyan-500/30 text-cyan-400 px-3 py-2 rounded-lg flex items-center gap-2 cursor-pointer transition-all text-xs font-bold uppercase tracking-wider">
                            <Upload size={16} />
                            <span>Bulk Upload</span>
                            <input
                                type="file"
                                accept=".csv"
                                className="hidden"
                                onChange={handleBulkUpload}
                                disabled={loading}
                            />
                        </label>
                    </div>
                </div>
            </header>

            <div className="grid grid-cols-1 xl:grid-cols-4 gap-6">
                {/* BOQ List */}
                <div className="xl:col-span-3 bg-[#0a0a0f] border border-white/5 rounded-xl overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="w-full text-left text-slate-400 border-collapse">
                            <thead className="bg-white/5 text-slate-200 uppercase text-[9px] font-bold">
                                <tr className="border-b border-white/10">
                                    <th className="p-3 border-r border-white/10 text-center w-12">No</th>
                                    <th className="p-3 border-r border-white/10 min-w-[200px]">Item Description</th>
                                    <th className="p-3 border-r border-white/10 text-center">Unit</th>
                                    <th className="p-3 border-r border-white/10 text-center">Quantity</th>
                                    <th className="p-3 border-r border-white/10 text-right">Material Unit Cost</th>
                                    <th className="p-3 border-r border-white/10 text-right">Material Total Cost</th>
                                    <th className="p-3 border-r border-white/10 text-right">Labor Unit Cost</th>
                                    <th className="p-3 border-r border-white/10 text-right">Labor Total Cost</th>
                                    <th className="p-3 text-right">Total Amount</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-white/5 text-xs">
                                {filteredItems.map((item, idx) => {
                                    const matTotal = Number(item.materialUnitPrice) * Number(item.quantity);
                                    const laborTotal = (Number(item.laborUnitPrice) || 0) * Number(item.quantity);
                                    const rowTotal = matTotal + laborTotal;

                                    return (
                                        <tr key={item.id} className="hover:bg-white/5">
                                            <td className="p-3 border-r border-white/5 text-center text-[10px] text-slate-500 font-mono">
                                                {idx + 1}
                                            </td>
                                            <td className="p-3 border-r border-white/5">
                                                <div className="flex items-center gap-2">
                                                    <div className="font-medium text-white">{item.itemDescription}</div>
                                                    {item.isCarport && (
                                                        <span className="text-[8px] bg-orange-500/10 text-orange-400 border border-orange-500/20 px-1 rounded flex items-center gap-1 uppercase font-bold">
                                                            <Car size={10} /> Carport
                                                        </span>
                                                    )}
                                                </div>
                                            </td>
                                            <td className="p-3 border-r border-white/5 text-center">{item.unit}</td>
                                            <td className="p-3 border-r border-white/5 text-center font-mono text-cyan-400">{item.quantity}</td>
                                            <td className="p-3 border-r border-white/5 text-right font-mono italic">
                                                {Number(item.materialUnitPrice).toLocaleString(undefined, { minimumFractionDigits: 2 })}
                                            </td>
                                            <td className="p-3 border-r border-white/5 text-right font-mono">
                                                {matTotal.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                                            </td>
                                            <td className="p-3 border-r border-white/5 text-right font-mono italic text-slate-500">
                                                {Number(item.laborUnitPrice || 0).toLocaleString(undefined, { minimumFractionDigits: 2 })}
                                            </td>
                                            <td className="p-3 border-r border-white/5 text-right font-mono text-slate-500">
                                                {laborTotal.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                                            </td>
                                            <td className="p-3 text-right font-mono text-emerald-400 font-bold">
                                                {rowTotal.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                                            </td>
                                        </tr>
                                    );
                                })}
                                {items.length === 0 && !loading && (
                                    <tr>
                                        <td colSpan={9} className="p-8 text-center opacity-50">No BOQ items defined yet.</td>
                                    </tr>
                                )}
                            </tbody>
                            <tfoot className="border-t-2 border-white/10 bg-white/5 font-bold text-white text-xs">
                                <tr className="border-b border-white/5 text-[10px] text-slate-400">
                                    <td colSpan={4} className="p-3 text-right border-r border-white/5">SUMMARY TOTALS</td>
                                    <td className="p-3 text-right border-r border-white/5 font-mono text-cyan-500/50 italic">
                                        {totalMaterialUnitCost.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                                    </td>
                                    <td className="p-3 text-right border-r border-white/5 font-mono text-cyan-400">
                                        {totalMaterialCost.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                                    </td>
                                    <td className="p-3 text-right border-r border-white/5 font-mono text-purple-500/50 italic">
                                        {totalLaborUnitCost.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                                    </td>
                                    <td className="p-3 text-right border-r border-white/5 font-mono text-purple-400">
                                        {totalLaborCost.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                                    </td>
                                    <td className="p-3 text-right font-mono text-emerald-400">
                                        {totalConstructionCost.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                                    </td>
                                </tr>
                                <tr>
                                    <td colSpan={8} className="p-4 text-right border-r border-white/5 uppercase tracking-wider text-slate-400">Total Construction Cost</td>
                                    <td className="p-4 text-right text-emerald-400 border-b border-white/5 text-sm">
                                        {totalConstructionCost.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                                    </td>
                                </tr>
                                <tr className="bg-orange-600/10">
                                    <td colSpan={8} className="p-4 text-right border-r border-white/5 text-orange-400 uppercase tracking-wider">
                                        Total Construction Cost (+ 10% profit)
                                    </td>
                                    <td className="p-4 text-right text-orange-400 font-black text-sm">
                                        {(totalConstructionCost * 1.1).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                                    </td>
                                </tr>
                            </tfoot>
                        </table>
                    </div>
                </div>

                {/* Add Item Form */}
                <div className="bg-[#1a1a20] rounded-xl border border-white/10 h-fit overflow-hidden transition-all duration-300">
                    <button
                        onClick={() => setIsFormOpen(!isFormOpen)}
                        className="w-full p-6 text-left hover:bg-white/5 transition-colors flex items-center justify-between"
                    >
                        <h2 className="text-lg font-bold text-white flex items-center gap-2">
                            <Plus size={18} className="text-orange-500" /> Add Item
                        </h2>
                        {isFormOpen ? <ChevronUp size={20} className="text-slate-500" /> : <ChevronDown size={20} className="text-slate-500" />}
                    </button>

                    {isFormOpen && (
                        <div className="p-6 pt-0">
                            <form onSubmit={handleAdd} className="space-y-4">
                                <div>
                                    <label className="text-[10px] text-slate-400 uppercase font-bold mb-1 block">Item Description</label>
                                    <input
                                        list="material-suggestions"
                                        className="w-full bg-black/20 border border-white/10 rounded p-2 text-white text-sm"
                                        value={newItem.itemDescription}
                                        onChange={e => {
                                            const val = e.target.value;
                                            const mat = materials.find(m => m.name === val);
                                            if (mat) {
                                                setNewItem({ ...newItem, itemDescription: mat.name, unit: mat.unit });
                                            } else {
                                                setNewItem({ ...newItem, itemDescription: val });
                                            }
                                        }}
                                        required
                                        placeholder="Type description or select..."
                                    />
                                    <datalist id="material-suggestions">
                                        {materials.map(m => <option key={m.id} value={m.name} />)}
                                    </datalist>
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="text-[10px] text-slate-400 uppercase font-bold mb-1 block">Quantity</label>
                                        <input type="number" step="0.01" className="w-full bg-black/20 border border-white/10 rounded p-2 text-white text-sm" value={newItem.quantity || ''} onChange={e => setNewItem({ ...newItem, quantity: parseFloat(e.target.value) })} required />
                                    </div>
                                    <div className="flex flex-col">
                                        <label className="text-[10px] text-slate-400 uppercase font-bold mb-1 block">Classification</label>
                                        <button
                                            type="button"
                                            onClick={() => setNewItem({ ...newItem, isCarport: !newItem.isCarport })}
                                            className={`flex-1 flex items-center justify-center gap-2 rounded border transition-all text-[10px] font-bold uppercase tracking-wider h-[38px] ${newItem.isCarport
                                                ? 'bg-orange-500/20 border-orange-500 text-orange-400 shadow-[0_0_10px_rgba(249,115,22,0.2)]'
                                                : 'bg-cyan-500/10 border-cyan-500/30 text-cyan-400'
                                                }`}
                                        >
                                            {newItem.isCarport ? <Car size={14} /> : <Home size={14} />}
                                            {newItem.isCarport ? 'Carport Item' : 'Building Item'}
                                        </button>
                                    </div>
                                </div>

                                <div>
                                    <label className="text-[10px] text-slate-400 uppercase font-bold mb-1 block">Unit</label>
                                    <input
                                        list="unit-suggestions"
                                        className="w-full bg-black/20 border border-white/10 rounded p-2 text-white text-sm"
                                        value={newItem.unit}
                                        onChange={e => setNewItem({ ...newItem, unit: e.target.value })}
                                        required
                                        placeholder="Unit (e.g. PCS, KG)"
                                    />
                                    <datalist id="unit-suggestions">
                                        {units.map(u => (
                                            <option key={u.id} value={u.abbreviation}>{u.name}</option>
                                        ))}
                                    </datalist>
                                </div>

                                <div className="space-y-4 border-t border-white/5 pt-4">
                                    {/* Cost Headers side-by-side */}
                                    <div className="grid grid-cols-2 gap-4">
                                        <h3 className="text-[10px] text-cyan-500 uppercase font-black flex items-center gap-2">
                                            <span className="w-1 h-3 bg-cyan-500 rounded-full" /> Material Cost
                                        </h3>
                                        <h3 className="text-[10px] text-purple-500 uppercase font-black flex items-center gap-2">
                                            <span className="w-1 h-3 bg-purple-500 rounded-full" /> Labor Cost
                                        </h3>
                                    </div>

                                    {/* Unit Costs side-by-side */}
                                    <div className="grid grid-cols-2 gap-4">
                                        <div>
                                            <label className="text-[10px] text-slate-500 uppercase font-bold mb-1 block">Unit Cost</label>
                                            <input type="number" step="0.01" className="w-full bg-black/20 border border-cyan-500/30 rounded p-2 text-white text-sm" value={newItem.materialUnitPrice || ''} onChange={e => setNewItem({ ...newItem, materialUnitPrice: parseFloat(e.target.value) })} required />
                                        </div>
                                        <div>
                                            <label className="text-[10px] text-slate-500 uppercase font-bold mb-1 block">Unit Cost</label>
                                            <input type="number" step="0.01" className="w-full bg-black/20 border border-purple-500/30 rounded p-2 text-white text-sm" value={newItem.laborUnitPrice || ''} onChange={e => setNewItem({ ...newItem, laborUnitPrice: parseFloat(e.target.value) })} required />
                                        </div>
                                    </div>

                                    {/* Totals side-by-side */}
                                    <div className="grid grid-cols-2 gap-4">
                                        <div>
                                            <label className="text-[10px] text-slate-500 uppercase font-bold mb-1 block">Total Mat. Cost</label>
                                            <div className="w-full bg-cyan-500/5 border border-cyan-500/20 rounded p-2 text-cyan-400 text-sm font-mono h-[38px] flex items-center">
                                                {((newItem.materialUnitPrice || 0) * (newItem.quantity || 0)).toLocaleString(undefined, { minimumFractionDigits: 2 })}
                                            </div>
                                        </div>
                                        <div>
                                            <label className="text-[10px] text-slate-500 uppercase font-bold mb-1 block">Total Labor Cost</label>
                                            <div className="w-full bg-purple-500/5 border border-purple-500/20 rounded p-2 text-purple-400 text-sm font-mono h-[38px] flex items-center">
                                                {((newItem.laborUnitPrice || 0) * (newItem.quantity || 0)).toLocaleString(undefined, { minimumFractionDigits: 2 })}
                                            </div>
                                        </div>
                                    </div>

                                    {/* Final Summary Box Emerald styled */}
                                    <div className="mt-2 bg-emerald-500/10 border border-emerald-500/30 rounded-lg p-3 group hover:bg-emerald-500/20 transition-all">
                                        <div className="flex justify-between items-center text-[10px] text-emerald-400 uppercase font-black mb-1">
                                            <span>Combined Item Total</span>
                                            <span className="bg-emerald-500 text-black px-1 rounded">ESTIMATED</span>
                                        </div>
                                        <div className="text-xl font-black text-emerald-400 font-mono tracking-tight">
                                            ₱ {(((newItem.materialUnitPrice || 0) + (newItem.laborUnitPrice || 0)) * (newItem.quantity || 0)).toLocaleString(undefined, { minimumFractionDigits: 2 })}
                                        </div>
                                    </div>
                                </div>

                                <button type="submit" className="w-full bg-orange-600 hover:bg-orange-500 text-white py-3 rounded-lg font-bold flex items-center justify-center gap-2 mt-4 shadow-lg shadow-orange-600/20 active:scale-95 transition-all">
                                    <Save size={18} /> Add to BOQ
                                </button>
                            </form>
                        </div>
                    )}
                </div>

                {/* Project Area Metrics Display */}
                <div className="xl:col-span-4 bg-[#1a1a20] rounded-xl border border-white/10 p-6">
                    <div className="flex justify-between items-center mb-6">
                        <h2 className="text-lg font-bold text-white flex items-center gap-2">
                            <LayoutGrid size={18} className="text-cyan-500" /> Project Area Metrics
                        </h2>
                        <div className="flex gap-4">
                            <div className="flex flex-col">
                                <label className="text-[10px] text-slate-400 uppercase font-bold mb-1">Total Floor Area (sqm)</label>
                                <input
                                    type="number"
                                    step="0.01"
                                    className="bg-black/20 border border-white/10 rounded px-2 py-1 text-white text-xs w-24"
                                    defaultValue={project?.totalFloorArea || 0}
                                    onBlur={(e) => handleUpdateAreas(parseFloat(e.target.value) || 0, project?.carportArea || 0)}
                                />
                            </div>
                            <div className="flex flex-col">
                                <label className="text-[10px] text-slate-400 uppercase font-bold mb-1">Carport Area (sqm)</label>
                                <input
                                    type="number"
                                    step="0.01"
                                    className="bg-black/20 border border-white/10 rounded px-2 py-1 text-white text-xs w-24"
                                    defaultValue={project?.carportArea || 0}
                                    onBlur={(e) => handleUpdateAreas(project?.totalFloorArea || 0, parseFloat(e.target.value) || 0)}
                                />
                            </div>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {/* Building Metrics */}
                        <div className="bg-white/5 rounded-lg p-4 border border-white/5 space-y-4">
                            <h3 className="text-xs font-bold text-cyan-400 flex items-center gap-2 uppercase tracking-wider">
                                <Home size={14} /> Main Building
                            </h3>
                            <div className="space-y-3">
                                <div className="flex justify-between items-center">
                                    <span className="text-xs text-slate-400">Amount Without Carport</span>
                                    <span className="text-sm font-bold text-white font-mono">₱ {amountWithoutCarport.toLocaleString(undefined, { minimumFractionDigits: 2 })}</span>
                                </div>
                                <div className="flex justify-between items-center">
                                    <span className="text-xs text-slate-400">Total Floor Area</span>
                                    <span className="text-sm font-bold text-white font-mono">{floorArea.toLocaleString()} sqm</span>
                                </div>
                                <div className="bg-cyan-500/10 p-2 rounded flex justify-between items-center">
                                    <span className="text-xs text-cyan-400 font-bold">Amount Per Sqm</span>
                                    <span className="text-sm font-black text-cyan-400 font-mono">₱ {amountPerSqmBuilding.toLocaleString(undefined, { minimumFractionDigits: 2 })}</span>
                                </div>
                            </div>
                        </div>

                        {/* Carport Metrics */}
                        <div className="bg-white/5 rounded-lg p-4 border border-white/5 space-y-4">
                            <h3 className="text-xs font-bold text-orange-400 flex items-center gap-2 uppercase tracking-wider">
                                <Car size={14} /> Carport Section
                            </h3>
                            <div className="space-y-3">
                                <div className="flex justify-between items-center">
                                    <span className="text-xs text-slate-400">Amount of Carport</span>
                                    <span className="text-sm font-bold text-white font-mono">₱ {amountOfCarport.toLocaleString(undefined, { minimumFractionDigits: 2 })}</span>
                                </div>
                                <div className="flex justify-between items-center">
                                    <span className="text-xs text-slate-400">Carport Area</span>
                                    <span className="text-sm font-bold text-white font-mono">{carportArea.toLocaleString()} sqm</span>
                                </div>
                                <div className="bg-orange-500/10 p-2 rounded flex justify-between items-center">
                                    <span className="text-xs text-orange-400 font-bold">Amount Per Sqm</span>
                                    <span className="text-sm font-black text-orange-400 font-mono">₱ {amountPerSqmCarport.toLocaleString(undefined, { minimumFractionDigits: 2 })}</span>
                                </div>
                            </div>
                        </div>

                        {/* Summary Visualization */}
                        <div className="bg-white/5 rounded-lg p-4 border border-white/5 flex flex-col justify-center gap-4">
                            <div className="text-center">
                                <div className="text-[10px] text-slate-500 uppercase font-black mb-1">Total Construction Base</div>
                                <div className="text-xl font-black text-white font-mono">₱ {totalConstructionCost.toLocaleString(undefined, { minimumFractionDigits: 2 })}</div>
                            </div>
                            <div className="w-full bg-black/40 rounded-full h-3 overflow-hidden flex border border-white/5">
                                <div
                                    className="bg-cyan-500 h-full transition-all duration-500"
                                    style={{ width: `${(amountWithoutCarport / totalConstructionCost) * 100 || 0}%` }}
                                    title={`Building: ${((amountWithoutCarport / totalConstructionCost) * 100).toFixed(1)}%`}
                                />
                                <div
                                    className="bg-orange-500 h-full transition-all duration-500"
                                    style={{ width: `${(amountOfCarport / totalConstructionCost) * 100 || 0}%` }}
                                    title={`Carport: ${((amountOfCarport / totalConstructionCost) * 100).toFixed(1)}%`}
                                />
                            </div>
                            <div className="flex justify-center gap-6 text-[9px] uppercase font-bold">
                                <div className="flex items-center gap-2">
                                    <div className="w-2 h-2 bg-cyan-500 rounded-full" />
                                    <span className="text-slate-400">Building</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <div className="w-2 h-2 bg-orange-500 rounded-full" />
                                    <span className="text-slate-400">Carport</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
