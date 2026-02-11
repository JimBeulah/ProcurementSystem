'use client';

import React, { useState, useEffect, use, useCallback } from 'react';
import { ClipboardList, Plus, Save, RefreshCcw, Upload, FileDown, Search, LayoutGrid, Home, Car, TrendingUp, ChevronDown, ChevronRight, Calculator, Trash2, Hammer, Settings } from 'lucide-react';
import { getProjectBoq, createBoqItem, bulkCreateBoqItems } from '@/actions/boq-actions';
import { getMaterials } from '@/actions/master-data-actions';
import { getUnits } from '@/actions/unit-actions';
import { getProject, updateProjectAreas } from '@/actions/project-actions';
import { Modal } from '@/components/ui/Modal';

interface BoqPageProps {
    params: Promise<{ id: string }>;
}

export default function ProjectBoqPage({ params }: BoqPageProps) {
    const { id } = use(params);
    const projectId = parseInt(id);

    const [items, setItems] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [materials, setMaterials] = useState<any[]>([]);
    const [units, setUnits] = useState<any[]>([]);
    const [project, setProject] = useState<any>(null);
    const [searchQuery, setSearchQuery] = useState('');
    const [isFormOpen, setIsFormOpen] = useState(false);

    // Add Form
    const [newItem, setNewItem] = useState({
        itemDescription: '',
        unit: '',
        materialUnitPrice: 0,
        laborUnitPrice: 0,
        quantity: 0,
        isCarport: false,
        components: [] as any[]
    });
    const [expandedRows, setExpandedRows] = useState<Set<number>>(new Set());

    const loadData = useCallback(async () => {
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
    }, [projectId]);

    useEffect(() => {
        console.log('[CLIENT] BOQ Items Updated:', items.length);
    }, [items]);

    useEffect(() => {
        loadData();
    }, [loadData]);

    const handleAdd = async (e: React.FormEvent) => {
        e.preventDefault();
        const res = await createBoqItem({
            projectId,
            itemDescription: newItem.itemDescription,
            unit: newItem.unit,
            quantity: Number(newItem.quantity),
            isCarport: newItem.isCarport,
            components: newItem.components
        });

        if (res.success) {
            setNewItem({
                itemDescription: '',
                unit: '',
                materialUnitPrice: 0,
                laborUnitPrice: 0,
                quantity: 0,
                isCarport: false,
                components: []
            });
            setIsFormOpen(false);
            loadData();
        } else {
            alert("Error adding item: " + res.error);
        }
    };

    const handleUpdateAreas = async (floorArea: number, carportArea: number) => {
        const res = await updateProjectAreas(projectId, { totalFloorArea: floorArea, carportArea });
        if (res.success) {
            loadData();
        } else {
            alert(res.error);
        }
    };

    const addComponent = () => {
        setNewItem(prev => ({
            ...prev,
            components: [...prev.components, { resourceType: 'MATERIAL', name: '', quantityFactor: 0, unitRate: 0 }]
        }));
    };

    const removeComponent = (index: number) => {
        setNewItem(prev => ({
            ...prev,
            components: prev.components.filter((_, i) => i !== index)
        }));
    };

    const updateComponent = (index: number, field: string, value: any) => {
        const newComponents = [...newItem.components];
        newComponents[index] = { ...newComponents[index], [field]: value };

        // Recalculate parent costs
        const matCosts = newComponents
            .filter(c => c.resourceType === 'MATERIAL')
            .reduce((sum, c) => sum + (Number(c.quantityFactor) * Number(c.unitRate)), 0);
        const labCosts = newComponents
            .filter(c => c.resourceType === 'LABOR' || c.resourceType === 'EQUIPMENT')
            .reduce((sum, c) => sum + (Number(c.quantityFactor) * Number(c.unitRate)), 0);

        setNewItem(prev => ({
            ...prev,
            components: newComponents,
            materialUnitPrice: matCosts,
            laborUnitPrice: labCosts
        }));
    };

    const totalMaterialCost = items.reduce((sum, item) => sum + (Number(item.materialUnitPrice) * Number(item.quantity)), 0);
    const totalLaborCost = items.reduce((sum, item) => sum + (Number(item.laborUnitPrice || 0) * Number(item.quantity)), 0);
    const totalConstructionCost = totalMaterialCost + totalLaborCost;

    const baseCarportAmount = items.filter(i => i.isCarport).reduce((sum, i) => sum + ((Number(i.materialUnitPrice) + Number(i.laborUnitPrice || 0)) * Number(i.quantity)), 0);
    const amountOfCarportWithProfit = baseCarportAmount * 1.1;
    const totalWithProfit = totalConstructionCost * 1.1;
    const amountWithoutCarportWithProfit = totalWithProfit - amountOfCarportWithProfit;

    const floorArea = project?.totalFloorArea || 0;
    const carportArea = project?.carportArea || 0;

    const amountPerSqmBuilding = floorArea > 0 ? amountWithoutCarportWithProfit / floorArea : 0;
    const amountPerSqmCarport = carportArea > 0 ? amountOfCarportWithProfit / carportArea : 0;

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
            const text = (event.target?.result as string).replace(/^\uFEFF/, '');
            if (!text) return;

            const lines = text.split(/\r?\n/).filter(line => line.trim() !== '');
            if (lines.length < 2) return;

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
                let rawName = row['ITEM DESCRIPTION'] || row['DESCRIPTION'] || row['ITEM'] || row['MATERIAL NAME'] || '';
                const isNumeric = (val: string) => !val || (!isNaN(Number(val)) && String(val).length < 6);

                if (isNumeric(rawName)) {
                    const textCandidate = values.find(v => v && /[a-zA-Z]/.test(String(v)));
                    if (textCandidate) rawName = textCandidate;
                }

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
                }
                setLoading(false);
            }
        };
        reader.readAsText(file);
        e.target.value = '';
    };

    const toggleRow = (id: number) => {
        const newExpanded = new Set(expandedRows);
        if (newExpanded.has(id)) newExpanded.delete(id);
        else newExpanded.add(id);
        setExpandedRows(newExpanded);
    };

    const filteredItems = items.filter(item =>
        item.itemDescription.toLowerCase().includes(searchQuery.toLowerCase())
    );

    return (
        <div className="p-4 space-y-4 max-h-[calc(100vh-64px)] overflow-y-auto custom-scrollbar">
            {/* Condensed Header */}
            <header className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-[#0a0a0f]/50 backdrop-blur-md p-4 rounded-xl border border-white/5 sticky top-0 z-20">
                <div>
                    <h1 className="text-[clamp(1.25rem,5vw,1.5rem)] font-bold text-white flex items-center gap-2">
                        <ClipboardList className="text-orange-500" size={24} /> BOQ Management
                    </h1>
                    <p className="text-[clamp(0.6rem,2vw,0.7rem)] text-slate-400 uppercase tracking-[0.2em] font-black opacity-60">Project Reference ID: #{projectId}</p>
                </div>

                <div className="flex items-center gap-2">
                    <div className="relative group max-w-xs">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-cyan-500 transition-colors" size={14} />
                        <input
                            type="text"
                            placeholder="Search items..."
                            className="w-full bg-black/40 border border-white/10 rounded-lg pl-9 pr-4 py-1.5 text-white text-xs focus:border-cyan-500/50 outline-none transition-all"
                            value={searchQuery}
                            onChange={e => setSearchQuery(e.target.value)}
                        />
                    </div>

                    <button onClick={() => setIsFormOpen(true)} className="bg-orange-600 hover:bg-orange-500 text-white px-3 py-1.5 rounded-lg flex items-center gap-2 text-xs font-bold transition-all shadow-lg shadow-orange-600/20 active:scale-95">
                        <Plus size={16} /> <span>Add Item</span>
                    </button>

                    <div className="h-6 w-px bg-white/10 mx-1" />

                    <div className="flex items-center gap-1">
                        <button onClick={loadData} disabled={loading} className="p-1.5 text-slate-400 hover:text-white hover:bg-white/5 rounded-lg transition-colors" title="Refresh">
                            <RefreshCcw size={16} className={loading ? 'animate-spin' : ''} />
                        </button>
                        <button onClick={downloadTemplate} className="p-1.5 text-slate-400 hover:text-white hover:bg-white/5 rounded-lg transition-colors" title="Template">
                            <FileDown size={16} />
                        </button>
                        <label className="p-1.5 text-cyan-400 hover:bg-cyan-400/10 rounded-lg cursor-pointer transition-colors" title="Bulk Upload">
                            <Upload size={16} />
                            <input type="file" accept=".csv" className="hidden" onChange={handleBulkUpload} disabled={loading} />
                        </label>
                    </div>
                </div>
            </header>

            {/* Top Dashboard Metrics */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3">
                {/* Total Cost Card */}
                <div className="bg-gradient-to-br from-[#1a1a20] to-[#0a0a0f] border border-white/10 rounded-xl p-4 flex items-center gap-4 group hover:border-orange-500/30 transition-all">
                    <div className="p-3 rounded-lg bg-orange-500/10 text-orange-500 group-hover:scale-110 transition-transform">
                        <TrendingUp size={24} />
                    </div>
                    <div>
                        <p className="text-[clamp(0.55rem,1.5vw,0.65rem)] text-slate-500 uppercase font-black tracking-wider">Total Project Cost (+10%)</p>
                        <p className="text-[clamp(1.25rem,4vw,1.5rem)] font-black text-white font-mono tracking-tighter leading-none">
                            ₱ {totalWithProfit.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                        </p>
                    </div>
                </div>

                {/* Building Metric Card */}
                <div className="bg-gradient-to-br from-[#1a1a20] to-[#0a0a0f] border border-white/10 rounded-xl p-4 flex flex-col gap-2 group hover:border-cyan-500/30 transition-all">
                    <div className="flex justify-between items-center">
                        <span className="text-[10px] text-slate-500 uppercase font-black">Building Metrics</span>
                        <Home size={14} className="text-cyan-500" />
                    </div>
                    <div className="flex justify-between items-end">
                        <p className="text-lg font-black text-white font-mono">₱ {amountPerSqmBuilding.toLocaleString(undefined, { minimumFractionDigits: 0 })}<span className="text-[10px] text-slate-400">/sqm</span></p>
                        <div className="text-right">
                            <input
                                type="number"
                                className="bg-transparent border-b border-white/10 w-12 text-right text-xs text-cyan-400 font-mono focus:border-cyan-500 outline-none"
                                defaultValue={floorArea}
                                onBlur={(e) => handleUpdateAreas(parseFloat(e.target.value) || 0, project?.carportArea || 0)}
                            />
                            <span className="text-[10px] text-slate-500 ml-1">sqm</span>
                        </div>
                    </div>
                </div>

                {/* Carport Metric Card */}
                <div className="bg-gradient-to-br from-[#1a1a20] to-[#0a0a0f] border border-white/10 rounded-xl p-4 flex flex-col gap-2 group hover:border-orange-500/30 transition-all">
                    <div className="flex justify-between items-center">
                        <span className="text-[10px] text-slate-500 uppercase font-black">Carport Metrics</span>
                        <Car size={14} className="text-orange-500" />
                    </div>
                    <div className="flex justify-between items-end">
                        <p className="text-lg font-black text-white font-mono">₱ {amountPerSqmCarport.toLocaleString(undefined, { minimumFractionDigits: 0 })}<span className="text-[10px] text-slate-400">/sqm</span></p>
                        <div className="text-right">
                            <input
                                type="number"
                                className="bg-transparent border-b border-white/10 w-12 text-right text-xs text-orange-400 font-mono focus:border-orange-500 outline-none"
                                defaultValue={carportArea}
                                onBlur={(e) => handleUpdateAreas(project?.totalFloorArea || 0, parseFloat(e.target.value) || 0)}
                            />
                            <span className="text-[10px] text-slate-500 ml-1">sqm</span>
                        </div>
                    </div>
                </div>

                {/* Progress/Ratio Card */}
                <div className="bg-gradient-to-br from-[#1a1a20] to-[#0a0a0f] border border-white/10 rounded-xl p-4 flex flex-col justify-between group hover:border-emerald-500/30 transition-all">
                    <div className="flex justify-between items-center mb-1">
                        <span className="text-[10px] text-slate-500 uppercase font-black">Cost Distribution</span>
                        <span className="text-[9px] font-bold text-emerald-400">{((amountWithoutCarportWithProfit / totalWithProfit) * 100 || 0).toFixed(0)}% Building</span>
                    </div>
                    <div className="w-full bg-black/40 rounded-full h-1.5 overflow-hidden flex">
                        <div className="bg-cyan-500 h-full" style={{ width: `${(amountWithoutCarportWithProfit / totalWithProfit) * 100 || 0}%` }} />
                        <div className="bg-orange-500 h-full" style={{ width: `${(amountOfCarportWithProfit / totalWithProfit) * 100 || 0}%` }} />
                    </div>
                    <div className="flex justify-between text-[8px] mt-1 text-slate-500 font-bold">
                        <span>₱ {(totalMaterialCost * 1.1).toLocaleString(undefined, { maximumFractionDigits: 0 })} Materials</span>
                        <span>₱ {(totalLaborCost * 1.1).toLocaleString(undefined, { maximumFractionDigits: 0 })} Labor</span>
                    </div>
                </div>
            </div>

            {/* Main Content - Table */}
            <div className="bg-[#0a0a0f] border border-white/5 rounded-xl overflow-hidden shadow-2xl">
                <div className="overflow-x-auto overflow-y-auto max-h-[calc(100vh-320px)] custom-scrollbar">
                    <table className="w-full text-left border-collapse">
                        <thead className="bg-[#1a1a20] text-slate-400 uppercase text-[9px] font-black tracking-widest sticky top-0 z-10 shadow-lg">
                            <tr className="border-b border-white/10">
                                <th className="p-2 border-r border-white/5 text-center w-10">No</th>
                                <th className="p-2 border-r border-white/5 min-w-[250px]">Description</th>
                                <th className="p-2 border-r border-white/5 text-center w-16">Unit</th>
                                <th className="p-2 border-r border-white/5 text-center w-20">Qty</th>
                                <th className="p-2 border-r border-white/5 text-right w-32">Mat. Unit</th>
                                <th className="p-2 border-r border-white/5 text-right w-36 text-cyan-400/80">Mat. Total</th>
                                <th className="p-2 border-r border-white/5 text-right w-32">Lab. Unit</th>
                                <th className="p-2 border-r border-white/5 text-right w-36 text-purple-400/80">Lab. Total</th>
                                <th className="p-2 text-right w-40 text-emerald-400 bg-emerald-500/5">Amount</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-white/5 text-[11px]">
                            {filteredItems.map((item, idx) => {
                                const matTotal = Number(item.materialUnitPrice) * Number(item.quantity);
                                const laborTotal = (Number(item.laborUnitPrice) || 0) * Number(item.quantity);
                                const rowTotal = matTotal + laborTotal;
                                const isExpanded = expandedRows.has(item.id);

                                return (
                                    <React.Fragment key={item.id}>
                                        <tr className="hover:bg-white/5 group transition-colors cursor-pointer" onClick={() => toggleRow(item.id)}>
                                            <td className="p-2 border-r border-white/5 text-center text-[10px] text-slate-500 font-mono">
                                                <div className="flex items-center justify-center gap-1">
                                                    {isExpanded ? <ChevronDown size={12} className="text-orange-500" /> : <ChevronRight size={12} />}
                                                    {idx + 1}
                                                </div>
                                            </td>
                                            <td className="p-2 border-r border-white/5">
                                                <div className="flex items-center gap-2">
                                                    <div className="font-medium text-slate-200 group-hover:text-white uppercase">{item.itemDescription}</div>
                                                    {item.isCarport && (
                                                        <span className="text-[8px] bg-orange-500/10 text-orange-400 border border-orange-500/20 px-1 rounded flex items-center gap-1 uppercase font-bold">
                                                            <Car size={10} /> Carport
                                                        </span>
                                                    )}
                                                </div>
                                            </td>
                                            <td className="p-2 border-r border-white/5 text-center text-slate-500">{item.unit}</td>
                                            <td className="p-2 border-r border-white/5 text-center font-bold text-cyan-400/70">{item.quantity}</td>
                                            <td className="p-2 border-r border-white/5 text-right font-mono text-slate-400 italic">
                                                {Number(item.materialUnitPrice).toLocaleString(undefined, { minimumFractionDigits: 2 })}
                                            </td>
                                            <td className="p-2 border-r border-white/5 text-right font-mono text-cyan-400/90 font-bold bg-cyan-400/5">
                                                {matTotal.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                                            </td>
                                            <td className="p-2 border-r border-white/5 text-right font-mono text-slate-500 italic">
                                                {Number(item.laborUnitPrice || 0).toLocaleString(undefined, { minimumFractionDigits: 2 })}
                                            </td>
                                            <td className="p-2 border-r border-white/5 text-right font-mono text-purple-400/70 bg-purple-400/5">
                                                {laborTotal.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                                            </td>
                                            <td className="p-2 text-right font-mono text-emerald-400 font-black bg-emerald-500/5 group-hover:bg-emerald-500/10">
                                                {rowTotal.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                                            </td>
                                        </tr>
                                        {isExpanded && item.boqComponents && item.boqComponents.length > 0 && (
                                            <tr className="bg-black/40">
                                                <td colSpan={9} className="p-0">
                                                    <div className="p-4 pl-12 border-l-2 border-orange-500/50 space-y-2">
                                                        <p className="text-[9px] font-black text-slate-500 uppercase tracking-widest mb-2 flex items-center gap-2">
                                                            <Calculator size={10} /> Detailed Unit Price Analysis (DUPA)
                                                        </p>
                                                        <table className="w-full text-[10px] border-collapse bg-white/5 rounded-lg overflow-hidden">
                                                            <thead className="bg-white/5 text-slate-500 uppercase font-bold tracking-wider">
                                                                <tr>
                                                                    <th className="p-2 text-left pl-4">Type</th>
                                                                    <th className="p-2 text-left">Resource Name</th>
                                                                    <th className="p-2 text-center">Factor</th>
                                                                    <th className="p-2 text-right">Unit Rate</th>
                                                                    <th className="p-2 text-right pr-4">Cost/Unit</th>
                                                                </tr>
                                                            </thead>
                                                            <tbody className="divide-y divide-white/5">
                                                                {item.boqComponents.map((comp: any) => (
                                                                    <tr key={comp.id} className="hover:bg-white/5">
                                                                        <td className="p-2 pl-4">
                                                                            <span className={`px-1.5 py-0.5 rounded-[4px] text-[8px] font-black uppercase ${comp.resourceType === 'MATERIAL' ? 'bg-cyan-500/10 text-cyan-500 border border-cyan-500/20' :
                                                                                comp.resourceType === 'LABOR' ? 'bg-purple-500/10 text-purple-500 border border-purple-500/20' :
                                                                                    'bg-orange-500/10 text-orange-500 border border-orange-500/20'
                                                                                }`}>
                                                                                {comp.resourceType}
                                                                            </span>
                                                                        </td>
                                                                        <td className="p-2 text-slate-300">{comp.name}</td>
                                                                        <td className="p-2 text-center font-mono text-slate-500">{Number(comp.quantityFactor).toFixed(4)}</td>
                                                                        <td className="p-2 text-right font-mono text-slate-500">₱ {Number(comp.unitRate).toLocaleString()}</td>
                                                                        <td className="p-2 text-right pr-4 font-mono font-bold text-white">₱ {Number(comp.totalComponentCost).toLocaleString()}</td>
                                                                    </tr>
                                                                ))}
                                                            </tbody>
                                                        </table>
                                                    </div>
                                                </td>
                                            </tr>
                                        )}
                                    </React.Fragment>
                                );
                            })}
                            {items.length === 0 && !loading && (
                                <tr>
                                    <td colSpan={9} className="p-12 text-center opacity-30 text-xs uppercase tracking-widest">No items found in BOQ</td>
                                </tr>
                            )}
                        </tbody>
                        <tfoot className="border-t-2 border-white/10 bg-[#1a1a20] text-white text-[11px] font-black sticky bottom-0 z-10 shadow-[0_-4px_10px_rgba(0,0,0,0.5)]">
                            <tr className="bg-orange-600/10">
                                <td colSpan={4} className="p-3 text-right text-slate-400 uppercase tracking-widest border-r border-white/5">Grand Totals (Items Only)</td>
                                <td className="p-3 text-right border-r border-white/5 text-slate-500 opacity-50 font-mono">---</td>
                                <td className="p-3 text-right border-r border-white/5 font-mono text-cyan-400">
                                    {totalMaterialCost.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                                </td>
                                <td className="p-3 text-right border-r border-white/5 text-slate-500 opacity-50 font-mono">---</td>
                                <td className="p-3 text-right border-r border-white/5 font-mono text-purple-400">
                                    {totalLaborCost.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                                </td>
                                <td className="p-3 text-right font-mono text-emerald-400 bg-emerald-500/10">
                                    {totalConstructionCost.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                                </td>
                            </tr>
                        </tfoot>
                    </table>
                </div>
            </div>

            {/* Add Item Modal */}
            <Modal isOpen={isFormOpen} onClose={() => setIsFormOpen(false)} title="Add BOQ Item">
                <form onSubmit={handleAdd} className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="md:col-span-2">
                            <label className="text-[10px] text-slate-400 uppercase font-black mb-1 block">Item Description</label>
                            <input
                                list="material-suggestions"
                                className="w-full bg-black/40 border border-white/10 rounded-lg p-2.5 text-white text-sm focus:border-orange-500 outline-none transition-all"
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
                                placeholder="Start typing material name..."
                            />
                            <datalist id="material-suggestions">
                                {materials.map(m => <option key={m.id} value={m.name} />)}
                            </datalist>
                        </div>

                        <div>
                            <label className="text-[10px] text-slate-400 uppercase font-black mb-1 block">Quantity</label>
                            <input type="number" step="0.01" className="w-full bg-black/40 border border-white/10 rounded-lg p-2.5 text-white text-sm focus:border-orange-500 outline-none" value={newItem.quantity || ''} onChange={e => setNewItem({ ...newItem, quantity: parseFloat(e.target.value) })} required />
                        </div>

                        <div>
                            <label className="text-[10px] text-slate-400 uppercase font-black mb-1 block">Unit</label>
                            <input
                                list="unit-suggestions"
                                className="w-full bg-black/40 border border-white/10 rounded-lg p-2.5 text-white text-sm focus:border-orange-500 outline-none"
                                value={newItem.unit}
                                onChange={e => setNewItem({ ...newItem, unit: e.target.value })}
                                required
                                placeholder="Unit"
                            />
                            <datalist id="unit-suggestions">
                                {units.map(u => <option key={u.id} value={u.abbreviation}>{u.name}</option>)}
                            </datalist>
                        </div>

                        <div className="md:col-span-2">
                            <button
                                type="button"
                                onClick={() => setNewItem({ ...newItem, isCarport: !newItem.isCarport })}
                                className={`w-full flex items-center justify-center gap-2 py-3 rounded-lg border transition-all text-xs font-black uppercase tracking-widest ${newItem.isCarport
                                    ? 'bg-orange-500/20 border-orange-500 text-orange-400 shadow-[0_0_20px_rgba(249,115,22,0.1)]'
                                    : 'bg-cyan-500/5 border-cyan-500/20 text-cyan-500'
                                    }`}
                            >
                                {newItem.isCarport ? <Car size={16} /> : <Home size={16} />}
                                {newItem.isCarport ? 'Classified: Carport' : 'Classified: Building'}
                            </button>
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4 border-t border-white/10 pt-4">
                        <div>
                            <label className="text-[10px] text-cyan-500 uppercase font-black mb-1 block">Calculated Mat. Unit Cost</label>
                            <div className="w-full bg-cyan-500/10 border border-cyan-500/30 rounded-lg p-2.5 text-white text-sm font-mono flex items-center justify-between">
                                <span>₱ {newItem.materialUnitPrice.toLocaleString(undefined, { minimumFractionDigits: 2 })}</span>
                                <Calculator size={14} className="opacity-40" />
                            </div>
                        </div>
                        <div>
                            <label className="text-[10px] text-purple-500 uppercase font-black mb-1 block">Calculated Labor/Eq. Unit Cost</label>
                            <div className="w-full bg-purple-500/10 border border-purple-500/30 rounded-lg p-2.5 text-white text-sm font-mono flex items-center justify-between">
                                <span>₱ {newItem.laborUnitPrice.toLocaleString(undefined, { minimumFractionDigits: 2 })}</span>
                                <Hammer size={14} className="opacity-40" />
                            </div>
                        </div>
                    </div>

                    {/* DUPA Section */}
                    <div className="border-t border-white/10 pt-4 space-y-3">
                        <div className="flex justify-between items-center">
                            <label className="text-[10px] text-orange-500 uppercase font-black tracking-widest flex items-center gap-2">
                                <Settings size={14} /> Resource Components (DUPA)
                            </label>
                            <button
                                type="button"
                                onClick={addComponent}
                                className="text-[9px] font-black uppercase text-cyan-500 hover:text-cyan-400 flex items-center gap-1"
                            >
                                <Plus size={12} /> Add Resource
                            </button>
                        </div>

                        <div className="space-y-2 max-h-48 overflow-y-auto custom-scrollbar pr-2">
                            {newItem.components.map((comp, idx) => (
                                <div key={idx} className="bg-white/5 rounded-lg p-3 border border-white/5 relative group/row">
                                    <div className="grid grid-cols-12 gap-2 items-center">
                                        <div className="col-span-3">
                                            <select
                                                className="w-full bg-black/60 border border-white/10 rounded p-1.5 text-[10px] text-white outline-none focus:border-orange-500"
                                                value={comp.resourceType}
                                                onChange={e => updateComponent(idx, 'resourceType', e.target.value)}
                                            >
                                                <option value="MATERIAL">MATERIAL</option>
                                                <option value="LABOR">LABOR</option>
                                                <option value="EQUIPMENT">EQUIPMENT</option>
                                            </select>
                                        </div>
                                        <div className="col-span-4">
                                            <input
                                                type="text"
                                                placeholder="Resource Name"
                                                className="w-full bg-black/40 border border-white/10 rounded p-1.5 text-[10px] text-white outline-none"
                                                value={comp.name}
                                                onChange={e => updateComponent(idx, 'name', e.target.value)}
                                            />
                                        </div>
                                        <div className="col-span-2">
                                            <input
                                                type="number"
                                                step="0.0001"
                                                placeholder="Qty"
                                                className="w-full bg-black/40 border border-white/10 rounded p-1.5 text-[10px] text-white outline-none text-center"
                                                value={comp.quantityFactor || ''}
                                                onChange={e => updateComponent(idx, 'quantityFactor', e.target.value)}
                                            />
                                        </div>
                                        <div className="col-span-2">
                                            <input
                                                type="number"
                                                step="0.01"
                                                placeholder="Rate"
                                                className="w-full bg-black/40 border border-white/10 rounded p-1.5 text-[10px] text-white outline-none text-right"
                                                value={comp.unitRate || ''}
                                                onChange={e => updateComponent(idx, 'unitRate', e.target.value)}
                                            />
                                        </div>
                                        <div className="col-span-1 text-right">
                                            <button type="button" onClick={() => removeComponent(idx)} className="text-slate-600 hover:text-red-500 p-1">
                                                <Trash2 size={12} />
                                            </button>
                                        </div>
                                    </div>
                                    <div className="flex justify-end mt-1">
                                        <span className="text-[9px] font-mono text-slate-500">
                                            Row Total: ₱ {(Number(comp.quantityFactor) * Number(comp.unitRate)).toLocaleString()}
                                        </span>
                                    </div>
                                </div>
                            ))}
                            {newItem.components.length === 0 && (
                                <div className="text-center py-6 border-2 border-dashed border-white/5 rounded-xl opacity-20 text-[9px] uppercase font-black">
                                    No resources added yet
                                </div>
                            )}
                        </div>
                    </div>

                    <div className="bg-emerald-500/10 border border-emerald-500/20 rounded-xl p-4 flex justify-between items-center group">
                        <div className="flex flex-col">
                            <span className="text-[9px] text-emerald-400 uppercase font-black">Estimated Combined Total</span>
                            <span className="text-2xl font-black text-emerald-400 font-mono">
                                ₱ {(((newItem.materialUnitPrice || 0) + (newItem.laborUnitPrice || 0)) * (newItem.quantity || 0)).toLocaleString(undefined, { minimumFractionDigits: 2 })}
                            </span>
                        </div>
                        <div className="p-3 bg-emerald-500/20 rounded-full text-emerald-400 group-hover:rotate-12 transition-transform">
                            <TrendingUp size={24} />
                        </div>
                    </div>

                    <button type="submit" className="w-full bg-orange-600 hover:bg-orange-500 text-white py-4 rounded-xl font-black uppercase tracking-widest flex items-center justify-center gap-3 mt-6 shadow-xl shadow-orange-600/30 active:scale-95 transition-all">
                        <Save size={20} /> Add to BOQ
                    </button>
                </form>
            </Modal>
        </div>
    );
}
