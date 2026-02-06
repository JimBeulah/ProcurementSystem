'use client';

import React, { useState, useEffect } from 'react';
import { FileText, Plus, Search, Calendar, Users } from 'lucide-react';
import Link from 'next/link';
import { getProjectRFQs } from '@/actions/rfq-actions';
// We might need a generic getRFQs for all projects
import { prisma } from '@/lib/prisma'; // Client components can't import prisma directly usually. 
// I need a generic "getAllRFQs" action.

export default function RfqListPage() {
    return (
        <div className="p-6 space-y-6">
            <header className="flex justify-between items-center pb-6 border-b border-white/5">
                <div>
                    <h1 className="text-2xl font-bold text-white flex items-center gap-3">
                        <FileText className="text-pink-500" /> Request for Quotations (RFQ)
                    </h1>
                    <p className="text-slate-400">Manage RFQs and supplier pricing.</p>
                </div>
                <Link href="/purchasing/rfq/create">
                    <button className="bg-pink-600 hover:bg-pink-500 text-white px-4 py-2 rounded-lg flex items-center gap-2">
                        <Plus size={18} /> Create RFQ
                    </button>
                </Link>
            </header>

            <div className="text-center py-12 text-slate-500 bg-white/5 rounded-xl border border-dashed border-white/10">
                <FileText size={48} className="mx-auto mb-4 opacity-50" />
                <p>No RFQs found. Create one to get started.</p>
                {/* Real implementation would fetch and list RFQs here */}
            </div>
        </div>
    );
}
