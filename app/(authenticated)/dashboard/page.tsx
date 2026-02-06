import React from 'react';
import { Card } from '@/components/ui/Card';
import { DollarSign, ShoppingCart, AlertCircle, Clock, Activity, ArrowUpRight, PhilippinePeso } from 'lucide-react';
import { prisma } from '@/lib/prisma';
import { FinancialChart } from '@/components/dashboard/FinancialChart';

async function getDashboardData() {
    try {
        const pendingPOs = await prisma.purchaseOrder.count({ where: { status: 'PENDING' } });
        const activeProjects = await prisma.project.count({ where: { status: 'ACTIVE' } });
        return { pendingPOs, activeProjects };
    } catch (e) {
        return { pendingPOs: 0, activeProjects: 0, dbError: true };
    }
}

export default async function DashboardPage() {
    const data = await getDashboardData();

    return (
        <div className="space-y-10">
            <header className="flex justify-between items-end pb-6 border-b border-white/5">
                <div>
                    <h1 className="text-4xl font-bold text-white mb-2 font-[family-name:var(--font-outfit)]">Dashboard Overview</h1>
                    <p className="text-slate-400">Welcome back, get an update on your projects.</p>
                </div>
                <div className="text-right hidden md:block">
                    <div className="inline-flex items-center px-4 py-2 rounded-full bg-white/5 border border-white/10 text-sm text-slate-300 backdrop-blur-md">
                        <span className="w-2 h-2 rounded-full bg-emerald-500 mr-2 animate-pulse"></span>
                        System Operational
                    </div>
                </div>
            </header>

            {data.dbError && (
                <div className="bg-red-500/10 border border-red-500/30 text-red-400 p-4 rounded-xl flex items-center gap-3 glass">
                    <AlertCircle size={20} />
                    <p>Database connection failed. Running in demo mode.</p>
                </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <StatCard
                    title="Pending Approvals"
                    value={data.pendingPOs.toString()}
                    icon={<Clock className="text-orange-400" />}
                    trend="+2 New"
                    color="from-orange-500/20 to-amber-500/5"
                />
                <StatCard
                    title="Active Projects"
                    value={data.activeProjects.toString()}
                    icon={<PhilippinePeso className="text-emerald-400" />}
                    trend="On Time"
                    color="from-emerald-500/20 to-teal-500/5"
                />
                <StatCard
                    title="Total Orders"
                    value="1,240"
                    icon={<ShoppingCart className="text-blue-400" />}
                    trend="+12% vs last month"
                    color="from-blue-500/20 to-cyan-500/5"
                />
                <StatCard
                    title="Alerts"
                    value="3"
                    icon={<AlertCircle className="text-red-400" />}
                    trend="Inventory Low"
                    color="from-red-500/20 to-pink-500/5"
                />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-2 space-y-8">
                    {/* Financial Overview Chart */}
                    <FinancialChart />

                    {/* Recent Activities */}
                    <Card className="h-full">
                        <div className="flex justify-between items-center mb-8">
                            <h3 className="text-xl font-bold text-white">Recent Activities</h3>
                            <button className="text-sm text-cyan-400 hover:text-cyan-300">View All</button>
                        </div>
                        <div className="space-y-2">
                            {[1, 2, 3, 4].map(i => (
                                <div key={i} className="flex items-center justify-between p-4 rounded-xl hover:bg-white/5 transition-colors group cursor-pointer border border-transparent hover:border-white/5">
                                    <div className="flex items-center gap-4">
                                        <div className="w-12 h-12 rounded-xl bg-slate-800/50 flex items-center justify-center text-slate-400 group-hover:text-cyan-400 group-hover:bg-cyan-950/30 transition-all">
                                            <Activity size={20} />
                                        </div>
                                        <div>
                                            <p className="font-medium text-slate-200 group-hover:text-white">New Purchase Order Created</p>
                                            <p className="text-sm text-slate-500">PO-2026-00{i} • Just now</p>
                                        </div>
                                    </div>
                                    <div className="flex items-center text-emerald-400 bg-emerald-500/10 px-3 py-1 rounded-full text-xs font-medium">
                                        Running
                                    </div>
                                </div>
                            ))}
                        </div>
                    </Card>
                </div>

                <div>
                    <Card className="h-full bg-gradient-to-b from-slate-900 to-black">
                        <h3 className="text-xl font-bold text-white mb-6">Budget Utilization</h3>
                        <div className="space-y-8">
                            <BudgetRow name="Skyline Tower" progress={75} budget="50M" />
                            <BudgetRow name="Seaside Villa" progress={32} budget="15M" />
                            <BudgetRow name="City Hardware" progress={90} budget="2M" color="bg-red-500" />
                        </div>

                        <div className="mt-10 p-6 rounded-2xl bg-gradient-to-br from-cyan-600 to-blue-700 relative overflow-hidden">
                            <div className="relative z-10">
                                <h4 className="font-bold text-white text-lg mb-2">Pro Tip</h4>
                                <p className="text-cyan-100 text-sm mb-4">Review DUPA limits before approving large orders to maintain budget health.</p>
                                <button className="bg-white text-cyan-900 px-4 py-2 rounded-lg text-sm font-bold shadow-lg hover:bg-cyan-50 transition-colors">
                                    Check Reports
                                </button>
                            </div>
                            {/* Decorative circles */}
                            <div className="absolute -bottom-10 -right-10 w-32 h-32 bg-white/20 rounded-full blur-2xl" />
                            <div className="absolute top-10 -right-5 w-20 h-20 bg-blue-400/30 rounded-full blur-xl" />
                        </div>
                    </Card>
                </div>
            </div>
        </div>
    );
}

function StatCard({ title, value, icon, trend, color }: any) {
    return (
        <Card hoverEffect className={`relative overflow-hidden`}>
            <div className={`absolute -right-10 -top-10 w-40 h-40 bg-gradient-to-br ${color} rounded-full blur-3xl opacity-50 pointer-events-none`} />

            <div className="relative z-10">
                <div className="flex justify-between items-start mb-6">
                    <div className="p-3 bg-white/5 rounded-xl border border-white/5 ring-1 ring-white/10 backdrop-blur-sm shadow-inner">
                        {icon}
                    </div>
                    {trend && (
                        <div className="flex items-center gap-1 text-xs font-medium bg-emerald-500/10 text-emerald-400 px-2 py-1 rounded-full border border-emerald-500/20">
                            <ArrowUpRight size={12} /> {trend}
                        </div>
                    )}
                </div>

                <h3 className="text-3xl font-bold text-white mb-1 tracking-tight">{value}</h3>
                <p className="text-sm text-slate-400 font-medium">{title}</p>
            </div>
        </Card>
    );
}

function BudgetRow({ name, progress, budget, color = "bg-cyan-500" }: any) {
    return (
        <div>
            <div className="flex justify-between mb-2">
                <div>
                    <p className="text-sm font-bold text-slate-200">{name}</p>
                    <p className="text-xs text-slate-500">Budget: ₱{budget}</p>
                </div>
                <span className="text-sm font-bold text-slate-400">{progress}%</span>
            </div>
            <div className="h-2 bg-slate-800 rounded-full overflow-hidden">
                <div className={`h-full ${color} rounded-full transition-all duration-1000 ease-out shadow-lg shadow-cyan-500/20`} style={{ width: `${progress}%` }}></div>
            </div>
        </div>
    );
}
