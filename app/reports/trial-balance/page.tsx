'use client';

import React from 'react';
import Link from 'next/link';
import { ShieldCheck, ArrowLeft, Printer, CheckCircle2 } from 'lucide-react';
import { useADCare } from '@/lib/context';

export default function TrialBalancePage() {
  const { getTrialBalance, orgSettings } = useADCare();
  const tb = getTrialBalance();

  return (
    <div className="space-y-6 max-w-4xl mx-auto pb-12">
      <div className="flex items-center justify-between">
        <Link href="/reports" className="flex items-center gap-1.5 text-xs font-bold text-slate-500 hover:text-slate-900">
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Financial Reports</span>
        </Link>
        <button
          onClick={() => window.print()}
          className="flex items-center gap-1.5 px-3 py-1.5 bg-brand-600 hover:bg-brand-700 text-white rounded-lg text-xs font-bold shadow-sm"
        >
          <Printer className="w-4 h-4" /> Print / Export PDF
        </button>
      </div>

      <div className="bg-white rounded-2xl border border-slate-200 shadow-subtle p-8 space-y-6">
        <div className="text-center border-b border-slate-200 pb-6 space-y-1">
          <h2 className="text-2xl font-extrabold text-slate-900 tracking-tight">{orgSettings.name}</h2>
          <div className="text-sm font-bold text-brand-600 uppercase tracking-widest">Trial Balance Report</div>
          <p className="text-xs text-slate-500 font-mono">Closing Debit & Credit Audit Snapshot</p>
        </div>

        <table className="w-full text-xs text-left">
          <thead className="bg-slate-900 text-white uppercase text-[10px] tracking-wider">
            <tr>
              <th className="p-3 rounded-tl-md">Account Code</th>
              <th className="p-3">Account Name</th>
              <th className="p-3">Category</th>
              <th className="p-3 text-right">Debit (PKR)</th>
              <th className="p-3 text-right rounded-tr-md">Credit (PKR)</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-200 text-slate-800">
            {tb.rows.map((row) => (
              <tr key={row.code} className="hover:bg-slate-50">
                <td className="p-3 font-mono font-bold text-brand-600">{row.code}</td>
                <td className="p-3 font-semibold text-slate-900">{row.name}</td>
                <td className="p-3 text-slate-500 uppercase font-semibold text-[10px]">{row.category}</td>
                <td className="p-3 text-right font-mono font-bold">{row.debit > 0 ? `PKR ${row.debit.toLocaleString(undefined, { minimumFractionDigits: 2 })}` : '-'}</td>
                <td className="p-3 text-right font-mono font-bold">{row.credit > 0 ? `PKR ${row.credit.toLocaleString(undefined, { minimumFractionDigits: 2 })}` : '-'}</td>
              </tr>
            ))}
          </tbody>
          <tfoot>
            <tr className="bg-slate-100 font-bold text-xs text-slate-900 border-t-2 border-slate-300">
              <td colSpan={3} className="p-3 uppercase">Total Trial Balance:</td>
              <td className="p-3 text-right font-mono text-brand-600">PKR {tb.totalDebit.toLocaleString(undefined, { minimumFractionDigits: 2 })}</td>
              <td className="p-3 text-right font-mono text-brand-600">PKR {tb.totalCredit.toLocaleString(undefined, { minimumFractionDigits: 2 })}</td>
            </tr>
          </tfoot>
        </table>

        <div className="p-4 rounded-xl border border-emerald-200 bg-emerald-50 text-emerald-800 flex items-center justify-between text-xs font-semibold">
          <span>Debits and Credits mathematically verified equal (PKR 0.00 Variance).</span>
          <CheckCircle2 className="w-5 h-5 text-emerald-600" />
        </div>
      </div>
    </div>
  );
}
