'use client';

import React from 'react';
import Link from 'next/link';
import { TrendingUp, ArrowLeft, Printer, ShoppingBag, DollarSign, Percent, PackageCheck } from 'lucide-react';
import { useADCare } from '@/lib/context';

export default function ProfitLossPage() {
  const { getProfitAndLoss, orgSettings } = useADCare();
  const pnl = getProfitAndLoss();

  const totalQtySold = pnl.itemizedSummary.reduce((acc, it) => acc + it.quantitySold, 0);
  const totalItemRevenue = pnl.itemizedSummary.reduce((acc, it) => acc + it.totalRevenue, 0);
  const totalItemCost = pnl.itemizedSummary.reduce((acc, it) => acc + it.totalCost, 0);
  const totalGrossProfit = totalItemRevenue - totalItemCost;
  const overallMargin = totalItemRevenue > 0 ? (totalGrossProfit / totalItemRevenue) * 100 : 0;

  return (
    <div className="space-y-6 max-w-5xl mx-auto pb-12">
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

      <div className="bg-white rounded-2xl border border-slate-200 shadow-subtle p-6 sm:p-8 space-y-6 print:shadow-none print:border-none print:p-0">
        
        {/* P&L Header */}
        <div className="text-center border-b border-slate-200 pb-6 space-y-1">
          <h2 className="text-2xl font-extrabold text-slate-900 tracking-tight">{orgSettings.name}</h2>
          <div className="text-sm font-bold text-brand-600 uppercase tracking-widest">PROFIT & LOSS STATEMENT (INCOME STATEMENT)</div>
          <p className="text-xs text-slate-500 font-mono">Fiscal Period: Jan 1, 2026 – Dec 31, 2026 (PKR)</p>
        </div>

        {/* Operating Revenue */}
        <div className="space-y-3">
          <div className="text-xs font-bold text-slate-900 uppercase tracking-wider bg-slate-100 p-2.5 rounded-lg flex items-center justify-between">
            <span>OPERATING REVENUE & SALES INCOME</span>
            <span className="text-[10px] text-slate-500 font-mono">Live Invoice Aggregation</span>
          </div>
          <div className="space-y-2 text-xs px-2">
            <div className="flex justify-between text-slate-700 font-medium">
              <span>[4000] Medicine & Pharmacy Sales Income (Invoice Sales)</span>
              <span className="font-mono font-bold text-slate-900">
                PKR {pnl.salesRevenue.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
              </span>
            </div>
            <div className="flex justify-between font-bold text-slate-900 border-t border-slate-200 pt-2 text-sm">
              <span>Total Operating Sales Revenue:</span>
              <span className="font-mono text-emerald-600">
                PKR {pnl.salesRevenue.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
              </span>
            </div>
          </div>
        </div>

        {/* Operating Expenses & Cost of Sales */}
        <div className="space-y-3 pt-4 border-t border-slate-200">
          <div className="text-xs font-bold text-slate-900 uppercase tracking-wider bg-slate-100 p-2.5 rounded-lg flex items-center justify-between">
            <span>OPERATING EXPENSES & PROCUREMENT COST (COGS)</span>
            <span className="text-[10px] text-slate-500 font-mono">Direct Costs & Procurement</span>
          </div>
          <div className="space-y-2 text-xs px-2">
            <div className="flex justify-between text-slate-700 font-medium">
              <span>[6100] Pharmaceutical Procurement Cost / Cost of Goods Sold</span>
              <span className="font-mono font-bold text-slate-900">
                PKR {pnl.procurementCost.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
              </span>
            </div>
            <div className="flex justify-between text-slate-700 font-medium">
              <span>[6200] Rent, Facilities & Direct Logged Expenses</span>
              <span className="font-mono font-bold text-slate-900">
                PKR {pnl.directExpenses.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
              </span>
            </div>
            <div className="flex justify-between font-bold text-slate-900 border-t border-slate-200 pt-2 text-sm">
              <span>Total Operating Expenses & COGS:</span>
              <span className="font-mono text-rose-600">
                PKR {pnl.totalExpenses.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
              </span>
            </div>
          </div>
        </div>

        {/* Net Income Summary Bar */}
        <div className="bg-slate-900 text-white p-5 rounded-xl flex items-center justify-between text-sm shadow-md">
          <div>
            <div className="font-extrabold text-base flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-emerald-400" />
              <span>NET OPERATING INCOME</span>
            </div>
            <div className="text-xs text-slate-400 mt-0.5">Total Sales Revenue minus Procurement & Operating Expenses</div>
          </div>
          <div className={`text-2xl font-extrabold font-mono ${pnl.netIncome >= 0 ? 'text-emerald-400' : 'text-rose-400'}`}>
            PKR {pnl.netIncome.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
          </div>
        </div>

        {/* Itemized Sales & Product Profitability Report Table */}
        <div className="pt-6 space-y-3 border-t border-slate-200">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
              <ShoppingBag className="w-4 h-4 text-brand-600" />
              Itemized Medicine Sales & Profitability Report
            </h3>
            <span className="text-xs text-slate-500 font-semibold">
              Total Sold: <strong className="text-slate-900 font-mono">{totalQtySold} items</strong>
            </span>
          </div>
          <p className="text-xs text-slate-500">
            Breakdown of exact medicine items sold, units deducted from stock, revenue generated, cost incurred, and net profit per product.
          </p>

          <div className="overflow-x-auto rounded-xl border border-slate-200">
            <table className="w-full text-xs text-left min-w-[700px]">
              <thead className="bg-slate-50 text-slate-600 uppercase text-[10px] font-bold tracking-wider border-b border-slate-200">
                <tr>
                  <th className="p-3">Medicine / Product Name</th>
                  <th className="p-3">SKU</th>
                  <th className="p-3 text-right">Qty Sold</th>
                  <th className="p-3 text-right">Unit Price</th>
                  <th className="p-3 text-right">Unit Cost</th>
                  <th className="p-3 text-right">Total Revenue</th>
                  <th className="p-3 text-right">Total Cost</th>
                  <th className="p-3 text-right">Gross Profit</th>
                  <th className="p-3 text-center">Margin %</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-slate-800">
                {pnl.itemizedSummary.length === 0 ? (
                  <tr>
                    <td colSpan={9} className="p-6 text-center text-slate-400 italic">
                      No medicine item sales recorded yet. Create an invoice to view live product profitability metrics.
                    </td>
                  </tr>
                ) : (
                  pnl.itemizedSummary.map((item) => (
                    <tr key={item.itemId} className="hover:bg-slate-50/80 transition-colors">
                      <td className="p-3 font-bold text-slate-900">{item.itemName}</td>
                      <td className="p-3 font-mono text-[11px] text-slate-500">{item.sku}</td>
                      <td className="p-3 text-right font-mono font-bold text-brand-700">{item.quantitySold}</td>
                      <td className="p-3 text-right font-mono text-slate-700">PKR {item.unitPrice.toLocaleString(undefined, { minimumFractionDigits: 2 })}</td>
                      <td className="p-3 text-right font-mono text-slate-600">PKR {item.costPrice.toLocaleString(undefined, { minimumFractionDigits: 2 })}</td>
                      <td className="p-3 text-right font-mono font-bold text-slate-900">PKR {item.totalRevenue.toLocaleString(undefined, { minimumFractionDigits: 2 })}</td>
                      <td className="p-3 text-right font-mono text-rose-700">PKR {item.totalCost.toLocaleString(undefined, { minimumFractionDigits: 2 })}</td>
                      <td className={`p-3 text-right font-mono font-bold ${item.grossProfit >= 0 ? 'text-emerald-600' : 'text-rose-600'}`}>
                        PKR {item.grossProfit.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                      </td>
                      <td className="p-3 text-center font-bold">
                        <span className={`px-2 py-0.5 rounded-full text-[10px] ${item.profitMargin >= 20 ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'}`}>
                          {item.profitMargin.toFixed(1)}%
                        </span>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
              {pnl.itemizedSummary.length > 0 && (
                <tfoot className="bg-slate-100 text-slate-900 font-bold border-t border-slate-300">
                  <tr>
                    <td colSpan={2} className="p-3 uppercase text-[10px] tracking-wider">Total Sales Metrics:</td>
                    <td className="p-3 text-right font-mono font-bold text-brand-700">{totalQtySold}</td>
                    <td className="p-3"></td>
                    <td className="p-3"></td>
                    <td className="p-3 text-right font-mono text-slate-900">PKR {totalItemRevenue.toLocaleString(undefined, { minimumFractionDigits: 2 })}</td>
                    <td className="p-3 text-right font-mono text-rose-700">PKR {totalItemCost.toLocaleString(undefined, { minimumFractionDigits: 2 })}</td>
                    <td className="p-3 text-right font-mono text-emerald-600">PKR {totalGrossProfit.toLocaleString(undefined, { minimumFractionDigits: 2 })}</td>
                    <td className="p-3 text-center font-mono text-emerald-700">{overallMargin.toFixed(1)}%</td>
                  </tr>
                </tfoot>
              )}
            </table>
          </div>
        </div>

      </div>
    </div>
  );
}
