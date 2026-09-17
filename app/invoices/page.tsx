'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Receipt, Plus, Search, Filter, Printer, Edit2, Trash2 } from 'lucide-react';
import { useADCare } from '@/lib/context';
import { Invoice } from '@/lib/types';
import { DocumentPrintModal } from '@/components/documents/DocumentPrintModal';

export default function InvoicesPage() {
  const { invoices, updateInvoice, deleteInvoice, recordInvoicePayment } = useADCare();
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [selectedDoc, setSelectedDoc] = useState<Invoice | null>(null);
  
  // Payment State
  const [paymentInvoice, setPaymentInvoice] = useState<Invoice | null>(null);
  const [paymentAmount, setPaymentAmount] = useState<number>(0);
  const [paymentMode, setPaymentMode] = useState<string>('bank_transfer');

  // Edit Invoice State
  const [editingInvoice, setEditingInvoice] = useState<Invoice | null>(null);
  const [editCustomerName, setEditCustomerName] = useState('');
  const [editIssueDate, setEditIssueDate] = useState('');
  const [editDueDate, setEditDueDate] = useState('');
  const [editDiscountTotal, setEditDiscountTotal] = useState<number>(0);
  const [editShippingTotal, setEditShippingTotal] = useState<number>(0);
  const [auditReason, setAuditReason] = useState('');

  const filteredInvoices = invoices.filter(inv => {
    const matchesSearch = inv.invoiceNumber.toLowerCase().includes(search.toLowerCase()) ||
                          inv.customerName.toLowerCase().includes(search.toLowerCase());
    const matchesStatus = statusFilter === 'all' || inv.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const handleOpenPayment = (inv: Invoice) => {
    setPaymentInvoice(inv);
    setPaymentAmount(inv.balanceDue);
  };

  const handleRecordPayment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!paymentInvoice || paymentAmount <= 0) return;
    recordInvoicePayment(paymentInvoice.id, paymentAmount, paymentMode);
    setPaymentInvoice(null);
  };

  const openEditModal = (inv: Invoice) => {
    setEditingInvoice(inv);
    setEditCustomerName(inv.customerName);
    setEditIssueDate(inv.issueDate);
    setEditDueDate(inv.dueDate);
    setEditDiscountTotal(inv.discountTotal || 0);
    setEditShippingTotal(inv.shippingTotal || 0);
    setAuditReason('');
  };

  const handleSaveEdit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingInvoice) return;

    const subtotal = editingInvoice.subtotal;
    const totalAmount = Math.max(0, subtotal - editDiscountTotal + editShippingTotal);

    updateInvoice(
      editingInvoice.id,
      {
        customerName: editCustomerName,
        issueDate: editIssueDate,
        dueDate: editDueDate,
        discountTotal: editDiscountTotal,
        shippingTotal: editShippingTotal,
        totalAmount,
        balanceDue: Math.max(0, totalAmount - editingInvoice.amountPaid)
      },
      auditReason || 'Updated invoice details'
    );

    setEditingInvoice(null);
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-12 px-2 sm:px-4">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-4 sm:p-6 rounded-2xl border border-slate-200 shadow-subtle">
        <div>
          <h2 className="text-lg sm:text-xl font-bold text-slate-900 flex items-center gap-2">
            <Receipt className="w-5 h-5 text-brand-600" />
            Invoices Management
          </h2>
          <p className="text-xs text-slate-500 mt-1">
            Create, edit, track, and manage sales invoices, payment status, and branded PDF generation.
          </p>
        </div>

        <Link
          href="/invoices/new"
          className="flex items-center justify-center gap-2 px-4 py-2 bg-brand-600 hover:bg-brand-700 text-white font-bold text-xs rounded-xl shadow-sm transition-colors self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>Create New Invoice</span>
        </Link>
      </div>

      {/* Filter Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="relative flex-1 max-w-md">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by invoice # or customer name..."
            className="w-full pl-9 pr-4 py-2 text-xs bg-white border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-500 text-slate-900 shadow-2xs"
          />
        </div>

        <div className="flex items-center gap-2">
          <Filter className="w-4 h-4 text-slate-400" />
          <span className="text-xs font-semibold text-slate-500">Filter Status:</span>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-3 py-1.5 text-xs bg-white border border-slate-200 rounded-lg text-slate-800 font-medium focus:outline-none focus:ring-2 focus:ring-brand-500"
          >
            <option value="all">All Statuses</option>
            <option value="sent">Sent</option>
            <option value="overdue">Overdue</option>
            <option value="paid">Paid</option>
            <option value="partially_paid">Partially Paid</option>
            <option value="draft">Draft</option>
          </select>
        </div>
      </div>

      {/* Mobile Card View (< md) */}
      <div className="block md:hidden space-y-3">
        {filteredInvoices.length === 0 ? (
          <div className="bg-white p-6 rounded-xl border border-slate-200 text-center text-xs text-slate-500">
            No invoices found.
          </div>
        ) : (
          filteredInvoices.map((inv) => (
            <div
              key={inv.id}
              className="bg-white rounded-xl border border-slate-200 p-4 shadow-subtle space-y-3"
            >
              {/* Card Header */}
              <div className="flex items-center justify-between">
                <button
                  onClick={() => setSelectedDoc(inv)}
                  className="font-mono font-bold text-sm text-brand-600 hover:underline flex items-center gap-1.5"
                >
                  <Receipt className="w-4 h-4" />
                  <span>{inv.invoiceNumber}</span>
                </button>
                <span className={`px-2.5 py-0.5 text-[10px] font-bold rounded-full uppercase ${
                  inv.status === 'paid' ? 'bg-emerald-100 text-emerald-700 border border-emerald-300' :
                  inv.status === 'overdue' ? 'bg-rose-100 text-rose-700 border border-rose-300' :
                  inv.status === 'partially_paid' ? 'bg-amber-100 text-amber-700 border border-amber-300' :
                  'bg-blue-100 text-blue-700 border border-blue-300'
                }`}>
                  {inv.status.replace('_', ' ')}
                </span>
              </div>

              {/* Card Content */}
              <div className="grid grid-cols-2 gap-2 text-xs border-y border-slate-100 py-2.5">
                <div>
                  <span className="text-[10px] uppercase font-bold text-slate-400 block">Customer</span>
                  <span className="font-semibold text-slate-900 truncate block">{inv.customerName}</span>
                </div>
                <div className="text-right">
                  <span className="text-[10px] uppercase font-bold text-slate-400 block">Total Amount</span>
                  <span className="font-mono font-bold text-slate-900 block">
                    PKR {inv.totalAmount.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                  </span>
                </div>
                <div>
                  <span className="text-[10px] uppercase font-bold text-slate-400 block">Issue / Due Date</span>
                  <span className="text-slate-500 text-[11px] block">{inv.issueDate}</span>
                </div>
                <div className="text-right">
                  <span className="text-[10px] uppercase font-bold text-slate-400 block">Balance Due</span>
                  <span className={`font-mono font-bold text-[11px] block ${inv.balanceDue > 0 ? 'text-rose-600' : 'text-slate-400'}`}>
                    PKR {inv.balanceDue.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                  </span>
                </div>
              </div>

              {/* Card Action Bar (Always visible on mobile) */}
              <div className="flex items-center justify-between gap-2 pt-1">
                <button
                  onClick={() => setSelectedDoc(inv)}
                  className="flex-1 flex items-center justify-center gap-1.5 px-3 py-2 bg-brand-600 hover:bg-brand-700 text-white font-bold text-xs rounded-lg shadow-2xs transition-colors"
                >
                  <Printer className="w-3.5 h-3.5" />
                  <span>Print / View PDF</span>
                </button>

                {inv.balanceDue > 0 && (
                  <button
                    onClick={() => handleOpenPayment(inv)}
                    className="px-2.5 py-2 bg-emerald-50 hover:bg-emerald-100 text-emerald-700 border border-emerald-200 rounded-lg font-bold text-xs transition-colors"
                  >
                    Pay
                  </button>
                )}

                <button
                  onClick={() => openEditModal(inv)}
                  className="p-2 text-slate-600 hover:text-brand-600 rounded-lg border border-slate-200 hover:bg-slate-50 transition-colors"
                  title="Edit Invoice"
                >
                  <Edit2 className="w-4 h-4" />
                </button>

                <button
                  onClick={() => deleteInvoice(inv.id)}
                  className="p-2 text-slate-400 hover:text-rose-600 rounded-lg border border-slate-200 hover:bg-rose-50 transition-colors"
                  title="Delete Invoice"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Desktop Invoices Table (hidden on mobile, visible md+) */}
      <div className="hidden md:block bg-white rounded-xl border border-slate-200 shadow-subtle overflow-x-auto">
        <table className="w-full text-xs text-left min-w-[700px]">
          <thead className="bg-slate-50 text-slate-500 uppercase text-[10px] font-bold tracking-wider border-b border-slate-200">
            <tr>
              <th className="p-4">Invoice #</th>
              <th className="p-4">Customer</th>
              <th className="p-4">Issue Date</th>
              <th className="p-4">Due Date</th>
              <th className="p-4 text-right">Total Amount</th>
              <th className="p-4 text-right">Balance Due</th>
              <th className="p-4 text-center">Status</th>
              <th className="p-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 text-slate-800">
            {filteredInvoices.map((inv) => (
              <tr key={inv.id} className="hover:bg-slate-50/80 transition-colors">
                <td className="p-4 font-mono font-bold text-brand-600">
                  <button onClick={() => setSelectedDoc(inv)} className="hover:underline">
                    {inv.invoiceNumber}
                  </button>
                </td>
                <td className="p-4 font-medium text-slate-900">{inv.customerName}</td>
                <td className="p-4 text-slate-500">{inv.issueDate}</td>
                <td className="p-4 text-slate-500">{inv.dueDate}</td>
                <td className="p-4 text-right font-mono font-bold text-slate-900">
                  PKR {inv.totalAmount.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                </td>
                <td className="p-4 text-right font-mono font-bold">
                  <span className={inv.balanceDue > 0 ? 'text-rose-600' : 'text-slate-400'}>
                    PKR {inv.balanceDue.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                  </span>
                </td>
                <td className="p-4 text-center">
                  <span className={`px-2.5 py-1 text-[10px] font-bold rounded-full uppercase ${
                    inv.status === 'paid' ? 'bg-emerald-100 text-emerald-700 border border-emerald-300' :
                    inv.status === 'overdue' ? 'bg-rose-100 text-rose-700 border border-rose-300' :
                    inv.status === 'partially_paid' ? 'bg-amber-100 text-amber-700 border border-amber-300' :
                    'bg-blue-100 text-blue-700 border border-blue-300'
                  }`}>
                    {inv.status.replace('_', ' ')}
                  </span>
                </td>
                <td className="p-4 text-right space-x-1">
                  {inv.balanceDue > 0 && (
                    <button
                      onClick={() => handleOpenPayment(inv)}
                      className="px-2.5 py-1 bg-emerald-50 hover:bg-emerald-100 text-emerald-700 border border-emerald-200 rounded-md font-bold text-[11px] transition-colors"
                    >
                      Record Payment
                    </button>
                  )}
                  <button
                    onClick={() => openEditModal(inv)}
                    className="p-1.5 text-slate-600 hover:text-brand-600 rounded-md hover:bg-slate-100 transition-colors"
                    title="Edit Invoice"
                  >
                    <Edit2 className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => setSelectedDoc(inv)}
                    className="p-1.5 text-slate-500 hover:text-brand-600 rounded-md hover:bg-slate-100 transition-colors"
                    title="View & Print Branded PDF"
                  >
                    <Printer className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => deleteInvoice(inv.id)}
                    className="p-1.5 text-slate-400 hover:text-rose-600 rounded-md hover:bg-rose-50 transition-colors"
                    title="Delete Invoice"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Payment Recording Modal */}
      {paymentInvoice && (
        <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl p-6 shadow-2xl w-full max-w-sm space-y-4 border border-slate-200 animate-in fade-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="font-bold text-slate-900 text-base">Record Payment</h3>
              <button onClick={() => setPaymentInvoice(null)} className="text-slate-400 hover:text-slate-600">✕</button>
            </div>
            <form onSubmit={handleRecordPayment} className="space-y-3 text-xs">
              <div>
                <label className="font-semibold text-slate-600">Invoice Number</label>
                <div className="font-bold text-slate-900 font-mono text-sm mt-0.5">{paymentInvoice.invoiceNumber}</div>
              </div>
              <div>
                <label className="font-semibold text-slate-600">Customer</label>
                <div className="font-semibold text-slate-800">{paymentInvoice.customerName}</div>
              </div>
              <div>
                <label className="font-semibold text-slate-700">Payment Amount (PKR)</label>
                <input
                  type="number"
                  required
                  step="0.01"
                  max={paymentInvoice.balanceDue}
                  value={paymentAmount}
                  onChange={(e) => setPaymentAmount(parseFloat(e.target.value) || 0)}
                  className="w-full mt-1 p-2 border border-slate-200 rounded-lg text-slate-900 font-mono font-bold focus:ring-2 focus:ring-emerald-500 outline-none"
                />
              </div>
              <div>
                <label className="font-semibold text-slate-700">Payment Method</label>
                <select
                  value={paymentMode}
                  onChange={(e) => setPaymentMode(e.target.value)}
                  className="w-full mt-1 p-2 border border-slate-200 rounded-lg text-slate-900"
                >
                  <option value="bank_transfer">Bank Wire Transfer</option>
                  <option value="cash">Cash / Online Transfer</option>
                  <option value="cheque">Cheque</option>
                </select>
              </div>
              <div className="pt-3 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setPaymentInvoice(null)}
                  className="px-3 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg font-semibold shadow-sm"
                >
                  Save Payment
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Edit Invoice Modal */}
      {editingInvoice && (
        <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl p-6 shadow-2xl w-full max-w-md space-y-4 border border-slate-200 animate-in fade-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="font-bold text-slate-900 text-base">Edit Invoice {editingInvoice.invoiceNumber}</h3>
              <button onClick={() => setEditingInvoice(null)} className="text-slate-400 hover:text-slate-600">✕</button>
            </div>
            <form onSubmit={handleSaveEdit} className="space-y-3 text-xs">
              <div>
                <label className="font-semibold text-slate-700">Customer Name *</label>
                <input
                  type="text"
                  required
                  value={editCustomerName}
                  onChange={(e) => setEditCustomerName(e.target.value)}
                  className="w-full mt-1 p-2 border border-slate-200 rounded-lg text-slate-900 focus:ring-2 focus:ring-brand-500 outline-none"
                />
              </div>
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="font-semibold text-slate-700">Issue Date</label>
                  <input
                    type="date"
                    required
                    value={editIssueDate}
                    onChange={(e) => setEditIssueDate(e.target.value)}
                    className="w-full mt-1 p-2 border border-slate-200 rounded-lg text-slate-900 focus:ring-2 focus:ring-brand-500 outline-none"
                  />
                </div>
                <div>
                  <label className="font-semibold text-slate-700">Due Date</label>
                  <input
                    type="date"
                    required
                    value={editDueDate}
                    onChange={(e) => setEditDueDate(e.target.value)}
                    className="w-full mt-1 p-2 border border-slate-200 rounded-lg text-slate-900 focus:ring-2 focus:ring-brand-500 outline-none"
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="font-semibold text-slate-700">Discount Amount (PKR)</label>
                  <input
                    type="number"
                    step="0.01"
                    value={editDiscountTotal}
                    onChange={(e) => setEditDiscountTotal(parseFloat(e.target.value) || 0)}
                    className="w-full mt-1 p-2 border border-slate-200 rounded-lg text-slate-900 font-mono focus:ring-2 focus:ring-brand-500 outline-none"
                  />
                </div>
                <div>
                  <label className="font-semibold text-slate-700">Shipping Charges (PKR)</label>
                  <input
                    type="number"
                    step="0.01"
                    value={editShippingTotal}
                    onChange={(e) => setEditShippingTotal(parseFloat(e.target.value) || 0)}
                    className="w-full mt-1 p-2 border border-slate-200 rounded-lg text-slate-900 font-mono focus:ring-2 focus:ring-brand-500 outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="font-bold text-amber-700 block mb-1">
                  Reason for Editing / Modification Note (Audit Trail) *
                </label>
                <textarea
                  rows={2}
                  required
                  value={auditReason}
                  onChange={(e) => setAuditReason(e.target.value)}
                  placeholder="Explain why this invoice is being edited..."
                  className="w-full p-2 border border-amber-300 bg-amber-50/50 rounded-lg text-slate-900 focus:ring-2 focus:ring-amber-500 outline-none"
                />
              </div>

              <div className="pt-3 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setEditingInvoice(null)}
                  className="px-3 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-brand-600 hover:bg-brand-700 text-white rounded-lg font-semibold shadow-sm"
                >
                  Update Invoice
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {selectedDoc && (
        <DocumentPrintModal
          document={selectedDoc}
          type="invoice"
          onClose={() => setSelectedDoc(null)}
        />
      )}
    </div>
  );
}
