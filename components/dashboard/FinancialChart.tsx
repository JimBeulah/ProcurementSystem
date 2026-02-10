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
            <Card className="h-[320px] flex items-center justify-center">
                <div className="text-xs text-muted animate-pulse">Loading Financial Data...</div>
            </Card>
        );
    }

    return (
        <Card className="h-[320px] p-4">
            <div className="flex items-center justify-between mb-4">
                <div>
                    <h3 className="text-lg font-bold tracking-tight font-[family-name:var(--font-poppins)]">Financial Overview</h3>
                    <p className="text-[11px] text-muted font-medium">Monthly revenue, expenses, and profit trends</p>
                </div>
                <div className="flex gap-3 text-[10px] font-bold uppercase tracking-wider">
                    <div className="flex items-center gap-1.5 text-emerald-600">
                        <span className="w-2 h-2 rounded-full bg-emerald-500"></span> Profit
                    </div>
                    <div className="flex items-center gap-1.5 text-rose-600">
                        <span className="w-2 h-2 rounded-full bg-rose-500"></span> Expenses
                    </div>
                    <div className="flex items-center gap-1.5 text-blue-600">
                        <span className="w-2 h-2 rounded-full bg-blue-500"></span> Cost
                    </div>
                </div>
            </div>

            <div className="h-[220px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                    <AreaChart
                        data={data}
                        margin={{ top: 5, right: 5, left: -20, bottom: 0 }}
                    >
                        <defs>
                            <linearGradient id="colorProfit" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="5%" stopColor="#10b981" stopOpacity={0.15} />
                                <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
                            </linearGradient>
                            <linearGradient id="colorExpenses" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="5%" stopColor="#f43f5e" stopOpacity={0.15} />
                                <stop offset="95%" stopColor="#f43f5e" stopOpacity={0} />
                            </linearGradient>
                            <linearGradient id="colorCost" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.15} />
                                <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
                            </linearGradient>
                        </defs>
                        <CartesianGrid strokeDasharray="3 3" stroke="currentColor" className="text-border/40" vertical={false} />
                        <XAxis
                            dataKey="name"
                            stroke="currentColor"
                            className="text-muted/60 font-medium"
                            fontSize={10}
                            tickLine={false}
                            axisLine={false}
                            dy={10}
                        />
                        <YAxis
                            stroke="currentColor"
                            className="text-muted/60 font-medium"
                            fontSize={10}
                            tickLine={false}
                            axisLine={false}
                            tickFormatter={(value) => `₱${value / 1000}k`}
                        />
                        <Tooltip
                            contentStyle={{
                                backgroundColor: 'var(--card)',
                                borderColor: 'var(--border)',
                                borderRadius: '12px',
                                fontSize: '12px',
                                boxShadow: 'var(--shadow-lg)'
                            }}
                            itemStyle={{ fontWeight: '600' }}
                        />
                        <Area type="monotone" dataKey="profit" stroke="#10b981" fillOpacity={1} fill="url(#colorProfit)" strokeWidth={2} />
                        <Area type="monotone" dataKey="expenses" stroke="#f43f5e" fillOpacity={1} fill="url(#colorExpenses)" strokeWidth={2} />
                        <Area type="monotone" dataKey="cost" stroke="#3b82f6" fillOpacity={1} fill="url(#colorCost)" strokeWidth={2} />
                    </AreaChart>
                </ResponsiveContainer>
            </div>
        </Card>
    );
}
