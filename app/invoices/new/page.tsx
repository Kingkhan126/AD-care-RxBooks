'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Receipt, Plus, Trash2, ArrowLeft, Save, CheckCircle, Printer } from 'lucide-react';
import { useADCare } from '@/lib/context';
import { LineItem, Invoice } from '@/lib/types';
import { DocumentPrintModal } from '@/components/documents/DocumentPrintModal';

export default function NewInvoicePage() {
  const router = useRouter();
  const { contacts, items: catalogItems, addInvoice, orgSettings } = useADCare();
  const [savedInvoice, setSavedInvoice] = useState<Invoice | null>(null);

  const customers = contacts.filter(c => c.type === 'customer');

  const [customerId, setCustomerId] = useState(customers[0]?.id || '');
  const [issueDate, setIssueDate] = useState(new Date().toISOString().split('T')[0]);
  const [dueDate, setDueDate] = useState(() => {
    const d = new Date();
    d.setDate(d.getDate() + 30);
    return d.toISOString().split('T')[0];
  });
  const [notes, setNotes] = useState('Thank you for your business. Please process payment to AD CARE designated bank account.');
  const [terms, setTerms] = useState('Payment due within 30 days of invoice date.');

  const [lineItems, setLineItems] = useState<LineItem[]>([
    {
      id: 'li_1',
      itemId: catalogItems[0]?.id || '',
      itemName: catalogItems[0]?.name || 'AD CARE Platform License',
      description: catalogItems[0]?.description || '',
      quantity: 1,
      unitPrice: catalogItems[0]?.salesPrice || 450.00,
      taxRate: 10,
      amount: catalogItems[0]?.salesPrice || 450.00
    }
  ]);

  const handleItemSelect = (index: number, itemId: string) => {
    const catalogItem = catalogItems.find(i => i.id === itemId);
    if (!catalogItem) return;
    setLineItems(prev => prev.map((row, idx) => {
      if (idx === index) {
        const qty = row.quantity;
        const price = catalogItem.salesPrice;
        return {
          ...row,
          itemId: catalogItem.id,
          itemName: catalogItem.name,
          description: catalogItem.description,
          unitPrice: price,
          taxRate: catalogItem.taxRate,
          amount: qty * price
        };
      }
      return row;
    }));
  };

  const handleQuantityChange = (index: number, qty: number) => {
    setLineItems(prev => prev.map((row, idx) => {
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
    setLineItems(prev => prev.map((row, idx) => {
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
    const firstItem = catalogItems[0];
    setLineItems(prev => [
      ...prev,
      {
        id: `li_${Date.now()}`,
        itemId: firstItem?.id || '',
        itemName: firstItem?.name || 'Custom Item',
        description: firstItem?.description || '',
        quantity: 1,
        unitPrice: firstItem?.salesPrice || 100,
        taxRate: 10,
        amount: firstItem?.salesPrice || 100
      }
    ]);
  };

  const removeLineRow = (index: number) => {
    if (lineItems.length <= 1) return;
    setLineItems(prev => prev.filter((_, idx) => idx !== index));
  };

  const [discountVal, setDiscountVal] = useState<number>(0);
  const [discountType, setDiscountType] = useState<'fixed' | 'percentage'>('fixed');
  const [shippingCharges, setShippingCharges] = useState<number>(0);

  const subtotal = lineItems.reduce((acc, row) => acc + row.amount, 0);
  const discountTotal = discountType === 'percentage' ? (subtotal * discountVal) / 100 : discountVal;
  const taxableAmount = Math.max(0, subtotal - discountTotal);
  const taxTotal = 0;
  const totalAmount = taxableAmount + shippingCharges;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const customer = customers.find(c => c.id === customerId);
    if (!customer) return;

    const newInv = addInvoice({
      customerId: customer.id,
      customerName: customer.companyName,
      customerEmail: customer.email,
      issueDate,
      dueDate,
      items: lineItems,
      subtotal,
      taxTotal,
      discountTotal,
      shippingTotal: shippingCharges,
      totalAmount,
      amountPaid: 0,
      balanceDue: totalAmount,
      notes,
      terms
    });

    setSavedInvoice(newInv);
  };

  return (
    <div className="space-y-6 max-w-5xl mx-auto pb-12">
      {/* Print Modal */}
      {savedInvoice && (
        <DocumentPrintModal
          document={savedInvoice}
          type="invoice"
          onClose={() => {
            setSavedInvoice(null);
            router.push('/invoices');
          }}
        />
      )}

      {/* Top Controls */}
      <div className="flex items-center justify-between">
        <button
          onClick={() => router.back()}
          className="flex items-center gap-1.5 text-xs font-bold text-slate-500 hover:text-slate-900 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Invoices</span>
        </button>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => router.push('/invoices')}
            className="px-4 py-2 bg-slate-200 hover:bg-slate-300 text-slate-700 font-bold text-xs rounded-xl transition-colors"
          >
            Cancel
          </button>
          <button
            type="submit"
            form="invoice-form"
            className="flex items-center gap-2 px-5 py-2 bg-brand-600 hover:bg-brand-700 text-white font-bold text-xs rounded-xl shadow-md transition-colors"
          >
            <Save className="w-4 h-4" />
            <span>Save & Issue Invoice</span>
          </button>
        </div>
      </div>

      {/* Main Invoice Card */}
      <form id="invoice-form" onSubmit={handleSubmit} className="bg-white rounded-2xl border border-slate-200 shadow-subtle p-8 space-y-6">
        {/* Document Banner */}
        <div className="flex items-start justify-between border-b border-slate-200 pb-6">
          <div>
            <div className="font-extrabold text-xl text-slate-900 flex items-center gap-2">
              <Receipt className="w-6 h-6 text-brand-600" />
              <span>Create New Invoice</span>
            </div>
            <p className="text-xs text-slate-500 mt-1">AD CARE Cloud Invoicing Builder</p>
          </div>

          <div className="text-right">
            <span className="text-xs font-mono font-bold text-slate-400">INVOICE # (Auto Generated)</span>
          </div>
        </div>

        {/* Customer & Date Selection */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 bg-slate-50 p-4 rounded-xl border border-slate-200 text-xs">
          <div>
            <label className="font-bold text-slate-700 uppercase tracking-wider block mb-1">Select Customer *</label>
            <select
              value={customerId}
              onChange={(e) => setCustomerId(e.target.value)}
              className="w-full p-2.5 bg-white border border-slate-200 rounded-lg text-slate-900 font-medium focus:ring-2 focus:ring-brand-500"
            >
              {customers.map(c => (
                <option key={c.id} value={c.id}>{c.companyName} ({c.name})</option>
              ))}
            </select>
          </div>

          <div>
            <label className="font-bold text-slate-700 uppercase tracking-wider block mb-1">Issue Date *</label>
            <input
              type="date"
              required
              value={issueDate}
              onChange={(e) => setIssueDate(e.target.value)}
              className="w-full p-2 bg-white border border-slate-200 rounded-lg text-slate-900 font-mono"
            />
          </div>

          <div>
            <label className="font-bold text-slate-700 uppercase tracking-wider block mb-1">Payment Due Date *</label>
            <input
              type="date"
              required
              value={dueDate}
              onChange={(e) => setDueDate(e.target.value)}
              className="w-full p-2 bg-white border border-slate-200 rounded-lg text-slate-900 font-mono"
            />
          </div>
        </div>

        {/* Line Items Table */}
        <div className="space-y-3">
          <label className="font-bold text-slate-800 text-xs uppercase tracking-wider">Invoice Line Items</label>
          <table className="w-full text-xs text-left border-collapse">
            <thead>
              <tr className="bg-slate-900 text-white uppercase text-[10px] tracking-wider">
                <th className="p-3 rounded-tl-lg">Item / Service</th>
                <th className="p-3 w-24 text-center">Qty</th>
                <th className="p-3 w-32 text-right">Unit Price (PKR)</th>
                <th className="p-3 w-24 text-right">Tax</th>
                <th className="p-3 w-32 text-right">Amount (PKR)</th>
                <th className="p-3 w-12 text-center rounded-tr-lg"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 text-slate-800">
              {lineItems.map((row, idx) => (
                <tr key={row.id} className="hover:bg-slate-50/50">
                  <td className="p-2.5">
                    <select
                      value={row.itemId}
                      onChange={(e) => handleItemSelect(idx, e.target.value)}
                      className="w-full p-2 border border-slate-200 rounded-lg bg-white font-medium"
                    >
                      {catalogItems.map(item => (
                        <option key={item.id} value={item.id}>{item.name} (PKR {item.salesPrice})</option>
                      ))}
                    </select>
                  </td>
                  <td className="p-2.5 text-center">
                    <input
                      type="number"
                      min="1"
                      value={row.quantity}
                      onChange={(e) => handleQuantityChange(idx, parseInt(e.target.value) || 1)}
                      className="w-full p-2 text-center border border-slate-200 rounded-lg font-mono font-bold"
                    />
                  </td>
                  <td className="p-2.5 text-right">
                    <input
                      type="number"
                      step="0.01"
                      value={row.unitPrice}
                      onChange={(e) => handlePriceChange(idx, parseFloat(e.target.value) || 0)}
                      className="w-full p-2 text-right border border-slate-200 rounded-lg font-mono font-bold"
                    />
                  </td>
                  <td className="p-2.5 text-right font-mono text-slate-500 font-semibold">{row.taxRate}%</td>
                  <td className="p-2.5 text-right font-mono font-bold text-slate-900">PKR {row.amount.toFixed(2)}</td>
                  <td className="p-2.5 text-center">
                    <button
                      type="button"
                      onClick={() => removeLineRow(idx)}
                      className="p-1.5 text-slate-400 hover:text-rose-600 rounded-md"
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
            onClick={addLineRow}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg text-xs font-bold transition-colors"
          >
            <Plus className="w-4 h-4" />
            <span>Add Item Row</span>
          </button>
        </div>

        {/* Calculations Footer */}
        <div className="flex justify-end pt-4 border-t border-slate-200 text-xs">
          <div className="w-80 space-y-3 bg-slate-50 p-4 rounded-xl border border-slate-200">
            <div className="flex justify-between items-center text-slate-600">
              <span className="font-semibold">Subtotal:</span>
              <span className="font-mono font-bold">PKR {subtotal.toFixed(2)}</span>
            </div>

            {/* Discount Option */}
            <div className="flex justify-between items-center gap-2">
              <div className="flex items-center gap-1.5 text-slate-700 font-semibold">
                <span>Discount:</span>
                <select
                  value={discountType}
                  onChange={(e) => setDiscountType(e.target.value as 'fixed' | 'percentage')}
                  className="p-1 bg-white border border-slate-200 rounded text-[11px] font-medium"
                >
                  <option value="fixed">PKR Fixed</option>
                  <option value="percentage">% Percent</option>
                </select>
              </div>
              <input
                type="number"
                min="0"
                step="0.01"
                value={discountVal}
                onChange={(e) => setDiscountVal(parseFloat(e.target.value) || 0)}
                placeholder="0.00"
                className="w-24 p-1 text-right border border-slate-200 rounded bg-white font-mono font-bold text-slate-900"
              />
            </div>
            {discountTotal > 0 && (
              <div className="flex justify-between text-emerald-600 text-[11px] font-medium">
                <span>Discount Applied {discountType === 'percentage' ? `(${discountVal}%)` : `(${((discountTotal / (subtotal || 1)) * 100).toFixed(0)}%)`} (-):</span>
                <span className="font-mono font-bold">-PKR {discountTotal.toFixed(2)}</span>
              </div>
            )}

            {/* Shipping Charges */}
            <div className="flex justify-between items-center text-slate-700 font-semibold">
              <span>Shipping & Freight (PKR):</span>
              <input
                type="number"
                min="0"
                step="0.01"
                value={shippingCharges}
                onChange={(e) => setShippingCharges(parseFloat(e.target.value) || 0)}
                placeholder="0.00"
                className="w-24 p-1 text-right border border-slate-200 rounded bg-white font-mono font-bold text-slate-900"
              />
            </div>

            {/* Final Total */}
            <div className="flex justify-between items-center text-base font-extrabold text-slate-900 border-t border-slate-300 pt-2">
              <span>Total Amount:</span>
              <span className="font-mono text-brand-600">PKR {totalAmount.toFixed(2)}</span>
            </div>
          </div>
        </div>

        {/* Terms & Notes */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs pt-4 border-t border-slate-200">
          <div>
            <label className="font-bold text-slate-700 block mb-1">Customer Notes</label>
            <textarea
              rows={3}
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              className="w-full p-2 border border-slate-200 rounded-lg text-slate-800"
            />
          </div>
          <div>
            <label className="font-bold text-slate-700 block mb-1">Terms & Conditions</label>
            <textarea
              rows={3}
              value={terms}
              onChange={(e) => setTerms(e.target.value)}
              className="w-full p-2 border border-slate-200 rounded-lg text-slate-800"
            />
          </div>
        </div>
      </form>
    </div>
  );
}
