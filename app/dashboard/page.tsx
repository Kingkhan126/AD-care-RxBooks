'use client';

import React from 'react';
import Link from 'next/link';
import {
  TrendingUp, TrendingDown, DollarSign, Wallet, ArrowUpRight, ArrowDownRight,
  AlertCircle, CheckCircle2, Clock, Plus, ArrowRight, Receipt, FileText,
  CreditCard, Sparkles, Building2, ShieldCheck, BarChart3
} from 'lucide-react';
import {
  ResponsiveContainer, AreaChart, Area, XAxis, YAxis, Tooltip, CartesianGrid,
  PieChart as RePieChart, Pie, Cell, Legend
} from 'recharts';
import { useADCare } from '@/lib/context';

const cashFlowData = [
  { month: 'Mar', Income: 12400, Expense: 8100 },
  { month: 'Apr', Income: 15800, Expense: 9200 },
  { month: 'May', Income: 18200, Expense: 10400 },
  { month: 'Jun', Income: 21500, Expense: 11800 },
  { month: 'Jul', Income: 24250, Expense: 13100 },
  { month: 'Aug', Income: 24250, Expense: 17390 },
];

const expenseCategoryData = [
  { name: 'Hosting & Server Infrastructure', value: 8400, color: '#0f172a' },
  { name: 'Rent & Lease', value: 4500, color: '#2563eb' },
  { name: 'Marketing & Digital Ads', value: 3200, color: '#10b981' },
  { name: 'Software Subscriptions', value: 1290, color: '#f59e0b' },
];

