'use client';

import React, { useState } from 'react';
import { FileText, Plus, Search, Printer, Edit2, Trash2, Package, Building2 } from 'lucide-react';
import { useADCare } from '@/lib/context';
import { Bill, LineItem } from '@/lib/types';
import { DocumentPrintModal } from '@/components/documents/DocumentPrintModal';

export default function BillsPage() {
  const { bills, contacts, items: catalogItems, addBill, updateBill, deleteBill } = useADCare();
  const [search, setSearch] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [editingBill, setEditingBill] = useState<Bill | null>(null);
  const [selectedDoc, setSelectedDoc] = useState<Bill | null>(null);

  const vendors = contacts.filter(c => c.type === 'vendor');
  const [vendorId, setVendorId] = useState(vendors[0]?.id || '');
  const [auditReason, setAuditReason] = useState('');

  // Multi-line items for bill
  const [billItems, setBillItems] = useState<LineItem[]>([
    {
      id: 'li_init',
      itemId: catalogItems[0]?.id || 'item-serv',
      itemName: catalogItems[0]?.name || 'Medical Supplies',
      description: catalogItems[0]?.description || 'Supplier inventory batch',
      quantity: 10,
      unitPrice: catalogItems[0]?.costPrice || 500,
      taxRate: 0,
      amount: (10 * (catalogItems[0]?.costPrice || 500))
    }
  ]);

  const subtotal = billItems.reduce((acc, it) => acc + (it.amount || 0), 0);
  const totalAmount = subtotal;

  const filteredBills = bills.filter(b => (
    b.billNumber.toLowerCase().includes(search.toLowerCase()) ||
    b.vendorName.toLowerCase().includes(search.toLowerCase())
  ));

  const openAddModal = () => {
    setEditingBill(null);
    setVendorId(vendors[0]?.id || '');
    setAuditReason('');
    setBillItems([
      {
        id: `li_${Date.now()}`,
        itemId: catalogItems[0]?.id || 'item-serv',
        itemName: catalogItems[0]?.name || 'Medical Supplies',
        description: catalogItems[0]?.description || '',
        quantity: 10,
        unitPrice: catalogItems[0]?.costPrice || 500,
        taxRate: 0,
        amount: (10 * (catalogItems[0]?.costPrice || 500))
      }
    ]);
    setShowModal(true);
  };

  const openEditModal = (b: Bill) => {
    setEditingBill(b);
    setVendorId(b.vendorId);
    setBillItems(b.items || []);
    setAuditReason('');
    setShowModal(true);
  };

  const handleProductSelect = (index: number, selectedItemId: string) => {
    const itemObj = catalogItems.find(i => i.id === selectedItemId);
    setBillItems(prev => prev.map((row, idx) => {
      if (idx === index) {
        const rate = itemObj ? itemObj.costPrice : row.unitPrice;
        const name = itemObj ? itemObj.name : row.itemName;
        const desc = itemObj ? itemObj.description : row.description;
        return {
          ...row,
          itemId: selectedItemId,
          itemName: name,
          description: desc,
          unitPrice: rate,
          amount: row.quantity * rate
        };
      }
      return row;
    }));
  };

  const handleQtyChange = (index: number, qty: number) => {
    setBillItems(prev => prev.map((row, idx) => {
      if (idx === index) {
        return {
          ...row,
          quantity: qty,
          amount: qty * row.unitPrice
        };
      }
      return row;
    }));
  };

  const handlePriceChange = (index: number, price: number) => {
    setBillItems(prev => prev.map((row, idx) => {
      if (idx === index) {
        return {
          ...row,
          unitPrice: price,
          amount: row.quantity * price
        };
      }
      return row;
    }));
  };

  const addLineRow = () => {
    const firstCat = catalogItems[0];
    setBillItems(prev => [
      ...prev,
      {
        id: `li_${Date.now()}`,
        itemId: firstCat?.id || 'custom',
        itemName: firstCat?.name || 'Pharmacy Stock Batch',
        description: firstCat?.description || '',
        quantity: 1,
        unitPrice: firstCat?.costPrice || 1000,
        taxRate: 0,
        amount: firstCat?.costPrice || 1000
      }
    ]);
  };

  const removeLineRow = (index: number) => {
    setBillItems(prev => prev.filter((_, idx) => idx !== index));
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
          items: billItems,
          subtotal,
          taxTotal: 0,
          discountTotal: 0,
          shippingTotal: 0,
          totalAmount,
          balanceDue: Math.max(0, totalAmount - editingBill.amountPaid)
        },
        auditReason || 'Updated bill items and amounts'
      );
    } else {
      addBill({
        vendorId: v.id,
        vendorName: v.companyName,
        issueDate: new Date().toISOString().split('T')[0],
        dueDate: new Date(Date.now() + 30*86400000).toISOString().split('T')[0],
        items: billItems,
        subtotal,
        taxTotal: 0,
        discountTotal: 0,
        shippingTotal: 0,
        totalAmount,
        amountPaid: 0,
        balanceDue: totalAmount,
        notes: 'Vendor Bill coordinated with inventory catalog.'
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
            Coordinated purchasing ledger: Pick vendors & products catalog items to auto-update payables & inventory stock.
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

      {/* Mobile Card View (< md) */}
      <div className="block md:hidden space-y-3">
        {filteredBills.length === 0 ? (
          <div className="bg-white p-6 rounded-xl border border-slate-200 text-center text-xs text-slate-500">
            No vendor bills found.
          </div>
        ) : (
          filteredBills.map((b) => (
            <div
              key={b.id}
              className="bg-white rounded-xl border border-slate-200 p-4 shadow-subtle space-y-3"
            >
              {/* Card Header */}
              <div className="flex items-center justify-between">
                <button
                  onClick={() => setSelectedDoc(b)}
                  className="font-mono font-bold text-sm text-indigo-600 hover:underline flex items-center gap-1.5"
                >
                  <FileText className="w-4 h-4" />
                  <span>{b.billNumber}</span>
                </button>
                <span className="px-2.5 py-0.5 text-[10px] font-bold rounded-full bg-slate-100 text-slate-700 uppercase">
                  {b.status}
                </span>
              </div>

              {/* Card Content */}
              <div className="grid grid-cols-2 gap-2 text-xs border-y border-slate-100 py-2.5">
                <div>
                  <span className="text-[10px] uppercase font-bold text-slate-400 block">Vendor</span>
                  <span className="font-semibold text-slate-900 truncate block">{b.vendorName}</span>
                </div>
                <div className="text-right">
                  <span className="text-[10px] uppercase font-bold text-slate-400 block">Total Amount</span>
                  <span className="font-mono font-bold text-slate-900 block">
                    PKR {b.totalAmount.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                  </span>
                </div>
                <div>
                  <span className="text-[10px] uppercase font-bold text-slate-400 block">Issue Date</span>
                  <span className="text-slate-500 text-[11px] block">{b.issueDate}</span>
                </div>
                <div className="text-right">
                  <span className="text-[10px] uppercase font-bold text-slate-400 block">Due Date</span>
                  <span className="text-slate-500 text-[11px] block">{b.dueDate}</span>
                </div>
              </div>

              {/* Card Action Bar */}
              <div className="flex items-center justify-between gap-2 pt-1">
                <button
                  onClick={() => setSelectedDoc(b)}
                  className="flex-1 flex items-center justify-center gap-1.5 px-3 py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs rounded-lg shadow-2xs transition-colors"
                >
                  <Printer className="w-3.5 h-3.5" />
                  <span>Print / View PDF</span>
                </button>

                <button
                  onClick={() => openEditModal(b)}
                  className="p-2 text-slate-600 hover:text-indigo-600 rounded-lg border border-slate-200 hover:bg-slate-50 transition-colors"
                  title="Edit Bill"
                >
                  <Edit2 className="w-4 h-4" />
                </button>

                <button
                  onClick={() => deleteBill(b.id)}
                  className="p-2 text-slate-400 hover:text-rose-600 rounded-lg border border-slate-200 hover:bg-rose-50 transition-colors"
                  title="Delete Bill"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Desktop Bills Table (hidden on mobile, visible md+) */}
      <div className="hidden md:block bg-white rounded-xl border border-slate-200 shadow-subtle overflow-x-auto">
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

      {/* Add / Edit Bill Modal with Catalog Coordination */}
      {showModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl p-6 shadow-2xl w-full max-w-2xl space-y-4 border border-slate-200 animate-in fade-in zoom-in-95 duration-150 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="font-bold text-slate-900 text-base flex items-center gap-2">
                <Building2 className="w-5 h-5 text-indigo-600" />
                <span>{editingBill ? `Edit Bill ${editingBill.billNumber}` : 'Record Vendor Bill (Catalog Coordinated)'}</span>
              </h3>
              <button onClick={() => setShowModal(false)} className="text-slate-400 hover:text-slate-600">✕</button>
            </div>
            
            <form onSubmit={handleSubmit} className="space-y-4 text-xs">
              <div>
                <label className="font-bold text-slate-700">Select Vendor *</label>
                <select
                  value={vendorId}
                  onChange={(e) => setVendorId(e.target.value)}
                  className="w-full mt-1 p-2 border border-slate-200 rounded-lg text-slate-900 font-semibold focus:ring-2 focus:ring-indigo-500 outline-none"
                >
                  {vendors.map(v => (
                    <option key={v.id} value={v.id}>{v.companyName} (Payables: PKR {v.payables.toLocaleString()})</option>
                  ))}
                </select>
              </div>

              {/* Line Items Table linked to Product Catalog */}
              <div className="space-y-2">
                <label className="font-bold text-slate-700 flex items-center gap-1.5">
                  <Package className="w-4 h-4 text-brand-600" />
                  <span>Purchased Products & Catalog Line Items</span>
                </label>
                <div className="border border-slate-200 rounded-xl overflow-hidden bg-slate-50/50 p-2">
                  <table className="w-full text-xs text-left">
                    <thead>
                      <tr className="text-slate-500 text-[10px] font-bold uppercase border-b border-slate-200 pb-2">
                        <th className="p-2">Catalog Product</th>
                        <th className="p-2 w-20 text-center">Qty</th>
                        <th className="p-2 w-28 text-right">Cost Rate</th>
                        <th className="p-2 w-32 text-right">Amount</th>
                        <th className="p-2 w-10 text-center"></th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-200">
                      {billItems.map((row, idx) => (
                        <tr key={row.id || idx}>
                          <td className="p-2">
                            <select
                              value={row.itemId}
                              onChange={(e) => handleProductSelect(idx, e.target.value)}
                              className="w-full p-1.5 border border-slate-200 rounded bg-white font-medium"
                            >
                              {catalogItems.map(item => (
                                <option key={item.id} value={item.id}>
                                  {item.name} (Cost: PKR {item.costPrice})
                                </option>
                              ))}
                            </select>
                          </td>
                          <td className="p-2">
                            <input
                              type="number"
                              min="1"
                              value={row.quantity}
                              onChange={(e) => handleQtyChange(idx, parseFloat(e.target.value) || 1)}
                              className="w-full p-1.5 text-center border border-slate-200 rounded bg-white font-mono font-bold"
                            />
                          </td>
                          <td className="p-2">
                            <input
                              type="number"
                              step="0.01"
                              value={row.unitPrice}
                              onChange={(e) => handlePriceChange(idx, parseFloat(e.target.value) || 0)}
                              className="w-full p-1.5 text-right border border-slate-200 rounded bg-white font-mono font-bold"
                            />
                          </td>
                          <td className="p-2 text-right font-mono font-bold text-slate-900">
                            PKR {row.amount.toFixed(2)}
                          </td>
                          <td className="p-2 text-center">
                            <button
                              type="button"
                              onClick={() => removeLineRow(idx)}
                              className="p-1 text-slate-400 hover:text-rose-600"
                            >
                              ✕
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                  <div className="pt-2">
                    <button
                      type="button"
                      onClick={addLineRow}
                      className="px-3 py-1 bg-white border border-slate-300 hover:bg-slate-100 rounded text-slate-700 font-semibold"
                    >
                      + Add Item Row
                    </button>
                  </div>
                </div>
              </div>

              {/* Total Calculation Display */}
              <div className="flex justify-end pt-2">
                <div className="w-64 space-y-1 text-right bg-indigo-50/60 p-3 rounded-xl border border-indigo-100">
                  <div className="text-xs text-slate-600 font-semibold">Total Vendor Bill Amount:</div>
                  <div className="text-lg font-black text-indigo-900 font-mono">
                    PKR {totalAmount.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                  </div>
                </div>
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

              <div className="pt-3 flex items-center justify-end gap-2 border-t border-slate-100">
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
                  {editingBill ? 'Update Bill' : 'Record & Sync Vendor Bill'}
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
