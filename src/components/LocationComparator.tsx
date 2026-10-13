import React from 'react';
import {
  Scale,
  Sparkles,
  DollarSign,
  Users,
  Compass,
  ShieldAlert,
  ArrowRight,
  Plus,
  Trash2,
  CheckCircle2,
  Trophy
} from 'lucide-react';
import { ShopProfile, TerritoryZone } from '../types';

interface LocationComparatorProps {
  shop: ShopProfile;
  territories: TerritoryZone[];
  comparisonList: TerritoryZone[];
  onRemoveFromComparison: (zoneId: string) => void;
  onAddToComparison: (zone: TerritoryZone) => void;
  onSelectPrimaryZone: (zone: TerritoryZone) => void;
}

export const LocationComparator: React.FC<LocationComparatorProps> = ({
  shop,
  territories,
  comparisonList,
  onRemoveFromComparison,
  onAddToComparison,
  onSelectPrimaryZone,
}) => {
  // If comparison list has fewer than 2 items, suggest adding more
  const availableToAdd = territories.filter(
    (t) => !comparisonList.some((c) => c.id === t.id)
  );

  // Calculate winners
  const bestScoreZone = comparisonList.reduce(
    (prev, curr) => (curr.opportunityScore > (prev?.opportunityScore || 0) ? curr : prev),
    comparisonList[0]
  );
  const bestRentZone = comparisonList.reduce(
    (prev, curr) => (curr.avgRentSqFt < (prev?.avgRentSqFt || 999) ? curr : prev),
    comparisonList[0]
  );
  const bestFootfallZone = comparisonList.reduce(
    (prev, curr) => (curr.footfallIndex > (prev?.footfallIndex || 0) ? curr : prev),
    comparisonList[0]
  );

  return (
    <div className="space-y-6 w-full">
      {/* Header */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-2xl flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs uppercase font-bold tracking-wider px-2.5 py-0.5 rounded-full bg-blue-500/10 text-blue-400 border border-blue-500/20">
              Site Selection Arena
            </span>
            <span className="text-xs text-slate-400">
              Comparing {comparisonList.length} candidate districts for <strong className="text-slate-200">{shop.name}</strong>
            </span>
          </div>
          <h2 className="text-xl lg:text-2xl font-bold text-slate-100 mt-1">
            Side-by-Side Location Matchup Matrix
          </h2>
          <p className="text-xs text-slate-400">
            Compare rental overhead, customer footfall, customer cannibalization risks, and competitor density across target neighborhoods.
          </p>
        </div>

        {/* Add more locations quick dropdown */}
        {availableToAdd.length > 0 && comparisonList.length < 4 && (
          <div className="flex items-center gap-2">
            <select
              aria-label="Add candidate district to comparison"
              className="bg-slate-950 border border-slate-700 text-xs text-slate-200 rounded-xl px-3 py-2 focus:outline-none focus:border-emerald-500"
              onChange={(e) => {
                const zone = territories.find((t) => t.id === e.target.value);
                if (zone) onAddToComparison(zone);
                e.target.value = '';
              }}
              defaultValue=""
            >
              <option value="" disabled>
                + Add Candidate District...
              </option>
              {availableToAdd.map((z) => (
                <option key={z.id} value={z.id}>
                  {z.name} (Score: {z.opportunityScore}%)
                </option>
              ))}
            </select>
          </div>
        )}
      </div>

      {comparisonList.length === 0 ? (
        <div className="w-full min-h-[400px] flex flex-col items-center justify-center p-12 bg-slate-900 border border-slate-800 rounded-2xl text-center space-y-4">
          <div className="p-4 rounded-full bg-slate-800 text-slate-400">
            <Scale className="w-10 h-10" />
          </div>
          <h3 className="text-lg font-bold text-slate-200">No Locations in Comparison</h3>
          <p className="text-xs text-slate-400 max-w-sm">
            Add 2 or more target districts from the Territory Map to see a detailed side-by-side trade-off matrix.
          </p>
          <div className="flex flex-wrap gap-2 justify-center pt-2">
            {territories.slice(0, 3).map((z) => (
              <button
                key={z.id}
                onClick={() => onAddToComparison(z)}
                className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 border border-slate-700 text-xs text-slate-200 rounded-lg transition-colors flex items-center gap-1"
              >
                <Plus className="w-3.5 h-3.5" /> Add {z.name.split(' ')[0]}
              </button>
            ))}
          </div>
        </div>
      ) : (
        <div className="space-y-6">
          {/* Comparison Cards Grid */}
          <div className={`grid grid-cols-1 md:grid-cols-${Math.min(comparisonList.length, 3)} gap-6`}>
            {comparisonList.map((zone) => {
              const isBestOverall = bestScoreZone?.id === zone.id;
              const isBestRent = bestRentZone?.id === zone.id;
              const isBestFootfall = bestFootfallZone?.id === zone.id;

              return (
                <div
                  key={zone.id}
                  className={`bg-slate-900 border rounded-2xl p-6 shadow-xl space-y-5 relative transition-all ${
                    isBestOverall
                      ? 'border-emerald-500/50 ring-1 ring-emerald-500/20'
                      : 'border-slate-800'
                  }`}
                >
                  {/* Winner Badges */}
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <div className="flex items-center gap-1.5">
                      {isBestOverall && (
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 flex items-center gap-1">
                          <Trophy className="w-3 h-3" /> Top Overall
                        </span>
                      )}
                      {isBestRent && (
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-indigo-500/10 text-indigo-400 border border-indigo-500/30">
                          Best Rent
                        </span>
                      )}
                      {isBestFootfall && (
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-blue-500/10 text-blue-400 border border-blue-500/30">
                          Top Traffic
                        </span>
                      )}
                    </div>

                    <button
                      onClick={() => onRemoveFromComparison(zone.id)}
                      className="text-slate-500 hover:text-rose-400 p-1 transition-colors"
                      title="Remove from comparison"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  {/* Header Title */}
                  <div>
                    <h3 className="text-lg font-bold text-slate-100">{zone.name}</h3>
                    <p className="text-xs text-slate-400 mt-0.5">
                      {zone.distanceFromFlagshipMiles} miles from Flagship ({zone.cannibalizationRisk} Cannibalization)
                    </p>
                  </div>

                  {/* Big Score */}
                  <div className="p-4 rounded-xl bg-slate-950/70 border border-slate-800/80 flex items-center justify-between">
                    <div>
                      <span className="text-xs text-slate-400">Opportunity Score</span>
                      <div className="text-3xl font-black text-emerald-400">
                        {zone.opportunityScore}
                        <span className="text-xs text-slate-500 font-normal">/100</span>
                      </div>
                    </div>
                    <div className="text-right">
                      <span className="text-xs text-slate-400">YoY Growth</span>
                      <div className="text-sm font-bold text-blue-400">
                        +{zone.growthVelocityPercent}%
                      </div>
                    </div>
                  </div>

                  {/* Metric Breakdown Rows */}
                  <div className="space-y-3 text-xs divide-y divide-slate-800/60 pt-1">
                    <div className="flex justify-between items-center pt-2">
                      <span className="text-slate-400 flex items-center gap-1">
                        <DollarSign className="w-3.5 h-3.5 text-emerald-400" /> Asking Rent:
                      </span>
                      <span className="font-bold text-slate-200">
                        ${zone.avgRentSqFt} / sq ft/yr
                      </span>
                    </div>

                    <div className="flex justify-between items-center pt-2">
                      <span className="text-slate-400 flex items-center gap-1">
                        <Users className="w-3.5 h-3.5 text-blue-400" /> Footfall Index:
                      </span>
                      <span className="font-bold text-slate-200">
                        {zone.footfallIndex} / 100
                      </span>
                    </div>

                    <div className="flex justify-between items-center pt-2">
                      <span className="text-slate-400 flex items-center gap-1">
                        <ShieldAlert className="w-3.5 h-3.5 text-amber-400" /> Competition:
                      </span>
                      <span className={`font-semibold ${
                        zone.saturationLevel === 'Low' ? 'text-emerald-400' : 'text-amber-400'
                      }`}>
                        {zone.competitorCount} rivals ({zone.saturationLevel})
                      </span>
                    </div>

                    <div className="flex justify-between items-center pt-2">
                      <span className="text-slate-400">Median Income:</span>
                      <span className="font-bold text-slate-200">{zone.medianHouseholdIncome}</span>
                    </div>

                    <div className="flex justify-between items-center pt-2">
                      <span className="text-slate-400">Est. Monthly Rent:</span>
                      <span className="font-bold text-slate-200">
                        ${Math.round((zone.avgRentSqFt * shop.storeSizeSqFt) / 12).toLocaleString()}/mo
                      </span>
                    </div>
                  </div>

                  {/* Ideal Anchors */}
                  <div className="p-3 rounded-xl bg-slate-950/40 border border-slate-800 text-xs space-y-1.5">
                    <span className="text-[11px] font-semibold text-slate-400 block">
                      Neighbor Anchors:
                    </span>
                    <div className="flex flex-wrap gap-1">
                      {zone.idealAnchors.map((a) => (
                        <span key={a} className="text-[10px] bg-slate-800 px-1.5 py-0.5 rounded text-slate-300">
                          {a}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Select as Primary Action */}
                  <button
                    onClick={() => onSelectPrimaryZone(zone)}
                    className="w-full py-2.5 px-4 bg-emerald-500/10 hover:bg-emerald-500/20 border border-emerald-500/30 text-emerald-300 font-bold rounded-xl text-xs transition-all flex items-center justify-center gap-1.5"
                  >
                    Set as Active Focus District
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              );
            })}
          </div>

          {/* Quick Trade-off Summary Box */}
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-3">
            <h3 className="text-sm font-bold text-slate-200 flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-emerald-400" />
              Strategic Trade-Off Synthesis
            </h3>
            <p className="text-xs text-slate-300 leading-relaxed">
              If your priority is <strong>maximizing walk-in volume immediately</strong>,{' '}
              <strong className="text-emerald-400">{bestFootfallZone?.name}</strong> is the strongest contender ({bestFootfallZone?.footfallIndex}/100 foot traffic).{' '}
              However, if <strong>conserving working capital and runway</strong> is critical,{' '}
              <strong className="text-blue-400">{bestRentZone?.name}</strong> provides a significantly lower lease burden (${bestRentZone?.avgRentSqFt}/sqft) with lower competitor saturation.
            </p>
          </div>
        </div>
      )}
    </div>
  );
};
