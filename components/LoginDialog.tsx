'use client';

import React, { useState } from 'react';
import { Modal } from '@/components/ui/Modal';
import { Button } from '@/components/ui/Button';
import { Lock, ArrowRight, Loader2, User } from 'lucide-react';

interface LoginDialogProps {
    isOpen: boolean;
    onClose: () => void;
    role: { name: string; icon: React.ReactNode; desc: string; color: string } | null;
    onLogin: () => void;
}

export function LoginDialog({ isOpen, onClose, role, onLogin }: LoginDialogProps) {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        // Simulate API call
        setTimeout(() => {
            setIsLoading(false);
            onLogin();
        }, 1000);
    };

    if (!role) return null;

    return (
        <Modal isOpen={isOpen} onClose={onClose} title={`Login as ${role.name}`}>
            <div className="space-y-6">
                <div className="flex items-center p-4 rounded-xl bg-white/5 border border-white/10">
                    <div className="mr-4 p-2 rounded-lg bg-[#0a0a0f] border border-white/10">
                        {role.icon}
                    </div>
                    <div>
                        <h3 className="text-lg font-bold text-white">{role.name}</h3>
                        <p className="text-sm text-slate-400">{role.desc}</p>
                    </div>
                </div>

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="space-y-2">
                        <label className="text-sm font-medium text-slate-300">Username</label>
                        <div className="relative">
                            <User className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500 w-4 h-4" />
                            <input
                                type="text"
                                value={username}
                                onChange={(e) => setUsername(e.target.value)}
                                className="w-full bg-[#0a0a0f] border border-white/10 rounded-lg py-2.5 pl-10 pr-4 text-white placeholder:text-slate-600 focus:outline-none focus:ring-2 focus:ring-cyan-500/50 transition-all"
                                placeholder="Enter username..."
                                autoFocus
                            />
                        </div>
                    </div>

                    <div className="space-y-2">
                        <label className="text-sm font-medium text-slate-300">Password</label>
                        <div className="relative">
                            <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500 w-4 h-4" />
                            <input
                                type="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className="w-full bg-[#0a0a0f] border border-white/10 rounded-lg py-2.5 pl-10 pr-4 text-white placeholder:text-slate-600 focus:outline-none focus:ring-2 focus:ring-cyan-500/50 transition-all"
                                placeholder="Enter access password..."
                            />
                        </div>
                    </div>

                    <div className="space-y-3 pt-2">
                        <Button
                            type="submit"
                            className="w-full h-11 bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-500 hover:to-cyan-500 text-white shadow-lg shadow-cyan-500/20"
                            disabled={isLoading}
                        >
                            {isLoading ? (
                                <>
                                    <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Authenticating...
                                </>
                            ) : (
                                <>
                                    Access Dashboard <ArrowRight className="ml-2 w-4 h-4" />
                                </>
                            )}
                        </Button>
                        <Button
                            type="button"
                            variant="ghost"
                            onClick={onClose}
                            className="w-full text-slate-400 hover:text-white hover:bg-white/5"
                        >
                            Back to Role Selection
                        </Button>
                    </div>
                </form>
            </div>
        </Modal>
    );
}
