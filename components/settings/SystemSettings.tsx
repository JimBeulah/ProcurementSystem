import React from 'react';
import { Card } from '@/components/ui/Card';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { Save } from 'lucide-react';

export default function SystemSettings() {
    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-xl font-bold text-white mb-2">System Configuration</h2>
                    <p className="text-slate-400">General system parameters and preferences.</p>
                </div>
                <Button className="bg-cyan-600 hover:bg-cyan-500 text-white">
                    <Save className="w-4 h-4 mr-2" /> Save Changes
                </Button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Card className="p-6 space-y-6 bg-slate-800/20 border-slate-700/50">
                    <h3 className="font-bold text-white border-b border-white/5 pb-2">General Information</h3>

                    <div className="space-y-4">
                        <div className="space-y-2">
                            <label className="text-sm font-medium text-slate-300">New Company Name</label>
                            <Input placeholder="Enter company name" defaultValue="Procurement System" />
                        </div>

                        <div className="space-y-2">
                            <label className="text-sm font-medium text-slate-300">Support Email</label>
                            <Input type="email" placeholder="support@example.com" />
                        </div>
                    </div>
                </Card>

                <Card className="p-6 space-y-6 bg-slate-800/20 border-slate-700/50">
                    <h3 className="font-bold text-white border-b border-white/5 pb-2">Localization</h3>

                    <div className="space-y-4">
                        <div className="space-y-2">
                            <label className="text-sm font-medium text-slate-300">Currency Symbol</label>
                            <Input placeholder="$" defaultValue="$" className="w-20" />
                        </div>

                        <div className="space-y-2">
                            <label className="text-sm font-medium text-slate-300">Time Zone</label>
                            <select className="w-full h-10 px-3 rounded-lg bg-white/5 border border-white/10 text-white focus:outline-none focus:ring-2 focus:ring-cyan-500">
                                <option>UTC</option>
                                <option>EST</option>
                                <option>PST</option>
                                <option>GMT</option>
                            </select>
                        </div>
                    </div>
                </Card>
            </div>
        </div>
    );
}
