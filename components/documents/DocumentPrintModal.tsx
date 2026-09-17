'use client';

import React, { useState } from 'react';
import { X, Printer, Building2, Edit3, Check, Upload, Plus, Trash2 } from 'lucide-react';
import { useADCare } from '@/lib/context';
import { Invoice, Bill, Quote, LineItem } from '@/lib/types';

interface DocumentPrintModalProps {
  document: Invoice | Bill | Quote;
  type: 'invoice' | 'bill' | 'quote';
  onClose: () => void;
}

export const DocumentPrintModal: React.FC<DocumentPrintModalProps> = ({ document: doc, type, onClose }) => {
  const { orgSettings, updateInvoice, updateBill, updateOrgSettings } = useADCare();

  const [isEditing, setIsEditing] = useState(false);
  const [logoSrc, setLogoSrc] = useState<string>('/logo.jpg');
  const [thankYouMsg, setThankYouMsg] = useState(orgSettings.thankYouMessage || 'Thank you for choosing AD CARE Meds & Pharmacy Online Home Service!');

  // Editable Document Fields
  const initialPartyName = type === 'invoice' ? (doc as Invoice).customerName : type === 'bill' ? (doc as Bill).vendorName : (doc as Quote).customerName;
  const [partyName, setPartyName] = useState(initialPartyName || '');
  const [contactPhone, setContactPhone] = useState('0342-3010508');
  const [address, setAddress] = useState('Peshawar, Khyber Pakhtunkhwa');
  const [issueDate, setIssueDate] = useState(doc.issueDate || '');
  const [terms, setTerms] = useState('terms' in doc && doc.terms ? doc.terms : 'Due on Receipt');
  const [dueDate, setDueDate] = useState(type === 'invoice' ? (doc as Invoice).dueDate : type === 'bill' ? (doc as Bill).dueDate : (doc as Quote).expiryDate);

  // Line items
  const [items, setItems] = useState<LineItem[]>(doc.items || []);

  // Financial totals
  const [discountTotal, setDiscountTotal] = useState<number>('discountTotal' in doc ? (doc as Invoice).discountTotal || 0 : 0);
  const [shippingTotal, setShippingTotal] = useState<number>('shippingTotal' in doc ? (doc as Invoice).shippingTotal || 0 : 0);
  const [amountPaid, setAmountPaid] = useState<number>('amountPaid' in doc ? (doc as Invoice).amountPaid || 0 : 0);

  const [auditReason, setAuditReason] = useState('');

  const docNumber = type === 'invoice' ? (doc as Invoice).invoiceNumber : type === 'bill' ? (doc as Bill).billNumber : (doc as Quote).quoteNumber;
  const currency = orgSettings.currency || 'PKR';

  // Computed Totals
  const subtotal = items.reduce((acc, it) => acc + (it.amount || 0), 0);
  const totalAmount = Math.max(0, subtotal - discountTotal + shippingTotal);
  const balanceDue = Math.max(0, totalAmount - amountPaid);

  const handlePrint = () => {
    window.print();
  };

  const handleLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (uploadEvent) => {
        if (uploadEvent.target?.result) {
          setLogoSrc(uploadEvent.target.result as string);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleItemChange = (index: number, field: keyof LineItem, value: any) => {
    setItems(prev => prev.map((item, idx) => {
      if (idx === index) {
        const updated = { ...item, [field]: value };
        if (field === 'quantity' || field === 'unitPrice') {
          const qty = field === 'quantity' ? parseFloat(value) || 0 : item.quantity;
          const rate = field === 'unitPrice' ? parseFloat(value) || 0 : item.unitPrice;
          updated.amount = qty * rate;
        }
        return updated;
      }
      return item;
    }));
  };

  const addItemRow = () => {
    setItems(prev => [
      ...prev,
      {
        id: `row_${Date.now()}`,
        itemId: 'custom',
        itemName: 'New Product Item',
        description: '',
        quantity: 1,
        unitPrice: 1000,
        taxRate: 0,
        amount: 1000
      }
    ]);
  };

  const removeItemRow = (index: number) => {
    setItems(prev => prev.filter((_, idx) => idx !== index));
  };

  const handleSaveChanges = () => {
    const reasonText = auditReason || 'Updated document fields';
    if (type === 'invoice') {
      updateInvoice(
        doc.id,
        {
          customerName: partyName,
          issueDate,
          dueDate,
          items,
          subtotal,
          discountTotal,
          shippingTotal,
          totalAmount,
          amountPaid,
          balanceDue,
          terms
        },
        reasonText
      );
    } else if (type === 'bill') {
      updateBill(
        doc.id,
        {
          vendorName: partyName,
          issueDate,
          dueDate,
          items,
          subtotal,
          totalAmount,
          amountPaid,
          balanceDue,
          terms
        },
        reasonText
      );
    }
    if (thankYouMsg !== orgSettings.thankYouMessage) {
      updateOrgSettings({ thankYouMessage: thankYouMsg });
    }
    setIsEditing(false);
  };

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
    <div className="fixed inset-0 z-50 bg-slate-900/70 backdrop-blur-xs flex flex-col overflow-hidden print:bg-white print:block">
      
      {/* Control Bar - Always visible at top on mobile, sticky on desktop */}
      <div className="shrink-0 z-30 p-2.5 sm:p-3 md:p-4 bg-slate-900 text-white print:hidden shadow-md">
        <div className="flex items-center justify-between gap-2 sm:gap-3">
          <div className="flex items-center gap-2 font-bold text-xs sm:text-sm min-w-0">
            <Building2 className="w-4 h-4 text-brand-400 shrink-0" />
            <span className="truncate">AD CARE {type === 'bill' ? 'Vendor Bill' : 'Invoice'}</span>
          </div>

          <div className="flex items-center gap-1.5 sm:gap-2 shrink-0">
            {isEditing ? (
              <button
                onClick={handleSaveChanges}
                className="flex items-center justify-center gap-1 sm:gap-1.5 px-2.5 sm:px-3 py-1.5 sm:py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg text-[11px] sm:text-xs font-bold shadow-md transition-colors"
              >
                <Check className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                <span>Save</span>
              </button>
            ) : (
              <button
                onClick={() => setIsEditing(true)}
                className="flex items-center justify-center gap-1 sm:gap-1.5 px-2.5 sm:px-3 py-1.5 sm:py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg text-[11px] sm:text-xs font-bold shadow-md transition-colors"
              >
                <Edit3 className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                <span>Edit</span>
              </button>
            )}

            <button
              onClick={handlePrint}
              className="flex items-center justify-center gap-1 sm:gap-1.5 px-2.5 sm:px-3.5 py-1.5 sm:py-2 bg-brand-600 hover:bg-brand-500 text-white rounded-lg text-[11px] sm:text-xs font-bold shadow-md transition-colors"
            >
              <Printer className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
              <span>Print / Download PDF</span>
            </button>

            <button
              onClick={onClose}
              className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-white/10 transition-colors"
            >
              <X className="w-4 h-4 sm:w-5 sm:h-5" />
            </button>
          </div>
        </div>

        {isEditing && (
          <div className="mt-2 bg-amber-950/80 border border-amber-500/40 rounded-lg p-2 flex items-center gap-2 text-xs animate-in fade-in duration-150">
            <span className="font-bold text-amber-300 shrink-0 hidden sm:inline">Reason for Editing:</span>
            <input
              type="text"
              value={auditReason}
              onChange={(e) => setAuditReason(e.target.value)}
              placeholder="Audit reason..."
              className="flex-1 bg-slate-900 border border-slate-700 rounded px-2 py-1 text-white placeholder-slate-400 text-xs focus:ring-1 focus:ring-amber-400 outline-none"
            />
          </div>
        )}
      </div>

      {/* Scrollable Document Area */}
      <div className="flex-1 overflow-y-auto p-2 sm:p-4 md:p-6 print:p-0 print:overflow-visible">
        <div className="bg-white rounded-xl shadow-2xl w-full max-w-4xl mx-auto overflow-hidden print:shadow-none print:rounded-none print:max-w-none">

        {/* Printable Document Paper */}
        <div className="p-6 sm:p-12 bg-white text-slate-900 font-sans print:p-0 min-h-[950px] flex flex-col justify-between">
          
          <div>
            {/* 1. Header Section */}
            <div className="flex items-start justify-between mb-8 gap-4">
              {/* Left: Logo Box & Address */}
              <div className="space-y-3 max-w-sm">
                {logoSrc ? (
                  <div className="relative group max-w-[240px] max-h-[100px] flex items-center justify-center overflow-hidden mb-2">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={logoSrc}
                      alt="Company Logo"
                      className="max-h-24 max-w-full object-contain"
                    />
                    {isEditing && (
                      <div className="absolute inset-0 bg-slate-900/80 text-white flex items-center justify-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity rounded-lg">
                        <label className="flex items-center gap-1 cursor-pointer text-xs font-semibold px-2 py-1 bg-brand-600 hover:bg-brand-500 rounded text-white shadow-sm">
                          <Upload className="w-3.5 h-3.5" />
                          <span>Change</span>
                          <input
                            type="file"
                            accept="image/*"
                            onChange={handleLogoUpload}
                            className="hidden"
                          />
                        </label>
                        <button
                          type="button"
                          onClick={() => setLogoSrc('')}
                          className="flex items-center gap-1 text-xs font-semibold px-2 py-1 bg-rose-600 hover:bg-rose-500 rounded text-white shadow-sm"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                          <span>Remove</span>
                        </button>
                      </div>
                    )}
                  </div>
                ) : isEditing ? (
                  <label className="flex items-center gap-2 w-52 h-12 border-2 border-dashed border-slate-300 hover:border-brand-500 hover:bg-brand-50/50 rounded-lg p-2 justify-center cursor-pointer text-xs font-semibold text-slate-600 transition-all print:hidden mb-2">
                    <Upload className="w-4 h-4 text-brand-600" />
                    <span>+ Add Company Logo</span>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleLogoUpload}
                      className="hidden"
                    />
                  </label>
                ) : null}

                <div className="text-xs text-slate-800 space-y-0.5 font-medium pt-1">
                  <div className="font-bold text-slate-900 text-sm">Adcare Meds & Pharmacy Online Home Service</div>
                  <div>Peshawar, Khyber Pakhtunkhwa</div>
                  <div>Pakistan</div>
                </div>
              </div>

              {/* Right: Title, Number & Balance Due Header */}
              <div className="text-right space-y-2">
                <h1 className="text-3xl sm:text-4xl font-extrabold text-[#1c75bc] tracking-wide uppercase font-sans">
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

            {/* 2. Customer / Vendor Info & Dates Row */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-8 text-xs pt-4 border-t border-slate-100">
              {/* Left: Party Name, Contact, Address */}
              <div className="space-y-2 text-slate-800">
                <div className="flex items-center gap-2">
                  <span className="font-bold text-slate-900 min-w-[100px]">
                    {type === 'bill' ? 'Vendor Name:' : 'Patient Name:'}
                  </span>
                  {isEditing ? (
                    <input
                      type="text"
                      value={partyName}
                      onChange={(e) => setPartyName(e.target.value)}
                      className="p-1 text-xs border border-slate-300 rounded font-bold text-slate-900 flex-1"
                    />
                  ) : (
                    <span className="font-bold text-slate-900">{partyName}</span>
                  )}
                </div>

                <div className="flex items-center gap-2">
                  <span className="font-bold text-slate-800 min-w-[100px]">Contact:</span>
                  {isEditing ? (
                    <input
                      type="text"
                      value={contactPhone}
                      onChange={(e) => setContactPhone(e.target.value)}
                      className="p-1 text-xs border border-slate-300 rounded text-slate-800 flex-1"
                    />
                  ) : (
                    <span>{contactPhone}</span>
                  )}
                </div>

                <div className="flex items-center gap-2">
                  <span className="font-bold text-slate-800 min-w-[100px]">Address:</span>
                  {isEditing ? (
                    <input
                      type="text"
                      value={address}
                      onChange={(e) => setAddress(e.target.value)}
                      className="p-1 text-xs border border-slate-300 rounded text-slate-800 flex-1"
                    />
                  ) : (
                    <span>{address}</span>
                  )}
                </div>
              </div>

              {/* Right: Dates */}
              <div className="text-left sm:text-right space-y-2 text-slate-700">
                <div className="flex sm:justify-end gap-3 items-center">
                  <span className="text-slate-600 font-medium">Invoice Date :</span>
                  {isEditing ? (
                    <input
                      type="text"
                      value={issueDate}
                      onChange={(e) => setIssueDate(e.target.value)}
                      className="p-1 text-xs border border-slate-300 rounded text-slate-900 font-semibold w-32"
                    />
                  ) : (
                    <span className="font-semibold text-slate-900 min-w-[90px]">{formatDateStr(issueDate)}</span>
                  )}
                </div>

                <div className="flex sm:justify-end gap-3 items-center">
                  <span className="text-slate-600 font-medium">Terms :</span>
                  {isEditing ? (
                    <input
                      type="text"
                      value={terms}
                      onChange={(e) => setTerms(e.target.value)}
                      className="p-1 text-xs border border-slate-300 rounded text-slate-900 font-semibold w-32"
                    />
                  ) : (
                    <span className="font-semibold text-slate-900 min-w-[90px]">{terms}</span>
                  )}
                </div>

                <div className="flex sm:justify-end gap-3 items-center">
                  <span className="text-slate-600 font-medium">Due Date :</span>
                  {isEditing ? (
                    <input
                      type="text"
                      value={dueDate}
                      onChange={(e) => setDueDate(e.target.value)}
                      className="p-1 text-xs border border-slate-300 rounded text-slate-900 font-semibold w-32"
                    />
                  ) : (
                    <span className="font-semibold text-slate-900 min-w-[90px]">{formatDateStr(dueDate)}</span>
                  )}
                </div>
              </div>
            </div>

            {/* 3. Items Table */}
            <div className="mb-6 overflow-x-auto">
              <table className="w-full text-xs text-left border-collapse min-w-[600px]">
                <thead>
                  <tr className="bg-[#2280c3] text-white font-semibold text-xs">
                    <th className="py-2.5 px-3 w-10 text-center font-semibold">#</th>
                    <th className="py-2.5 px-3 font-semibold">Description</th>
                    <th className="py-2.5 px-3 text-right font-semibold w-24">Qty</th>
                    <th className="py-2.5 px-3 text-right font-semibold w-32">Rate</th>
                    <th className="py-2.5 px-3 text-right font-semibold w-36">Amount</th>
                    {isEditing && <th className="py-2.5 px-2 w-10 text-center print:hidden"></th>}
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200 text-slate-800">
                  {items.map((item, idx) => (
                    <tr key={item.id || idx} className="hover:bg-slate-50/50">
                      <td className="py-3 px-3 text-center text-slate-600">{idx + 1}</td>
                      <td className="py-3 px-3 font-medium text-slate-900">
                        {isEditing ? (
                          <input
                            type="text"
                            value={item.itemName}
                            onChange={(e) => handleItemChange(idx, 'itemName', e.target.value)}
                            className="w-full p-1 border border-slate-300 rounded font-medium"
                          />
                        ) : (
                          item.itemName
                        )}
                      </td>
                      <td className="py-3 px-3 text-right font-mono">
                        {isEditing ? (
                          <input
                            type="number"
                            step="0.01"
                            value={item.quantity}
                            onChange={(e) => handleItemChange(idx, 'quantity', e.target.value)}
                            className="w-20 p-1 text-right border border-slate-300 rounded font-mono"
                          />
                        ) : (
                          item.quantity.toFixed(2)
                        )}
                      </td>
                      <td className="py-3 px-3 text-right font-mono">
                        {isEditing ? (
                          <input
                            type="number"
                            step="0.01"
                            value={item.unitPrice}
                            onChange={(e) => handleItemChange(idx, 'unitPrice', e.target.value)}
                            className="w-24 p-1 text-right border border-slate-300 rounded font-mono"
                          />
                        ) : (
                          item.unitPrice.toLocaleString(undefined, { minimumFractionDigits: 2 })
                        )}
                      </td>
                      <td className="py-3 px-3 text-right font-mono font-medium">
                        {isEditing ? (
                          <input
                            type="number"
                            step="0.01"
                            value={item.amount}
                            onChange={(e) => handleItemChange(idx, 'amount', parseFloat(e.target.value) || 0)}
                            className="w-28 p-1 text-right border border-slate-300 rounded font-mono font-bold"
                          />
                        ) : (
                          item.amount.toLocaleString(undefined, { minimumFractionDigits: 2 })
                        )}
                      </td>
                      {isEditing && (
                        <td className="py-3 px-2 text-center print:hidden">
                          <button
                            type="button"
                            onClick={() => removeItemRow(idx)}
                            className="p-1 text-slate-400 hover:text-rose-600 rounded"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </td>
                      )}
                    </tr>
                  ))}
                </tbody>
              </table>

              {isEditing && (
                <div className="mt-3 print:hidden">
                  <button
                    type="button"
                    onClick={addItemRow}
                    className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg text-xs font-bold transition-colors"
                  >
                    <Plus className="w-4 h-4" />
                    <span>Add Item Row</span>
                  </button>
                </div>
              )}

              <div className="border-b border-slate-300 mt-2"></div>
            </div>

            {/* 4. Totals Section */}
            <div className="flex justify-end mb-12 text-xs">
              <div className="w-80 space-y-2">
                <div className="flex justify-between py-1 text-slate-700">
                  <span className="font-medium">Sub Total</span>
                  <span className="font-mono">{subtotal.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
                </div>
                
                {(() => {
                  const discountPercent = subtotal > 0 && discountTotal > 0 ? (discountTotal / subtotal) * 100 : 0;
                  const percentLabel = discountPercent > 0 ? ` (${discountPercent % 1 === 0 ? discountPercent.toFixed(0) : discountPercent.toFixed(2)}%)` : '';
                  return (
                    <div className="flex justify-between items-center py-1 text-slate-700">
                      <span className="font-medium">Discount{percentLabel}</span>
                      {isEditing ? (
                        <input
                          type="number"
                          step="0.01"
                          value={discountTotal}
                          onChange={(e) => setDiscountTotal(parseFloat(e.target.value) || 0)}
                          className="w-24 p-1 text-right border border-slate-300 rounded font-mono"
                        />
                      ) : (
                        discountTotal > 0 && <span className="font-mono">(-) {discountTotal.toLocaleString(undefined, { minimumFractionDigits: 2 })}</span>
                      )}
                    </div>
                  );
                })()}

                <div className="flex justify-between items-center py-1 text-slate-700">
                  <span className="font-medium">Shipping Charges</span>
                  {isEditing ? (
                    <input
                      type="number"
                      step="0.01"
                      value={shippingTotal}
                      onChange={(e) => setShippingTotal(parseFloat(e.target.value) || 0)}
                      className="w-24 p-1 text-right border border-slate-300 rounded font-mono"
                    />
                  ) : (
                    shippingTotal > 0 && <span className="font-mono">{shippingTotal.toLocaleString(undefined, { minimumFractionDigits: 2 })}</span>
                  )}
                </div>

                <div className="flex justify-between py-1 font-bold text-sm text-slate-900 border-t border-slate-200 pt-2">
                  <span>Total</span>
                  <span className="font-mono">{currency}{totalAmount.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
                </div>

                <div className="flex justify-between items-center py-1 text-rose-500 font-medium">
                  <span>Payment Made</span>
                  {isEditing ? (
                    <input
                      type="number"
                      step="0.01"
                      value={amountPaid}
                      onChange={(e) => setAmountPaid(parseFloat(e.target.value) || 0)}
                      className="w-24 p-1 text-right border border-slate-300 rounded font-mono text-rose-500 font-bold"
                    />
                  ) : (
                    amountPaid > 0 && <span className="font-mono">(-) {amountPaid.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
                  )}
                </div>

                {/* Highlighted Balance Due Bar */}
                <div className="flex justify-between items-center bg-[#f2f8f9] p-2.5 rounded border-y border-slate-200 mt-2 font-bold text-slate-900">
                  <span className="text-xs uppercase tracking-wider">BALANCE DUE</span>
                  <span className="font-mono text-sm">{currency}{balanceDue.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
                </div>
              </div>
            </div>
          </div>

          {/* 5. Footer & Legal Section */}
          <div className="pt-6 space-y-6">
            {/* Flex container for Thank You message (left) and WhatsApp QR Code (right bottom corner) */}
            <div className="flex items-end justify-between gap-4">
              {/* Left Side: Thank You Message & Contact Details in Normal Clean Font */}
              <div className="space-y-1.5 max-w-md">
                <div className="text-xs sm:text-sm font-medium text-slate-800 leading-relaxed">
                  {isEditing ? (
                    <div className="space-y-1">
                      <label className="text-[10px] font-semibold text-slate-500 uppercase">Thank You Note (Editable):</label>
                      <input
                        type="text"
                        value={thankYouMsg}
                        onChange={(e) => setThankYouMsg(e.target.value)}
                        className="w-full p-1.5 border border-slate-300 rounded text-xs font-normal text-slate-900 bg-white"
                      />
                    </div>
                  ) : (
                    <span>{thankYouMsg}</span>
                  )}
                </div>

                <div className="text-xs font-normal text-slate-600 space-y-0.5">
                  <div className="font-semibold text-slate-900">Adcare Meds & Pharmacy Online Home Service</div>
                  <div>WhatsApp / Phone: <span className="font-mono font-medium text-slate-800">0342-3010508</span></div>
                </div>
              </div>

              {/* Right Side Bottom Corner: WhatsApp QR Code */}
              <div className="flex flex-col items-center justify-end text-center shrink-0">
                <div className="p-1 bg-white border border-slate-200 rounded-lg shadow-2xs inline-block">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src="/whatsapp-qr.png"
                    alt="WhatsApp QR Code"
                    className="w-20 h-20 sm:w-24 sm:h-24 object-contain rounded"
                  />
                </div>
                <span className="text-[10px] font-semibold text-slate-500 mt-1">Scan for WhatsApp</span>
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
    </div>
  );
};
