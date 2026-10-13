import React, { useState } from 'react';
import { X, Store, DollarSign, Users, Sparkles, Building2, Check } from 'lucide-react';
import { BusinessCategory, BudgetTier, ExpansionType, ShopProfile } from '../types';

interface ShopProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentShop: ShopProfile;
  onSaveShop: (shop: ShopProfile) => void;
  presetShops: ShopProfile[];
  onSelectPreset: (preset: ShopProfile) => void;
}

const CATEGORIES: BusinessCategory[] = [
  'Specialty Coffee & Bakery',
  'Boutique Apparel & Vintage',
  'Artisan Pizzeria & Bistro',
  'Pet Care & Boutique Grooming',
  'Reformer Pilates & Fitness Studio',
  'Specialty Bookstore & Café',
  'Craft Beer & Wine Taproom',
  'Handmade Ice Cream & Dessert',
  'Wellness, Spa & Beauty',
  'Organic Grocery & Deli',
  'Custom Retail / Other',
];

const EXPANSION_TYPES: ExpansionType[] = [
  '2nd Brick-and-Mortar Store',
  'High-Footfall Kiosk / Pop-Up',
  'Flagship Experiential Store',
  'Micro-Fulfillment / Pickup Node',
  'Franchise Partner Branch',
];

const BUDGET_TIERS: BudgetTier[] = [
  'Conservative ($40k-$80k)',
  'Moderate ($80k-$150k)',
  'Aggressive ($150k-$300k+)',
];

export const ShopProfileModal: React.FC<ShopProfileModalProps> = ({
  isOpen,
  onClose,
  currentShop,
  onSaveShop,
  presetShops,
  onSelectPreset,
}) => {
  const [formData, setFormData] = useState<ShopProfile>({ ...currentShop });

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSaveShop(formData);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fade-in">
      <div className="bg-slate-900 border border-slate-800 rounded-3xl max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl p-6 lg:p-8 space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-800 pb-4">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-2xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
              <Store className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-slate-100">
                Configure Shop Profile & Flagship Baseline
              </h2>
              <p className="text-xs text-slate-400">
                Tailor parameters so expansion models reflect your exact retail economics.
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-slate-200 rounded-xl hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Quick Presets Bar */}
        <div className="space-y-2">
          <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider block">
            Or Load Preset Business Model:
          </label>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
            {presetShops.map((preset) => (
              <button
                key={preset.id}
                type="button"
                onClick={() => {
                  onSelectPreset(preset);
                  setFormData({ ...preset });
                }}
                className={`p-2.5 rounded-xl border text-left transition-all text-xs ${
                  formData.id === preset.id
                    ? 'bg-emerald-500/10 border-emerald-500/50 text-emerald-300 font-bold'
                    : 'bg-slate-950/60 border-slate-800 text-slate-300 hover:border-slate-700'
                }`}
              >
                <div className="truncate font-semibold">{preset.name.split(' ')[0]}</div>
                <div className="text-[10px] text-slate-500 truncate">{preset.category}</div>
              </button>
            ))}
          </div>
        </div>

        {/* Custom Edit Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="text-xs text-slate-300 font-medium">Business / Brand Name</label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-xs text-slate-100 focus:outline-none focus:border-emerald-500"
                required
              />
            </div>

            <div className="space-y-1">
              <label className="text-xs text-slate-300 font-medium">Retail Category</label>
              <select
                value={formData.category}
                onChange={(e) => setFormData({ ...formData, category: e.target.value as BusinessCategory })}
                className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-xs text-slate-100 focus:outline-none focus:border-emerald-500"
              >
                {CATEGORIES.map((c) => (
                  <option key={c} value={c}>
                    {c}
                  </option>
                ))}
              </select>
            </div>

            <div className="space-y-1">
              <label className="text-xs text-slate-300 font-medium">Current Flagship District</label>
              <input
                type="text"
                value={formData.flagshipDistrict}
                onChange={(e) => setFormData({ ...formData, flagshipDistrict: e.target.value })}
                className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-xs text-slate-100 focus:outline-none focus:border-emerald-500"
                required
              />
            </div>

            <div className="space-y-1">
              <label className="text-xs text-slate-300 font-medium">Current Monthly Gross Sales ($)</label>
              <input
                type="number"
                min="5000"
                max="500000"
                step="1000"
                value={formData.monthlyRevenue}
                onChange={(e) => setFormData({ ...formData, monthlyRevenue: Number(e.target.value) })}
                className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-xs text-slate-100 focus:outline-none focus:border-emerald-500"
                required
              />
            </div>

            <div className="space-y-1">
              <label className="text-xs text-slate-300 font-medium">Typical Store Size (Sq Ft)</label>
              <input
                type="number"
                min="300"
                max="5000"
                step="50"
                value={formData.storeSizeSqFt}
                onChange={(e) => setFormData({ ...formData, storeSizeSqFt: Number(e.target.value) })}
                className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-xs text-slate-100 focus:outline-none focus:border-emerald-500"
                required
              />
            </div>

            <div className="space-y-1">
              <label className="text-xs text-slate-300 font-medium">Average Ticket / Order Value ($)</label>
              <input
                type="number"
                min="2"
                max="300"
                step="0.5"
                value={formData.averageTicket}
                onChange={(e) => setFormData({ ...formData, averageTicket: Number(e.target.value) })}
                className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-xs text-slate-100 focus:outline-none focus:border-emerald-500"
                required
              />
            </div>

            <div className="space-y-1">
              <label className="text-xs text-slate-300 font-medium">Expansion Model</label>
              <select
                value={formData.expansionType}
                onChange={(e) => setFormData({ ...formData, expansionType: e.target.value as ExpansionType })}
                className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-xs text-slate-100 focus:outline-none focus:border-emerald-500"
              >
                {EXPANSION_TYPES.map((t) => (
                  <option key={t} value={t}>
                    {t}
                  </option>
                ))}
              </select>
            </div>

            <div className="space-y-1">
              <label className="text-xs text-slate-300 font-medium">Expansion Capex Budget Tier</label>
              <select
                value={formData.budgetTier}
                onChange={(e) => setFormData({ ...formData, budgetTier: e.target.value as BudgetTier })}
                className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-xs text-slate-100 focus:outline-none focus:border-emerald-500"
              >
                {BUDGET_TIERS.map((b) => (
                  <option key={b} value={b}>
                    {b}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="space-y-1">
            <label className="text-xs text-slate-300 font-medium">Target Customer Persona</label>
            <input
              type="text"
              value={formData.targetAudience}
              onChange={(e) => setFormData({ ...formData, targetAudience: e.target.value })}
              className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-xs text-slate-100 focus:outline-none focus:border-emerald-500"
              placeholder="e.g. Young creatives, morning commuters, affluent dog owners..."
              required
            />
          </div>

          <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-800">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs text-slate-400 hover:text-slate-200"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2.5 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold rounded-xl text-xs transition-all shadow-lg"
            >
              Save Shop Profile
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
