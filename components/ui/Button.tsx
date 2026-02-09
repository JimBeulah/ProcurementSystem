import React from 'react';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs));
}

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    variant?: 'primary' | 'secondary' | 'danger' | 'outline' | 'ghost';
    size?: 'sm' | 'md' | 'lg';
}

export function Button({ className, variant = 'primary', size = 'md', ...props }: ButtonProps) {
    const variants = {
        primary: 'bg-accent hover:opacity-90 text-white shadow-lg shadow-accent/20',
        secondary: 'bg-muted/10 hover:bg-muted/20 text-foreground',
        danger: 'bg-red-500 hover:bg-red-600 text-white',
        outline: 'border border-border hover:bg-muted/10 text-muted hover:text-foreground',
        ghost: 'hover:bg-muted/10 text-muted hover:text-foreground'
    };

    const sizes = {
        sm: 'px-3 py-1.5 text-xs',
        md: 'px-4 py-2 text-sm',
        lg: 'px-6 py-3 text-base'
    };

    return (
        <button
            className={cn(
                "rounded-lg font-medium transition-all active:scale-95 disabled:opacity-50 disabled:pointer-events-none",
                variants[variant],
                sizes[size],
                className
            )}
            {...props}
        />
    );
}
