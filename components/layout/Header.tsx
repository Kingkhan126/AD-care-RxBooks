'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  Search, Plus, Bell, Sparkles, ChevronDown, FileText, Receipt,
  Users, BookOpen, Menu, X, LayoutDashboard, Building2, ShoppingBag,
  Package, Store, Landmark, ShieldCheck, PieChart, Briefcase, Zap, Settings, CreditCard, ArrowUpRight
} from 'lucide-react';
import { useADCare } from '@/lib/context';
import { BrandLogo } from '@/components/ui/BrandLogo';

export const Header: React.FC = () => {
  const pathname = usePathname();
  const { orgSettings, setIsAIOpen, auditLogs, isSidebarCollapsed, isMobileSidebarOpen, setIsMobileSidebarOpen } = useADCare();
  const [showQuickAdd, setShowQuickAdd] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);

  // Dynamic header title lookup based on path
  const getPageTitle = (path: string) => {
    if (path.startsWith('/dashboard')) return 'AD CARE — Dashboard';
    if (path.startsWith('/customers')) return 'AD CARE — Customers';
    if (path.startsWith('/vendors')) return 'AD CARE — Vendors';
    if (path.startsWith('/items')) return 'AD CARE — Products & Services';
    if (path.startsWith('/inventory')) return 'AD CARE — Inventory & Warehouses';
    if (path.startsWith('/quotes')) return 'AD CARE — Quotes & Estimates';
    if (path.startsWith('/invoices')) return 'AD CARE — Invoices';
    if (path.startsWith('/payments')) return 'AD CARE — Customer Payments';
    if (path.startsWith('/credit-notes')) return 'AD CARE — Credit Notes';
    if (path.startsWith('/purchase-orders')) return 'AD CARE — Purchase Orders';
    if (path.startsWith('/bills')) return 'AD CARE — Vendor Bills';
    if (path.startsWith('/expenses')) return 'AD CARE — Expense Log';
    if (path.startsWith('/banking')) return 'AD CARE — Bank Accounts';
    if (path.startsWith('/reconciliation')) return 'AD CARE — Bank Reconciliation';
    if (path.startsWith('/chart-of-accounts')) return 'AD CARE — Chart of Accounts';
    if (path.startsWith('/journal-entries')) return 'AD CARE — Journal Entries';
    if (path.startsWith('/reports')) return 'AD CARE — Financial Reports';
    if (path.startsWith('/projects')) return 'AD CARE — Projects & Timesheets';
    if (path.startsWith('/automation')) return 'AD CARE — Automation';
    if (path.startsWith('/audit-logs')) return 'AD CARE — Audit Trail';
    if (path.startsWith('/settings')) return 'AD CARE — Organization Settings';
    return 'AD CARE — Meds & Pharmacy';
  };

  return (
    <>
      <header className={`h-16 bg-white border-b border-slate-200 fixed top-0 right-0 left-0 transition-all duration-300 ease-in-out ${
        isSidebarCollapsed ? 'md:left-20' : 'md:left-64'
      } z-20 px-3 sm:px-6 flex items-center justify-between shadow-subtle`}>
        {/* Mobile Hamburger & Title */}
        <div className="flex items-center gap-2 sm:gap-3">
          <button
            onClick={() => setIsMobileSidebarOpen(!isMobileSidebarOpen)}
            className="md:hidden p-2 text-slate-700 hover:bg-slate-100 rounded-lg focus:outline-none transition-colors"
            aria-label="Toggle navigation drawer"
          >
            {isMobileSidebarOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>

          <h1 className="text-sm sm:text-lg font-bold text-slate-900 font-sans tracking-tight truncate max-w-[180px] sm:max-w-none">
            {getPageTitle(pathname)}
          </h1>
          <span className="hidden lg:inline-block px-2 py-0.5 rounded text-[11px] font-semibold bg-slate-100 text-slate-600 border border-slate-200">
            FY 2026
          </span>
        </div>

        {/* Action Center */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Quick + Create Dropdown */}
          <div className="relative">
            <button
              onClick={() => setShowQuickAdd(!showQuickAdd)}
              className="flex items-center gap-1 sm:gap-1.5 px-2.5 sm:px-3 py-1.5 bg-brand-600 hover:bg-brand-700 text-white rounded-lg text-xs font-medium shadow-sm transition-colors"
            >
              <Plus className="w-4 h-4" />
              <span className="hidden sm:inline">Create</span>
              <ChevronDown className="w-3 h-3" />
            </button>

            {showQuickAdd && (
              <div className="absolute right-0 mt-2 w-48 bg-white border border-slate-200 rounded-lg shadow-premium py-1.5 z-50 text-xs animate-in fade-in zoom-in-95 duration-100">
                <Link
                  href="/invoices/new"
                  onClick={() => setShowQuickAdd(false)}
                  className="flex items-center gap-2 px-3 py-2 text-slate-700 hover:bg-slate-50 hover:text-brand-600"
                >
                  <Receipt className="w-4 h-4 text-brand-500" />
                  <span>New Invoice</span>
                </Link>
                <Link
                  href="/expenses"
                  onClick={() => setShowQuickAdd(false)}
                  className="flex items-center gap-2 px-3 py-2 text-slate-700 hover:bg-slate-50 hover:text-brand-600"
                >
                  <FileText className="w-4 h-4 text-emerald-500" />
                  <span>Log Expense</span>
                </Link>
                <Link
                  href="/customers"
                  onClick={() => setShowQuickAdd(false)}
                  className="flex items-center gap-2 px-3 py-2 text-slate-700 hover:bg-slate-50 hover:text-brand-600"
                >
                  <Users className="w-4 h-4 text-indigo-500" />
                  <span>Add Customer</span>
                </Link>
                <Link
                  href="/journal-entries"
                  onClick={() => setShowQuickAdd(false)}
                  className="flex items-center gap-2 px-3 py-2 text-slate-700 hover:bg-slate-50 hover:text-brand-600"
                >
                  <BookOpen className="w-4 h-4 text-amber-500" />
                  <span>Journal Entry</span>
                </Link>
              </div>
            )}
          </div>

          {/* AD CARE AI Button */}
          <button
            onClick={() => setIsAIOpen(true)}
            className="flex items-center gap-1 sm:gap-1.5 px-2.5 sm:px-3 py-1.5 bg-indigo-50 text-indigo-700 hover:bg-indigo-100 border border-indigo-200 rounded-lg text-xs font-semibold transition-colors"
          >
            <Sparkles className="w-3.5 h-3.5 text-indigo-600 animate-pulse" />
            <span className="hidden sm:inline">AD CARE AI</span>
            <span className="sm:hidden">AI</span>
          </button>

          {/* Notifications */}
          <div className="relative">
            <button
              onClick={() => setShowNotifications(!showNotifications)}
              className="p-1.5 text-slate-500 hover:text-slate-700 hover:bg-slate-100 rounded-lg relative transition-colors"
            >
              <Bell className="w-4 h-4" />
              <span className="absolute top-1 right-1 w-2 h-2 rounded-full bg-brand-600"></span>
            </button>

            {showNotifications && (
              <div className="absolute right-0 mt-2 w-72 sm:w-80 bg-white border border-slate-200 rounded-xl shadow-premium p-3 z-50 text-xs">
                <div className="font-bold text-slate-900 mb-2 flex items-center justify-between">
                  <span>Recent System Alerts</span>
                  <span className="text-[10px] text-brand-600 font-normal">Mark all read</span>
                </div>
                <div className="space-y-2 max-h-60 overflow-y-auto">
                  {auditLogs.slice(0, 3).map(log => (
                    <div key={log.id} className="p-2 bg-slate-50 rounded border border-slate-100">
                      <div className="font-semibold text-slate-800">{log.action}</div>
                      <div className="text-slate-500 text-[11px]">{log.details}</div>
                      <div className="text-[9px] text-slate-400 mt-1">{log.timestamp}</div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* User Profile */}
          <div className="flex items-center gap-2 pl-1 sm:pl-2 border-l border-slate-200">
            <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-slate-900 text-white flex items-center justify-center font-bold text-xs">
              AD
            </div>
          </div>
        </div>
      </header>
    </>
  );
};
