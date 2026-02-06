'use client';

import React, { useState, useEffect } from 'react';
import { Modal } from '@/components/ui/Modal';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { UserRole } from '@prisma/client';
import { Loader2, Save, Trash2, ShieldCheck } from 'lucide-react';
import { createUser, updateUser, deleteUser } from '@/actions/user-actions';

interface UserDialogProps {
    isOpen: boolean;
    onClose: () => void;
    userToEdit?: any | null; // If null, we are adding a new user
}

export function UserDialog({ isOpen, onClose, userToEdit }: UserDialogProps) {
    const [isLoading, setIsLoading] = useState(false);
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: '',
        role: 'ENCODER',
    });
    const [deleteConfirm, setDeleteConfirm] = useState(false);

    useEffect(() => {
        if (userToEdit) {
            setFormData({
                name: userToEdit.name,
                email: userToEdit.email,
                password: '', // Don't show existing hash
                role: userToEdit.role,
            });
        } else {
            setFormData({
                name: '',
                email: '',
                password: '',
                role: 'ENCODER',
            });
        }
        setDeleteConfirm(false);
    }, [userToEdit, isOpen]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);

        try {
            let result;
            if (userToEdit) {
                result = await updateUser(userToEdit.id, formData);
            } else {
                result = await createUser(formData);
            }

            if (result.success) {
                onClose();
            } else {
                alert(result.error || 'Operation failed');
            }
        } catch (error) {
            console.error(error);
            alert('An unexpected error occurred');
        } finally {
            setIsLoading(false);
        }
    };

    const handleDelete = async () => {
        if (!deleteConfirm) {
            setDeleteConfirm(true);
            return;
        }

        setIsLoading(true);
        try {
            const result = await deleteUser(userToEdit.id);
            if (result.success) {
                onClose();
            } else {
                alert(result.error);
            }
        } catch (error) {
            console.error(error);
        } finally {
            setIsLoading(false);
        }
    };

    if (!isOpen) return null;

    const roleOptions = [
        { value: 'ADMIN', label: 'Admin' },
        { value: 'PROJECT_MANAGER', label: 'Project Manager' },
        { value: 'PROCUREMENT_OFFICER', label: 'Procurement Officer' },
        { value: 'ENGINEER', label: 'Engineer' },
        { value: 'FINANCE', label: 'Finance' },
        { value: 'AUDITOR', label: 'Auditor' },
        { value: 'WAREHOUSE', label: 'Warehouse' },
        { value: 'ENCODER', label: 'Encoder' }, // Keeping base role
    ];

    return (
        <Modal isOpen={isOpen} onClose={onClose} title={userToEdit ? 'Edit User' : 'Add New User'}>
            <form onSubmit={handleSubmit} className="space-y-4">
                <Input
                    label="Full Name"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    placeholder="e.g. John Doe"
                    required
                />

                <Input
                    label="Email Address"
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="john@example.com"
                    required
                />

                <div className="space-y-1">
                    <label className="text-sm font-medium text-slate-300">Role</label>
                    <div className="relative">
                        <select
                            name="role"
                            value={formData.role}
                            onChange={handleChange}
                            className="w-full bg-[#0a0a0f] border border-white/10 rounded-lg py-2.5 px-4 text-white appearance-none focus:outline-none focus:ring-2 focus:ring-cyan-500/50"
                        >
                            {roleOptions.map((role) => (
                                <option key={role.value} value={role.value}>
                                    {role.label}
                                </option>
                            ))}
                        </select>
                        <ShieldCheck className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 pointer-events-none" size={16} />
                    </div>
                </div>

                <div className="space-y-1">
                    <label className="text-sm font-medium text-slate-300">
                        {userToEdit ? 'New Password (leave blank to keep current)' : 'Password'}
                    </label>
                    <Input
                        type="password"
                        name="password"
                        value={formData.password}
                        onChange={handleChange}
                        placeholder={userToEdit ? '••••••••' : 'Enter password'}
                        required={!userToEdit}
                    />
                </div>

                <div className="pt-4 flex gap-3">
                    <Button
                        type="submit"
                        disabled={isLoading}
                        className="flex-1 bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-500 hover:to-cyan-500 text-white"
                    >
                        {isLoading ? <Loader2 className="animate-spin mr-2" /> : <Save className="mr-2 w-4 h-4" />}
                        {userToEdit ? 'Update User' : 'Create User'}
                    </Button>

                    {userToEdit && (
                        <Button
                            type="button"
                            onClick={handleDelete}
                            variant="ghost"
                            className={`text-red-400 hover:text-red-300 hover:bg-red-500/10 ${deleteConfirm ? 'bg-red-500/10 border border-red-500/50' : ''}`}
                        >
                            <Trash2 className="w-4 h-4" />
                            {deleteConfirm ? 'Confirm Delete?' : ''}
                        </Button>
                    )}
                </div>
            </form>
        </Modal>
    );
}
