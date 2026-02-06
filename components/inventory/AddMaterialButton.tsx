'use client';

import React, { useState } from 'react';
import { Plus } from 'lucide-react';
import AddMaterialDialog from './AddMaterialDialog';

export default function AddMaterialButton() {
    const [isDialogOpen, setIsDialogOpen] = useState(false);

    return (
        <>
            <button
                onClick={() => setIsDialogOpen(true)}
                className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-cyan-500 to-blue-500 text-white rounded-lg font-medium hover:from-cyan-400 hover:to-blue-400 focus:outline-none focus:ring-2 focus:ring-cyan-500/20 transition-all shadow-lg shadow-cyan-500/20"
            >
                <Plus size={18} />
                <span>Add Material</span>
            </button>

            <AddMaterialDialog
                isOpen={isDialogOpen}
                onClose={() => setIsDialogOpen(false)}
            />
        </>
    );
}
