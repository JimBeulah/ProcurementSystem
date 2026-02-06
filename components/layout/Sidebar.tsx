'use client';

import React from 'react';
import Link from 'next/link';
import {
    Building2,
    ShoppingCart,
    FileText,
    CreditCard,
    Package,
    BarChart3,
    Users,
    Settings,
    Hexagon,
    X,
    Briefcase,
    Shield,
    ArrowDownCircle,
    ChevronDown
} from 'lucide-react';

interface SidebarProps {
    isOpen?: boolean;
    onClose?: () => void;
}

const Sidebar = ({ isOpen = false, onClose }: SidebarProps) => {
    // Handle link click to auto-close on mobile
    const handleLinkClick = () => {
        if (onClose && window.innerWidth < 768) {
            onClose();
        }
    };

    return (
        <>
            {/* Mobile Overlay */}
            {isOpen && (
                <div
                    className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 md:hidden animate-in fade-in duration-200"
                    onClick={onClose}
                />
            )}

            <div className={`
                h-screen w-72 bg-[#0a0a0f]/95 md:bg-[#0a0a0f]/80 backdrop-blur-xl border-r border-white/5 
                fixed left-0 top-0 flex flex-col z-50 
                transition-transform duration-300 cubic-bezier(0.4, 0, 0.2, 1)
                ${isOpen ? 'translate-x-0' : '-translate-x-full'} 
                md:translate-x-0 shadow-2xl md:shadow-none
            `}>
                <div className="p-8 pb-4 relative">
                    {/* Mobile Close Button */}
                    <button
                        onClick={onClose}
                        className="absolute top-4 right-4 md:hidden p-2 text-slate-500 hover:text-white transition-colors"
                    >
                        <X size={20} />
                    </button>

                    <div className="flex items-center gap-3 mb-6">
                        <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-blue-500 to-cyan-500 flex items-center justify-center shadow-lg shadow-cyan-500/20">
                            <Hexagon className="text-white fill-white/20" size={24} />
                        </div>
                        <div>
                            <h1 className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white to-slate-400">
                                ProcureFlow
                            </h1>
                            <p className="text-[10px] text-slate-500 font-semibold tracking-wider uppercase">Enterprise Edition</p>
                        </div>
                    </div>
                </div>

                <nav className="flex-1 overflow-y-auto px-4 space-y-6">
                    <NavItem onClick={handleLinkClick} href="/dashboard" icon={<BarChart3 />} label="Dashboard" />

                    <NavGroup label="Procurement" defaultExpanded={true}>
                        <NavItem onClick={handleLinkClick} href="/clients" icon={<Users />} label="Clients" />
                        <NavItem onClick={handleLinkClick} href="/projects" icon={<Briefcase />} label="Projects" />
                        <NavItem onClick={handleLinkClick} href="/purchasing/rfq" icon={<FileText />} label="RFQ" />
                        <NavItem onClick={handleLinkClick} href="/purchasing/requests" icon={<FileText />} label="Purchase Requests" />
                        <NavItem onClick={handleLinkClick} href="/purchasing/orders" icon={<ShoppingCart />} label="Purchase Orders" />
                        <NavItem onClick={handleLinkClick} href="/inventory/receiving" icon={<ArrowDownCircle />} label="Receive Goods" />
                        <NavItem onClick={handleLinkClick} href="/purchasing/approvals" icon={<Shield />} label="Approvals" />
                    </NavGroup>

                    <NavGroup label="Operations">
                        <NavItem onClick={handleLinkClick} href="/inventory" icon={<Package />} label="Inventory" />
                        <NavItem onClick={handleLinkClick} href="/receiving" icon={<Building2 />} label="Receiving" />
                        <NavItem onClick={handleLinkClick} href="/site-release" icon={<TruckIcon />} label="Site Release" />
                    </NavGroup>

                    <NavGroup label="Finance">
                        <NavItem onClick={handleLinkClick} href="/finance/invoices" icon={<FileText />} label="Invoices" />
                        <NavItem onClick={handleLinkClick} href="/finance/disbursements" icon={<CreditCard />} label="Disbursements" />
                        <NavItem onClick={handleLinkClick} href="/finance/reports" icon={<PieChartIcon />} label="Reports" />
                    </NavGroup>


                </nav>

                <div className="p-4 m-4 rounded-xl bg-gradient-to-br from-slate-900 to-black border border-white/5">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-gradient-to-r from-purple-500 to-pink-500 flex items-center justify-center font-bold text-white shadow-lg">
                            JD
                        </div>
                        <div className="overflow-hidden">
                            <p className="text-sm font-medium text-white truncate">John Doe</p>
                            <p className="text-xs text-slate-400">Purchaser</p>
                        </div>
                        <Link
                            href="/settings"
                            onClick={handleLinkClick}
                            className="ml-auto text-slate-500 hover:text-white transition-colors"
                        >
                            <Settings size={18} />
                        </Link>
                    </div>
                </div>
            </div>
        </>
    );
};

const NavGroup = ({ label, children, defaultExpanded = false }: { label: string, children: React.ReactNode, defaultExpanded?: boolean }) => {
    const [isExpanded, setIsExpanded] = React.useState(defaultExpanded);

    return (
        <div className="space-y-1">
            <button
                onClick={() => setIsExpanded(!isExpanded)}
                className="w-full flex items-center justify-between px-4 text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-2 hover:text-slate-300 transition-colors group"
                type="button"
            >
                <span>{label}</span>
                <ChevronDown
                    size={14}
                    className={`transition-transform duration-200 ${isExpanded ? 'rotate-0' : '-rotate-90'}`}
                />
            </button>
            <div className={`space-y-1 overflow-hidden transition-all duration-300 ease-in-out ${isExpanded ? 'max-h-screen opacity-100' : 'max-h-0 opacity-0'}`}>
                {children}
            </div>
        </div>
    );
};

const NavItem = ({ href, icon, label, onClick }: { href: string; icon: React.ReactNode; label: string; onClick?: () => void }) => {
    return (
        <Link
            href={href}
            onClick={onClick}
            className="group flex items-center gap-3 px-4 py-2.5 rounded-lg text-slate-400 hover:text-white hover:bg-white/5 transition-all duration-200 active:bg-white/10"
        >
            <span className="group-hover:text-cyan-400 transition-colors duration-200 group-hover:drop-shadow-[0_0_8px_rgba(34,211,238,0.5)]">
                {React.cloneElement(icon as React.ReactElement<any>, { size: 18 })}
            </span>
            <span className="text-sm font-medium">{label}</span>
        </Link>
    );
};

// Simple icons for missing lucide imports
const TruckIcon = () => <Users size={18} />;
const PieChartIcon = () => <FileText size={18} />;
const DatabaseIcon = () => <Package size={18} />;
const WorkflowIcon = () => <Settings size={18} />;

export default Sidebar;
