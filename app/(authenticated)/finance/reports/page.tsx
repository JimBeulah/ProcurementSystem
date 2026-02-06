'use client';

import React, { useState, useEffect } from 'react';
import { PieChart, TrendingUp, DollarSign, Activity, BarChart3 } from 'lucide-react';
import { getProjectCostSummary } from '@/actions/report-actions';

export default function ReportsPage() {
    const [data, setData] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const load = async () => {
            const res = await getProjectCostSummary();
            setData(res);
            setLoading(false);
        };
        load();
    }, []);

    const totalBudget = data.reduce((acc, curr) => acc + curr.budget, 0);
    const totalCommitted = data.reduce((acc, curr) => acc + curr.committed, 0);
    const totalPaid = data.reduce((acc, curr) => acc + curr.paid, 0);

    return (
        <div className="p-6 space-y-6">
            <header className="pb-6 border-b border-white/5">
                <h1 className="text-2xl font-bold text-white flex items-center gap-3">
                    <PieChart className="text-purple-500" /> Financial Reports
                </h1>
                <p className="text-slate-400">Project Budget vs. Actual Costs Analysis.</p>
            </header>

            {/* KPI Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-[#0a0a0f] border border-white/5 p-6 rounded-xl relative overflow-hidden group">
                    <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                        <DollarSign size={100} />
                    </div>
                    <div className="text-sm text-slate-400 uppercase font-bold mb-2">Total Budget</div>
                    <div className="text-3xl font-mono text-white font-bold">
                        {totalBudget.toLocaleString(undefined, { style: 'currency', currency: 'PHP', maximumFractionDigits: 0 })}
                    </div>
                    <div className="mt-4 h-1 bg-white/10 rounded-full overflow-hidden">
                        <div className="h-full bg-blue-500 w-full"></div>
                    </div>
                </div>

                <div className="bg-[#0a0a0f] border border-white/5 p-6 rounded-xl relative overflow-hidden group">
                    <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                        <TrendingUp size={100} />
                    </div>
                    <div className="text-sm text-slate-400 uppercase font-bold mb-2">Committed Costs (PO)</div>
                    <div className="text-3xl font-mono text-orange-400 font-bold">
                        {totalCommitted.toLocaleString(undefined, { style: 'currency', currency: 'PHP', maximumFractionDigits: 0 })}
                    </div>
                    <div className="mt-4 h-1 bg-white/10 rounded-full overflow-hidden">
                        <div className="h-full bg-orange-500" style={{ width: `${(totalCommitted / totalBudget) * 100}%` }}></div>
                    </div>
                    <div className="text-xs text-slate-500 mt-2">
                        {((totalCommitted / totalBudget) * 100).toFixed(1)}% of Budget used
                    </div>
                </div>

                <div className="bg-[#0a0a0f] border border-white/5 p-6 rounded-xl relative overflow-hidden group">
                    <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                        <Activity size={100} />
                    </div>
                    <div className="text-sm text-slate-400 uppercase font-bold mb-2">Actual Paid</div>
                    <div className="text-3xl font-mono text-emerald-400 font-bold">
                        {totalPaid.toLocaleString(undefined, { style: 'currency', currency: 'PHP', maximumFractionDigits: 0 })}
                    </div>
                    <div className="mt-4 h-1 bg-white/10 rounded-full overflow-hidden">
                        <div className="h-full bg-emerald-500" style={{ width: `${(totalPaid / totalCommitted) * 100}%` }}></div>
                    </div>
                    <div className="text-xs text-slate-500 mt-2">
                        {((totalPaid / totalCommitted) * 100).toFixed(1)}% of Committed
                    </div>
                </div>
            </div>

            {/* Project Table */}
            <div className="bg-[#0a0a0f] border border-white/5 rounded-xl overflow-hidden">
                <div className="p-4 border-b border-white/5 flex items-center gap-2">
                    <BarChart3 className="text-slate-400" size={18} />
                    <h2 className="font-bold text-white">Project Cost Breakdown</h2>
                </div>
                {loading ? <div className="p-8 text-center text-slate-500">Calculating financials...</div> : (
                    <table className="w-full text-left text-sm text-slate-400">
                        <thead className="bg-white/5 text-slate-200 uppercase text-xs">
                            <tr>
                                <th className="p-4">Project</th>
                                <th className="p-4 text-right">Budget</th>
                                <th className="p-4 text-right">Committed (PO)</th>
                                <th className="p-4 text-right">Invoiced</th>
                                <th className="p-4 text-right">Paid</th>
                                <th className="p-4 text-right">Remaining</th>
                                <th className="p-4 w-32">Usage</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-white/5">
                            {data.map(p => (
                                <tr key={p.id} className="hover:bg-white/5">
                                    <td className="p-4">
                                        <div className="text-white font-bold">{p.name}</div>
                                        <div className="text-xs">{p.clientName}</div>
                                    </td>
                                    <td className="p-4 text-right font-mono text-white">
                                        {p.budget.toLocaleString(undefined, { minimumFractionDigits: 0, maximumFractionDigits: 0 })}
                                    </td>
                                    <td className="p-4 text-right font-mono text-orange-400">
                                        {p.committed.toLocaleString(undefined, { minimumFractionDigits: 0, maximumFractionDigits: 0 })}
                                    </td>
                                    <td className="p-4 text-right font-mono">
                                        {p.invoiced.toLocaleString(undefined, { minimumFractionDigits: 0, maximumFractionDigits: 0 })}
                                    </td>
                                    <td className="p-4 text-right font-mono text-emerald-400">
                                        {p.paid.toLocaleString(undefined, { minimumFractionDigits: 0, maximumFractionDigits: 0 })}
                                    </td>
                                    <td className="p-4 text-right font-mono font-bold text-white">
                                        {p.remaining.toLocaleString(undefined, { minimumFractionDigits: 0, maximumFractionDigits: 0 })}
                                    </td>
                                    <td className="p-4">
                                        <div className="w-full bg-white/10 rounded-full h-1.5 mb-1">
                                            <div
                                                className={`h-1.5 rounded-full ${p.progress > 90 ? 'bg-red-500' : p.progress > 70 ? 'bg-yellow-500' : 'bg-emerald-500'}`}
                                                style={{ width: `${Math.min(p.progress, 100)}%` }}
                                            ></div>
                                        </div>
                                        <div className="text-xs text-right">{p.progress.toFixed(0)}%</div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                )}
            </div>
        </div>
    );
}
