'use client';

import React from 'react';
import { User } from 'next-auth';
import { Bell, Search, Menu, LogOut, ChevronDown } from 'lucide-react';
import { Breadcrumbs } from '@/components/ui/Breadcrumbs';
import { signOutAction } from '@/actions/auth-actions';
import { motion, AnimatePresence } from 'framer-motion';

interface HeaderProps {
    user: User;
    onMenuClick: () => void;
}

export default function Header({ user, onMenuClick }: HeaderProps) {
    const [isProfileOpen, setIsProfileOpen] = React.useState(false);

    return (
        <header className="sticky top-0 z-40 w-full border-b border-white/5 bg-[#0a0a0f]/80 backdrop-blur-xl transition-all">
            <div className="flex h-16 items-center justify-between px-4 md:px-6">
                <div className="flex items-center gap-4">
                    <button
                        onClick={onMenuClick}
                        className="md:hidden p-2 -ml-2 rounded-lg hover:bg-white/5 text-slate-300"
                    >
                        <Menu size={20} />
                    </button>
                    {/* Breadcrumbs wrapper to override default margin if needed */}
                    <div className="hidden md:block">
                        <Breadcrumbs />
                    </div>
                </div>

                <div className="flex items-center gap-4">
                    {/* Search Bar - Hidden on mobile for now */}
                    <motion.div
                        initial={false}
                        whileFocusWithin={{ width: "240px", backgroundColor: "rgba(255,255,255,0.1)" }}
                        className="hidden md:flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/5 border border-white/5 focus-within:border-cyan-500/50 transition-all w-48"
                    >
                        <Search size={14} className="text-slate-500" />
                        <input
                            type="text"
                            placeholder="Search..."
                            className="bg-transparent border-none outline-none text-sm text-white placeholder-slate-500 w-full"
                        />
                    </motion.div>

                    <button className="p-2 rounded-full hover:bg-white/5 relative text-slate-400 hover:text-white transition-colors">
                        <Bell size={18} />
                        <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-cyan-500 border border-[#0a0a0f]" />
                    </button>

                    <div className="relative">
                        <motion.button
                            onClick={() => setIsProfileOpen(!isProfileOpen)}
                            className="flex items-center gap-2 pl-2 pr-1 py-1 rounded-full hover:bg-white/5 transition-all text-left"
                            whileTap={{ scale: 0.97 }}
                        >
                            <div className="w-8 h-8 rounded-full bg-gradient-to-r from-purple-500 to-pink-500 flex items-center justify-center font-bold text-white shadow-lg text-xs">
                                {user.name ? user.name.charAt(0).toUpperCase() : 'U'}
                            </div>
                            <div className="hidden md:flex flex-col">
                                <span className="text-xs font-medium text-white leading-none">{user.name}</span>
                                <span className="text-[10px] text-slate-400 leading-none mt-1">Admin</span>
                            </div>
                            <ChevronDown size={14} className={`text-slate-500 transition-transform ${isProfileOpen ? 'rotate-180' : ''}`} />
                        </motion.button>

                        <AnimatePresence>
                            {isProfileOpen && (
                                <>
                                    <div
                                        className="fixed inset-0 z-40"
                                        onClick={() => setIsProfileOpen(false)}
                                    />
                                    <motion.div
                                        initial={{ opacity: 0, y: 10, scale: 0.95 }}
                                        animate={{ opacity: 1, y: 0, scale: 1 }}
                                        exit={{ opacity: 0, y: 10, scale: 0.95 }}
                                        transition={{ duration: 0.2 }}
                                        className="absolute right-0 mt-2 w-56 rounded-xl bg-[#0a0a0f] border border-white/10 shadow-2xl overflow-hidden z-50 origin-top-right"
                                    >
                                        <div className="p-4 border-b border-white/5 bg-white/5">
                                            <p className="text-sm font-medium text-white">{user.name}</p>
                                            <p className="text-xs text-slate-500">{user.email}</p>
                                        </div>
                                        <div className="p-2">
                                            <button className="w-full flex items-center gap-2 px-3 py-2 text-sm text-slate-400 hover:text-white hover:bg-white/5 rounded-lg transition-colors">
                                                <Menu size={16} />
                                                Settings
                                            </button>
                                            <form action={signOutAction}>
                                                <button
                                                    type="submit"
                                                    className="w-full flex items-center gap-2 px-3 py-2 text-sm text-red-400 hover:bg-red-500/10 rounded-lg transition-colors"
                                                >
                                                    <LogOut size={16} />
                                                    Sign Out
                                                </button>
                                            </form>
                                        </div>
                                    </motion.div>
                                </>
                            )}
                        </AnimatePresence>
                    </div>
                </div>
            </div>
        </header>
    );
}
