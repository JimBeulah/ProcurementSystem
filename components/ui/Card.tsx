import React from 'react';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs));
}

interface CardProps {
    className?: string;
    children: React.ReactNode;
    hoverEffect?: boolean;
}

export function Card({ className, children, hoverEffect = false }: CardProps) {
    return (
        <div
            className={cn(
                "glass-card rounded-xl p-4 transition-all duration-200", // p-6 -> p-4
                "shadow-sm border-border/40", // Tighter border/shadow
                hoverEffect && "hover:bg-accent/[0.02] hover:-translate-y-0.5 hover:shadow-md hover:border-accent/20 cursor-pointer",
                className
            )}
        >
            {children}
        </div>
    );
}
