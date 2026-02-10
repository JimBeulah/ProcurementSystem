'use client';

import React from 'react';
import { Card } from '@/components/ui/Card';
import { Building2, Phone, FileText, ChevronRight, Hash, Clock } from 'lucide-react';
import { motion } from 'framer-motion';

interface ClientCardProps {
    client: {
        id: number | string;
        name: string;
        contactPerson?: string;
        contractType: string;
        paymentTerms: string;
        _count?: {
            projects: number;
        };
    };
}

export function ClientCard({ client }: ClientCardProps) {
    return (
        <motion.div
            layout
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.2 }}
        >
            <Card hoverEffect className="group relative overflow-hidden h-full p-3.5 border-border bg-foreground/[0.02]">
                {/* Background Accent */}
                <div className="absolute -right-8 -top-8 w-20 h-20 bg-blue-500/5 rounded-full blur-2xl group-hover:bg-blue-500/10 transition-colors pointer-events-none" />

                <div className="relative z-10 flex flex-col h-full">
                    {/* Header: Icon & ID */}
                    <div className="flex justify-between items-start mb-2.5">
                        <div className="p-1.5 rounded-lg bg-blue-500/10 text-blue-400 border border-blue-500/20 group-hover:bg-blue-500/20 transition-colors">
                            <Building2 size={16} />
                        </div>
                        <div className="flex items-center gap-1 px-1.5 py-0.5 rounded bg-foreground/[0.03] border border-border">
                            <Hash size={10} className="text-muted" />
                            <span className="text-[9px] font-black text-muted uppercase tracking-tight">
                                {client.id}
                            </span>
                        </div>
                    </div>

                    {/* Content */}
                    <div className="mb-2">
                        <h3 className="text-[15px] font-bold text-foreground mb-0.5 group-hover:text-blue-400 transition-colors line-clamp-1">
                            {client.name}
                        </h3>
                        {client.contactPerson && (
                            <div className="flex items-center gap-1.5 text-[11px] text-muted mb-1">
                                <Phone size={10} className="text-muted" />
                                <span className="truncate">{client.contactPerson}</span>
                            </div>
                        )}
                    </div>

                    {/* Footer Details */}
                    <div className="grid grid-cols-2 gap-2 pt-2.5 mt-auto border-t border-border">
                        <div className="space-y-0.5">
                            <p className="text-[9px] font-black text-muted uppercase tracking-wider">Contract</p>
                            <div className="flex items-center gap-1">
                                <FileText size={10} className="text-blue-500/70" />
                                <span className="text-[11px] font-bold text-foreground opacity-80">{client.contractType}</span>
                            </div>
                        </div>
                        <div className="space-y-0.5 text-right">
                            <p className="text-[9px] font-black text-muted uppercase tracking-wider">Terms</p>
                            <div className="flex items-center gap-1 justify-end">
                                <Clock size={10} className="text-emerald-500/70" />
                                <span className="text-[11px] font-bold text-foreground opacity-80">{client.paymentTerms}</span>
                            </div>
                        </div>
                    </div>

                    {/* Stats Badge */}
                    <div className="mt-2.5 flex items-center justify-between">
                        <div className="px-1.5 py-0.5 rounded bg-blue-500/5 border border-blue-500/10">
                            <span className="text-[10px] font-black text-blue-400 uppercase tracking-tight">
                                {client._count?.projects || 0} Projects
                            </span>
                        </div>
                        <div className="w-5 h-5 rounded-full flex items-center justify-center text-muted group-hover:text-foreground transition-colors">
                            <ChevronRight size={12} />
                        </div>
                    </div>
                </div>
            </Card>
        </motion.div>
    );
}
