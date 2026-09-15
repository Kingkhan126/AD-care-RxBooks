'use client';

import React from 'react';
import Link from 'next/link';
import { Landmark, Wallet, CreditCard, ShieldCheck, RefreshCw, ArrowUpRight, ArrowDownRight } from 'lucide-react';
import { useADCare } from '@/lib/context';

export default function BankingPage() {
  const { bankAccounts, bankTransactions, totalBankBalance } = useADCare();

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-12">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-2xl border border-slate-200 shadow-subtle">
        <div>
          <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">
            <Landmark className="w-5 h-5 text-brand-600" />
            Bank & Cash Accounts Overview
          </h2>
          <p className="text-xs text-slate-500 mt-1">
            Real-time multi-bank feed integration, cash reserves, and automated ledger matching.
          </p>
        </div>

        <Link
          href="/reconciliation"
          className="flex items-center gap-2 px-4 py-2 bg-brand-600 hover:bg-brand-700 text-white font-bold text-xs rounded-xl shadow-sm transition-colors"
        >
          <ShieldCheck className="w-4 h-4" />
          <span>Launch Bank Reconciliation</span>
        </Link>
      </div>

      {/* Accounts Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {bankAccounts.map((acc) => (
          <div key={acc.id} className="bg-white rounded-2xl p-5 border border-slate-200 shadow-subtle flex flex-col justify-between space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-slate-900 text-white flex items-center justify-center font-bold text-sm">
                  {acc.bankName.charAt(0)}
                </div>
                <div>
                  <h3 className="font-bold text-sm text-slate-900 leading-tight">{acc.accountName}</h3>
                  <p className="text-[11px] font-mono text-slate-500">{acc.accountNumber}</p>
                </div>
              </div>
              <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-100 text-emerald-700 border border-emerald-300">
                Connected
              </span>
            </div>

            <div>
              <div className="text-xs text-slate-400 font-semibold uppercase tracking-wider">Current Book Balance</div>
              <div className="text-2xl font-extrabold text-slate-900 font-mono mt-1">
                PKR {acc.balance.toLocaleString(undefined, { minimumFractionDigits: 2 })}
              </div>
            </div>

            <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
              <span>Last Reconciled: <span className="font-medium text-slate-700">{acc.lastReconciledDate}</span></span>
              <RefreshCw className="w-3.5 h-3.5 text-slate-400 hover:rotate-180 transition-transform cursor-pointer" />
            </div>
          </div>
        ))}
      </div>

      {/* Bank Transactions Feed Table */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-subtle overflow-hidden space-y-3">
        <div className="p-4 border-b border-slate-200 flex items-center justify-between">
          <div>
            <h3 className="font-bold text-sm text-slate-900">Recent Bank Feed Activity</h3>
            <p className="text-[11px] text-slate-500">Automated bank clearing house transactions</p>
          </div>
          <span className="text-xs font-mono font-semibold text-slate-600 bg-slate-100 px-2.5 py-1 rounded-md">
            Live Feed Active
          </span>
        </div>

        <table className="w-full text-xs text-left">
          <thead className="bg-slate-50 text-slate-500 uppercase text-[10px] font-bold tracking-wider border-b border-slate-200">
            <tr>
              <th className="p-4">Date</th>
              <th className="p-4">Transaction Description</th>
              <th className="p-4">Category</th>
              <th className="p-4">Reference Code</th>
              <th className="p-4 text-right">Amount</th>
              <th className="p-4 text-center">Ledger Match</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 text-slate-800">
            {bankTransactions.map((tx) => (
              <tr key={tx.id} className="hover:bg-slate-50/80 transition-colors">
                <td className="p-4 text-slate-500 font-mono">{tx.date}</td>
                <td className="p-4 font-semibold text-slate-900">{tx.description}</td>
                <td className="p-4 text-slate-600 font-medium">{tx.category}</td>
                <td className="p-4 font-mono text-slate-500 text-[11px]">{tx.reference}</td>
                <td className={`p-4 text-right font-mono font-bold ${tx.amount >= 0 ? 'text-emerald-600' : 'text-slate-900'}`}>
                  {tx.amount >= 0 ? `+PKR ${tx.amount.toFixed(2)}` : `-PKR ${Math.abs(tx.amount).toFixed(2)}`}
                </td>
                <td className="p-4 text-center">
                  <span className={`px-2.5 py-1 text-[10px] font-bold rounded-full ${
                    tx.isMatched ? 'bg-emerald-100 text-emerald-700' : 'bg-amber-100 text-amber-700'
                  }`}>
                    {tx.isMatched ? 'Matched' : 'Unmatched'}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
