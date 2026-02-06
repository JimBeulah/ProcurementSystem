'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Users, Shield, HardHat, Package, DollarSign, ArrowRight, CheckCircle2 } from 'lucide-react';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Modal } from '@/components/ui/Modal';
import { LoginDialog } from '@/components/LoginDialog';

export default function LandingPage() {
  const router = useRouter();
  const [isRoleSelectionOpen, setIsRoleSelectionOpen] = useState(false);
  const [isLoginOpen, setIsLoginOpen] = useState(false);
  const [selectedRole, setSelectedRole] = useState<{ name: string; icon: React.ReactNode; desc: string; color: string } | null>(null);

  const roles = [
    { name: 'Admin', icon: <Shield className="w-6 h-6 text-purple-400" />, desc: 'System Config & Users', color: 'group-hover:border-purple-500/50' },
    { name: 'Purchaser', icon: <DollarSign className="w-6 h-6 text-green-400" />, desc: 'Create Purchase Orders', color: 'group-hover:border-green-500/50' },
    { name: 'Approver', icon: <Users className="w-6 h-6 text-blue-400" />, desc: 'Approve & Decline POs', color: 'group-hover:border-blue-500/50' },
    { name: 'Warehouse', icon: <Package className="w-6 h-6 text-orange-400" />, desc: 'Inventory & Stock', color: 'group-hover:border-orange-500/50' },
    { name: 'Site Engineer', icon: <HardHat className="w-6 h-6 text-yellow-400" />, desc: 'Receiving & Releases', color: 'group-hover:border-yellow-500/50' },
  ];

  const handleRoleSelect = (roleName: string) => {
    const role = roles.find(r => r.name === roleName);
    if (role) {
      setSelectedRole(role);
      setIsRoleSelectionOpen(false);
      setIsLoginOpen(true);
    }
  };

  const handleLogin = () => {
    router.push('/dashboard');
  };

  return (
    <div className="min-h-screen flex flex-col relative overflow-hidden font-sans">
      {/* Dynamic Background */}
      <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?q=80&w=2070&auto=format&fit=crop')] bg-cover bg-center opacity-[0.03]" />
      <div className="absolute inset-0 bg-gradient-to-b from-[#0a0a0f] via-transparent to-[#0a0a0f]" />
      <div className="absolute inset-0 bg-gradient-to-r from-[#0a0a0f]/80 to-transparent" />

      {/* Navbar */}
      <nav className="relative z-10 w-full px-8 py-6 flex justify-between items-center border-b border-white/5 backdrop-blur-sm">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-xl flex items-center justify-center shadow-lg shadow-cyan-500/20">
            <span className="text-white font-bold text-xl">P</span>
          </div>
          <span className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white to-slate-400 font-[family-name:var(--font-outfit)]">
            ProcureFlow
          </span>
        </div>
        <div className="flex gap-4">
          <Button variant="ghost" onClick={() => window.alert('Contact Support')}>Support</Button>
          <Button onClick={() => setIsRoleSelectionOpen(true)} className="shadow-cyan-500/20 shadow-lg">Login Access</Button>
        </div>
      </nav>

      {/* Hero Section */}
      <main className="flex-1 relative z-10 container mx-auto px-6 flex flex-col justify-center max-w-7xl">
        <div className="max-w-3xl">
          <div className="inline-flex items-center px-4 py-2 rounded-full bg-white/5 border border-white/10 text-sm text-cyan-400 mb-8 backdrop-blur-md">
            <span className="w-2 h-2 rounded-full bg-cyan-400 mr-2 animate-pulse"></span>
            Enterprise Procurement System v1.0
          </div>

          <h1 className="text-7xl font-bold text-white mb-6 leading-tight tracking-tight font-[family-name:var(--font-outfit)]">
            Streamline Your <br />
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-400 via-cyan-400 to-emerald-400">
              Supply Chain
            </span>
          </h1>

          <p className="text-xl text-slate-400 mb-10 max-w-2xl leading-relaxed">
            Manage purchase requests, approvals, and inventory in one unified platform.
            Designed for construction and material-intensive industries with DUPA integration.
          </p>

          <div className="flex gap-4">
            <Button onClick={() => setIsRoleSelectionOpen(true)} className="h-14 px-8 text-lg bg-white text-black hover:bg-slate-200">
              Get Started <ArrowRight className="ml-2" />
            </Button>
            <Button variant="outline" className="h-14 px-8 text-lg border-white/20 hover:bg-white/5">
              View Documentation
            </Button>
          </div>

          <div className="mt-12 flex gap-8 text-slate-500">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="text-emerald-500" size={20} /> Real-time Tracking
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle2 className="text-emerald-500" size={20} /> DUPA Validation
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle2 className="text-emerald-500" size={20} /> Multi-role Access
            </div>
          </div>
        </div>
      </main>

      {/* Role Selection Modal */}
      <Modal
        isOpen={isRoleSelectionOpen}
        onClose={() => setIsRoleSelectionOpen(false)}
        title="Select Access Role"
      >
        <div className="space-y-4">
          <p className="text-slate-400 mb-6 text-sm">
            Please select your authorized role to enter the system. This is a demo environment, no password required.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {roles.map((role) => (
              <button
                key={role.name}
                onClick={() => handleRoleSelect(role.name)}
                className={`group flex items-start p-4 rounded-xl bg-white/5 border border-white/5 hover:bg-white/10 transition-all text-left ${role.color} hover:border`}
              >
                <div className="mr-4 p-3 rounded-lg bg-[#0a0a0f] border border-white/10 group-hover:scale-110 transition-transform">
                  {role.icon}
                </div>
                <div>
                  <h3 className="text-lg font-bold text-slate-200 group-hover:text-white transition-colors">{role.name}</h3>
                  <p className="text-xs text-slate-500 group-hover:text-slate-400">{role.desc}</p>
                </div>
              </button>
            ))}
          </div>

          <div className="mt-6 pt-6 border-t border-white/5 flex justify-between items-center">
            <a href="#" className="text-xs text-slate-500 hover:text-cyan-400">Forgot credentials?</a>
            <p className="text-xs text-slate-600">Secure AES-256 Connection</p>
          </div>
        </div>
      </Modal>

      {/* Login Dialog */}
      <LoginDialog
        isOpen={isLoginOpen}
        onClose={() => setIsLoginOpen(false)}
        role={selectedRole}
        onLogin={handleLogin}
      />
    </div>
  );
}
