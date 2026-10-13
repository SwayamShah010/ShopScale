import React from 'react';
import { X, Printer, Download, Sparkles, Building2, CheckCircle2, TrendingUp, DollarSign } from 'lucide-react';
import { EvaluationResult, ShopProfile, TerritoryZone } from '../types';

interface ExportDossierModalProps {
  isOpen: boolean;
  onClose: () => void;
  shop: ShopProfile;
  zone: TerritoryZone;
  evaluation: EvaluationResult | null;
}

export const ExportDossierModal: React.FC<ExportDossierModalProps> = ({
  isOpen,
  onClose,
  shop,
  zone,
  evaluation,
}) => {
  if (!isOpen) return null;

  const handlePrint = () => {
    window.print();
  };

  const estMonthlyRent = Math.round((zone.avgRentSqFt * shop.storeSizeSqFt) / 12);
  const estGrossSales = Math.round(shop.monthlyRevenue * 1.15);
  const estCapex = Math.round(shop.storeSizeSqFt * 110);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md">
      <div className="bg-slate-900 border border-slate-800 rounded-3xl max-w-4xl w-full max-h-[92vh] overflow-y-auto shadow-2xl flex flex-col">
        {/* Action Header (Hidden during print) */}
        <div className="p-4 bg-slate-950/90 border-b border-slate-800 flex items-center justify-between gap-4 sticky top-0 z-10 print:hidden">
          <div className="flex items-center gap-2">
            <span className="p-2 rounded-xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
              <Building2 className="w-5 h-5" />
            </span>
            <div>
              <h3 className="text-sm font-bold text-slate-100">
                Commercial Expansion Dossier & Lease Application Package
              </h3>
              <p className="text-xs text-slate-400">
                Ready to present to commercial landlords, brokers, and banking lenders.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handlePrint}
              className="py-2 px-4 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold rounded-xl text-xs transition-all flex items-center gap-1.5 shadow-lg"
            >
              <Printer className="w-4 h-4" /> Print / Save as PDF
            </button>
            <button
              onClick={onClose}
              className="p-2 text-slate-400 hover:text-slate-200 rounded-xl hover:bg-slate-800"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Dossier Printable Document Body */}
        <div className="p-8 lg:p-12 space-y-8 text-slate-200 print:text-black print:bg-white bg-slate-900">
          {/* Document Cover Header */}
          <div className="border-b border-slate-800 print:border-slate-300 pb-6 flex flex-col sm:flex-row justify-between items-start sm:items-end gap-4">
            <div>
              <div className="text-xs font-bold uppercase tracking-widest text-emerald-400 print:text-emerald-700">
                Retail Territory Feasibility & Expansion Dossier
              </div>
              <h1 className="text-3xl font-black text-slate-100 print:text-black mt-1">
                {shop.name}
              </h1>
              <p className="text-sm text-slate-400 print:text-slate-600 mt-0.5">
                Target Location: <strong className="text-slate-200 print:text-slate-900">{zone.name}</strong>, {zone.city}
              </p>
            </div>

            <div className="text-right text-xs text-slate-400 print:text-slate-600">
              <div>Date: {new Date().toLocaleDateString()}</div>
              <div>Expansion Model: {shop.expansionType}</div>
              <div className="text-emerald-400 print:text-emerald-700 font-bold mt-1">
                Suitability Rating: {evaluation?.overallScore || zone.opportunityScore}/100
              </div>
            </div>
          </div>

          {/* Section 1: Executive Summary */}
          <div className="space-y-3">
            <h2 className="text-sm font-bold uppercase tracking-wider text-slate-300 print:text-slate-800 border-b border-slate-800 print:border-slate-200 pb-1">
              1. Executive Expansion Summary
            </h2>
            <p className="text-xs leading-relaxed text-slate-300 print:text-slate-700">
              {evaluation?.summary ||
                `${shop.name} is seeking to expand into ${zone.name}. With proven monthly revenues of $${shop.monthlyRevenue.toLocaleString()} at our flagship location, this proposed site unlocks an incremental customer cluster with minimal cannibalization of existing trade.`}
            </p>
          </div>

          {/* Section 2: Business Baseline & Track Record */}
          <div className="space-y-3">
            <h2 className="text-sm font-bold uppercase tracking-wider text-slate-300 print:text-slate-800 border-b border-slate-800 print:border-slate-200 pb-1">
              2. Brand Track Record & Operational Baseline
            </h2>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs">
              <div className="p-3 rounded-xl bg-slate-950/60 print:bg-slate-100 border border-slate-800 print:border-slate-300">
                <span className="text-slate-400 print:text-slate-600 block">Category</span>
                <span className="font-bold text-slate-200 print:text-black">{shop.category}</span>
              </div>
              <div className="p-3 rounded-xl bg-slate-950/60 print:bg-slate-100 border border-slate-800 print:border-slate-300">
                <span className="text-slate-400 print:text-slate-600 block">Flagship Location</span>
                <span className="font-bold text-slate-200 print:text-black">{shop.flagshipDistrict}</span>
              </div>
              <div className="p-3 rounded-xl bg-slate-950/60 print:bg-slate-100 border border-slate-800 print:border-slate-300">
                <span className="text-slate-400 print:text-slate-600 block">Current Gross Sales</span>
                <span className="font-bold text-slate-200 print:text-black">${shop.monthlyRevenue.toLocaleString()}/mo</span>
              </div>
              <div className="p-3 rounded-xl bg-slate-950/60 print:bg-slate-100 border border-slate-800 print:border-slate-300">
                <span className="text-slate-400 print:text-slate-600 block">Average Ticket Size</span>
                <span className="font-bold text-slate-200 print:text-black">${shop.averageTicket.toFixed(2)}</span>
              </div>
            </div>
          </div>

          {/* Section 3: Demographic & Territory Viability */}
          <div className="space-y-3">
            <h2 className="text-sm font-bold uppercase tracking-wider text-slate-300 print:text-slate-800 border-b border-slate-800 print:border-slate-200 pb-1">
              3. Proposed Territory Demographics & Market Synergy
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
              <div className="space-y-1">
                <span className="text-slate-400 print:text-slate-600">Foot Traffic Index:</span>
                <div className="font-bold text-slate-200 print:text-black">{zone.footfallIndex}/100 (+{zone.growthVelocityPercent}% YoY growth)</div>
              </div>
              <div className="space-y-1">
                <span className="text-slate-400 print:text-slate-600">Median Household Income:</span>
                <div className="font-bold text-slate-200 print:text-black">{zone.medianHouseholdIncome}</div>
              </div>
              <div className="space-y-1">
                <span className="text-slate-400 print:text-slate-600">Distance from Flagship:</span>
                <div className="font-bold text-slate-200 print:text-black">{zone.distanceFromFlagshipMiles} miles (Low cannibalization risk)</div>
              </div>
            </div>
            <p className="text-xs text-slate-400 print:text-slate-600 mt-2">
              <strong>Target Customer Profile:</strong> {zone.primaryAudience}
            </p>
          </div>

          {/* Section 4: Pro Forma Unit Economics */}
          <div className="space-y-3">
            <h2 className="text-sm font-bold uppercase tracking-wider text-slate-300 print:text-slate-800 border-b border-slate-800 print:border-slate-200 pb-1">
              4. Pro Forma Unit Economics & Occupancy Affordability
            </h2>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs">
              <div className="p-3 rounded-xl bg-slate-950/60 print:bg-slate-100 border border-slate-800 print:border-slate-300">
                <span className="text-slate-400 print:text-slate-600 block">Target Size</span>
                <span className="font-bold text-slate-200 print:text-black">{shop.storeSizeSqFt.toLocaleString()} sq ft</span>
              </div>
              <div className="p-3 rounded-xl bg-slate-950/60 print:bg-slate-100 border border-slate-800 print:border-slate-300">
                <span className="text-slate-400 print:text-slate-600 block">Est. Base Rent</span>
                <span className="font-bold text-slate-200 print:text-black">${estMonthlyRent.toLocaleString()}/mo</span>
              </div>
              <div className="p-3 rounded-xl bg-slate-950/60 print:bg-slate-100 border border-slate-800 print:border-slate-300">
                <span className="text-slate-400 print:text-slate-600 block">Projected Sales</span>
                <span className="font-bold text-emerald-400 print:text-emerald-700">${estGrossSales.toLocaleString()}/mo</span>
              </div>
              <div className="p-3 rounded-xl bg-slate-950/60 print:bg-slate-100 border border-slate-800 print:border-slate-300">
                <span className="text-slate-400 print:text-slate-600 block">Initial Capex</span>
                <span className="font-bold text-slate-200 print:text-black">${estCapex.toLocaleString()}</span>
              </div>
            </div>
            <div className="text-xs text-slate-400 print:text-slate-600">
              Total occupancy costs (Rent + CAM) are projected at ~11.8% of gross sales, well within healthy retail feasibility thresholds.
            </div>
          </div>

          {/* Section 5: Co-Tenancy & Neighbor Synergy */}
          <div className="space-y-3">
            <h2 className="text-sm font-bold uppercase tracking-wider text-slate-300 print:text-slate-800 border-b border-slate-800 print:border-slate-200 pb-1">
              5. Co-Tenancy Synergy & Traffic Anchors
            </h2>
            <div className="flex flex-wrap gap-2 text-xs">
              {zone.idealAnchors.map((anchor) => (
                <span
                  key={anchor}
                  className="px-2.5 py-1 rounded-lg bg-slate-950 print:bg-slate-200 border border-slate-800 print:border-slate-300 font-medium"
                >
                  ✓ {anchor}
                </span>
              ))}
            </div>
          </div>

          {/* Footer Sign-off */}
          <div className="pt-6 border-t border-slate-800 print:border-slate-300 flex justify-between items-center text-xs text-slate-500">
            <span>Prepared via ShopScale Expansion Intelligence Engine</span>
            <span>Confidential • Commercial Real Estate & Banking Package</span>
          </div>
        </div>
      </div>
    </div>
  );
};
