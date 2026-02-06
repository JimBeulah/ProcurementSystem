'use client';

import React, { useState } from 'react';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { UserPlus, Search, Edit2, Shield, Mail } from 'lucide-react';
import { UserDialog } from './UserDialog';

interface UserManagementClientProps {
    users: any[];
}

export default function UserManagementClient({ users }: UserManagementClientProps) {
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [userToEdit, setUserToEdit] = useState<any | null>(null);
    const [searchTerm, setSearchTerm] = useState('');

    const handleAddUser = () => {
        setUserToEdit(null);
        setIsDialogOpen(true);
    };

    const handleEditUser = (user: any) => {
        setUserToEdit(user);
        setIsDialogOpen(true);
    };

    const filteredUsers = users.filter(user =>
        user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.role.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="space-y-6">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div className="relative w-full md:w-auto">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500 w-4 h-4" />
                    <input
                        type="text"
                        placeholder="Search users..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="pl-10 pr-4 py-2 bg-white/5 border border-white/10 rounded-lg text-sm text-white focus:outline-none focus:ring-2 focus:ring-cyan-500/50 w-full md:w-64"
                    />
                </div>
                <Button
                    onClick={handleAddUser}
                    className="bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-500 hover:to-cyan-500 text-white shadow-lg shadow-cyan-500/20"
                >
                    <UserPlus className="w-4 h-4 mr-2" /> Add New User
                </Button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {filteredUsers.map((user) => (
                    <Card key={user.id} hoverEffect className="group relative overflow-hidden">
                        <div className="absolute top-0 right-0 p-4 opacity-0 group-hover:opacity-100 transition-opacity">
                            <button
                                onClick={() => handleEditUser(user)}
                                className="p-2 bg-white/10 hover:bg-white/20 rounded-lg text-cyan-400 transition-colors"
                            >
                                <Edit2 size={16} />
                            </button>
                        </div>

                        <div className="flex items-start gap-4">
                            <div className="w-12 h-12 rounded-full bg-gradient-to-br from-slate-700 to-slate-900 flex items-center justify-center text-lg font-bold text-white border border-white/10">
                                {user.name.charAt(0)}
                            </div>
                            <div>
                                <h3 className="font-bold text-white text-lg">{user.name}</h3>
                                <div className="flex items-center gap-2 text-slate-400 text-sm mb-2">
                                    <Mail size={12} /> {user.email}
                                </div>
                                <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-white/5 border border-white/10 text-xs font-medium text-cyan-400">
                                    <Shield size={10} />
                                    {user.role}
                                </div>
                            </div>
                        </div>
                    </Card>
                ))}
            </div>

            <UserDialog
                isOpen={isDialogOpen}
                onClose={() => setIsDialogOpen(false)}
                userToEdit={userToEdit}
            />
        </div>
    );
}
