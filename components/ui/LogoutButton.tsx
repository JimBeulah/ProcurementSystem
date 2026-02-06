'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/Button';
import { LogOut } from 'lucide-react';

export function LogoutButton() {
    const router = useRouter();

    const handleLogout = () => {
        // Clear any local storage/session if needed
        // For now, just redirect to landing page
        router.push('/');
    };

    return (
        <Button
            variant="ghost"
            onClick={handleLogout}
            className="text-red-400 hover:text-red-300 hover:bg-red-500/10 border border-transparent hover:border-red-500/20"
        >
            <LogOut size={16} className="mr-2" />
            Logout
        </Button>
    );
}
