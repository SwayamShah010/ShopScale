import React, { useState } from 'react';
import {
  MapPin,
  TrendingUp,
  DollarSign,
  Users,
  ShieldAlert,
  Compass,
  Sparkles,
  Sliders,
  Layers,
  ArrowRight,
  Eye,
  Building,
  Navigation
} from 'lucide-react';
import { ShopProfile, TerritoryZone } from '../types';

interface TerritoryMapProps {
  shop: ShopProfile;
  territories: TerritoryZone[];
  selectedZone: TerritoryZone | null;
  onSelectZone: (zone: TerritoryZone) => void;
  onEvaluate: (zone: TerritoryZone) => void;
  onCompareToggle: (zone: TerritoryZone) => void;
  comparisonList: TerritoryZone[];
}

type MapLayer = 'opportunity' | 'footfall' | 'rent' | 'competition' | 'cannibalization';

export const TerritoryMap: React.FC<TerritoryMapProps> = ({
  shop,
  territories,
  selectedZone,
  onSelectZone,
  onEvaluate,
  onCompareToggle,
  comparisonList,
}) => {
  const [activeLayer, setActiveLayer] = useState<MapLayer>('opportunity');
  const [filterTag, setFilterTag] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [hoveredZone, setHoveredZone] = useState<TerritoryZone | null>(null);

  // Filter territories
  const filteredTerritories = territories.filter((zone) => {
    const matchesSearch =
      zone.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      zone.primaryAudience.toLowerCase().includes(searchQuery.toLowerCase()) ||
      zone.tags.some((t) => t.toLowerCase().includes(searchQuery.toLowerCase()));

    if (!matchesSearch) return false;

    if (filterTag === 'all') return true;
    if (filterTag === 'high-opportunity') return zone.opportunityScore >= 85;
    if (filterTag === 'low-saturation') return zone.saturationLevel === 'Low';
    if (filterTag === 'affordable-rent') return zone.avgRentSqFt <= 36;
    if (filterTag === 'high-footfall') return zone.footfallIndex >= 85;
    return true;
  });

  // Calculate distance between flagship and zone
  const getFlagshipDistance = (zone: TerritoryZone) => {
    const dx = zone.coordinates.x - shop.flagshipCoords.x;
    const dy = zone.coordinates.y - shop.flagshipCoords.y;
    // Map scale approximation: 10 units ~ 1.5 miles
    const approxMiles = Math.sqrt(dx * dx + dy * dy) * 0.15;
    return approxMiles.toFixed(1);
  };

  const getOpportunityColor = (score: number) => {
    if (score >= 88) return '#10b981'; // emerald
    if (score >= 80) return '#3b82f6'; // blue
    if (score >= 72) return '#f59e0b'; // amber
    return '#f43f5e'; // rose
  };

  return (
    <div className="flex flex-col lg:flex-row gap-6 w-full h-full min-h-[750px]">
      {/* Map Interactive Canvas Container */}
      <div className="flex-1 flex flex-col bg-slate-900/90 border border-slate-800 rounded-2xl overflow-hidden shadow-2xl relative">
        {/* Map Top Toolbar */}
        <div className="p-4 bg-slate-950/70 border-b border-slate-800/80 backdrop-blur-md flex flex-wrap items-center justify-between gap-3 z-10">
          <div className="flex items-center gap-2">
            <div className="p-2 bg-emerald-500/10 text-emerald-400 rounded-lg border border-emerald-500/20">
              <Compass className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-slate-100 flex items-center gap-2">
                Territory Geospatial Radar
                <span className="text-[11px] font-normal px-2 py-0.5 rounded-full bg-slate-800 text-slate-300 border border-slate-700">
                  {shop.city}
                </span>
              </h3>
              <p className="text-xs text-slate-400">
                Flagship: <span className="text-emerald-300 font-medium">{shop.flagshipDistrict}</span> • Analyzing {filteredTerritories.length} candidate districts
              </p>
            </div>
          </div>

          {/* Layer Selector */}
          <div className="flex items-center bg-slate-900 border border-slate-800 rounded-xl p-1 gap-1 text-xs">
            <button
              onClick={() => setActiveLayer('opportunity')}
              className={`px-3 py-1.5 rounded-lg font-medium transition-all flex items-center gap-1.5 ${
                activeLayer === 'opportunity'
                  ? 'bg-emerald-500 text-slate-950 shadow-md font-semibold'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <Sparkles className="w-3.5 h-3.5" />
              Opportunity Score
            </button>
            <button
              onClick={() => setActiveLayer('footfall')}
              className={`px-3 py-1.5 rounded-lg font-medium transition-all flex items-center gap-1.5 ${
                activeLayer === 'footfall'
                  ? 'bg-blue-500 text-white shadow-md font-semibold'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <Users className="w-3.5 h-3.5" />
              Foot Traffic
            </button>
            <button
              onClick={() => setActiveLayer('rent')}
              className={`px-3 py-1.5 rounded-lg font-medium transition-all flex items-center gap-1.5 ${
                activeLayer === 'rent'
                  ? 'bg-indigo-500 text-white shadow-md font-semibold'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <DollarSign className="w-3.5 h-3.5" />
              Rent $/sqft
            </button>
            <button
              onClick={() => setActiveLayer('competition')}
              className={`px-3 py-1.5 rounded-lg font-medium transition-all flex items-center gap-1.5 ${
                activeLayer === 'competition'
                  ? 'bg-amber-500 text-slate-950 shadow-md font-semibold'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <ShieldAlert className="w-3.5 h-3.5" />
              Competition
            </button>
            <button
              onClick={() => setActiveLayer('cannibalization')}
              className={`px-3 py-1.5 rounded-lg font-medium transition-all flex items-center gap-1.5 ${
                activeLayer === 'cannibalization'
                  ? 'bg-purple-500 text-white shadow-md font-semibold'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <Navigation className="w-3.5 h-3.5" />
              Cannibalization
            </button>
          </div>
        </div>

        {/* Filter Pills & Quick Search */}
        <div className="px-4 py-2 bg-slate-950/40 border-b border-slate-800/60 flex flex-wrap items-center justify-between gap-3 text-xs z-10">
          <div className="flex items-center gap-2 overflow-x-auto py-1">
            <span className="text-slate-500 flex items-center gap-1">
              <Sliders className="w-3 h-3" /> Quick Filter:
            </span>
            {[
              { id: 'all', label: 'All Districts' },
              { id: 'high-opportunity', label: 'Score 85+' },
              { id: 'low-saturation', label: 'Low Competition' },
              { id: 'affordable-rent', label: 'Rent < $36/sqft' },
              { id: 'high-footfall', label: 'High Footfall' },
            ].map((f) => (
              <button
                key={f.id}
                onClick={() => setFilterTag(f.id)}
                className={`px-2.5 py-1 rounded-md transition-colors ${
                  filterTag === f.id
                    ? 'bg-slate-800 text-emerald-400 font-medium border border-emerald-500/30'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
                }`}
              >
                {f.label}
              </button>
            ))}
          </div>

          <div className="relative min-w-[200px]">
            <input
              type="text"
              placeholder="Search district or vibe..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-1.5 text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-emerald-500"
            />
          </div>
        </div>

        {/* Spatial SVG Vector Map */}
        <div className="relative flex-1 w-full min-h-[480px] bg-[#0c121e] overflow-hidden select-none">
          <svg
            viewBox="0 0 100 100"
            className="w-full h-full object-cover"
            preserveAspectRatio="none"
          >
            <defs>
              {/* Radial gradient for map glow */}
              <radialGradient id="mapGlow" cx="50%" cy="50%" r="60%">
                <stop offset="0%" stopColor="#1e293b" stopOpacity="0.4" />
                <stop offset="100%" stopColor="#0b0f17" stopOpacity="0.9" />
              </radialGradient>

              {/* Grid pattern */}
              <pattern id="gridPattern" width="10" height="10" patternUnits="userSpaceOnUse">
                <path d="M 10 0 L 0 0 0 10" fill="none" stroke="#1e293b" strokeWidth="0.2" strokeDasharray="1,1" />
              </pattern>

              {/* Cannibalization buffer gradient */}
              <radialGradient id="buffer1Mile" cx="50%" cy="50%" r="50%">
                <stop offset="0%" stopColor="#ef4444" stopOpacity="0.25" />
                <stop offset="100%" stopColor="#ef4444" stopOpacity="0.02" />
              </radialGradient>
              <radialGradient id="buffer3Mile" cx="50%" cy="50%" r="50%">
                <stop offset="0%" stopColor="#f59e0b" stopOpacity="0.15" />
                <stop offset="100%" stopColor="#f59e0b" stopOpacity="0.01" />
              </radialGradient>
              <radialGradient id="buffer5Mile" cx="50%" cy="50%" r="50%">
                <stop offset="0%" stopColor="#10b981" stopOpacity="0.12" />
                <stop offset="100%" stopColor="#10b981" stopOpacity="0.0" />
              </radialGradient>
            </defs>

            {/* Background Grid & Ambient Land */}
            <rect width="100" height="100" fill="url(#mapGlow)" />
            <rect width="100" height="100" fill="url(#gridPattern)" />

            {/* Stylized River / Watercourse (Lady Bird Lake / River Basin) */}
            <path
              d="M -5 54 C 20 52, 35 62, 55 58 C 75 54, 88 64, 105 60 L 105 66 C 88 70, 75 60, 55 64 C 35 68, 20 58, -5 60 Z"
              fill="#0f2b48"
              opacity="0.75"
            />
            <path
              d="M -5 54 C 20 52, 35 62, 55 58 C 75 54, 88 64, 105 60"
              fill="none"
              stroke="#38bdf8"
              strokeWidth="0.4"
              opacity="0.6"
            />

            {/* Metro Transit Corridors & Major Expressways */}
            <line x1="38" y1="0" x2="38" y2="100" stroke="#334155" strokeWidth="0.6" strokeDasharray="1.5,1" />
            <line x1="0" y1="46" x2="100" y2="46" stroke="#334155" strokeWidth="0.6" strokeDasharray="1.5,1" />
            <path d="M 10 90 L 90 10" stroke="#1e293b" strokeWidth="0.8" />
            <path d="M 50 0 L 50 100" stroke="#1e293b" strokeWidth="0.5" />

            {/* Cannibalization Radar Rings around Flagship */}
            {activeLayer === 'cannibalization' && (
              <g>
                {/* 1.5 Mile High Cannibalization Zone */}
                <circle
                  cx={shop.flagshipCoords.x}
                  cy={shop.flagshipCoords.y}
                  r="12"
                  fill="url(#buffer1Mile)"
                  stroke="#ef4444"
                  strokeWidth="0.4"
                  strokeDasharray="1,1"
                />
                {/* 3.5 Mile Moderate Cannibalization Zone */}
                <circle
                  cx={shop.flagshipCoords.x}
                  cy={shop.flagshipCoords.y}
                  r="24"
                  fill="url(#buffer3Mile)"
                  stroke="#f59e0b"
                  strokeWidth="0.4"
                  strokeDasharray="1.5,1.5"
                />
                {/* 6.0 Mile Fresh Territory Safe Zone */}
                <circle
                  cx={shop.flagshipCoords.x}
                  cy={shop.flagshipCoords.y}
                  r="38"
                  fill="url(#buffer5Mile)"
                  stroke="#10b981"
                  strokeWidth="0.4"
                  strokeDasharray="2,2"
                />

                <text
                  x={shop.flagshipCoords.x + 13}
                  y={shop.flagshipCoords.y - 4}
                  fill="#f87171"
                  fontSize="2"
                  fontWeight="bold"
                >
                  1.5 mi (High Overlap)
                </text>
                <text
                  x={shop.flagshipCoords.x + 25}
                  y={shop.flagshipCoords.y - 4}
                  fill="#fbbf24"
                  fontSize="2"
                  fontWeight="bold"
                >
                  3.5 mi (Safe Buffer)
                </text>
                <text
                  x={shop.flagshipCoords.x + 39}
                  y={shop.flagshipCoords.y - 4}
                  fill="#34d399"
                  fontSize="2"
                  fontWeight="bold"
                >
                  6.0 mi (Fresh Customer Pool)
                </text>
              </g>
            )}

            {/* District Foot Traffic or Opportunity Heatmap Blobs */}
            {filteredTerritories.map((zone) => {
              let heatColor = '#10b981';
              let heatRadius = 10;
              let heatOpacity = 0.25;

              if (activeLayer === 'opportunity') {
                heatColor = getOpportunityColor(zone.opportunityScore);
                heatRadius = (zone.opportunityScore / 100) * 14;
                heatOpacity = 0.22;
              } else if (activeLayer === 'footfall') {
                heatColor = '#3b82f6';
                heatRadius = (zone.footfallIndex / 100) * 15;
                heatOpacity = 0.3;
              } else if (activeLayer === 'rent') {
                // Higher rent = darker purple/indigo
                heatColor = zone.avgRentSqFt > 50 ? '#ec4899' : '#6366f1';
                heatRadius = (zone.avgRentSqFt / 80) * 14;
                heatOpacity = 0.25;
              } else if (activeLayer === 'competition') {
                heatColor = zone.saturationLevel === 'Severe' ? '#ef4444' : zone.saturationLevel === 'High' ? '#f59e0b' : '#10b981';
                heatRadius = (zone.competitorCount / 12) * 16;
                heatOpacity = 0.28;
              }

              return (
                <circle
                  key={`heat-${zone.id}`}
                  cx={zone.coordinates.x}
                  cy={zone.coordinates.y}
                  r={heatRadius}
                  fill={heatColor}
                  opacity={heatOpacity}
                  className="transition-all duration-500 ease-out pointer-events-none"
                />
              );
            })}

            {/* Flagship Store Marker */}
            <g transform={`translate(${shop.flagshipCoords.x}, ${shop.flagshipCoords.y})`}>
              {/* Radar pulse */}
              <circle r="3" fill="#10b981" opacity="0.3">
                <animate attributeName="r" values="3;7;3" dur="2.5s" repeatCount="indefinite" />
                <animate attributeName="opacity" values="0.4;0.05;0.4" dur="2.5s" repeatCount="indefinite" />
              </circle>
              <circle r="2.2" fill="#0f172a" stroke="#10b981" strokeWidth="0.8" />
              <circle r="1" fill="#10b981" />
              <text
                x="3"
                y="1"
                fill="#34d399"
                fontSize="2.5"
                fontWeight="bold"
                className="select-none filter drop-shadow-[0_1px_2px_rgba(0,0,0,0.8)]"
              >
                ★ Flagship: {shop.name.slice(0, 16)}...
              </text>
            </g>

            {/* Territory Pins */}
            {filteredTerritories.map((zone) => {
              const isSelected = selectedZone?.id === zone.id;
              const isHovered = hoveredZone?.id === zone.id;
              const pinColor = getOpportunityColor(zone.opportunityScore);

              return (
                <g
                  key={`pin-${zone.id}`}
                  transform={`translate(${zone.coordinates.x}, ${zone.coordinates.y})`}
                  className="cursor-pointer transition-transform duration-200"
                  onClick={() => onSelectZone(zone)}
                  onMouseEnter={() => setHoveredZone(zone)}
                  onMouseLeave={() => setHoveredZone(null)}
                >
                  {/* Selection Ring */}
                  {isSelected && (
                    <circle
                      r="4.2"
                      fill="none"
                      stroke="#ffffff"
                      strokeWidth="0.6"
                      strokeDasharray="1,1"
                      className="animate-spin-slow"
                    />
                  )}

                  {/* Pin Body */}
                  <circle
                    r={isSelected || isHovered ? "3.2" : "2.4"}
                    fill="#0f172a"
                    stroke={pinColor}
                    strokeWidth={isSelected ? "1.2" : "0.8"}
                  />

                  {/* Inner Score Indicator */}
                  <circle
                    r="1.2"
                    fill={pinColor}
                  />

                  {/* Label */}
                  <text
                    x="0"
                    y={isSelected || isHovered ? "-4.2" : "-3.2"}
                    textAnchor="middle"
                    fill={isSelected ? '#ffffff' : '#cbd5e1'}
                    fontSize={isSelected || isHovered ? "2.6" : "2.2"}
                    fontWeight={isSelected ? "800" : "600"}
                    className="select-none drop-shadow-[0_2px_4px_rgba(0,0,0,0.9)]"
                  >
                    {zone.name.split(' ')[0]}
                  </text>

                  {/* Small Score Pill */}
                  <rect
                    x="-3"
                    y="3"
                    width="6"
                    height="2.4"
                    rx="1.2"
                    fill="#1e293b"
                    stroke={pinColor}
                    strokeWidth="0.4"
                  />
                  <text
                    x="0"
                    y="4.7"
                    textAnchor="middle"
                    fill="#ffffff"
                    fontSize="1.6"
                    fontWeight="bold"
                  >
                    {zone.opportunityScore}%
                  </text>
                </g>
              );
            })}
          </svg>

          {/* Map Layer Legend Overlay */}
          <div className="absolute bottom-4 left-4 bg-slate-950/80 backdrop-blur-md border border-slate-800 p-3 rounded-xl text-xs space-y-1.5 shadow-xl max-w-xs">
            <div className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
              <Layers className="w-3.5 h-3.5 text-emerald-400" />
              Layer: {activeLayer.toUpperCase()}
            </div>
            {activeLayer === 'opportunity' && (
              <div className="flex items-center gap-3 text-[11px]">
                <span className="flex items-center gap-1"><span className="w-2.5 h-2.5 rounded-full bg-emerald-500"></span> 88+ Prime</span>
                <span className="flex items-center gap-1"><span className="w-2.5 h-2.5 rounded-full bg-blue-500"></span> 80-87 High</span>
                <span className="flex items-center gap-1"><span className="w-2.5 h-2.5 rounded-full bg-amber-500"></span> 72-79 Moderate</span>
              </div>
            )}
            {activeLayer === 'cannibalization' && (
              <div className="text-[11px] text-slate-300 space-y-0.5">
                <div className="text-red-400">● Inside 1.5 mi: High customer poaching danger</div>
                <div className="text-amber-400">● 1.5 - 3.5 mi: Balanced crossover territory</div>
                <div className="text-emerald-400">● 3.5+ mi: 100% Incremental market expansion</div>
              </div>
            )}
            {activeLayer === 'footfall' && (
              <div className="text-[11px] text-slate-300">
                Pulsing blue indicates pedestrian volume index relative to city core.
              </div>
            )}
            {activeLayer === 'rent' && (
              <div className="text-[11px] text-slate-300">
                Commercial retail average asking rate (annual $/sq ft).
              </div>
            )}
            {activeLayer === 'competition' && (
              <div className="text-[11px] text-slate-300">
                Red/Orange highlights high direct competitor saturation in same category.
              </div>
            )}
          </div>

          {/* Floating Hover Tooltip if hovering a pin */}
          {hoveredZone && !selectedZone && (
            <div
              className="absolute pointer-events-none bg-slate-950/95 border border-slate-700 p-3 rounded-xl shadow-2xl text-xs z-30 transition-all max-w-[240px]"
              style={{
                left: `${Math.min(75, Math.max(10, hoveredZone.coordinates.x))}%`,
                top: `${Math.min(70, Math.max(15, hoveredZone.coordinates.y - 12))}%`,
              }}
            >
              <div className="font-bold text-slate-100 flex items-center justify-between">
                <span>{hoveredZone.name}</span>
                <span className="text-emerald-400 font-extrabold">{hoveredZone.opportunityScore}%</span>
              </div>
              <div className="text-slate-400 mt-1">
                Footfall: <strong className="text-slate-200">{hoveredZone.footfallIndex}/100</strong> • Rent: <strong className="text-slate-200">${hoveredZone.avgRentSqFt}/sqft</strong>
              </div>
              <div className="text-slate-500 mt-0.5">
                Distance: {getFlagshipDistance(hoveredZone)} mi from Flagship
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Selected Territory Intelligence Drawer */}
      <div className="w-full lg:w-96 flex flex-col bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-2xl">
        {selectedZone ? (
          <div className="flex flex-col h-full">
            {/* Drawer Header */}
            <div className="p-5 bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 border-b border-slate-800">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <span className="text-[11px] uppercase tracking-wider font-semibold text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-full border border-emerald-500/20">
                    {selectedZone.recommendedType}
                  </span>
                  <h3 className="text-lg font-bold text-slate-100 mt-1.5 leading-snug">
                    {selectedZone.name}
                  </h3>
                  <div className="flex items-center gap-2 text-xs text-slate-400 mt-1">
                    <MapPin className="w-3.5 h-3.5 text-slate-500" />
                    <span>{selectedZone.city}</span>
                    <span>•</span>
                    <span className="text-emerald-400 font-medium">
                      {selectedZone.distanceFromFlagshipMiles} mi from Flagship
                    </span>
                  </div>
                </div>

                <div className="flex flex-col items-end">
                  <div className="text-2xl font-black text-emerald-400">
                    {selectedZone.opportunityScore}
                    <span className="text-xs text-slate-500 font-normal">/100</span>
                  </div>
                  <span className="text-[10px] text-slate-400 uppercase tracking-wider">
                    Score
                  </span>
                </div>
              </div>

              {/* Tag Badges */}
              <div className="flex flex-wrap gap-1.5 mt-3">
                {selectedZone.tags.map((tag) => (
                  <span
                    key={tag}
                    className="text-[10px] px-2 py-0.5 rounded-md bg-slate-800 text-slate-300 border border-slate-700/60"
                  >
                    #{tag}
                  </span>
                ))}
              </div>
            </div>

            {/* Quick Metrics Grid */}
            <div className="p-5 flex-1 overflow-y-auto space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <div className="p-3 rounded-xl bg-slate-950/60 border border-slate-800/80">
                  <div className="text-[11px] text-slate-400 flex items-center gap-1">
                    <Users className="w-3 h-3 text-blue-400" /> Footfall Index
                  </div>
                  <div className="text-base font-bold text-slate-100 mt-0.5">
                    {selectedZone.footfallIndex} <span className="text-xs text-slate-500 font-normal">/ 100</span>
                  </div>
                  <div className="text-[10px] text-emerald-400 mt-0.5">
                    +{selectedZone.growthVelocityPercent}% YoY Growth
                  </div>
                </div>

                <div className="p-3 rounded-xl bg-slate-950/60 border border-slate-800/80">
                  <div className="text-[11px] text-slate-400 flex items-center gap-1">
                    <DollarSign className="w-3 h-3 text-emerald-400" /> Avg Asking Rent
                  </div>
                  <div className="text-base font-bold text-slate-100 mt-0.5">
                    ${selectedZone.avgRentSqFt} <span className="text-xs text-slate-500 font-normal">/sq ft/yr</span>
                  </div>
                  <div className="text-[10px] text-slate-400 mt-0.5">
                    ~${Math.round((selectedZone.avgRentSqFt * shop.storeSizeSqFt) / 12).toLocaleString()}/mo
                  </div>
                </div>

                <div className="p-3 rounded-xl bg-slate-950/60 border border-slate-800/80">
                  <div className="text-[11px] text-slate-400 flex items-center gap-1">
                    <ShieldAlert className="w-3 h-3 text-amber-400" /> Direct Competitors
                  </div>
                  <div className="text-base font-bold text-slate-100 mt-0.5">
                    {selectedZone.competitorCount} <span className="text-xs text-slate-500 font-normal">outlets</span>
                  </div>
                  <div className={`text-[10px] font-medium mt-0.5 ${
                    selectedZone.saturationLevel === 'Low' ? 'text-emerald-400' : selectedZone.saturationLevel === 'Moderate' ? 'text-amber-400' : 'text-rose-400'
                  }`}>
                    {selectedZone.saturationLevel} Saturation
                  </div>
                </div>

                <div className="p-3 rounded-xl bg-slate-950/60 border border-slate-800/80">
                  <div className="text-[11px] text-slate-400 flex items-center gap-1">
                    <Navigation className="w-3 h-3 text-purple-400" /> Cannibalization
                  </div>
                  <div className="text-base font-bold text-slate-100 mt-0.5">
                    {selectedZone.cannibalizationRisk}
                  </div>
                  <div className="text-[10px] text-slate-400 mt-0.5">
                    {selectedZone.distanceFromFlagshipMiles} mi radius
                  </div>
                </div>
              </div>

              {/* Demographics & Target Persona */}
              <div className="p-3.5 rounded-xl bg-slate-950/40 border border-slate-800 space-y-2">
                <div className="text-xs font-semibold text-slate-300 flex items-center gap-1.5">
                  <Users className="w-3.5 h-3.5 text-blue-400" /> Audience & Income
                </div>
                <div className="text-xs text-slate-300">
                  <strong>Median Income:</strong> {selectedZone.medianHouseholdIncome}
                </div>
                <div className="text-xs text-slate-400 leading-relaxed">
                  {selectedZone.primaryAudience}
                </div>
              </div>

              {/* Ideal Anchor Neighbors */}
              <div className="p-3.5 rounded-xl bg-slate-950/40 border border-slate-800 space-y-2">
                <div className="text-xs font-semibold text-slate-300 flex items-center gap-1.5">
                  <Building className="w-3.5 h-3.5 text-emerald-400" /> Key Anchor Magnets
                </div>
                <div className="flex flex-wrap gap-1.5">
                  {selectedZone.idealAnchors.map((anchor) => (
                    <span
                      key={anchor}
                      className="text-[11px] px-2 py-1 rounded bg-slate-900 border border-slate-700 text-slate-300"
                    >
                      ✓ {anchor}
                    </span>
                  ))}
                </div>
              </div>

              {/* District Overview Note */}
              <p className="text-xs text-slate-400 leading-relaxed italic bg-slate-950/20 p-2.5 rounded-lg border border-slate-800/60">
                "{selectedZone.description}"
              </p>
            </div>

            {/* Bottom Actions */}
            <div className="p-4 bg-slate-950/80 border-t border-slate-800 space-y-2">
              <button
                onClick={() => onEvaluate(selectedZone)}
                className="w-full py-2.5 px-4 bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-slate-950 font-bold rounded-xl shadow-lg transition-all flex items-center justify-center gap-2 text-sm"
              >
                <Sparkles className="w-4 h-4" />
                Run Full AI Territory Evaluation
                <ArrowRight className="w-4 h-4" />
              </button>

              <button
                onClick={() => onCompareToggle(selectedZone)}
                className={`w-full py-2 px-3 rounded-xl border text-xs font-semibold transition-all flex items-center justify-center gap-1.5 ${
                  comparisonList.some((c) => c.id === selectedZone.id)
                    ? 'bg-blue-500/20 border-blue-500/50 text-blue-300'
                    : 'bg-slate-800 border-slate-700 text-slate-300 hover:bg-slate-700'
                }`}
              >
                {comparisonList.some((c) => c.id === selectedZone.id)
                  ? '✓ Added to Comparison (View Comparator)'
                  : '+ Add to Location Comparison Matrix'}
              </button>
            </div>
          </div>
        ) : (
          <div className="flex-1 flex flex-col items-center justify-center p-8 text-center text-slate-500 space-y-3">
            <div className="p-4 rounded-full bg-slate-950 border border-slate-800 text-slate-600">
              <MapPin className="w-8 h-8" />
            </div>
            <h4 className="text-sm font-semibold text-slate-300">No District Selected</h4>
            <p className="text-xs text-slate-500 max-w-xs leading-relaxed">
              Click any pin or heat cluster on the geospatial map to view demographics, competitor saturation, rent metrics, and run deep AI expansion audits.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};
