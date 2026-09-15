'use client';

import React, { useState } from 'react';
import { Receipt, Plus, Search, Upload, Tag, CreditCard, CheckCircle } from 'lucide-react';
import { useADCare } from '@/lib/context';

export default function ExpensesPage() {
  const { expenses, addExpense, totalExpenses } = useADCare();
  const [search, setSearch] = useState('');
  const [showModal, setShowModal] = useState(false);

  const [category, setCategory] = useState('Software & Subscriptions');
  const [amount, setAmount] = useState<number>(250);
  const [vendorName, setVendorName] = useState('Google Cloud Services');
  const [description, setDescription] = useState('Development server hosting cluster');
  const [paymentMode, setPaymentMode] = useState('Credit Card');

  const filteredExpenses = expenses.filter(e => (
    e.expenseNumber.toLowerCase().includes(search.toLowerCase()) ||
    e.description.toLowerCase().includes(search.toLowerCase()) ||
    e.category.toLowerCase().includes(search.toLowerCase())
  ));

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    addExpense({
      category,
      amount,
      taxAmount: 0,
      date: new Date().toISOString().split('T')[0],
      vendorName,
      paymentMode,
      account: '6100 - Software Subscriptions',
      description
    });
    setShowModal(false);
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-12">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-2xl border border-slate-200 shadow-subtle">
        <div>
          <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">
            <Receipt className="w-5 h-5 text-emerald-600" />
            Direct Expense Tracker
          </h2>
          <p className="text-xs text-slate-500 mt-1">
            Log corporate card charges, employee reimbursements, and operational expenses.
          </p>
        </div>

        <button
          onClick={() => setShowModal(true)}
          className="flex items-center gap-2 px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl shadow-sm transition-colors"
        >
          <Plus className="w-4 h-4" />
          <span>Log New Expense</span>
        </button>
      </div>

      <div className="flex items-center gap-3">
        <div className="relative flex-1 max-w-md">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search expenses by category or description..."
            className="w-full pl-9 pr-4 py-2 text-xs bg-white border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 text-slate-900 shadow-2xs"
          />
        </div>
      </div>

      <div className="bg-white rounded-xl border border-slate-200 shadow-subtle overflow-hidden">
        <table className="w-full text-xs text-left">
          <thead className="bg-slate-50 text-slate-500 uppercase text-[10px] font-bold tracking-wider border-b border-slate-200">
            <tr>
              <th className="p-4">Expense #</th>
              <th className="p-4">Category</th>
              <th className="p-4">Description</th>
              <th className="p-4">Payee / Vendor</th>
              <th className="p-4">Payment Method</th>
              <th className="p-4 text-right">Amount</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 text-slate-800">
            {filteredExpenses.map((exp) => (
              <tr key={exp.id} className="hover:bg-slate-50/80 transition-colors">
                <td className="p-4 font-mono font-bold text-emerald-600">{exp.expenseNumber}</td>
                <td className="p-4 font-semibold text-slate-900">
                  <span className="px-2 py-0.5 rounded-full bg-slate-100 text-slate-700 border border-slate-200 text-[10px]">
                    {exp.category}
                  </span>
                </td>
                <td className="p-4 text-slate-700 font-medium">{exp.description}</td>
                <td className="p-4 text-slate-600">{exp.vendorName || 'N/A'}</td>
                <td className="p-4 text-slate-500">{exp.paymentMode}</td>
                <td className="p-4 text-right font-mono font-bold text-slate-900">
                  PKR {exp.amount.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {showModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl p-6 shadow-2xl w-full max-w-md space-y-4 border border-slate-200">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="font-bold text-slate-900 text-base">Log Business Expense</h3>
              <button onClick={() => setShowModal(false)} className="text-slate-400 hover:text-slate-600">✕</button>
            </div>
            <form onSubmit={handleSubmit} className="space-y-3 text-xs">
              <div>
                <label className="font-semibold text-slate-700">Category *</label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="w-full mt-1 p-2 border border-slate-200 rounded-lg text-slate-900"
                >
                  <option value="Software & Subscriptions">Software & Subscriptions</option>
                  <option value="Rent & Lease">Rent & Lease</option>
                  <option value="Marketing & Digital Ads">Marketing & Digital Ads</option>
                  <option value="Travel & Meals">Travel & Meals</option>
                  <option value="Office Supplies">Office Supplies</option>
                </select>
              </div>
              <div>
                <label className="font-semibold text-slate-700">Vendor / Merchant Name</label>
                <input
                  type="text"
                  required
                  value={vendorName}
                  onChange={(e) => setVendorName(e.target.value)}
                  className="w-full mt-1 p-2 border border-slate-200 rounded-lg text-slate-900"
                />
              </div>
              <div>
                <label className="font-semibold text-slate-700">Description</label>
                <input
                  type="text"
                  required
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="w-full mt-1 p-2 border border-slate-200 rounded-lg text-slate-900"
                />
              </div>
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="font-semibold text-slate-700">Amount (PKR)</label>
                  <input
                    type="number"
                    step="0.01"
                    required
                    value={amount}
                    onChange={(e) => setAmount(parseFloat(e.target.value) || 0)}
                    className="w-full mt-1 p-2 border border-slate-200 rounded-lg text-slate-900 font-mono font-bold"
                  />
                </div>
                <div>
                  <label className="font-semibold text-slate-700">Payment Mode</label>
                  <select
                    value={paymentMode}
                    onChange={(e) => setPaymentMode(e.target.value)}
                    className="w-full mt-1 p-2 border border-slate-200 rounded-lg text-slate-900"
                  >
                    <option value="Credit Card">Corporate Credit Card</option>
                    <option value="Bank Transfer">Bank Transfer</option>
                    <option value="Petty Cash">Petty Cash</option>
                  </select>
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
                  className="px-4 py-2 bg-emerald-600 text-white rounded-lg font-semibold shadow-sm"
                >
                  Log Expense
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
