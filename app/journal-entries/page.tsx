'use client';

import React, { useState } from 'react';
import { FileText, Plus, Trash2, ShieldAlert, CheckCircle2, Lock } from 'lucide-react';
import { useADCare } from '@/lib/context';
import { JournalLine } from '@/lib/types';

export default function JournalEntriesPage() {
  const { journalEntries, accounts, addJournalEntry } = useADCare();
  const [showModal, setShowModal] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [reference, setReference] = useState('');
  const [narration, setNarration] = useState('');

  const [lines, setLines] = useState<JournalLine[]>([
    {
      id: 'l1',
      accountId: accounts[0]?.id || '',
      accountCode: accounts[0]?.code || '6100',
      accountName: accounts[0]?.name || 'Software Subscriptions',
      debit: 500,
      credit: 0,
      memo: 'Debit allocation'
    },
    {
      id: 'l2',
      accountId: accounts[1]?.id || '',
      accountCode: accounts[1]?.code || '1010',
      accountName: accounts[1]?.name || 'SVB Operating Account',
      debit: 0,
      credit: 500,
      memo: 'Credit cash withdrawal'
    }
  ]);

  const totalDebit = lines.reduce((acc, l) => acc + (l.debit || 0), 0);
  const totalCredit = lines.reduce((acc, l) => acc + (l.credit || 0), 0);
  const isBalanced = Math.abs(totalDebit - totalCredit) < 0.01;

  const handleAccountChange = (index: number, accId: string) => {
    const selected = accounts.find(a => a.id === accId);
    if (!selected) return;
    setLines(prev => prev.map((l, idx) => {
      if (idx === index) {
        return {
          ...l,
          accountId: selected.id,
          accountCode: selected.code,
          accountName: selected.name
        };
      }
      return l;
    }));
  };

  const handleLineValueChange = (index: number, field: 'debit' | 'credit', val: number) => {
    setLines(prev => prev.map((l, idx) => {
      if (idx === index) {
        return {
          ...l,
          [field]: val,
          [field === 'debit' ? 'credit' : 'debit']: 0
        };
      }
      return l;
    }));
  };

  const addLine = () => {
    const acc = accounts[0];
    setLines(prev => [
      ...prev,
      {
        id: `l_${Date.now()}`,
        accountId: acc?.id || '',
        accountCode: acc?.code || '',
        accountName: acc?.name || '',
        debit: 0,
        credit: 0,
        memo: ''
      }
    ]);
  };

  const removeLine = (index: number) => {
    if (lines.length <= 2) return;
    setLines(prev => prev.filter((_, idx) => idx !== index));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');
    const res = addJournalEntry({
      date,
      reference,
      narration,
      lines,
      totalDebit,
      totalCredit,
      status: 'posted'
    });

    if (!res.success) {
      setErrorMsg(res.error || 'Failed to post entry');
      return;
    }

    setShowModal(false);
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-12">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-2xl border border-slate-200 shadow-subtle">
        <div>
          <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">
            <FileText className="w-5 h-5 text-brand-600" />
            General Journal Entries
          </h2>
          <p className="text-xs text-slate-500 mt-1">
            Record manual double-entry debit and credit ledger transactions with enforced balance verification.
          </p>
        </div>

        <button
          onClick={() => setShowModal(true)}
          className="flex items-center gap-2 px-4 py-2 bg-brand-600 hover:bg-brand-700 text-white font-bold text-xs rounded-xl shadow-sm transition-colors"
        >
          <Plus className="w-4 h-4" />
          <span>New Journal Entry</span>
        </button>
      </div>

      {/* Journal Entries List */}
      <div className="space-y-4">
        {journalEntries.map((je) => (
          <div key={je.id} className="bg-white rounded-xl border border-slate-200 shadow-subtle overflow-hidden">
            <div className="p-4 bg-slate-50 border-b border-slate-200 flex flex-wrap items-center justify-between gap-2 text-xs">
              <div className="flex items-center gap-3">
                <span className="font-mono font-bold text-brand-600 text-sm">{je.entryNumber}</span>
                <span className="text-slate-500 font-mono">Date: {je.date}</span>
                {je.reference && <span className="px-2 py-0.5 rounded bg-slate-200 text-slate-700 font-mono text-[10px]">Ref: {je.reference}</span>}
              </div>

              <div className="flex items-center gap-3">
                <span className="font-mono font-bold text-slate-900">
                  Total Debit/Credit: PKR {je.totalDebit.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                </span>
                <span className="px-2 py-0.5 text-[10px] font-bold rounded-full bg-emerald-100 text-emerald-700 uppercase">
                  {je.status}
                </span>
              </div>
            </div>

            <div className="p-4 space-y-2 text-xs">
              <div className="text-slate-600 font-medium italic mb-2">Narration: {je.narration}</div>
              <table className="w-full text-left">
                <thead>
                  <tr className="text-slate-400 text-[10px] uppercase font-bold border-b border-slate-100">
                    <th className="pb-1">Account</th>
                    <th className="pb-1">Memo</th>
                    <th className="pb-1 text-right">Debit (PKR)</th>
                    <th className="pb-1 text-right">Credit (PKR)</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {je.lines.map((l) => (
                    <tr key={l.id} className="text-slate-800">
                      <td className="py-1.5 font-semibold">
                        <span className="font-mono text-slate-500 mr-2">{l.accountCode}</span>
                        {l.accountName}
                      </td>
                      <td className="py-1.5 text-slate-500">{l.memo}</td>
                      <td className="py-1.5 text-right font-mono font-bold">{l.debit > 0 ? `PKR ${l.debit.toFixed(2)}` : '-'}</td>
                      <td className="py-1.5 text-right font-mono font-bold">{l.credit > 0 ? `PKR ${l.credit.toFixed(2)}` : '-'}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        ))}
      </div>

      {/* New Journal Entry Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl p-6 shadow-2xl w-full max-w-2xl space-y-4 border border-slate-200 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="font-bold text-slate-900 text-base">Create Manual Journal Entry</h3>
              <button onClick={() => setShowModal(false)} className="text-slate-400 hover:text-slate-600">✕</button>
            </div>

            {errorMsg && (
              <div className="p-3 bg-rose-50 border border-rose-200 rounded-lg text-rose-700 text-xs font-semibold flex items-center gap-2">
                <ShieldAlert className="w-4 h-4 shrink-0" />
                <span>{errorMsg}</span>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-semibold text-slate-700">Posting Date *</label>
                  <input
                    type="date"
                    required
                    value={date}
                    onChange={(e) => setDate(e.target.value)}
                    className="w-full mt-1 p-2 border border-slate-200 rounded-lg text-slate-900 font-mono"
                  />
                </div>
                <div>
                  <label className="font-semibold text-slate-700">Reference / Doc #</label>
                  <input
                    type="text"
                    value={reference}
                    onChange={(e) => setReference(e.target.value)}
                    placeholder="e.g. JE-REF-09"
                    className="w-full mt-1 p-2 border border-slate-200 rounded-lg text-slate-900 font-mono"
                  />
                </div>
              </div>

              <div>
                <label className="font-semibold text-slate-700">Narration / Memo *</label>
                <input
                  type="text"
                  required
                  value={narration}
                  onChange={(e) => setNarration(e.target.value)}
                  placeholder="Reason for journal adjustment..."
                  className="w-full mt-1 p-2 border border-slate-200 rounded-lg text-slate-900"
                />
              </div>

              {/* Lines Table */}
              <div className="space-y-2">
                <label className="font-semibold text-slate-700">Journal Allocation Lines</label>
                <table className="w-full text-xs text-left border-collapse">
                  <thead>
                    <tr className="bg-slate-900 text-white uppercase text-[10px] tracking-wider">
                      <th className="p-2">Account</th>
                      <th className="p-2 w-32 text-right">Debit (PKR)</th>
                      <th className="p-2 w-32 text-right">Credit (PKR)</th>
                      <th className="p-2 w-8"></th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-200">
                    {lines.map((l, idx) => (
                      <tr key={l.id}>
                        <td className="p-2">
                          <select
                            value={l.accountId}
                            onChange={(e) => handleAccountChange(idx, e.target.value)}
                            className="w-full p-2 border border-slate-200 rounded-lg font-medium"
                          >
                            {accounts.map(acc => (
                              <option key={acc.id} value={acc.id}>[{acc.code}] {acc.name}</option>
                            ))}
                          </select>
                        </td>
                        <td className="p-2 text-right">
                          <input
                            type="number"
                            step="0.01"
                            value={l.debit}
                            onChange={(e) => handleLineValueChange(idx, 'debit', parseFloat(e.target.value) || 0)}
                            className="w-full p-2 text-right border border-slate-200 rounded-lg font-mono font-bold"
                          />
                        </td>
                        <td className="p-2 text-right">
                          <input
                            type="number"
                            step="0.01"
                            value={l.credit}
                            onChange={(e) => handleLineValueChange(idx, 'credit', parseFloat(e.target.value) || 0)}
                            className="w-full p-2 text-right border border-slate-200 rounded-lg font-mono font-bold"
                          />
                        </td>
                        <td className="p-2 text-center">
                          <button
                            type="button"
                            onClick={() => removeLine(idx)}
                            className="p-1 text-slate-400 hover:text-rose-600"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>

                <button
                  type="button"
                  onClick={addLine}
                  className="flex items-center gap-1 px-3 py-1.5 bg-slate-100 text-slate-700 rounded-lg font-bold text-xs"
                >
                  <Plus className="w-4 h-4" /> Add Line Row
                </button>
              </div>

              {/* Total Balance Validation */}
              <div className="p-3 rounded-xl border flex items-center justify-between text-xs font-mono font-bold bg-slate-50">
                <div>Total Debits: PKR {totalDebit.toFixed(2)} | Total Credits: PKR {totalCredit.toFixed(2)}</div>
                <div className={`flex items-center gap-1 ${isBalanced ? 'text-emerald-600' : 'text-rose-600'}`}>
                  {isBalanced ? (
                    <>
                      <CheckCircle2 className="w-4 h-4" />
                      <span>Balanced Entry</span>
                    </>
                  ) : (
                    <>
                      <ShieldAlert className="w-4 h-4" />
                      <span>Out of Balance (PKR {Math.abs(totalDebit - totalCredit).toFixed(2)})</span>
                    </>
                  )}
                </div>
              </div>

              <div className="pt-2 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="px-3 py-2 bg-slate-100 text-slate-700 rounded-lg font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={!isBalanced}
                  className="px-4 py-2 bg-brand-600 disabled:opacity-50 text-white rounded-lg font-semibold shadow-sm"
                >
                  Post Journal Entry
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
