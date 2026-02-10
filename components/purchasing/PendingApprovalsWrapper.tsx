'use client';

import React from 'react';
import dynamic from 'next/dynamic';

interface PendingApprovalsWrapperProps {
    initialPos: any[];
    initialMrs: any[];
}

const LazyPendingApprovalsClient = dynamic(() => import('./PendingApprovalsClient'), {
    loading: () => <div className="p-8 space-y-4 animate-pulse">
        <div className="h-10 bg-white/5 rounded-lg w-1/4"></div>
        <div className="h-64 bg-white/5 rounded-xl"></div>
    </div>,
    ssr: false
});

export default function PendingApprovalsWrapper(props: PendingApprovalsWrapperProps) {
    return <LazyPendingApprovalsClient {...props} />;
}
