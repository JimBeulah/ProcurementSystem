'use client';

import React, { createContext, useContext, useState } from 'react';
import { ChevronDown } from 'lucide-react';
import { cn } from '@/lib/utils'; // Assuming you have a utility for class merging, otherwise I'll define a simple one inline or use template literals carefully. I see clsx/tailwind-merge in package.json so I'll assume they are used but I will stick to template literals if utils is not clearly found, BUT standard practices usually have it. I'll use simple concat for safety if I didn't verify lib/utils existing. 
// Wait, I saw lib folder in list_dir. Let's assume standard utils or just write clean tailwind.
// Actually, to be safe and avoid "module not found", I will implement without external cn for now, or assume common usage. 
// Re-reading list_dir: lib exists.
// I will just use template strings to be safe.

const AccordionContext = createContext<{
    activeItem: string | null;
    toggleItem: (value: string) => void;
} | null>(null);

export function Accordion({
    children,
    defaultValue,
    className,
}: {
    children: React.ReactNode;
    defaultValue?: string;
    className?: string;
}) {
    const [activeItem, setActiveItem] = useState<string | null>(defaultValue || null);

    const toggleItem = (value: string) => {
        setActiveItem((prev) => (prev === value ? null : value));
    };

    return (
        <AccordionContext.Provider value={{ activeItem, toggleItem }}>
            <div className={`space-y-4 ${className || ''}`}>{children}</div>
        </AccordionContext.Provider>
    );
}

export function AccordionItem({
    value,
    children,
    className,
}: {
    value: string;
    children: React.ReactNode;
    className?: string;
}) {
    return (
        <div className={`border border-white/10 rounded-xl bg-slate-800/20 overflow-hidden ${className || ''}`}>
            {children}
        </div>
    );
}

export function AccordionTrigger({
    value,
    children,
    className,
    icon: Icon,
}: {
    value: string;
    children: React.ReactNode;
    className?: string;
    icon?: React.ElementType;
}) {
    const context = useContext(AccordionContext);
    if (!context) throw new Error('AccordionTrigger must be used within Accordion');

    const isOpen = context.activeItem === value;

    return (
        <button
            onClick={() => context.toggleItem(value)}
            className={`w-full flex items-center justify-between p-4 text-left transition-colors ${isOpen ? 'bg-white/5 text-white' : 'text-slate-300 hover:bg-white/5 hover:text-white'
                } ${className || ''}`}
        >
            <div className="flex items-center gap-3 font-medium text-lg">
                {Icon && <Icon className={`w-5 h-5 ${isOpen ? 'text-cyan-400' : 'text-slate-500'}`} />}
                {children}
            </div>
            <ChevronDown
                className={`w-5 h-5 text-slate-500 transition-transform duration-200 ${isOpen ? 'rotate-180 text-cyan-400' : ''
                    }`}
            />
        </button>
    );
}

export function AccordionContent({
    value,
    children,
    className,
}: {
    value: string;
    children: React.ReactNode;
    className?: string;
}) {
    const context = useContext(AccordionContext);
    if (!context) throw new Error('AccordionContent must be used within Accordion');

    const isOpen = context.activeItem === value;

    if (!isOpen) return null;

    return (
        <div className={`p-6 border-t border-white/5 animate-in slide-in-from-top-2 fade-in duration-200 ${className || ''}`}>
            {children}
        </div>
    );
}
