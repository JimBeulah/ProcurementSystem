'use client';

import React from 'react';
import { Card } from '@/components/ui/Card';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const data = [
    { name: 'Jan', cost: 4000, expenses: 2400, profit: 2400 },
    { name: 'Feb', cost: 3000, expenses: 1398, profit: 2210 },
    { name: 'Mar', cost: 2000, expenses: 9800, profit: 2290 },
    { name: 'Apr', cost: 2780, expenses: 3908, profit: 2000 },
    { name: 'May', cost: 1890, expenses: 4800, profit: 2181 },
    { name: 'Jun', cost: 2390, expenses: 3800, profit: 2500 },
    { name: 'Jul', cost: 3490, expenses: 4300, profit: 2100 },
];

export function FinancialChart() {
    const [mounted, setMounted] = React.useState(false);

    React.useEffect(() => {
        setMounted(true);
    }, []);

    if (!mounted) {
        return (
            <Card className="col-span-1 lg:col-span-2 h-[400px] flex items-center justify-center">
                <div className="text-slate-500">Loading Chart...</div>
            </Card>
        );
    }

    return (
        <Card className="col-span-1 lg:col-span-2 h-[400px]">
            <div className="flex items-center justify-between mb-6">
                <div>
                    <h3 className="text-xl font-bold text-white">Financial Overview</h3>
                    <p className="text-sm text-slate-400">Cost, Expenses, and Profit Trends</p>
                </div>
                <div className="flex gap-4 text-sm">
                    <div className="flex items-center gap-2 text-slate-400">
                        <span className="w-3 h-3 rounded-full bg-cyan-500"></span> Profit
                    </div>
                    <div className="flex items-center gap-2 text-slate-400">
                        <span className="w-3 h-3 rounded-full bg-purple-500"></span> Expenses
                    </div>
                    <div className="flex items-center gap-2 text-slate-400">
                        <span className="w-3 h-3 rounded-full bg-blue-500"></span> Cost
                    </div>
                </div>
            </div>

            <div className="h-[300px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                    <AreaChart
                        data={data}
                        margin={{ top: 10, right: 10, left: 0, bottom: 0 }}
                    >
                        <defs>
                            <linearGradient id="colorProfit" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="5%" stopColor="#06b6d4" stopOpacity={0.3} />
                                <stop offset="95%" stopColor="#06b6d4" stopOpacity={0} />
                            </linearGradient>
                            <linearGradient id="colorExpenses" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="5%" stopColor="#a855f7" stopOpacity={0.3} />
                                <stop offset="95%" stopColor="#a855f7" stopOpacity={0} />
                            </linearGradient>
                            <linearGradient id="colorCost" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3} />
                                <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
                            </linearGradient>
                        </defs>
                        <CartesianGrid strokeDasharray="3 3" stroke="#334155" opacity={0.5} vertical={false} />
                        <XAxis
                            dataKey="name"
                            stroke="#94a3b8"
                            fontSize={12}
                            tickLine={false}
                            axisLine={false}
                        />
                        <YAxis
                            stroke="#94a3b8"
                            fontSize={12}
                            tickLine={false}
                            axisLine={false}
                            tickFormatter={(value) => `₱${value}`}
                        />
                        <Tooltip
                            contentStyle={{ backgroundColor: '#0f172a', borderColor: '#1e293b', color: '#f8fafc' }}
                            itemStyle={{ color: '#cbd5e1' }}
                        />
                        <Area type="monotone" dataKey="profit" stroke="#06b6d4" fillOpacity={1} fill="url(#colorProfit)" strokeWidth={2} />
                        <Area type="monotone" dataKey="expenses" stroke="#a855f7" fillOpacity={1} fill="url(#colorExpenses)" strokeWidth={2} />
                        <Area type="monotone" dataKey="cost" stroke="#3b82f6" fillOpacity={1} fill="url(#colorCost)" strokeWidth={2} />
                    </AreaChart>
                </ResponsiveContainer>
            </div>
        </Card>
    );
}
