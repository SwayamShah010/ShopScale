import React, { useState, useEffect, useCallback } from 'react';
import {
  INITIAL_SHOPS,
  INITIAL_TERRITORIES,
  INITIAL_LAUNCH_TASKS,
} from './data/mockDistricts';
import {
  CampaignData,
  EvaluationResult,
  LaunchTask,
  ShopProfile,
  TerritoryZone,
} from './types';
import { ActiveTab, Navbar } from './components/Navbar';
import { TerritoryMap } from './components/TerritoryMap';
import { EvaluationView } from './components/EvaluationView';
import { FinancialProForma } from './components/FinancialProForma';
import { LocationComparator } from './components/LocationComparator';
import { LaunchPlaybook } from './components/LaunchPlaybook';
import { AiAdvisorChat } from './components/AiAdvisorChat';
import { ShopProfileModal } from './components/ShopProfileModal';
import { ExportDossierModal } from './components/ExportDossierModal';

export default function App() {
  const [shops, setShops] = useState<ShopProfile[]>(INITIAL_SHOPS);
  const [currentShop, setCurrentShop] = useState<ShopProfile>(INITIAL_SHOPS[0]);
  const [territories] = useState<TerritoryZone[]>(INITIAL_TERRITORIES);
  const [selectedZone, setSelectedZone] = useState<TerritoryZone>(INITIAL_TERRITORIES[0]);
  const [activeTab, setActiveTab] = useState<ActiveTab>('map');

  // Evaluation state
  const [evaluation, setEvaluation] = useState<EvaluationResult | null>(null);
  const [isLoadingEvaluation, setIsLoadingEvaluation] = useState<boolean>(false);

  // Location comparison list
  const [comparisonList, setComparisonList] = useState<TerritoryZone[]>([
    INITIAL_TERRITORIES[0],
    INITIAL_TERRITORIES[1],
  ]);

  // Launch tasks and campaign
  const [tasks, setTasks] = useState<LaunchTask[]>(INITIAL_LAUNCH_TASKS);
  const [campaign, setCampaign] = useState<CampaignData | null>(null);
  const [isGeneratingCampaign, setIsGeneratingCampaign] = useState<boolean>(false);

  // Modals
  const [isShopModalOpen, setIsShopModalOpen] = useState<boolean>(false);
  const [isExportModalOpen, setIsExportModalOpen] = useState<boolean>(false);

  // Fetch or re-evaluate territory
  const fetchEvaluation = useCallback(async (zone: TerritoryZone, shop: ShopProfile) => {
    setIsLoadingEvaluation(true);
    try {
      const response = await fetch('/api/expansion/evaluate-territory', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          businessName: shop.name,
          businessType: shop.category,
          currentLocation: shop.flagshipDistrict,
          targetCity: zone.city,
          targetDistrict: zone.name,
          storeSizeSqFt: shop.storeSizeSqFt,
          monthlyRevenue: shop.monthlyRevenue,
          targetAudience: shop.targetAudience,
          expansionType: shop.expansionType,
          budgetTier: shop.budgetTier,
        }),
      });

      const data = await response.json();
      if (data.success && data.data) {
        setEvaluation(data.data);
      }
    } catch (err) {
      console.error('Failed to evaluate territory:', err);
    } finally {
      setIsLoadingEvaluation(false);
    }
  }, []);

  // Initial evaluation on mount
  useEffect(() => {
    fetchEvaluation(selectedZone, currentShop);
  }, []); // Run on initial load

  // Trigger evaluation and switch tab
  const handleEvaluateZone = (zone: TerritoryZone) => {
    setSelectedZone(zone);
    fetchEvaluation(zone, currentShop);
    setActiveTab('evaluation');
  };

  // Toggle comparison item
  const handleCompareToggle = (zone: TerritoryZone) => {
    setComparisonList((prev) => {
      const exists = prev.some((c) => c.id === zone.id);
      if (exists) {
        return prev.filter((c) => c.id !== zone.id);
      } else {
        return [...prev, zone];
      }
    });
  };

  const handleAddToComparison = (zone: TerritoryZone) => {
    if (!comparisonList.some((c) => c.id === zone.id)) {
      setComparisonList((prev) => [...prev, zone]);
    }
  };

  const handleRemoveFromComparison = (zoneId: string) => {
    setComparisonList((prev) => prev.filter((c) => c.id !== zoneId));
  };

  // Generate marketing campaign
  const handleGenerateCampaign = async (launchBudget: number) => {
    setIsGeneratingCampaign(true);
    try {
      const response = await fetch('/api/expansion/generate-marketing-campaign', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          businessName: currentShop.name,
          businessType: currentShop.category,
          targetDistrict: selectedZone.name,
          targetCity: selectedZone.city,
          launchBudget,
        }),
      });

      const data = await response.json();
      if (data.success && data.data) {
        setCampaign(data.data);
      }
    } catch (err) {
      console.error('Failed to generate marketing campaign:', err);
    } finally {
      setIsGeneratingCampaign(false);
    }
  };

  // Task actions
  const handleToggleTask = (taskId: string) => {
    setTasks((prev) =>
      prev.map((t) => (t.id === taskId ? { ...t, completed: !t.completed } : t))
    );
  };

  const handleAddTask = (newTask: Omit<LaunchTask, 'id'>) => {
    setTasks((prev) => [
      ...prev,
      {
        ...newTask,
        id: `task-${Date.now()}`,
      },
    ]);
  };

  // Shop changes
  const handleSaveShop = (updated: ShopProfile) => {
    setCurrentShop(updated);
    setShops((prev) =>
      prev.map((s) => (s.id === updated.id ? updated : s))
    );
    fetchEvaluation(selectedZone, updated);
  };

  const handleSelectPreset = (preset: ShopProfile) => {
    setCurrentShop(preset);
    fetchEvaluation(selectedZone, preset);
  };

  return (
    <div className="min-h-screen bg-[#0b0f17] text-slate-100 flex flex-col font-sans selection:bg-emerald-500 selection:text-slate-950">
      {/* Navigation Bar */}
      <Navbar
        currentShop={currentShop}
        shops={shops}
        onSelectShop={(s) => {
          setCurrentShop(s);
          fetchEvaluation(selectedZone, s);
        }}
        onOpenShopModal={() => setIsShopModalOpen(true)}
        activeTab={activeTab}
        onSelectTab={setActiveTab}
        comparisonCount={comparisonList.length}
        onOpenExportModal={() => setIsExportModalOpen(true)}
      />

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto p-4 sm:p-6 lg:p-8">
        {activeTab === 'map' && (
          <TerritoryMap
            shop={currentShop}
            territories={territories}
            selectedZone={selectedZone}
            onSelectZone={setSelectedZone}
            onEvaluate={handleEvaluateZone}
            onCompareToggle={handleCompareToggle}
            comparisonList={comparisonList}
          />
        )}

        {activeTab === 'evaluation' && (
          <EvaluationView
            shop={currentShop}
            zone={selectedZone}
            evaluation={evaluation}
            isLoading={isLoadingEvaluation}
            onReevaluate={() => fetchEvaluation(selectedZone, currentShop)}
            onNavigateToEconomics={() => setActiveTab('economics')}
            onGenerateCampaign={() => {
              setActiveTab('playbook');
              if (!campaign) handleGenerateCampaign(3500);
            }}
            onExportDossier={() => setIsExportModalOpen(true)}
          />
        )}

        {activeTab === 'economics' && (
          <FinancialProForma
            shop={currentShop}
            zone={selectedZone}
            onExportDossier={() => setIsExportModalOpen(true)}
          />
        )}

        {activeTab === 'compare' && (
          <LocationComparator
            shop={currentShop}
            territories={territories}
            comparisonList={comparisonList}
            onRemoveFromComparison={handleRemoveFromComparison}
            onAddToComparison={handleAddToComparison}
            onSelectPrimaryZone={(z) => {
              setSelectedZone(z);
              fetchEvaluation(z, currentShop);
              setActiveTab('evaluation');
            }}
          />
        )}

        {activeTab === 'playbook' && (
          <LaunchPlaybook
            shop={currentShop}
            zone={selectedZone}
            tasks={tasks}
            onToggleTask={handleToggleTask}
            onAddTask={handleAddTask}
            campaign={campaign}
            onGenerateCampaign={handleGenerateCampaign}
            isGeneratingCampaign={isGeneratingCampaign}
          />
        )}

        {activeTab === 'advisor' && (
          <AiAdvisorChat
            shop={currentShop}
            zone={selectedZone}
          />
        )}
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-900 bg-slate-950/60 py-6 text-center text-xs text-slate-500">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
            <span>ShopScale Retail Expansion & Commercial Territory Intelligence</span>
          </div>
          <div>
            Built to empower independent local merchants to expand sustainably.
          </div>
        </div>
      </footer>

      {/* Modals */}
      <ShopProfileModal
        isOpen={isShopModalOpen}
        onClose={() => setIsShopModalOpen(false)}
        currentShop={currentShop}
        onSaveShop={handleSaveShop}
        presetShops={shops}
        onSelectPreset={handleSelectPreset}
      />

      <ExportDossierModal
        isOpen={isExportModalOpen}
        onClose={() => setIsExportModalOpen(false)}
        shop={currentShop}
        zone={selectedZone}
        evaluation={evaluation}
      />
    </div>
  );
}
