'use client';

import React from 'react';
import dynamic from 'next/dynamic';

const LazyFinancialChart = dynamic(() => import('./FinancialChart').then(mod => mod.FinancialChart), {
    loading: () => <div className="h-[400px] w-full bg-card/50 animate-pulse rounded-xl flex items-center justify-center text-muted-foreground">Loading charts...</div>,
    ssr: false
});

export default function FinancialChartWrapper() {
    return <LazyFinancialChart />;
}
