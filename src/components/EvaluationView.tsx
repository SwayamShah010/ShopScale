import React from 'react';
import {
  Sparkles,
  TrendingUp,
  DollarSign,
  Users,
  ShieldAlert,
  AlertTriangle,
  Building,
  CheckCircle2,
  ArrowRight,
  Calculator,
  RefreshCw,
  Compass,
  FileText,
  Clock,
  Layers,
  MapPin
} from 'lucide-react';
import { EvaluationResult, ShopProfile, TerritoryZone } from '../types';

interface EvaluationViewProps {
  shop: ShopProfile;
  zone: TerritoryZone;
  evaluation: EvaluationResult | null;
  isLoading: boolean;
  onReevaluate: () => void;
  onNavigateToEconomics: () => void;
  onGenerateCampaign: () => void;
  onExportDossier: () => void;
}

export const EvaluationView: React.FC<EvaluationViewProps> = ({
  shop,
  zone,
  evaluation,
  isLoading,
  onReevaluate,
  onNavigateToEconomics,
  onGenerateCampaign,
  onExportDossier,
}) => {
  if (isLoading) {
    return (
      <div className="w-full min-h-[600px] flex flex-col items-center justify-center p-12 bg-slate-900 border border-slate-800 rounded-2xl text-center space-y-6">
        <div className="relative">
          <div className="w-20 h-20 rounded-full border-4 border-slate-800 border-t-emerald-500 animate-spin"></div>
          <div className="absolute inset-0 flex items-center justify-center">
            <Sparkles className="w-8 h-8 text-emerald-400 animate-pulse" />
          </div>
        </div>

        <div className="space-y-2 max-w-md">
          <h3 className="text-xl font-bold text-slate-100">
            Synthesizing Territory Intelligence
          </h3>
          <p className="text-sm text-slate-400">
            Scanning demographic cohorts, competitor whitespace, cannibalization radii, and commercial rent feasibility for <strong className="text-emerald-400">{zone.name}</strong>...
          </p>
        </div>

        <div className="flex items-center gap-3 text-xs text-slate-500 bg-slate-950 px-4 py-2 rounded-full border border-slate-800">
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping"></span>
          Running Gemini AI Multivariable Retail Assessment Engine
        </div>
      </div>
    );
  }

  if (!evaluation) {
    return (
      <div className="w-full min-h-[500px] flex flex-col items-center justify-center p-12 bg-slate-900 border border-slate-800 rounded-2xl text-center space-y-4">
        <div className="p-4 rounded-full bg-slate-800 text-slate-400">
          <Compass className="w-10 h-10" />
        </div>
        <h3 className="text-lg font-bold text-slate-200">No Assessment Data Yet</h3>
        <p className="text-sm text-slate-400 max-w-md">
          Select a candidate district and run an evaluation to analyze foot-traffic, demographics, whitespace, and financial viability.
        </p>
        <button
          onClick={onReevaluate}
          className="px-5 py-2.5 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold rounded-xl text-sm transition-all"
        >
          Evaluate {zone.name} Now
        </button>
      </div>
    );
  }

  const getScoreBadgeColor = (score: number) => {
    if (score >= 85) return 'from-emerald-500/20 to-teal-500/20 border-emerald-500/40 text-emerald-300';
    if (score >= 75) return 'from-blue-500/20 to-indigo-500/20 border-blue-500/40 text-blue-300';
    if (score >= 65) return 'from-amber-500/20 to-orange-500/20 border-amber-500/40 text-amber-300';
    return 'from-rose-500/20 to-red-500/20 border-rose-500/40 text-rose-300';
  };

  return (
    <div className="space-y-6 w-full">
      {/* Top Banner / Hero Verdict Card */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 lg:p-8 shadow-2xl relative overflow-hidden">
        {/* Subtle background glow */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-emerald-500/5 rounded-full blur-3xl pointer-events-none"></div>

        <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6 relative z-10">
          <div className="space-y-3 flex-1">
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-xs uppercase tracking-wider font-bold px-3 py-1 rounded-full bg-slate-800 text-slate-300 border border-slate-700">
                {zone.city}
              </span>
              <span className="text-xs uppercase tracking-wider font-bold px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 flex items-center gap-1">
                <Sparkles className="w-3.5 h-3.5" />
                AI Expansion Assessment
              </span>
              <span className="text-xs text-slate-400 flex items-center gap-1">
                <MapPin className="w-3.5 h-3.5" />
                Targeting: {zone.name}
              </span>
            </div>

            <h2 className="text-2xl lg:text-3xl font-extrabold text-slate-100 leading-tight">
              Expansion Feasibility Audit: <span className="text-emerald-400">{zone.name}</span>
            </h2>

            <p className="text-sm lg:text-base text-slate-300 max-w-3xl leading-relaxed">
              {evaluation.summary}
            </p>
          </div>

          {/* Big Score Gauge Badge */}
          <div className="flex flex-col items-center justify-center p-5 rounded-2xl bg-slate-950/80 border border-slate-800 min-w-[200px] text-center shadow-inner">
            <div className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
              Expansion Suitability
            </div>
            <div className="text-5xl font-black text-emerald-400 my-1">
              {evaluation.overallScore}
              <span className="text-lg text-slate-500 font-normal">/100</span>
            </div>
            <div className={`text-xs font-bold px-3 py-1 rounded-full border bg-gradient-to-r ${getScoreBadgeColor(evaluation.overallScore)}`}>
              {evaluation.verdict}
            </div>
            <button
              onClick={onReevaluate}
              className="mt-3 text-[11px] text-slate-400 hover:text-slate-200 flex items-center gap-1 transition-colors"
            >
              <RefreshCw className="w-3 h-3" /> Re-run Assessment
            </button>
          </div>
        </div>
      </div>

      {/* 4 Pillars Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Pillar 1: Demographics */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-4 shadow-lg hover:border-slate-700 transition-colors">
          <div className="flex items-center justify-between">
            <div className="p-2.5 rounded-xl bg-blue-500/10 text-blue-400 border border-blue-500/20">
              <Users className="w-5 h-5" />
            </div>
            <span className="text-xs font-bold text-blue-400 bg-blue-500/10 px-2 py-0.5 rounded-full">
              {evaluation.demographics.fitScore}% Fit
            </span>
          </div>

          <div>
            <h4 className="text-sm font-bold text-slate-200">Demographic Alignment</h4>
            <p className="text-xs text-slate-400 mt-1">
              Primary Cohort: <strong className="text-slate-200">{evaluation.demographics.primaryAgeCohort}</strong>
            </p>
          </div>

          <div className="space-y-2 text-xs border-t border-slate-800 pt-3">
            <div className="flex justify-between">
              <span className="text-slate-400">Median Income:</span>
              <span className="font-semibold text-slate-200">{evaluation.demographics.medianHouseholdIncome}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-400">Foot Traffic Index:</span>
              <span className="font-semibold text-emerald-400">{evaluation.demographics.footTrafficIndex}/100</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-400">Customer Flow:</span>
              <span className="font-semibold text-slate-200 text-right">{evaluation.demographics.daytimeVsEveningPeak}</span>
            </div>
          </div>
        </div>

        {/* Pillar 2: Competitor & Whitespace */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-4 shadow-lg hover:border-slate-700 transition-colors">
          <div className="flex items-center justify-between">
            <div className="p-2.5 rounded-xl bg-amber-500/10 text-amber-400 border border-amber-500/20">
              <ShieldAlert className="w-5 h-5" />
            </div>
            <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${
              evaluation.competitorLandscape.saturationLevel === 'Low'
                ? 'bg-emerald-500/10 text-emerald-400'
                : evaluation.competitorLandscape.saturationLevel === 'Moderate'
                ? 'bg-amber-500/10 text-amber-400'
                : 'bg-rose-500/10 text-rose-400'
            }`}>
              {evaluation.competitorLandscape.saturationLevel} Saturation
            </span>
          </div>

          <div>
            <h4 className="text-sm font-bold text-slate-200">Competitor Whitespace</h4>
            <p className="text-xs text-slate-400 mt-1">
              Direct Rivals: <strong className="text-slate-200">{evaluation.competitorLandscape.estimatedDirectCompetitors} stores</strong> in category
            </p>
          </div>

          <div className="space-y-2 text-xs border-t border-slate-800 pt-3">
            <div className="text-slate-300 italic line-clamp-3">
              "{evaluation.competitorLandscape.whiteSpaceOpportunity}"
            </div>
          </div>
        </div>

        {/* Pillar 3: Cannibalization Safety */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-4 shadow-lg hover:border-slate-700 transition-colors">
          <div className="flex items-center justify-between">
            <div className="p-2.5 rounded-xl bg-purple-500/10 text-purple-400 border border-purple-500/20">
              <Compass className="w-5 h-5" />
            </div>
            <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${
              evaluation.cannibalizationRisk.riskLevel === 'Minimal'
                ? 'bg-emerald-500/10 text-emerald-400'
                : 'bg-amber-500/10 text-amber-400'
            }`}>
              {evaluation.cannibalizationRisk.riskLevel} Overlap Risk
            </span>
          </div>

          <div>
            <h4 className="text-sm font-bold text-slate-200">Customer Cannibalization</h4>
            <p className="text-xs text-slate-400 mt-1">
              Flagship Distance: <strong className="text-slate-200">{evaluation.cannibalizationRisk.estimatedDistance}</strong>
            </p>
          </div>

          <div className="space-y-2 text-xs border-t border-slate-800 pt-3">
            <p className="text-slate-300 leading-relaxed">
              {evaluation.cannibalizationRisk.recommendation}
            </p>
          </div>
        </div>

        {/* Pillar 4: Financial Payback */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-4 shadow-lg hover:border-slate-700 transition-colors">
          <div className="flex items-center justify-between">
            <div className="p-2.5 rounded-xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
              <DollarSign className="w-5 h-5" />
            </div>
            <span className="text-xs font-bold text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-full">
              ~{evaluation.financialProjections.projectedBreakEvenMonths} Mo Breakeven
            </span>
          </div>

          <div>
            <h4 className="text-sm font-bold text-slate-200">Financial Feasibility</h4>
            <p className="text-xs text-slate-400 mt-1">
              Est. Monthly Rent: <strong className="text-slate-200">${evaluation.financialProjections.estimatedMonthlyRent.toLocaleString()}</strong>
            </p>
          </div>

          <div className="space-y-2 text-xs border-t border-slate-800 pt-3">
            <div className="flex justify-between">
              <span className="text-slate-400">Est. Monthly Gross:</span>
              <span className="font-semibold text-emerald-400">
                ${(evaluation.financialProjections.estimatedMonthlyGrossMin / 1000).toFixed(0)}k - ${(evaluation.financialProjections.estimatedMonthlyGrossMax / 1000).toFixed(0)}k
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-400">Initial Fit-out Capex:</span>
              <span className="font-semibold text-slate-200">${(evaluation.financialProjections.estimatedInitialCapex / 1000).toFixed(0)}k</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-400">Projected Net Margin:</span>
              <span className="font-semibold text-emerald-400">~{evaluation.financialProjections.projectedNetMargin}%</span>
            </div>
          </div>
        </div>
      </div>

      {/* Deep Insights Rows */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column: Anchor Neighbors & Pitfalls */}
        <div className="space-y-6 lg:col-span-2">
          {/* Winning Differentiation Strategy */}
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl">
            <h3 className="text-base font-bold text-slate-100 flex items-center gap-2 mb-3">
              <Sparkles className="w-4 h-4 text-emerald-400" />
              Strategic Positioning & Differentiator Playbook
            </h3>
            <p className="text-sm text-slate-300 leading-relaxed">
              {evaluation.competitorLandscape.keyDifferentiatorAdvice}
            </p>
          </div>

          {/* Anchor Neighbors and Zoning Tips */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-lg">
              <h4 className="text-sm font-bold text-slate-200 flex items-center gap-2 mb-3">
                <Building className="w-4 h-4 text-blue-400" />
                Ideal Anchor Neighbors (Footfall Drivers)
              </h4>
              <ul className="space-y-2 text-xs text-slate-300">
                {evaluation.idealAnchorNeighbors.map((anchor, idx) => (
                  <li key={idx} className="flex items-start gap-2">
                    <CheckCircle2 className="w-3.5 h-3.5 text-blue-400 shrink-0 mt-0.5" />
                    <span>{anchor}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-lg">
              <h4 className="text-sm font-bold text-slate-200 flex items-center gap-2 mb-3">
                <AlertTriangle className="w-4 h-4 text-amber-400" />
                Zoning & Permitting Considerations
              </h4>
              <ul className="space-y-2 text-xs text-slate-300">
                {evaluation.zoningAndPermittingTips.map((tip, idx) => (
                  <li key={idx} className="flex items-start gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-amber-400 shrink-0 mt-1.5"></span>
                    <span>{tip}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Pitfalls to Avoid */}
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-lg">
            <h4 className="text-sm font-bold text-slate-200 flex items-center gap-2 mb-3">
              <ShieldAlert className="w-4 h-4 text-rose-400" />
              Expansion Traps & Critical Risks to Guard Against
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              {evaluation.pitfallsToAvoid.map((pitfall, idx) => (
                <div
                  key={idx}
                  className="p-3 rounded-xl bg-slate-950/60 border border-rose-500/20 text-xs text-slate-300 leading-relaxed"
                >
                  <span className="text-rose-400 font-bold block mb-1">Risk #{idx + 1}</span>
                  {pitfall}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Column: Hyperlocal Quick Promos & Action Launchpad */}
        <div className="space-y-6">
          {/* Hyperlocal Launch Tactics */}
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-xl space-y-4">
            <div className="flex items-center justify-between">
              <h4 className="text-sm font-bold text-slate-200 flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-emerald-400" />
                Hyperlocal Activation Sparks
              </h4>
              <button
                onClick={onGenerateCampaign}
                className="text-xs text-emerald-400 hover:text-emerald-300 font-medium"
              >
                Expand Campaign →
              </button>
            </div>

            <div className="space-y-3">
              {evaluation.hyperlocalPromos.map((promo, idx) => (
                <div
                  key={idx}
                  className="p-3 rounded-xl bg-slate-950/80 border border-slate-800 space-y-1.5"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-emerald-400">{promo.channel}</span>
                    <span className="text-[10px] text-slate-500">High Traction</span>
                  </div>
                  <p className="text-xs text-slate-300 leading-snug">{promo.tactic}</p>
                  <div className="text-[11px] text-slate-400 italic">
                    Impact: {promo.expectedImpact}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Action Launchpad Buttons */}
          <div className="bg-gradient-to-br from-slate-900 to-slate-950 border border-slate-800 rounded-2xl p-5 shadow-xl space-y-3">
            <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider">
              Next Expansion Steps
            </h4>

            <button
              onClick={onNavigateToEconomics}
              className="w-full py-2.5 px-4 bg-slate-800 hover:bg-slate-700 text-slate-100 font-semibold rounded-xl text-xs transition-all flex items-center justify-between group"
            >
              <span className="flex items-center gap-2">
                <Calculator className="w-4 h-4 text-emerald-400" />
                Model Unit Economics & P&L Pro Forma
              </span>
              <ArrowRight className="w-4 h-4 text-slate-500 group-hover:text-slate-200 transition-colors" />
            </button>

            <button
              onClick={onGenerateCampaign}
              className="w-full py-2.5 px-4 bg-slate-800 hover:bg-slate-700 text-slate-100 font-semibold rounded-xl text-xs transition-all flex items-center justify-between group"
            >
              <span className="flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-teal-400" />
                Build 4-Pillar Hyperlocal Launch Plan
              </span>
              <ArrowRight className="w-4 h-4 text-slate-500 group-hover:text-slate-200 transition-colors" />
            </button>

            <button
              onClick={onExportDossier}
              className="w-full py-2.5 px-4 bg-emerald-500/10 hover:bg-emerald-500/20 border border-emerald-500/30 text-emerald-300 font-bold rounded-xl text-xs transition-all flex items-center justify-between group"
            >
              <span className="flex items-center gap-2">
                <FileText className="w-4 h-4 text-emerald-400" />
                Export Full Expansion Dossier (PDF/Print)
              </span>
              <ArrowRight className="w-4 h-4 text-emerald-400" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
