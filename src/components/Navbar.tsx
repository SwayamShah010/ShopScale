import React from 'react';
import {
  Compass,
  BarChart3,
  Calculator,
  Scale,
  Rocket,
  MessageSquare,
  FileText,
  Store,
  ChevronDown,
  Sparkles,
  MapPin,
  Settings2
} from 'lucide-react';
import { ShopProfile } from '../types';

export type ActiveTab = 'map' | 'evaluation' | 'economics' | 'compare' | 'playbook' | 'advisor';

interface NavbarProps {
  currentShop: ShopProfile;
  shops: ShopProfile[];
  onSelectShop: (shop: ShopProfile) => void;
  onOpenShopModal: () => void;
  activeTab: ActiveTab;
  onSelectTab: (tab: ActiveTab) => void;
  comparisonCount: number;
  onOpenExportModal: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentShop,
  shops,
  onSelectShop,
  onOpenShopModal,
  activeTab,
  onSelectTab,
  comparisonCount,
  onOpenExportModal,
}) => {
  return (
    <header className="bg-slate-950/90 border-b border-slate-800/80 sticky top-0 z-40 backdrop-blur-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Top Row: Brand, Shop Selector, Export */}
        <div className="py-3 flex flex-wrap items-center justify-between gap-4 border-b border-slate-800/60">
          {/* Logo & Brand */}
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-emerald-500 to-teal-400 flex items-center justify-center text-slate-950 shadow-lg shadow-emerald-500/20 font-black">
              <Store className="w-5 h-5 text-slate-950" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-lg font-black tracking-tight text-white flex items-center gap-1.5">
                  ShopScale
                  <span className="text-xs px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 font-semibold">
                    EXPANSION AI
                  </span>
                </span>
              </div>
              <p className="text-[11px] text-slate-400">
                Local Shop Territory Intelligence & New Location Launchpad
              </p>
            </div>
          </div>

          {/* Shop Switcher & Quick Profile Trigger */}
          <div className="flex items-center gap-3">
            <div className="relative group">
              <button
                onClick={onOpenShopModal}
                className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-slate-900 border border-slate-800 hover:border-slate-700 text-xs transition-all text-slate-200"
              >
                <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></div>
                <div className="text-left">
                  <span className="text-[10px] text-slate-500 block uppercase font-medium">Active Shop</span>
                  <span className="font-bold text-slate-100 flex items-center gap-1">
                    {currentShop.name}
                    <ChevronDown className="w-3 h-3 text-slate-400" />
                  </span>
                </div>
              </button>
            </div>

            <button
              onClick={onOpenShopModal}
              className="p-2 rounded-xl bg-slate-900 border border-slate-800 hover:bg-slate-800 text-slate-400 hover:text-slate-200 transition-colors"
              title="Edit Shop Details"
            >
              <Settings2 className="w-4 h-4" />
            </button>

            {/* Export Dossier Action */}
            <button
              onClick={onOpenExportModal}
              className="py-1.5 px-3.5 bg-emerald-500/10 hover:bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 font-bold rounded-xl text-xs transition-all flex items-center gap-1.5 shadow-sm"
            >
              <FileText className="w-3.5 h-3.5" />
              <span>Export Dossier</span>
            </button>
          </div>
        </div>

        {/* Bottom Row: Navigation Tabs */}
        <div className="py-2 flex items-center justify-between overflow-x-auto gap-2 text-xs no-scrollbar">
          <div className="flex items-center gap-1">
            <button
              onClick={() => onSelectTab('map')}
              className={`px-3 py-2 rounded-xl font-bold transition-all flex items-center gap-1.5 shrink-0 ${
                activeTab === 'map'
                  ? 'bg-emerald-500 text-slate-950 shadow-md font-extrabold'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900'
              }`}
            >
              <Compass className="w-4 h-4" />
              Territory Radar Map
            </button>

            <button
              onClick={() => onSelectTab('evaluation')}
              className={`px-3 py-2 rounded-xl font-bold transition-all flex items-center gap-1.5 shrink-0 ${
                activeTab === 'evaluation'
                  ? 'bg-emerald-500 text-slate-950 shadow-md font-extrabold'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900'
              }`}
            >
              <Sparkles className="w-4 h-4" />
              AI Site Evaluation
            </button>

            <button
              onClick={() => onSelectTab('economics')}
              className={`px-3 py-2 rounded-xl font-bold transition-all flex items-center gap-1.5 shrink-0 ${
                activeTab === 'economics'
                  ? 'bg-emerald-500 text-slate-950 shadow-md font-extrabold'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900'
              }`}
            >
              <Calculator className="w-4 h-4" />
              Unit Economics & P&L
            </button>

            <button
              onClick={() => onSelectTab('compare')}
              className={`px-3 py-2 rounded-xl font-bold transition-all flex items-center gap-1.5 shrink-0 relative ${
                activeTab === 'compare'
                  ? 'bg-emerald-500 text-slate-950 shadow-md font-extrabold'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900'
              }`}
            >
              <Scale className="w-4 h-4" />
              Location Comparator
              {comparisonCount > 0 && (
                <span className="w-4 h-4 rounded-full bg-blue-500 text-white text-[10px] flex items-center justify-center font-bold">
                  {comparisonCount}
                </span>
              )}
            </button>

            <button
              onClick={() => onSelectTab('playbook')}
              className={`px-3 py-2 rounded-xl font-bold transition-all flex items-center gap-1.5 shrink-0 ${
                activeTab === 'playbook'
                  ? 'bg-emerald-500 text-slate-950 shadow-md font-extrabold'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900'
              }`}
            >
              <Rocket className="w-4 h-4" />
              90-Day Launch Playbook
            </button>

            <button
              onClick={() => onSelectTab('advisor')}
              className={`px-3 py-2 rounded-xl font-bold transition-all flex items-center gap-1.5 shrink-0 ${
                activeTab === 'advisor'
                  ? 'bg-emerald-500 text-slate-950 shadow-md font-extrabold'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900'
              }`}
            >
              <MessageSquare className="w-4 h-4" />
              AI Strategy Advisor
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};
