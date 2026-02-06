import React from 'react';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { DatabaseBackup, Upload, Download, RefreshCw, AlertCircle } from 'lucide-react';

export default function BackupSettings() {
    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-xl font-bold text-white mb-2">Backup & Recovery</h2>
                    <p className="text-slate-400">Manage data backups and restoration.</p>
                </div>
                <Button className="bg-cyan-600 hover:bg-cyan-500 text-white">
                    <RefreshCw className="w-4 h-4 mr-2" /> Refresh Status
                </Button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Card className="p-6 space-y-4 border-slate-700/50 bg-slate-800/20">
                    <div className="flex items-start justify-between">
                        <div className="flex items-center gap-3">
                            <div className="p-3 bg-blue-500/10 text-blue-400 rounded-lg">
                                <Download size={24} />
                            </div>
                            <div>
                                <h3 className="font-bold text-white">Create Backup</h3>
                                <p className="text-sm text-slate-400">Save current system state</p>
                            </div>
                        </div>
                    </div>
                    <p className="text-slate-400 text-sm">
                        Create a full backup of the database and system files. This file can be used to restore the system later.
                    </p>
                    <Button className="w-full bg-blue-600 hover:bg-blue-500 text-white">
                        Generate Backup
                    </Button>
                </Card>

                <Card className="p-6 space-y-4 border-slate-700/50 bg-slate-800/20">
                    <div className="flex items-start justify-between">
                        <div className="flex items-center gap-3">
                            <div className="p-3 bg-emerald-500/10 text-emerald-400 rounded-lg">
                                <Upload size={24} />
                            </div>
                            <div>
                                <h3 className="font-bold text-white">Restore Data</h3>
                                <p className="text-sm text-slate-400">Recover from backup file</p>
                            </div>
                        </div>
                    </div>
                    <p className="text-slate-400 text-sm">
                        Upload a previously generated backup file to restore the system.
                        <span className="text-red-400 block mt-1 flex items-center gap-1">
                            <AlertCircle size={12} /> Warning: This will overwrite current data.
                        </span>
                    </p>
                    <Button variant="outline" className="w-full border-slate-600 text-slate-300 hover:bg-white/5">
                        Upload Backup File
                    </Button>
                </Card>
            </div>

            <Card className="overflow-hidden bg-slate-800/20 border-slate-700/50">
                <div className="p-4 border-b border-white/5">
                    <h3 className="font-bold text-white">Recent Backups</h3>
                </div>
                <div className="p-8 text-center text-slate-500">
                    No backup history available.
                </div>
            </Card>
        </div>
    );
}
