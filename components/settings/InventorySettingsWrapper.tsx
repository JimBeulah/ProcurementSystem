'use client';

import React from 'react';
import dynamic from 'next/dynamic';

const LazyInventorySettings = dynamic(() => import('./InventorySettings'), {
    loading: () => <div className="h-96 w-full bg-white/5 animate-pulse rounded-xl flex items-center justify-center text-slate-500">Loading settings...</div>,
    ssr: false
});

export default function InventorySettingsWrapper() {
    return <LazyInventorySettings />;
}
