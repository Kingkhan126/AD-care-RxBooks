'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  LayoutDashboard, Users, FileText, ShoppingBag, Receipt, CreditCard,
  Building2, Package, ShieldCheck, PieChart, Landmark, BookOpen,
  Briefcase, Zap, Settings, Sparkles, ChevronRight, ChevronLeft, Store,
  ArrowUpRight, X
} from 'lucide-react';
import { useADCare } from '@/lib/context';
import { BrandLogo } from '@/components/ui/BrandLogo';

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

export const Sidebar: React.FC = () => {
  const pathname = usePathname();
  const {
    orgSettings,
    setIsAIOpen,
    overdueInvoicesCount,
    pendingBillsCount,
    isSidebarCollapsed,
    setIsSidebarCollapsed,
    isMobileSidebarOpen,
    setIsMobileSidebarOpen
  } = useADCare();

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
    <>
      {/* 1. Mobile Backdrop Overlay */}
      <div
        className={`md:hidden fixed inset-0 z-40 bg-black/50 backdrop-blur-sm transition-opacity duration-300 ease-in-out ${
          isMobileSidebarOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
        }`}
        onClick={() => setIsMobileSidebarOpen(false)}
        aria-hidden="true"
      />

      {/* 2. Mobile Slide-Over Drawer (Screens < md) */}
      <aside
        className={`md:hidden fixed inset-y-0 left-0 z-50 w-64 bg-slate-900 text-slate-300 flex flex-col shadow-2xl transition-transform duration-300 ease-in-out select-none ${
          isMobileSidebarOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        {/* Mobile Header */}
        <div className="p-4 border-b border-slate-800 flex items-center justify-between">
          <Link href="/dashboard" onClick={() => setIsMobileSidebarOpen(false)}>
            <BrandLogo size="md" lightText={true} />
          </Link>
          <button
            onClick={() => setIsMobileSidebarOpen(false)}
            className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition-colors"
            aria-label="Close mobile sidebar"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Mobile Org Badge */}
        <div className="mx-3 my-3 p-2.5 bg-slate-800/60 rounded-lg border border-slate-700/50 flex items-center justify-between text-xs">
          <div className="truncate pr-2">
            <div className="text-slate-400 text-[10px] uppercase font-semibold">Active Org</div>
            <div className="text-white font-medium truncate">{orgSettings.name}</div>
          </div>
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
        </div>

        {/* Mobile AI Quick Launcher */}
        <div className="px-3 mb-2">
          <button
            onClick={() => {
              setIsAIOpen(true);
              setIsMobileSidebarOpen(false);
            }}
            className="w-full py-2 px-3 rounded-lg bg-gradient-to-r from-brand-600 to-indigo-600 hover:from-brand-500 hover:to-indigo-500 text-white font-medium text-xs flex items-center justify-between shadow-md shadow-brand-500/10 transition-all border border-indigo-400/30 group"
          >
            <div className="flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-cyan-200" />
              <span>AD CARE AI</span>
            </div>
            <ChevronRight className="w-3.5 h-3.5 text-white/70" />
          </button>
        </div>

        {/* Mobile Nav List */}
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
                      onClick={() => setIsMobileSidebarOpen(false)}
                      className={`flex items-center justify-between px-2.5 py-2 rounded-md text-xs font-medium transition-colors ${
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

        {/* Mobile Footer */}
        <div className="p-3 border-t border-slate-800 text-[11px] text-slate-400 flex items-center justify-between">
          <div>AD CARE v2026.1</div>
          <div className="flex items-center gap-1.5 text-emerald-400">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400"></span>
            <span>Online</span>
          </div>
        </div>
      </aside>

      {/* 3. Desktop Permanent Sidebar (Screens >= md) */}
      <aside
        className={`hidden md:flex bg-slate-900 text-slate-300 flex-col h-screen fixed left-0 top-0 z-30 border-r border-slate-800 shadow-xl select-none transition-all duration-300 ease-in-out ${
          isSidebarCollapsed ? 'w-20' : 'w-64'
        }`}
      >
        {/* Desktop Header with Minimize Toggle */}
        <div className={`p-4 border-b border-slate-800/80 flex items-center ${isSidebarCollapsed ? 'justify-center' : 'justify-between'}`}>
          {!isSidebarCollapsed ? (
            <Link href="/dashboard" className="group truncate">
              <BrandLogo size="md" lightText={true} />
            </Link>
          ) : (
            <Link href="/dashboard" title="AD CARE Dashboard" className="p-1 text-brand-400 font-extrabold text-sm">
              <Store className="w-6 h-6 text-brand-400" />
            </Link>
          )}

          {/* Desktop Manual Collapse Button */}
          <button
            onClick={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
            className={`p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition-colors ${
              isSidebarCollapsed ? 'mt-1' : ''
            }`}
            title={isSidebarCollapsed ? 'Expand Sidebar' : 'Collapse Sidebar'}
            aria-label={isSidebarCollapsed ? 'Expand Sidebar' : 'Collapse Sidebar'}
          >
            {isSidebarCollapsed ? (
              <ChevronRight className="w-5 h-5 transition-transform duration-300" />
            ) : (
              <ChevronLeft className="w-5 h-5 transition-transform duration-300" />
            )}
          </button>
        </div>

        {/* Organization Status */}
        {!isSidebarCollapsed ? (
          <div className="mx-3 my-3 p-2.5 bg-slate-800/60 rounded-lg border border-slate-700/50 flex items-center justify-between text-xs transition-opacity duration-200">
            <div className="truncate pr-2">
              <div className="text-slate-400 text-[10px] uppercase font-semibold">Active Org</div>
              <div className="text-white font-medium truncate">{orgSettings.name}</div>
            </div>
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse shrink-0"></span>
          </div>
        ) : (
          <div className="my-3 flex justify-center" title={`Active Org: ${orgSettings.name}`}>
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse"></span>
          </div>
        )}

        {/* AI Assistant Launcher */}
        <div className="px-3 mb-2">
          {!isSidebarCollapsed ? (
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
          ) : (
            <button
              onClick={() => setIsAIOpen(true)}
              title="Launch AD CARE AI"
              className="w-full py-2 px-2 rounded-lg bg-gradient-to-r from-brand-600 to-indigo-600 hover:from-brand-500 hover:to-indigo-500 text-white flex justify-center shadow-md border border-indigo-400/30"
            >
              <Sparkles className="w-5 h-5 text-cyan-200" />
            </button>
          )}
        </div>

        {/* Navigation Items */}
        <nav className="flex-1 overflow-y-auto px-2 py-2 space-y-4 scrollbar-thin scrollbar-thumb-slate-700">
          {navigation.map((group) => (
            <div key={group.groupName}>
              {!isSidebarCollapsed ? (
                <div className="px-2 mb-1.5 text-[10px] font-bold text-slate-400 tracking-wider">
                  {group.groupName}
                </div>
              ) : (
                <div className="my-2 border-t border-slate-800/80" />
              )}
              <div className="space-y-1">
                {group.items.map((item) => {
                  const isActive = pathname === item.href || (item.href !== '/dashboard' && pathname.startsWith(item.href));
                  const Icon = item.icon;
                  return (
                    <Link
                      key={item.name}
                      href={item.href}
                      title={isSidebarCollapsed ? item.name : undefined}
                      className={`flex items-center rounded-lg text-xs font-medium transition-all ${
                        isSidebarCollapsed ? 'justify-center p-2.5' : 'justify-between px-2.5 py-1.5'
                      } ${
                        isActive
                          ? 'bg-brand-600 text-white shadow-sm font-semibold'
                          : 'text-slate-300 hover:bg-slate-800/80 hover:text-white'
                      }`}
                    >
                      <div className={`flex items-center ${isSidebarCollapsed ? 'justify-center' : 'gap-2.5 truncate'}`}>
                        <Icon className={`w-4 h-4 shrink-0 ${isActive ? 'text-white' : 'text-slate-400'}`} />
                        {!isSidebarCollapsed && <span className="truncate">{item.name}</span>}
                      </div>

                      {!isSidebarCollapsed && item.badge && (
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

        {/* Desktop Footer */}
        <div className={`p-3 border-t border-slate-800 text-[11px] text-slate-400 flex items-center ${
          isSidebarCollapsed ? 'justify-center' : 'justify-between'
        }`}>
          {!isSidebarCollapsed ? (
            <>
              <div>AD CARE v2026.1</div>
              <div className="flex items-center gap-1.5 text-emerald-400">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400"></span>
                <span>Online</span>
              </div>
            </>
          ) : (
            <div className="w-2 h-2 rounded-full bg-emerald-400" title="AD CARE Online"></div>
          )}
        </div>
      </aside>
    </>
  );
};
