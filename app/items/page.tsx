'use client';

import React, { useState } from 'react';
import { Package, Plus, Search, Edit2 } from 'lucide-react';
import { useADCare } from '@/lib/context';
import { Item } from '@/lib/types';

export default function ItemsPage() {
  const { items, addItem, updateItem } = useADCare();
  const [search, setSearch] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [editingItem, setEditingItem] = useState<Item | null>(null);

  const [name, setName] = useState('');
  const [sku, setSku] = useState('');
  const [type, setType] = useState<'product' | 'service'>('product');
  const [unit, setUnit] = useState('unit');
  const [salesPrice, setSalesPrice] = useState<number>(100);
  const [costPrice, setCostPrice] = useState<number>(40);
  const [stockOnHand, setStockOnHand] = useState<number>(50);
  const [description, setDescription] = useState('');

  const filteredItems = items.filter(i => (
    i.name.toLowerCase().includes(search.toLowerCase()) ||
    i.sku.toLowerCase().includes(search.toLowerCase())
  ));

  const openAddModal = () => {
    setEditingItem(null);
    setName('');
    setSku('');
    setType('product');
    setUnit('unit');
    setSalesPrice(100);
    setCostPrice(40);
    setStockOnHand(50);
    setDescription('');
    setShowModal(true);
  };

  const openEditModal = (item: Item) => {
    setEditingItem(item);
    setName(item.name);
    setSku(item.sku);
    setType(item.type);
    setUnit(item.unit);
    setSalesPrice(item.salesPrice);
    setCostPrice(item.costPrice);
    setStockOnHand(item.stockOnHand);
    setDescription(item.description);
    setShowModal(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    if (editingItem) {
      updateItem(editingItem.id, {
        name,
        sku,
        type,
        unit,
        salesPrice,
        costPrice,
        stockOnHand,
        description
      });
    } else {
      addItem({
        name,
        sku: sku || `SKU-${Date.now().toString().slice(-4)}`,
        type,
        unit,
        salesPrice,
        costPrice,
        taxRate: 0,
        stockOnHand,
        reorderPoint: 10,
        description,
        status: 'active'
      });
    }

    setShowModal(false);
    setEditingItem(null);
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-12 px-2 sm:px-4">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-4 sm:p-6 rounded-2xl border border-slate-200 shadow-subtle">
        <div>
          <h2 className="text-lg sm:text-xl font-bold text-slate-900 flex items-center gap-2">
            <Package className="w-5 h-5 text-brand-600" />
            Products & Services Catalog
          </h2>
          <p className="text-xs text-slate-500 mt-1">
            Maintain item prices, SKUs, inventory counts, and cost rates.
          </p>
        </div>

        <button
          onClick={openAddModal}
          className="flex items-center justify-center gap-2 px-4 py-2 bg-brand-600 hover:bg-brand-700 text-white font-bold text-xs rounded-xl shadow-sm transition-colors"
        >
          <Plus className="w-4 h-4" />
          <span>Add New Item</span>
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
            placeholder="Search catalog by SKU or item name..."
            className="w-full pl-9 pr-4 py-2 text-xs bg-white border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-500 text-slate-900 shadow-2xs"
          />
        </div>
      </div>

      {/* Catalog Table (Responsive Scroll) */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-subtle overflow-x-auto">
        <table className="w-full text-xs text-left min-w-[650px]">
          <thead className="bg-slate-50 text-slate-500 uppercase text-[10px] font-bold tracking-wider border-b border-slate-200">
            <tr>
              <th className="p-4">SKU / Code</th>
              <th className="p-4">Item Name</th>
              <th className="p-4">Type</th>
              <th className="p-4 text-right">Sales Price</th>
              <th className="p-4 text-right">Cost Price</th>
              <th className="p-4 text-center">Stock On Hand</th>
              <th className="p-4 text-center">Status</th>
              <th className="p-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 text-slate-800">
            {filteredItems.map((item) => (
              <tr key={item.id} className="hover:bg-slate-50/80 transition-colors">
                <td className="p-4 font-mono font-bold text-brand-600">{item.sku}</td>
                <td className="p-4 font-semibold text-slate-900">{item.name}</td>
                <td className="p-4">
                  <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                    item.type === 'service' ? 'bg-indigo-100 text-indigo-700' : 'bg-emerald-100 text-emerald-700'
                  }`}>
                    {item.type}
                  </span>
                </td>
                <td className="p-4 text-right font-mono font-bold text-slate-900">PKR {item.salesPrice.toLocaleString(undefined, { minimumFractionDigits: 2 })}</td>
                <td className="p-4 text-right font-mono text-slate-500">PKR {item.costPrice.toLocaleString(undefined, { minimumFractionDigits: 2 })}</td>
                <td className="p-4 text-center font-mono">
                  {item.type === 'service' ? 'N/A' : (
                    <span className={`font-bold ${item.stockOnHand <= item.reorderPoint ? 'text-rose-600' : 'text-slate-800'}`}>
                      {item.stockOnHand} {item.unit}s
                    </span>
                  )}
                </td>
                <td className="p-4 text-center">
                  <span className="px-2 py-0.5 text-[10px] font-bold rounded-full bg-emerald-100 text-emerald-700">
                    {item.status}
                  </span>
                </td>
                <td className="p-4 text-right">
                  <button
                    onClick={() => openEditModal(item)}
                    className="p-1.5 text-slate-600 hover:text-brand-600 rounded-md hover:bg-brand-50 transition-colors"
                    title="Edit Item"
                  >
                    <Edit2 className="w-4 h-4" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Add / Edit Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl p-6 shadow-2xl w-full max-w-md space-y-4 border border-slate-200 animate-in fade-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="font-bold text-slate-900 text-base">
                {editingItem ? 'Edit Item / Product' : 'Add New Item / Service'}
              </h3>
              <button onClick={() => setShowModal(false)} className="text-slate-400 hover:text-slate-600">✕</button>
            </div>
            <form onSubmit={handleSubmit} className="space-y-3 text-xs">
              <div>
                <label className="font-semibold text-slate-700">Item Name *</label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Inj Meropenem 1g"
                  className="w-full mt-1 p-2 border border-slate-200 rounded-lg text-slate-900 focus:ring-2 focus:ring-brand-500 outline-none"
                />
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                <div>
                  <label className="font-semibold text-slate-700">SKU Code</label>
                  <input
                    type="text"
                    value={sku}
                    onChange={(e) => setSku(e.target.value)}
                    placeholder="SKU-001"
                    className="w-full mt-1 p-2 border border-slate-200 rounded-lg text-slate-900 font-mono focus:ring-2 focus:ring-brand-500 outline-none"
                  />
                </div>
                <div>
                  <label className="font-semibold text-slate-700">Type</label>
                  <select
                    value={type}
                    onChange={(e) => setType(e.target.value as 'product' | 'service')}
                    className="w-full mt-1 p-2 border border-slate-200 rounded-lg text-slate-900 focus:ring-2 focus:ring-brand-500 outline-none"
                  >
                    <option value="product">Product (Inventory)</option>
                    <option value="service">Service (Non-inventory)</option>
                  </select>
                </div>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                <div>
                  <label className="font-semibold text-slate-700">Sales Price (PKR)</label>
                  <input
                    type="number"
                    step="0.01"
                    value={salesPrice}
                    onChange={(e) => setSalesPrice(parseFloat(e.target.value) || 0)}
                    className="w-full mt-1 p-2 border border-slate-200 rounded-lg text-slate-900 font-mono focus:ring-2 focus:ring-brand-500 outline-none"
                  />
                </div>
                <div>
                  <label className="font-semibold text-slate-700">Cost Price (PKR)</label>
                  <input
                    type="number"
                    step="0.01"
                    value={costPrice}
                    onChange={(e) => setCostPrice(parseFloat(e.target.value) || 0)}
                    className="w-full mt-1 p-2 border border-slate-200 rounded-lg text-slate-900 font-mono focus:ring-2 focus:ring-brand-500 outline-none"
                  />
                </div>
              </div>
              {type === 'product' && (
                <div>
                  <label className="font-semibold text-slate-700">Stock On Hand</label>
                  <input
                    type="number"
                    value={stockOnHand}
                    onChange={(e) => setStockOnHand(parseInt(e.target.value) || 0)}
                    className="w-full mt-1 p-2 border border-slate-200 rounded-lg text-slate-900 font-mono focus:ring-2 focus:ring-brand-500 outline-none"
                  />
                </div>
              )}
              <div>
                <label className="font-semibold text-slate-700">Description</label>
                <textarea
                  rows={2}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Item details..."
                  className="w-full mt-1 p-2 border border-slate-200 rounded-lg text-slate-900 focus:ring-2 focus:ring-brand-500 outline-none"
                />
              </div>
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
                  className="px-4 py-2 bg-brand-600 hover:bg-brand-700 text-white rounded-lg font-semibold shadow-sm transition-colors"
                >
                  {editingItem ? 'Update Item' : 'Save Item'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
