'use client';

import React, { useState } from 'react';
import { Settings, Save, Building2, Globe, Mail, Phone, MapPin, ShieldCheck, CheckCircle2 } from 'lucide-react';
import { useADCare } from '@/lib/context';

export default function SettingsPage() {
  const { orgSettings, updateOrgSettings, resetToDefaultData } = useADCare();
  const [saved, setSaved] = useState(false);

  const [name, setName] = useState(orgSettings.name);
  const [legalName, setLegalName] = useState(orgSettings.legalName);
  const [taxId, setTaxId] = useState(orgSettings.taxId);
  const [email, setEmail] = useState(orgSettings.email);
  const [phone, setPhone] = useState(orgSettings.phone);
  const [website, setWebsite] = useState(orgSettings.website);
  const [address, setAddress] = useState(orgSettings.address);
  const [city, setCity] = useState(orgSettings.city);
  const [country, setCountry] = useState(orgSettings.country);

  const handleReset = () => {
    if (confirm('Are you sure you want to reset all stored invoices, bills, customers, vendors, and inventory data back to factory defaults?')) {
      resetToDefaultData();
      alert('System data has been reset to factory defaults.');
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    updateOrgSettings({
      name,
      legalName,
      taxId,
      email,
      phone,
      website,
      address,
      city,
      country
    });
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  return (
    <div className="space-y-6 max-w-5xl mx-auto pb-12">
      <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-subtle flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">
            <Settings className="w-5 h-5 text-brand-600" />
            Organization & System Settings
          </h2>
          <p className="text-xs text-slate-500 mt-1">
            Configure AD CARE legal business parameters, tax registration, and persistent local storage database settings.
          </p>
        </div>

        {saved && (
          <div className="flex items-center gap-1.5 px-3 py-1.5 bg-emerald-50 text-emerald-700 border border-emerald-200 rounded-xl text-xs font-bold animate-in fade-in">
            <CheckCircle2 className="w-4 h-4" />
            <span>Settings Saved!</span>
          </div>
        )}
      </div>

      <form onSubmit={handleSubmit} className="bg-white rounded-2xl border border-slate-200 shadow-subtle p-6 space-y-6 text-xs">
        {/* Business Profile */}
        <div className="space-y-4">
          <div className="font-bold text-slate-900 uppercase tracking-wider text-xs border-b border-slate-100 pb-2">
            Legal Business Profile
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="font-semibold text-slate-700">Display Organization Name</label>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full mt-1 p-2 border border-slate-200 rounded-lg text-slate-900 font-medium"
              />
            </div>
            <div>
              <label className="font-semibold text-slate-700">Legal Entity Registered Name</label>
              <input
                type="text"
                required
                value={legalName}
                onChange={(e) => setLegalName(e.target.value)}
                className="w-full mt-1 p-2 border border-slate-200 rounded-lg text-slate-900 font-medium"
              />
            </div>
            <div>
              <label className="font-semibold text-slate-700">Federal Tax ID / Registration</label>
              <input
                type="text"
                required
                value={taxId}
                onChange={(e) => setTaxId(e.target.value)}
                className="w-full mt-1 p-2 border border-slate-200 rounded-lg text-slate-900 font-mono"
              />
            </div>
            <div>
              <label className="font-semibold text-slate-700">Base Currency</label>
              <input
                type="text"
                disabled
                value="PKR (Rs.)"
                className="w-full mt-1 p-2 border border-slate-200 rounded-lg bg-slate-100 text-slate-500 font-mono font-bold"
              />
            </div>
          </div>
        </div>

        {/* Contact Details */}
        <div className="space-y-4 pt-4 border-t border-slate-200">
          <div className="font-bold text-slate-900 uppercase tracking-wider text-xs border-b border-slate-100 pb-2">
            Contact & Address Details
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="font-semibold text-slate-700">Official Billing Email</label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full mt-1 p-2 border border-slate-200 rounded-lg text-slate-900"
              />
            </div>
            <div>
              <label className="font-semibold text-slate-700">Phone</label>
              <input
                type="text"
                required
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="w-full mt-1 p-2 border border-slate-200 rounded-lg text-slate-900"
              />
            </div>
            <div>
              <label className="font-semibold text-slate-700">Website</label>
              <input
                type="text"
                value={website}
                onChange={(e) => setWebsite(e.target.value)}
                className="w-full mt-1 p-2 border border-slate-200 rounded-lg text-slate-900"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="md:col-span-2">
              <label className="font-semibold text-slate-700">Street Address</label>
              <input
                type="text"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                className="w-full mt-1 p-2 border border-slate-200 rounded-lg text-slate-900"
              />
            </div>
            <div>
              <label className="font-semibold text-slate-700">City & Region</label>
              <input
                type="text"
                value={city}
                onChange={(e) => setCity(e.target.value)}
                className="w-full mt-1 p-2 border border-slate-200 rounded-lg text-slate-900"
              />
            </div>
          </div>
        </div>

        {/* Data Persistence & Storage Controls */}
        <div className="space-y-4 pt-4 border-t border-slate-200">
          <div className="font-bold text-slate-900 uppercase tracking-wider text-xs border-b border-slate-100 pb-2">
            Data Storage & System Persistence
          </div>
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 bg-slate-50 border border-slate-200 rounded-xl">
            <div>
              <div className="font-bold text-slate-900 text-xs">Persistent Browser Storage Active</div>
              <p className="text-[11px] text-slate-500 mt-0.5">
                All invoices, vendor bills, customer profiles, vendor records, product stock levels, and audit logs are automatically persisted to local storage upon modification and survive page reloads.
              </p>
            </div>
            <button
              type="button"
              onClick={handleReset}
              className="px-4 py-2 bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200 rounded-xl font-bold text-xs shrink-0 transition-colors"
            >
              Reset to Factory Defaults
            </button>
          </div>
        </div>

        <div className="pt-4 flex justify-end">
          <button
            type="submit"
            className="flex items-center gap-2 px-5 py-2.5 bg-brand-600 hover:bg-brand-700 text-white font-bold text-xs rounded-xl shadow-md transition-colors"
          >
            <Save className="w-4 h-4" />
            <span>Save Organization Profile</span>
          </button>
        </div>
      </form>
    </div>
  );
}