export default function DashboardPage() {
  const {
    totalRevenue, totalExpenses, netProfit, totalBankBalance, totalReceivables,
    totalPayables, overdueInvoicesCount, pendingBillsCount, invoices, bills,
    setIsAIOpen, orgSettings
  } = useADCare();

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-12">
      {/* Welcome Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 rounded-2xl p-6 text-white shadow-premium flex flex-col md:flex-row items-start md:items-center justify-between gap-4 border border-slate-800">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="px-2 py-0.5 rounded text-[10px] font-extrabold bg-brand-500 text-white uppercase tracking-wider">
              PRODUCTION LIVE
            </span>
            <span className="text-xs text-slate-300 font-medium">Fiscal Year 2026</span>
          </div>
          <h2 className="text-2xl font-extrabold tracking-tight text-white font-sans">
            Welcome to {orgSettings.name}
          </h2>
          <p className="text-xs text-slate-300 mt-1 max-w-xl">
            AD Care RxBooks is active. You have <span className="font-semibold text-white">PKR {totalBankBalance.toLocaleString()}</span> in total cash liquidity across connected banking accounts.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => setIsAIOpen(true)}
            className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-brand-500 to-indigo-500 hover:from-brand-600 hover:to-indigo-600 text-white rounded-xl text-xs font-bold shadow-lg shadow-brand-500/20 transition-all border border-white/10"
          >
            <Sparkles className="w-4 h-4 text-cyan-200" />
            <span>Launch RxBooks AI</span>
          </button>
          <Link
            href="/invoices/new"
            className="flex items-center gap-2 px-4 py-2 bg-white text-slate-900 hover:bg-slate-100 rounded-xl text-xs font-bold shadow-sm transition-colors"
          >
            <Plus className="w-4 h-4" />
            <span>New Invoice</span>
          </Link>
        </div>
      </div>

      {/* KPI Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Total Revenue */}
        <div className="bg-white rounded-xl p-5 border border-slate-200 shadow-subtle flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Total Revenue</span>
            <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center">
              <TrendingUp className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3">
            <div className="text-2xl font-extrabold text-slate-900 font-mono">
              PKR {totalRevenue.toLocaleString(undefined, { minimumFractionDigits: 2 })}
            </div>
            <div className="text-[11px] text-emerald-600 font-medium flex items-center gap-1 mt-1">
              <ArrowUpRight className="w-3.5 h-3.5" />
              <span>+14.2% from last month</span>
            </div>
          </div>
        </div>

        {/* Total Expenses & Bills */}
        <div className="bg-white rounded-xl p-5 border border-slate-200 shadow-subtle flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Expenses & Bills</span>
            <div className="w-8 h-8 rounded-lg bg-rose-50 text-rose-600 flex items-center justify-center">
              <TrendingDown className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3">
            <div className="text-2xl font-extrabold text-slate-900 font-mono">
              PKR {totalExpenses.toLocaleString(undefined, { minimumFractionDigits: 2 })}
            </div>
            <div className="text-[11px] text-slate-500 flex items-center gap-1 mt-1">
              <span>Includes {pendingBillsCount} pending vendor bills</span>
            </div>
          </div>
        </div>

        {/* Net Profit */}
        <div className="bg-white rounded-xl p-5 border border-slate-200 shadow-subtle flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Net Profit</span>
            <div className="w-8 h-8 rounded-lg bg-brand-50 text-brand-600 flex items-center justify-center">
              <DollarSign className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3">
            <div className={`text-2xl font-extrabold font-mono ${netProfit >= 0 ? 'text-slate-900' : 'text-rose-600'}`}>
              PKR {netProfit.toLocaleString(undefined, { minimumFractionDigits: 2 })}
            </div>
            <div className="text-[11px] text-emerald-600 font-semibold flex items-center gap-1 mt-1">
              <span>Operating Net Income Margin: {((netProfit / (totalRevenue || 1)) * 100).toFixed(1)}%</span>
            </div>
          </div>
        </div>

        {/* Total Bank Liquidity */}
        <div className="bg-white rounded-xl p-5 border border-slate-200 shadow-subtle flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Bank Balance</span>
            <div className="w-8 h-8 rounded-lg bg-indigo-50 text-indigo-600 flex items-center justify-center">
              <Wallet className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3">
            <div className="text-2xl font-extrabold text-slate-900 font-mono">
              PKR {totalBankBalance.toLocaleString(undefined, { minimumFractionDigits: 2 })}
            </div>
            <div className="text-[11px] text-slate-500 flex items-center gap-1 mt-1">
              <span>3 Connected Bank Accounts</span>
            </div>
          </div>
        </div>
      </div>

      {/* Financial Operations Bar */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Receivables Banner */}
        <div className="bg-amber-50/70 border border-amber-200/80 rounded-xl p-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-amber-500 text-white rounded-lg shadow-sm">
              <AlertCircle className="w-5 h-5" />
            </div>
            <div>
              <div className="text-xs font-bold text-amber-900">Total Accounts Receivable (A/R)</div>
              <div className="text-lg font-extrabold text-amber-950 font-mono">PKR {totalReceivables.toLocaleString()}</div>
              <div className="text-[11px] text-amber-800">{overdueInvoicesCount} invoice(s) are currently overdue</div>
            </div>
          </div>
          <Link
            href="/invoices"
            className="px-3 py-1.5 bg-amber-600 hover:bg-amber-700 text-white text-xs font-bold rounded-lg transition-colors shadow-2xs"
          >
            Manage Invoices
          </Link>
        </div>

        {/* Payables Banner */}
        <div className="bg-slate-900 text-white rounded-xl p-4 flex items-center justify-between shadow-subtle">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-brand-500 text-white rounded-lg shadow-sm">
              <Building2 className="w-5 h-5" />
            </div>
            <div>
              <div className="text-xs font-bold text-slate-300">Total Accounts Payable (A/P)</div>
              <div className="text-lg font-extrabold text-white font-mono">PKR {totalPayables.toLocaleString()}</div>
              <div className="text-[11px] text-slate-400">{pendingBillsCount} pending vendor bills due for payment</div>
            </div>
          </div>
          <Link
            href="/bills"
            className="px-3 py-1.5 bg-white/10 hover:bg-white/20 text-white text-xs font-bold rounded-lg transition-colors border border-white/20"
          >
            Review Bills
          </Link>
        </div>
      </div>

      {/* Main Charts & Analytics Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Cash Flow Area Chart */}
        <div className="lg:col-span-2 bg-white rounded-xl p-5 border border-slate-200 shadow-subtle space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-bold text-sm text-slate-900 flex items-center gap-2">
                <BarChart3 className="w-4 h-4 text-brand-600" />
                Monthly Cash Flow (Income vs Operating Expenses)
              </h3>
              <p className="text-[11px] text-slate-500">Historical performance across 2026 fiscal periods</p>
            </div>
            <span className="text-xs font-semibold text-slate-500 bg-slate-100 px-2.5 py-1 rounded-md">PKR</span>
          </div>

          <div className="h-72 w-full pt-2">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={cashFlowData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="incomeGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#10b981" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                  </linearGradient>
                  <linearGradient id="expenseGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#ef4444" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#ef4444" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                <XAxis dataKey="month" tick={{ fontSize: 11 }} stroke="#64748b" />
                <YAxis tick={{ fontSize: 11 }} stroke="#64748b" />
                <Tooltip
                  contentStyle={{ backgroundColor: '#0f172a', borderRadius: '8px', color: '#fff', fontSize: '12px' }}
                />
                <Area type="monotone" dataKey="Income" stroke="#10b981" strokeWidth={2} fillOpacity={1} fill="url(#incomeGrad)" />
                <Area type="monotone" dataKey="Expense" stroke="#ef4444" strokeWidth={2} fillOpacity={1} fill="url(#expenseGrad)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Expenses Pie Distribution */}
        <div className="bg-white rounded-xl p-5 border border-slate-200 shadow-subtle flex flex-col justify-between space-y-4">
          <div>
            <h3 className="font-bold text-sm text-slate-900">Operating Expense Breakdown</h3>
            <p className="text-[11px] text-slate-500">Major expense accounts distribution</p>
          </div>

          <div className="h-56 w-full relative">
            <ResponsiveContainer width="100%" height="100%">
              <RePieChart>
                <Pie
                  data={expenseCategoryData}
                  cx="50%"
                  cy="50%"
                  innerRadius={50}
                  outerRadius={75}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {expenseCategoryData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip contentStyle={{ backgroundColor: '#0f172a', borderRadius: '8px', color: '#fff', fontSize: '11px' }} />
              </RePieChart>
            </ResponsiveContainer>
          </div>

          <div className="space-y-1.5 pt-2 border-t border-slate-100">
            {expenseCategoryData.map((cat) => (
              <div key={cat.name} className="flex items-center justify-between text-xs">
                <div className="flex items-center gap-2 truncate">
                  <span className="w-2.5 h-2.5 rounded-full shrink-0" style={{ backgroundColor: cat.color }}></span>
                  <span className="text-slate-600 truncate">{cat.name}</span>
                </div>
                <span className="font-bold font-mono text-slate-800">PKR {cat.value.toLocaleString()}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Recent Invoices & Quick Actions */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Invoices Table */}
        <div className="lg:col-span-2 bg-white rounded-xl border border-slate-200 shadow-subtle overflow-hidden">
          <div className="p-4 border-b border-slate-200 flex items-center justify-between">
            <div className="font-bold text-sm text-slate-900">Recent Customer Invoices</div>
            <Link href="/invoices" className="text-xs font-semibold text-brand-600 hover:text-brand-700 flex items-center gap-1">
              <span>View All ({invoices.length})</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-xs text-left">
              <thead className="bg-slate-50 text-slate-500 uppercase text-[10px] font-bold tracking-wider border-b border-slate-200">
                <tr>
                  <th className="p-3">Invoice</th>
                  <th className="p-3">Customer</th>
                  <th className="p-3">Due Date</th>
                  <th className="p-3 text-right">Amount</th>
                  <th className="p-3 text-center">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {invoices.map((inv) => (
                  <tr key={inv.id} className="hover:bg-slate-50/80 transition-colors">
                    <td className="p-3 font-semibold text-brand-600 font-mono">{inv.invoiceNumber}</td>
                    <td className="p-3 font-medium text-slate-800">{inv.customerName}</td>
                    <td className="p-3 text-slate-500">{inv.dueDate}</td>
                    <td className="p-3 text-right font-mono font-bold text-slate-900">PKR {inv.totalAmount.toLocaleString()}</td>
                    <td className="p-3 text-center">
                      <span className={`px-2 py-0.5 text-[10px] font-bold rounded-full uppercase ${
                        inv.status === 'paid' ? 'bg-emerald-100 text-emerald-700' :
                        inv.status === 'overdue' ? 'bg-rose-100 text-rose-700' :
                        inv.status === 'partially_paid' ? 'bg-amber-100 text-amber-700' :
                        'bg-blue-100 text-blue-700'
                      }`}>
                        {inv.status.replace('_', ' ')}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Quick Launchpad */}
        <div className="bg-white rounded-xl p-5 border border-slate-200 shadow-subtle space-y-4">
          <div className="font-bold text-sm text-slate-900">Quick Launchpad</div>
          <div className="space-y-2">
            <Link
              href="/invoices/new"
              className="flex items-center gap-3 p-3 rounded-lg border border-slate-200 hover:border-brand-300 hover:bg-brand-50/50 transition-all text-xs font-medium text-slate-800"
            >
              <div className="p-2 rounded-md bg-brand-50 text-brand-600">
                <Receipt className="w-4 h-4" />
              </div>
              <div>
                <div className="font-bold text-slate-900">Create Invoice</div>
                <div className="text-[11px] text-slate-500">Issue new billable invoice</div>
              </div>
            </Link>

            <Link
              href="/expenses"
              className="flex items-center gap-3 p-3 rounded-lg border border-slate-200 hover:border-emerald-300 hover:bg-emerald-50/50 transition-all text-xs font-medium text-slate-800"
            >
              <div className="p-2 rounded-md bg-emerald-50 text-emerald-600">
                <FileText className="w-4 h-4" />
              </div>
              <div>
                <div className="font-bold text-slate-900">Log Expense</div>
                <div className="text-[11px] text-slate-500">Record business spending</div>
              </div>
            </Link>

            <Link
              href="/journal-entries"
              className="flex items-center gap-3 p-3 rounded-lg border border-slate-200 hover:border-indigo-300 hover:bg-indigo-50/50 transition-all text-xs font-medium text-slate-800"
            >
              <div className="p-2 rounded-md bg-indigo-50 text-indigo-600">
                <ShieldCheck className="w-4 h-4" />
              </div>
              <div>
                <div className="font-bold text-slate-900">Manual Journal Entry</div>
                <div className="text-[11px] text-slate-500">Post balanced debit/credit</div>
              </div>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
