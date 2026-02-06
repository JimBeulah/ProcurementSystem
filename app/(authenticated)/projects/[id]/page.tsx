'use client';

import React, { useState, useEffect } from 'react';
import {
    Briefcase,
    ClipboardList,
    Truck,
    ShoppingCart,
    BarChart3,
    Settings,
    ArrowRight,
    MapPin,
    Calendar,
    DollarSign,
    Building
} from 'lucide-react';
import Link from 'next/link';
import { Card } from '@/components/ui/Card';
import { prisma } from '@/lib/prisma';
import { getProjects } from '@/actions/project-actions'; // We might need a single getProject action

// We need a specific getProject action
import { getProject } from '@/actions/project-actions';

interface ProjectDashboardProps {
    params: Promise<{ id: string }>;
}

export default function ProjectDashboard({ params }: ProjectDashboardProps) {
    const { id } = React.use(params);
    const projectId = parseInt(id);
    const [project, setProject] = useState<any>(null);
    const [loading, setLoading] = useState(true);

    // Fetch project data - temporarily using a direct mock or we need to add getProject to actions
    // Let's assume we add getProject to actions/project-actions.ts in a moment

    // For now, I'll fetch list and find (inefficient but works without modifying actions immediately if strictly following tool usage)
    // BETTER: I will add getProject to project-actions.ts in the next step. 
    // To make this file compile, I will assume it exists.

    useEffect(() => {
        async function load() {
            setLoading(true);
            const data = await getProject(projectId);
            setProject(data);
            setLoading(false);
        }
        load();
    }, [projectId]);

    if (loading) return <div className="p-12 text-center text-slate-500">Loading project data...</div>;
    if (!project) return <div className="p-12 text-center text-red-500">Project not found</div>;

    return (
        <div className="p-6 space-y-6">
            {/* Header */}
            <header className="pb-6 border-b border-white/5">
                <div className="flex justify-between items-start">
                    <div>
                        <div className="flex items-center gap-2 text-slate-400 text-sm mb-1">
                            <Link href="/projects" className="hover:text-white transition-colors">Projects</Link>
                            <span>/</span>
                            <span>Dashboard</span>
                        </div>
                        <h1 className="text-3xl font-bold text-white mb-2">{project.name}</h1>
                        <div className="flex items-center gap-4 text-sm text-slate-400">
                            <div className="flex items-center gap-1"><Building size={14} /> {project.client?.name || 'Internal'}</div>
                            <div className="flex items-center gap-1"><MapPin size={14} /> {project.location || 'N/A'}</div>
                        </div>
                    </div>
                    <div className={`px-3 py-1 rounded-full text-sm font-semibold border ${project.status === 'ACTIVE' ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' : 'bg-slate-700 text-slate-400'
                        }`}>
                        {project.status}
                    </div>
                </div>
            </header>

            {/* Quick Stats */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <Card className="border-l-4 border-l-cyan-500">
                    <div className="text-slate-400 text-sm mb-1">Budget</div>
                    <div className="text-2xl font-bold text-white">{Number(project.budget).toLocaleString('en-PH', { style: 'currency', currency: 'PHP' })}</div>
                </Card>
                <Card className="border-l-4 border-l-orange-500">
                    <div className="text-slate-400 text-sm mb-1">Material Usage</div>
                    <div className="text-2xl font-bold text-white">45%</div>
                </Card>
                <Card className="border-l-4 border-l-purple-500">
                    <div className="text-slate-400 text-sm mb-1">Pending Requests</div>
                    <div className="text-2xl font-bold text-white">3</div>
                </Card>
                <Card className="border-l-4 border-l-blue-500">
                    <div className="text-slate-400 text-sm mb-1">Upcoming Deliveries</div>
                    <div className="text-2xl font-bold text-white">2</div>
                </Card>
            </div>

            {/* Main Navigation Grid */}
            <h2 className="text-xl font-bold text-white pt-4">Project Modules</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">

                {/* BOQ */}
                <Link href={`/projects/${projectId}/boq`}>
                    <Card hoverEffect className="group h-full">
                        <div className="p-4 bg-orange-500/10 rounded-xl w-fit mb-4 group-hover:bg-orange-500/20 transition-colors">
                            <ClipboardList size={32} className="text-orange-500" />
                        </div>
                        <h3 className="text-xl font-bold text-white mb-2">Bill of Quantities</h3>
                        <p className="text-slate-400 text-sm mb-4">Manage project budget limits, material requirements, and cost estimation.</p>
                        <div className="flex items-center text-orange-400 text-sm font-medium group-hover:gap-2 transition-all">
                            View BOQ <ArrowRight size={16} className="ml-1" />
                        </div>
                    </Card>
                </Link>

                {/* Material Requests */}
                <Link href={`/projects/${projectId}/material-requests`}>
                    <Card hoverEffect className="group h-full">
                        <div className="p-4 bg-purple-500/10 rounded-xl w-fit mb-4 group-hover:bg-purple-500/20 transition-colors">
                            <Truck size={32} className="text-purple-500" />
                        </div>
                        <h3 className="text-xl font-bold text-white mb-2">Material Requests</h3>
                        <p className="text-slate-400 text-sm mb-4">Request materials for site, track status, and generate RFQs.</p>
                        <div className="flex items-center text-purple-400 text-sm font-medium group-hover:gap-2 transition-all">
                            View Requests <ArrowRight size={16} className="ml-1" />
                        </div>
                    </Card>
                </Link>

                {/* Procurement Status (Placeholder linkage for now) */}
                <Link href="/purchasing/orders">
                    <Card hoverEffect className="group h-full">
                        <div className="p-4 bg-blue-500/10 rounded-xl w-fit mb-4 group-hover:bg-blue-500/20 transition-colors">
                            <ShoppingCart size={32} className="text-blue-500" />
                        </div>
                        <h3 className="text-xl font-bold text-white mb-2">Procurement Status</h3>
                        <p className="text-slate-400 text-sm mb-4">Track POs, deliveries, and supplier performance for this project.</p>
                        <div className="flex items-center text-blue-400 text-sm font-medium group-hover:gap-2 transition-all">
                            View Purchasing <ArrowRight size={16} className="ml-1" />
                        </div>
                    </Card>
                </Link>

            </div>
        </div>
    );
}
