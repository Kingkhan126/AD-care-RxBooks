'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  LayoutDashboard, Users, FileText, ShoppingBag, Receipt, CreditCard,
  Building2, Package, ShieldCheck, PieChart, Landmark, BookOpen,
  Briefcase, Zap, Settings, Sparkles, ChevronRight, Store, ArrowUpRight
} from 'lucide-react';
import { useADCare } from '@/lib/context';

interface NavItem {
  name: string;
  href: string;
  icon: React.ElementType;
  badge?: string | number;
}

interface NavGroup {
  groupName: string;
  items: NavItem[];
}

import { BrandLogo } from '@/components/ui/BrandLogo';

export const Sidebar: React.FC = () => {
  const pathname = usePathname();
  const { orgSettings, setIsAIOpen, overdueInvoicesCount, pendingBillsCount } = useADCare();

  const navigation: NavGroup[] = [
    {
      groupName: 'OVERVIEW',
      items: [
        { name: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
      ]
    },
    {
      groupName: 'SALES & CUSTOMERS',
      items: [
        { name: 'Customers', href: '/customers', icon: Users },
        { name: 'Quotes / Estimates', href: '/quotes', icon: FileText },
        { name: 'Invoices', href: '/invoices', icon: Receipt, badge: overdueInvoicesCount > 0 ? `${overdueInvoicesCount} Overdue` : undefined },
        { name: 'Customer Payments', href: '/payments', icon: CreditCard },
        { name: 'Credit Notes', href: '/credit-notes', icon: ArrowUpRight }
      ]
    },
    {
      groupName: 'PURCHASES & EXPENSES',
      items: [
        { name: 'Vendors', href: '/vendors', icon: Building2 },
        { name: 'Purchase Orders', href: '/purchase-orders', icon: ShoppingBag },
        { name: 'Vendor Bills', href: '/bills', icon: FileText, badge: pendingBillsCount > 0 ? `${pendingBillsCount} Pending` : undefined },
        { name: 'Expenses', href: '/expenses', icon: Receipt }
      ]
    },
    {
      groupName: 'INVENTORY & WAREHOUSE',
      items: [
        { name: 'Products & Services', href: '/items', icon: Package },
        { name: 'Inventory & Stock', href: '/inventory', icon: Store }
      ]
    },
    {
      groupName: 'BANKING & ACCOUNTING',
      items: [
        { name: 'Bank Accounts', href: '/banking', icon: Landmark },
        { name: 'Bank Reconciliation', href: '/reconciliation', icon: ShieldCheck },
        { name: 'Chart of Accounts', href: '/chart-of-accounts', icon: BookOpen },
        { name: 'Journal Entries', href: '/journal-entries', icon: FileText },
        { name: 'Financial Reports', href: '/reports', icon: PieChart }
      ]
    },
    {
      groupName: 'OPERATIONS & ADMIN',
      items: [
        { name: 'Projects & Time', href: '/projects', icon: Briefcase },
        { name: 'Automation', href: '/automation', icon: Zap },
        { name: 'Audit Logs', href: '/audit-logs', icon: ShieldCheck },
        { name: 'Organization Settings', href: '/settings', icon: Settings }
      ]
    }
  ];

  return (
    <aside className="w-64 bg-slate-900 text-slate-300 flex flex-col h-screen fixed left-0 top-0 z-30 border-r border-slate-800 shadow-xl select-none">
      {/* Brand Header */}
      <div className="p-4 border-b border-slate-800/80 flex items-center justify-between">
        <Link href="/dashboard" className="group">
          <BrandLogo size="md" lightText={true} />
        </Link>
      </div>

      {/* Organization Badge */}
      <div className="mx-3 my-3 p-2.5 bg-slate-800/60 rounded-lg border border-slate-700/50 flex items-center justify-between text-xs">
        <div className="truncate pr-2">
          <div className="text-slate-400 text-[10px] uppercase font-semibold">Active Org</div>
          <div className="text-white font-medium truncate">{orgSettings.name}</div>
        </div>
        <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
      </div>

      {/* AI Assistant Quick Launcher */}
      <div className="px-3 mb-2">
        <button
          onClick={() => setIsAIOpen(true)}
          className="w-full py-2 px-3 rounded-lg bg-gradient-to-r from-brand-600 to-indigo-600 hover:from-brand-500 hover:to-indigo-500 text-white font-medium text-xs flex items-center justify-between shadow-md shadow-brand-500/10 transition-all border border-indigo-400/30 group"
        >
          <div className="flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-cyan-200 animate-spin-slow" />
            <span>AD CARE AI</span>
          </div>
          <ChevronRight className="w-3.5 h-3.5 text-white/70 group-hover:translate-x-0.5 transition-transform" />
        </button>
      </div>

      {/* Navigation List */}
      <nav className="flex-1 overflow-y-auto px-3 py-2 space-y-4 scrollbar-thin scrollbar-thumb-slate-700">
        {navigation.map((group) => (
          <div key={group.groupName}>
            <div className="px-2 mb-1.5 text-[10px] font-bold text-slate-400 tracking-wider">
              {group.groupName}
            </div>
            <div className="space-y-0.5">
              {group.items.map((item) => {
                const isActive = pathname === item.href || (item.href !== '/dashboard' && pathname.startsWith(item.href));
                const Icon = item.icon;
                return (
                  <Link
                    key={item.name}
                    href={item.href}
                    className={`flex items-center justify-between px-2.5 py-1.5 rounded-md text-xs font-medium transition-colors ${
                      isActive
                        ? 'bg-brand-600 text-white shadow-sm font-semibold'
                        : 'text-slate-300 hover:bg-slate-800/80 hover:text-white'
                    }`}
                  >
                    <div className="flex items-center gap-2.5 truncate">
                      <Icon className={`w-4 h-4 ${isActive ? 'text-white' : 'text-slate-400'}`} />
                      <span className="truncate">{item.name}</span>
                    </div>
                    {item.badge && (
                      <span className={`px-1.5 py-0.5 text-[9px] font-bold rounded-full ${
                        isActive ? 'bg-white/20 text-white' : 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                      }`}>
                        {item.badge}
                      </span>
                    )}
                  </Link>
                );
              })}
            </div>
          </div>
        ))}
      </nav>

      {/* Footer */}
      <div className="p-3 border-t border-slate-800 text-[11px] text-slate-400 flex items-center justify-between">
        <div>AD CARE v2026.1</div>
        <div className="flex items-center gap-1.5 text-emerald-400">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400"></span>
          <span>Online</span>
        </div>
      </div>
    </aside>
  );
};
