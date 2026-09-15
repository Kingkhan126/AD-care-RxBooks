'use client';

import React, { useState } from 'react';
import { FileText, Plus, Search, Printer, Edit2, Trash2 } from 'lucide-react';
import { useADCare } from '@/lib/context';
import { Bill } from '@/lib/types';
import { DocumentPrintModal } from '@/components/documents/DocumentPrintModal';

export default function BillsPage() {
  const { bills, contacts, addBill, updateBill, deleteBill } = useADCare();
  const [search, setSearch] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [editingBill, setEditingBill] = useState<Bill | null>(null);
  const [selectedDoc, setSelectedDoc] = useState<Bill | null>(null);

  const vendors = contacts.filter(c => c.type === 'vendor');
  const [vendorId, setVendorId] = useState(vendors[0]?.id || '');
  const [amount, setAmount] = useState<number>(1000);
  const [description, setDescription] = useState('Monthly Service Contract');
  const [auditReason, setAuditReason] = useState('');

  const filteredBills = bills.filter(b => (
    b.billNumber.toLowerCase().includes(search.toLowerCase()) ||
    b.vendorName.toLowerCase().includes(search.toLowerCase())
  ));

  const openAddModal = () => {
    setEditingBill(null);
    setVendorId(vendors[0]?.id || '');
    setAmount(1000);
    setDescription('Monthly Service Contract');
    setAuditReason('');
    setShowModal(true);
  };

  const openEditModal = (b: Bill) => {
    setEditingBill(b);
    setVendorId(b.vendorId);
    setAmount(b.totalAmount);
    setDescription(b.items[0]?.itemName || 'Vendor Bill');
    setAuditReason('');
    setShowModal(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const v = vendors.find(ven => ven.id === vendorId);
    if (!v) return;

    if (editingBill) {
      updateBill(
        editingBill.id,
        {
          vendorId: v.id,
          vendorName: v.companyName,
          items: [
            {
              id: editingBill.items[0]?.id || `bli_${Date.now()}`,
              itemId: 'item-serv',
              itemName: description,
              description: 'Vendor service contract bill',
              quantity: 1,
              unitPrice: amount,
              taxRate: 0,
              amount: amount
            }
          ],
          subtotal: amount,
          taxTotal: 0,
          discountTotal: 0,
          shippingTotal: 0,
          totalAmount: amount
        },
        auditReason || 'Updated bill details'
      );
    } else {
      addBill({
        vendorId: v.id,
        vendorName: v.companyName,
        issueDate: new Date().toISOString().split('T')[0],
        dueDate: new Date(Date.now() + 30*86400000).toISOString().split('T')[0],
        items: [
          {
            id: `bli_${Date.now()}`,
            itemId: 'item-serv',
            itemName: description,
            description: 'Vendor service contract bill',
            quantity: 1,
            unitPrice: amount,
            taxRate: 0,
            amount: amount
          }
        ],
        subtotal: amount,
        taxTotal: 0,
        discountTotal: 0,
        shippingTotal: 0,
        totalAmount: amount,
        amountPaid: 0,
        balanceDue: amount,
        notes: 'Vendor Bill received.'
      });
    }

    setShowModal(false);
    setEditingBill(null);
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-12 px-2 sm:px-4">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-4 sm:p-6 rounded-2xl border border-slate-200 shadow-subtle">
        <div>
          <h2 className="text-lg sm:text-xl font-bold text-slate-900 flex items-center gap-2">
            <FileText className="w-5 h-5 text-indigo-600" />
            Vendor Bills
          </h2>
          <p className="text-xs text-slate-500 mt-1">
            Track incoming supplier bills, approval status, and accounts payable due dates.
          </p>
        </div>

        <button
          onClick={openAddModal}
          className="flex items-center justify-center gap-2 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs rounded-xl shadow-sm transition-colors"
        >
          <Plus className="w-4 h-4" />
          <span>Record Vendor Bill</span>
        </button>
      </div>

      {/* Filter & Search */}
      <div className="flex items-center gap-3">
        <div className="relative flex-1 max-w-md">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search bills by bill # or vendor name..."
            className="w-full pl-9 pr-4 py-2 text-xs bg-white border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 text-slate-900 shadow-2xs"
          />
        </div>
      </div>

      {/* Bills Table (Responsive Scroll) */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-subtle overflow-x-auto">
        <table className="w-full text-xs text-left min-w-[650px]">
          <thead className="bg-slate-50 text-slate-500 uppercase text-[10px] font-bold tracking-wider border-b border-slate-200">
            <tr>
              <th className="p-4">Bill #</th>
              <th className="p-4">Vendor</th>
              <th className="p-4">Issue Date</th>
              <th className="p-4">Due Date</th>
              <th className="p-4 text-right">Total Amount</th>
              <th className="p-4 text-center">Status</th>
              <th className="p-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 text-slate-800">
            {filteredBills.map((b) => (
              <tr key={b.id} className="hover:bg-slate-50/80 transition-colors">
                <td className="p-4 font-mono font-bold text-indigo-600">{b.billNumber}</td>
                <td className="p-4 font-medium text-slate-900">{b.vendorName}</td>
                <td className="p-4 text-slate-500">{b.issueDate}</td>
                <td className="p-4 text-slate-500">{b.dueDate}</td>
                <td className="p-4 text-right font-mono font-bold text-slate-900">
                  PKR {b.totalAmount.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                </td>
                <td className="p-4 text-center">
                  <span className="px-2.5 py-1 text-[10px] font-bold rounded-full bg-slate-100 text-slate-700 uppercase">
                    {b.status}
                  </span>
                </td>
                <td className="p-4 text-right space-x-1">
                  <button
                    onClick={() => openEditModal(b)}
                    className="p-1.5 text-slate-600 hover:text-indigo-600 rounded-md hover:bg-slate-100 transition-colors"
                    title="Edit Bill"
                  >
                    <Edit2 className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => setSelectedDoc(b)}
                    className="p-1.5 text-slate-500 hover:text-indigo-600 rounded-md hover:bg-slate-100 transition-colors"
                    title="Print Bill"
                  >
                    <Printer className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => deleteBill(b.id)}
                    className="p-1.5 text-slate-400 hover:text-rose-600 rounded-md hover:bg-rose-50 transition-colors"
                    title="Delete Bill"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Add / Edit Bill Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl p-6 shadow-2xl w-full max-w-md space-y-4 border border-slate-200 animate-in fade-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="font-bold text-slate-900 text-base">
                {editingBill ? `Edit Bill ${editingBill.billNumber}` : 'Record Vendor Bill'}
              </h3>
              <button onClick={() => setShowModal(false)} className="text-slate-400 hover:text-slate-600">✕</button>
            </div>
            <form onSubmit={handleSubmit} className="space-y-3 text-xs">
              <div>
                <label className="font-semibold text-slate-700">Vendor *</label>
                <select
                  value={vendorId}
                  onChange={(e) => setVendorId(e.target.value)}
                  className="w-full mt-1 p-2 border border-slate-200 rounded-lg text-slate-900 focus:ring-2 focus:ring-indigo-500 outline-none"
                >
                  {vendors.map(v => (
                    <option key={v.id} value={v.id}>{v.companyName}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="font-semibold text-slate-700">Bill Service Description</label>
                <input
                  type="text"
                  required
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="e.g. Pharmaceutical Supply Shipment"
                  className="w-full mt-1 p-2 border border-slate-200 rounded-lg text-slate-900 focus:ring-2 focus:ring-indigo-500 outline-none"
                />
              </div>
              <div>
                <label className="font-semibold text-slate-700">Total Bill Amount (PKR)</label>
                <input
                  type="number"
                  required
                  step="0.01"
                  value={amount}
                  onChange={(e) => setAmount(parseFloat(e.target.value) || 0)}
                  className="w-full mt-1 p-2 border border-slate-200 rounded-lg text-slate-900 font-mono focus:ring-2 focus:ring-indigo-500 outline-none"
                />
              </div>

              {editingBill && (
                <div>
                  <label className="font-bold text-amber-700 block mb-1">
                    Reason for Editing / Modification Note (Audit Log) *
                  </label>
                  <textarea
                    rows={2}
                    required
                    value={auditReason}
                    onChange={(e) => setAuditReason(e.target.value)}
                    placeholder="Explain why this vendor bill is being edited..."
                    className="w-full p-2 border border-amber-300 bg-amber-50/50 rounded-lg text-slate-900 focus:ring-2 focus:ring-amber-500 outline-none"
                  />
                </div>
              )}

              <div className="pt-3 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="px-3 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg font-semibold transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg font-semibold shadow-sm transition-colors"
                >
                  {editingBill ? 'Update Bill' : 'Save Bill'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {selectedDoc && (
        <DocumentPrintModal
          document={selectedDoc}
          type="bill"
          onClose={() => setSelectedDoc(null)}
        />
      )}
    </div>
  );
}
