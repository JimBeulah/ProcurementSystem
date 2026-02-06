import React from 'react';
import { prisma } from '@/lib/prisma';
import { PurchaseRequestForm } from './form';

async function getProjects() {
    try {
        return await prisma.project.findMany({ where: { status: 'ACTIVE' } });
    } catch (error) {
        console.warn("DB Connection failed, returning empty projects for build");
        return [];
    }
}

export default async function NewPurchaseRequest() {
    const projects = await getProjects();

    async function createRequest(formData: FormData) {
        'use server';
        console.log("Create request action called");
        // Action logic here
    }

    return (
        <div className="max-w-4xl mx-auto">
            <div className="flex justify-between items-center mb-8">
                <div>
                    <h1 className="text-2xl font-bold text-slate-100">Create Purchase Request</h1>
                    <p className="text-slate-400">Select items against project DUPA</p>
                </div>
            </div>

            <PurchaseRequestForm projects={projects} />
        </div>
    );
}
