'use client';

import React from 'react';
import { X, Printer, Building2 } from 'lucide-react';
import { useADCare } from '@/lib/context';
import { Invoice, Bill, Quote } from '@/lib/types';

interface DocumentPrintModalProps {
  document: Invoice | Bill | Quote;
  type: 'invoice' | 'bill' | 'quote';
  onClose: () => void;
}

export const DocumentPrintModal: React.FC<DocumentPrintModalProps> = ({ document: doc, type, onClose }) => {
  const { orgSettings } = useADCare();

  const handlePrint = () => {
    window.print();
  };

  const docNumber = type === 'invoice' ? (doc as Invoice).invoiceNumber : type === 'bill' ? (doc as Bill).billNumber : (doc as Quote).quoteNumber;
  const partyName = type === 'invoice' ? (doc as Invoice).customerName : type === 'bill' ? (doc as Bill).vendorName : (doc as Quote).customerName;
  const issueDate = doc.issueDate;
  const dueDate = type === 'invoice' ? (doc as Invoice).dueDate : type === 'bill' ? (doc as Bill).dueDate : (doc as Quote).expiryDate;

  const currency = orgSettings.currency || 'PKR';
  const amountPaid = 'amountPaid' in doc ? (doc as Invoice).amountPaid : 0;
  const balanceDue = 'balanceDue' in doc ? (doc as Invoice).balanceDue : doc.totalAmount;

  const formatDateStr = (dateStr: string) => {
    try {
      const d = new Date(dateStr);
      if (isNaN(d.getTime())) return dateStr;
      return d.toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' });
    } catch {
      return dateStr;
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/70 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-4xl overflow-hidden my-6 print:shadow-none print:m-0 print:w-full print:max-w-none">
        
        {/* Printable Control Bar (Hidden on print) */}
        <div className="p-4 bg-slate-900 text-white flex items-center justify-between print:hidden">
          <div className="flex items-center gap-2 font-bold text-sm">
            <Building2 className="w-4 h-4 text-brand-400" />
            <span>AD Care RxBooks Official Invoice Template</span>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={handlePrint}
              className="flex items-center gap-2 px-4 py-2 bg-brand-600 hover:bg-brand-500 text-white rounded-xl text-xs font-bold shadow-md transition-colors"
            >
              <Printer className="w-4 h-4" />
              <span>Print / Download PDF</span>
            </button>
            <button
              onClick={onClose}
              className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-white/10"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Printable Document Paper (Exact Reference Template Layout) */}
        <div className="p-12 bg-white text-slate-900 font-sans print:p-0 min-h-[950px] flex flex-col justify-between">
          
          <div>
            {/* 1. Header Section */}
            <div className="flex items-start justify-between mb-8">
              {/* Left: Logo & Address */}
              <div className="space-y-3 max-w-sm">
                <div className="w-64 h-28 border border-slate-200 rounded-lg p-2 flex items-center justify-center bg-white shadow-2xs">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src="/logo.jpg"
                    alt="AD CARE Meds & Pharmacy Logo"
                    className="max-h-full max-w-full object-contain"
                  />
                </div>
                <div className="text-xs text-slate-800 space-y-0.5 font-medium pt-1">
                  <div className="font-bold text-slate-900 text-sm">Adcare Meds & Pharmacy Online Home Service</div>
                  <div>Peshawar, Khyber Pakhtunkhwa</div>
                  <div>Pakistan</div>
                </div>
              </div>

              {/* Right: Title, Number & Balance Due Header */}
              <div className="text-right space-y-2">
                <h1 className="text-4xl font-extrabold text-[#1c75bc] tracking-wide uppercase font-sans">
                  INVOICE
                </h1>
                <div className="text-xs font-bold text-slate-900"># {docNumber}</div>
                
                <div className="pt-4">
                  <div className="text-xs font-medium text-slate-600">Balance Due</div>
                  <div className="text-xl font-extrabold text-slate-900 font-mono">
                    {currency}{balanceDue.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                  </div>
                </div>
              </div>
            </div>

            {/* 2. Customer & Metadata Info Row */}
            <div className="grid grid-cols-2 gap-8 mb-8 text-xs pt-4">
              {/* Left: Patient / Customer */}
              <div className="space-y-1 text-slate-800">
                <div className="font-bold text-slate-900 text-sm">
                  Patient Name: <span className="font-bold text-slate-900">{partyName}</span>
                </div>
                <div><span className="font-bold text-slate-800">Contact:</span> </div>
                <div><span className="font-bold text-slate-800">Address: ,</span> </div>
              </div>

              {/* Right: Invoice Metadata */}
              <div className="text-right space-y-1.5 text-slate-700">
                <div className="flex justify-end gap-3">
                  <span className="text-slate-600 font-medium">Invoice Date :</span>
                  <span className="font-semibold text-slate-900 min-w-[90px]">{formatDateStr(issueDate)}</span>
                </div>
                <div className="flex justify-end gap-3">
                  <span className="text-slate-600 font-medium">Terms :</span>
                  <span className="font-semibold text-slate-900 min-w-[90px]">{'terms' in doc && doc.terms ? doc.terms : 'Due on Receipt'}</span>
                </div>
                <div className="flex justify-end gap-3">
                  <span className="text-slate-600 font-medium">Due Date :</span>
                  <span className="font-semibold text-slate-900 min-w-[90px]">{formatDateStr(dueDate)}</span>
                </div>
              </div>
            </div>

            {/* 3. Items Table */}
            <div className="mb-6">
              <table className="w-full text-xs text-left border-collapse">
                <thead>
                  <tr className="bg-[#2280c3] text-white font-semibold text-xs">
                    <th className="py-2.5 px-3 w-10 text-center font-semibold">#</th>
                    <th className="py-2.5 px-3 font-semibold">Description</th>
                    <th className="py-2.5 px-3 text-right font-semibold w-24">Qty</th>
                    <th className="py-2.5 px-3 text-right font-semibold w-32">Rate</th>
                    <th className="py-2.5 px-3 text-right font-semibold w-36">Amount</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200 text-slate-800">
                  {doc.items.map((item, idx) => (
                    <tr key={idx} className="hover:bg-slate-50/50">
                      <td className="py-3 px-3 text-center text-slate-600">{idx + 1}</td>
                      <td className="py-3 px-3 font-medium text-slate-900">{item.itemName}</td>
                      <td className="py-3 px-3 text-right font-mono">{item.quantity.toFixed(2)}</td>
                      <td className="py-3 px-3 text-right font-mono">{item.unitPrice.toLocaleString(undefined, { minimumFractionDigits: 2 })}</td>
                      <td className="py-3 px-3 text-right font-mono font-medium">{item.amount.toLocaleString(undefined, { minimumFractionDigits: 2 })}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
              <div className="border-b border-slate-300"></div>
            </div>

            {/* 4. Totals Block */}
            <div className="flex justify-end mb-12 text-xs">
              <div className="w-80 space-y-2">
                <div className="flex justify-between py-1 text-slate-700">
                  <span className="font-medium">Sub Total</span>
                  <span className="font-mono">{doc.subtotal.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
                </div>
                
                {'discountTotal' in doc && (doc as Invoice).discountTotal > 0 && (
                  <div className="flex justify-between py-1 text-slate-700">
                    <span className="font-medium">Discount</span>
                    <span className="font-mono">(-) {(doc as Invoice).discountTotal.toLocaleString(undefined, { minimumFractionDigits: 2 })}</span>
                  </div>
                )}

                {'shippingTotal' in doc && (doc as Invoice).shippingTotal > 0 && (
                  <div className="flex justify-between py-1 text-slate-700">
                    <span className="font-medium">Shipping Charges</span>
                    <span className="font-mono">{ (doc as Invoice).shippingTotal.toLocaleString(undefined, { minimumFractionDigits: 2 }) }</span>
                  </div>
                )}

                <div className="flex justify-between py-1 font-bold text-sm text-slate-900">
                  <span>Total</span>
                  <span className="font-mono">{currency}{doc.totalAmount.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
                </div>

                {amountPaid > 0 && (
                  <div className="flex justify-between py-1 text-rose-500 font-medium">
                    <span>Payment Made</span>
                    <span className="font-mono">(-) {amountPaid.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
                  </div>
                )}

                {/* Highlighted Balance Due Bar */}
                <div className="flex justify-between items-center bg-[#f2f8f9] p-2.5 rounded border-y border-slate-200 mt-2 font-bold text-slate-900">
                  <span className="text-xs uppercase tracking-wider">Balance Due</span>
                  <span className="font-mono text-sm">{currency}{balanceDue.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
                </div>
              </div>
            </div>
          </div>

          {/* 5. Footer & Legal Section */}
          <div className="pt-8 space-y-8">
            <div className="text-xs text-slate-600 font-medium">
              Thanks you
            </div>

            <div className="space-y-1 text-center font-mono">
              <div className="text-xs font-bold tracking-[0.25em] text-slate-800 uppercase">
                A D C A R E  M E D S  &  P H A R M A C Y  O N L I N E  H O M E  D E L I V E R Y
              </div>
              <div className="text-xs tracking-[0.2em] text-slate-700">
                W h a t s A p p :  0 3 4 2 - 3 0 1 0 5 0 8
              </div>
            </div>

            {/* Bottom Powered By Line */}
            <div className="pt-4 border-t border-slate-300 flex items-center justify-between text-[10px] text-slate-500 uppercase tracking-widest">
              <div className="flex items-center gap-2">
                <span>POWERED BY</span>
                <span className="font-bold text-brand-600">AD CARE</span>
              </div>
              <div>1</div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};
