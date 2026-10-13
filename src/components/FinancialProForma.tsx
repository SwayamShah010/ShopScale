import React, { useState, useId } from 'react';
import {
  DollarSign,
  TrendingUp,
  Sliders,
  AlertCircle,
  CheckCircle,
  HelpCircle,
  BarChart3,
  Calendar,
  Layers,
  ArrowUpRight,
  ShieldCheck,
  RefreshCcw
} from 'lucide-react';
import { ShopProfile, TerritoryZone } from '../types';

interface FinancialProFormaProps {
  shop: ShopProfile;
  zone: TerritoryZone;
  onExportDossier?: () => void;
}

export const FinancialProForma: React.FC<FinancialProFormaProps> = ({ shop, zone }) => {
  // Configurable unit economics inputs initialized from shop & zone profile
  const [storeSize, setStoreSize] = useState<number>(shop.storeSizeSqFt || 1200);
  const [rentSqFtAnnual, setRentSqFtAnnual] = useState<number>(zone.avgRentSqFt || 38);
  const [dailyPassersby, setDailyPassersby] = useState<number>(
    Math.round(zone.footfallIndex * 45) // e.g. 88 * 45 = 3960 people/day
  );
  const [captureRatePercent, setCaptureRatePercent] = useState<number>(3.5); // 3.5% walk-in conversion
  const [averageTicket, setAverageTicket] = useState<number>(shop.averageTicket || 14.50);
  const [grossMarginPercent, setGrossMarginPercent] = useState<number>(68); // 68% margin (32% COGS)
  const [staffFTE, setStaffFTE] = useState<number>(3.5); // 3.5 FTEs
  const [hourlyWage, setHourlyWage] = useState<number>(18.50);
  const [initialCapex, setInitialCapex] = useState<number>(Math.round(storeSize * 105)); // ~$105/sqft fitout
  const [camTaxesPercent, setCamTaxesPercent] = useState<number>(20); // 20% NNN/CAM on top of base rent
  const [scenario, setScenario] = useState<'conservative' | 'base' | 'growth'>('base');

  const storeSizeId = useId();
  const rentSqFtId = useId();
  const dailyPassersbyId = useId();
  const captureRateId = useId();
  const averageTicketId = useId();
  const grossMarginId = useId();
  const staffFTEId = useId();
  const hourlyWageId = useId();
  const initialCapexId = useId();

  // Multiplier for scenario testing
  const scenarioMultiplier = scenario === 'conservative' ? 0.8 : scenario === 'growth' ? 1.25 : 1.0;

  // Monthly Calculations (30 days/month)
  const dailyCustomers = Math.round(dailyPassersby * (captureRatePercent / 100) * scenarioMultiplier);
  const monthlyTransactions = dailyCustomers * 30;
  const monthlyGrossRevenue = Math.round(monthlyTransactions * averageTicket);

  // Cost of Goods Sold
  const monthlyCOGS = Math.round(monthlyGrossRevenue * ((100 - grossMarginPercent) / 100));

  // Occupancy Costs (Base Rent + NNN/CAM)
  const monthlyBaseRent = Math.round((storeSize * rentSqFtAnnual) / 12);
  const monthlyNNNCam = Math.round(monthlyBaseRent * (camTaxesPercent / 100));
  const totalMonthlyOccupancy = monthlyBaseRent + monthlyNNNCam;

  // Labor & Payroll (FTE * 40 hrs/wk * 4.33 wks/mo * wage * 1.15 payroll tax burden)
  const monthlyLaborHours = staffFTE * 40 * 4.33;
  const monthlyGrossPayroll = monthlyLaborHours * hourlyWage;
  const totalMonthlyLabor = Math.round(monthlyGrossPayroll * 1.15); // +15% payroll tax & worker comp

  // Utilities, Software POS, Insurance, and Local Marketing
  const monthlyUtilitiesAndTech = Math.round(storeSize * 1.35 + 450); // Power, water, POS, internet
  const monthlyInsuranceAndOps = 650;
  const monthlyLocalMarketing = Math.max(800, Math.round(monthlyGrossRevenue * 0.03)); // 3% of sales

  // Total Expenses & Net Profit
  const totalMonthlyOpex =
    monthlyCOGS +
    totalMonthlyOccupancy +
    totalMonthlyLabor +
    monthlyUtilitiesAndTech +
    monthlyInsuranceAndOps +
    monthlyLocalMarketing;

  const monthlyNetOperatingIncome = monthlyGrossRevenue - totalMonthlyOpex;
  const netProfitMarginPercent = monthlyGrossRevenue > 0
    ? ((monthlyNetOperatingIncome / monthlyGrossRevenue) * 100).toFixed(1)
    : '0.0';

  // Occupancy cost ratio (Golden rule: <12-14% of gross sales)
  const occupancyRatio = monthlyGrossRevenue > 0
    ? ((totalMonthlyOccupancy / monthlyGrossRevenue) * 100).toFixed(1)
    : '0';

  // Breakeven Horizon in months
  const monthsToBreakeven = monthlyNetOperatingIncome > 0
    ? (initialCapex / monthlyNetOperatingIncome).toFixed(1)
    : 'Unprofitable';

  // Breakeven Daily Sales required
  const fixedMonthlyCosts = totalMonthlyOccupancy + totalMonthlyLabor + monthlyUtilitiesAndTech + monthlyInsuranceAndOps + monthlyLocalMarketing;
  const breakevenMonthlyRevenue = Math.round(fixedMonthlyCosts / (grossMarginPercent / 100));
  const breakevenDailyCustomers = Math.round(breakevenMonthlyRevenue / 30 / averageTicket);

  return (
    <div className="space-y-6 w-full">
      {/* Header & Scenario Switcher */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-2xl flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs uppercase font-bold tracking-wider px-2.5 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
              Pro Forma Model
            </span>
            <span className="text-xs text-slate-400">
              Target Site: <strong className="text-slate-200">{zone.name}</strong>
            </span>
          </div>
          <h2 className="text-xl lg:text-2xl font-bold text-slate-100 mt-1">
            Unit Economics & Breakeven Simulator
          </h2>
          <p className="text-xs text-slate-400">
            Real-time retail sensitivity model to test store size, lease asking prices, staffing, and customer flow.
          </p>
        </div>

        {/* Scenario Toggle */}
        <div className="flex items-center bg-slate-950 border border-slate-800 rounded-xl p-1 gap-1 text-xs">
          <span className="text-slate-500 px-2 font-medium">Scenario:</span>
          <button
            onClick={() => setScenario('conservative')}
            className={`px-3 py-1.5 rounded-lg font-medium transition-all ${
              scenario === 'conservative'
                ? 'bg-amber-500 text-slate-950 font-bold'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Conservative (-20%)
          </button>
          <button
            onClick={() => setScenario('base')}
            className={`px-3 py-1.5 rounded-lg font-medium transition-all ${
              scenario === 'base'
                ? 'bg-emerald-500 text-slate-950 font-bold'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Base Target (100%)
          </button>
          <button
            onClick={() => setScenario('growth')}
            className={`px-3 py-1.5 rounded-lg font-medium transition-all ${
              scenario === 'growth'
                ? 'bg-blue-500 text-white font-bold'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Growth (+25%)
          </button>
        </div>
      </div>

      {/* KPI Highlights Bar */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-lg">
          <div className="text-xs text-slate-400 font-medium">Monthly Gross Revenue</div>
          <div className="text-2xl font-black text-slate-100 mt-1">
            ${monthlyGrossRevenue.toLocaleString()}
          </div>
          <div className="text-xs text-slate-500 mt-1">
            ~{dailyCustomers} daily buyers @ ${averageTicket} ticket
          </div>
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-lg">
          <div className="text-xs text-slate-400 font-medium">Net Operating Profit</div>
          <div className={`text-2xl font-black mt-1 ${monthlyNetOperatingIncome >= 0 ? 'text-emerald-400' : 'text-rose-400'}`}>
            ${monthlyNetOperatingIncome.toLocaleString()}
          </div>
          <div className="text-xs text-slate-500 mt-1">
            {netProfitMarginPercent}% net margin
          </div>
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-lg">
          <div className="text-xs text-slate-400 font-medium">Payback Horizon</div>
          <div className="text-2xl font-black text-teal-300 mt-1">
            {monthsToBreakeven} {typeof monthsToBreakeven === 'string' && monthsToBreakeven.includes('Unprofitable') ? '' : 'Mo'}
          </div>
          <div className="text-xs text-slate-500 mt-1">
            Capex: ${initialCapex.toLocaleString()}
          </div>
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-lg">
          <div className="text-xs text-slate-400 font-medium">Rent Burden Index</div>
          <div className={`text-2xl font-black mt-1 ${
            Number(occupancyRatio) <= 12 ? 'text-emerald-400' : Number(occupancyRatio) <= 16 ? 'text-amber-400' : 'text-rose-400'
          }`}>
            {occupancyRatio}%
          </div>
          <div className="text-xs text-slate-500 mt-1">
            {Number(occupancyRatio) <= 12 ? 'Healthy (<12% benchmark)' : 'Caution: high occupancy load'}
          </div>
        </div>
      </div>

      {/* Main Grid: Interactive Sliders (Left) & P&L Statement (Right) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Sliders Configuration Column */}
        <div className="lg:col-span-7 bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-6">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <h3 className="text-base font-bold text-slate-100 flex items-center gap-2">
              <Sliders className="w-4 h-4 text-emerald-400" />
              Store Size & Location Parameters
            </h3>
            <button
              onClick={() => {
                setStoreSize(shop.storeSizeSqFt);
                setRentSqFtAnnual(zone.avgRentSqFt);
                setCaptureRatePercent(3.5);
                setAverageTicket(shop.averageTicket);
                setStaffFTE(3.5);
              }}
              className="text-xs text-slate-400 hover:text-slate-200 flex items-center gap-1 transition-colors"
            >
              <RefreshCcw className="w-3 h-3" /> Reset to Defaults
            </button>
          </div>

          <div className="space-y-5">
            {/* Store Size Slider */}
            <div className="space-y-1.5">
              <div className="flex justify-between text-xs">
                <label htmlFor={storeSizeId} className="text-slate-300 font-medium cursor-pointer">Store Floor Area (Sq Ft)</label>
                <span className="font-bold text-emerald-400">{storeSize.toLocaleString()} sq ft</span>
              </div>
              <input
                id={storeSizeId}
                type="range"
                min="400"
                max="3500"
                step="50"
                value={storeSize}
                onChange={(e) => setStoreSize(Number(e.target.value))}
                className="w-full accent-emerald-500 bg-slate-800 h-2 rounded-lg cursor-pointer"
              />
              <div className="flex justify-between text-[10px] text-slate-500">
                <span>Micro (400 sqft)</span>
                <span>Standard (1,200 sqft)</span>
                <span>Flagship (3,500 sqft)</span>
              </div>
            </div>

            {/* Rent Asking Rate Slider */}
            <div className="space-y-1.5">
              <div className="flex justify-between text-xs">
                <label htmlFor={rentSqFtId} className="text-slate-300 font-medium cursor-pointer">Commercial Asking Rent ($/sq ft / year)</label>
                <span className="font-bold text-emerald-400">${rentSqFtAnnual} / sq ft</span>
              </div>
              <input
                id={rentSqFtId}
                type="range"
                min="18"
                max="85"
                step="1"
                value={rentSqFtAnnual}
                onChange={(e) => setRentSqFtAnnual(Number(e.target.value))}
                className="w-full accent-emerald-500 bg-slate-800 h-2 rounded-lg cursor-pointer"
              />
              <div className="flex justify-between text-[10px] text-slate-500">
                <span>Suburban ($18)</span>
                <span>District Avg (${zone.avgRentSqFt})</span>
                <span>Prime Promenade ($85)</span>
              </div>
            </div>

            {/* Daily Passerby Footfall Slider */}
            <div className="space-y-1.5">
              <div className="flex justify-between text-xs">
                <label htmlFor={dailyPassersbyId} className="text-slate-300 font-medium cursor-pointer">Estimated Daily Footfall (Passersby)</label>
                <span className="font-bold text-blue-400">{dailyPassersby.toLocaleString()} people/day</span>
              </div>
              <input
                id={dailyPassersbyId}
                type="range"
                min="800"
                max="12000"
                step="200"
                value={dailyPassersby}
                onChange={(e) => setDailyPassersby(Number(e.target.value))}
                className="w-full accent-blue-500 bg-slate-800 h-2 rounded-lg cursor-pointer"
              />
            </div>

            {/* Walk-in Capture & Conversion Rate */}
            <div className="space-y-1.5">
              <div className="flex justify-between text-xs">
                <label htmlFor={captureRateId} className="text-slate-300 font-medium cursor-pointer">Walk-in Conversion / Capture Rate</label>
                <span className="font-bold text-blue-400">{captureRatePercent}% ({dailyCustomers} customers/day)</span>
              </div>
              <input
                id={captureRateId}
                type="range"
                min="0.5"
                max="10.0"
                step="0.1"
                value={captureRatePercent}
                onChange={(e) => setCaptureRatePercent(Number(e.target.value))}
                className="w-full accent-blue-500 bg-slate-800 h-2 rounded-lg cursor-pointer"
              />
            </div>

            {/* Average Order Value (Ticket) */}
            <div className="space-y-1.5">
              <div className="flex justify-between text-xs">
                <label htmlFor={averageTicketId} className="text-slate-300 font-medium cursor-pointer">Average Ticket / Order Value ($)</label>
                <span className="font-bold text-emerald-400">${averageTicket.toFixed(2)}</span>
              </div>
              <input
                id={averageTicketId}
                type="range"
                min="4"
                max="120"
                step="0.5"
                value={averageTicket}
                onChange={(e) => setAverageTicket(Number(e.target.value))}
                className="w-full accent-emerald-500 bg-slate-800 h-2 rounded-lg cursor-pointer"
              />
            </div>

            {/* Gross Margin % */}
            <div className="space-y-1.5">
              <div className="flex justify-between text-xs">
                <label htmlFor={grossMarginId} className="text-slate-300 font-medium cursor-pointer">Gross Product Margin %</label>
                <span className="font-bold text-teal-400">{grossMarginPercent}%</span>
              </div>
              <input
                id={grossMarginId}
                type="range"
                min="40"
                max="88"
                step="1"
                value={grossMarginPercent}
                onChange={(e) => setGrossMarginPercent(Number(e.target.value))}
                className="w-full accent-teal-500 bg-slate-800 h-2 rounded-lg cursor-pointer"
              />
              <div className="text-[10px] text-slate-500">
                COGS is {100 - grossMarginPercent}% of sales (${monthlyCOGS.toLocaleString()}/mo)
              </div>
            </div>

            {/* Staffing & Wage */}
            <div className="grid grid-cols-2 gap-4 pt-2 border-t border-slate-800">
              <div className="space-y-1.5">
                <div className="flex justify-between text-xs">
                  <label htmlFor={staffFTEId} className="text-slate-300 font-medium cursor-pointer">Staff (FTE)</label>
                  <span className="font-bold text-indigo-400">{staffFTE} FTE</span>
                </div>
                <input
                  id={staffFTEId}
                  type="range"
                  min="1"
                  max="10"
                  step="0.5"
                  value={staffFTE}
                  onChange={(e) => setStaffFTE(Number(e.target.value))}
                  className="w-full accent-indigo-500 bg-slate-800 h-2 rounded-lg cursor-pointer"
                />
              </div>

              <div className="space-y-1.5">
                <div className="flex justify-between text-xs">
                  <label htmlFor={hourlyWageId} className="text-slate-300 font-medium cursor-pointer">Avg Hourly Wage</label>
                  <span className="font-bold text-indigo-400">${hourlyWage.toFixed(2)}/hr</span>
                </div>
                <input
                  id={hourlyWageId}
                  type="range"
                  min="14"
                  max="35"
                  step="0.5"
                  value={hourlyWage}
                  onChange={(e) => setHourlyWage(Number(e.target.value))}
                  className="w-full accent-indigo-500 bg-slate-800 h-2 rounded-lg cursor-pointer"
                />
              </div>
            </div>

            {/* Initial Capex Fit-out */}
            <div className="space-y-1.5 pt-2 border-t border-slate-800">
              <div className="flex justify-between text-xs">
                <label htmlFor={initialCapexId} className="text-slate-300 font-medium cursor-pointer">Initial Buildout & Fit-out Capex</label>
                <span className="font-bold text-slate-200">${initialCapex.toLocaleString()} (${Math.round(initialCapex / storeSize)}/sqft)</span>
              </div>
              <input
                id={initialCapexId}
                type="range"
                min="25000"
                max="300000"
                step="5000"
                value={initialCapex}
                onChange={(e) => setInitialCapex(Number(e.target.value))}
                className="w-full accent-emerald-500 bg-slate-800 h-2 rounded-lg cursor-pointer"
              />
            </div>
          </div>
        </div>

        {/* P&L Monthly Pro Forma Statement (Right) */}
        <div className="lg:col-span-5 bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl flex flex-col justify-between space-y-6">
          <div>
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h3 className="text-base font-bold text-slate-100 flex items-center gap-2">
                <BarChart3 className="w-4 h-4 text-emerald-400" />
                Monthly Pro Forma P&L
              </h3>
              <span className="text-xs text-slate-400 uppercase tracking-wider font-semibold">
                30-Day Model
              </span>
            </div>

            {/* Statement Items */}
            <div className="mt-4 space-y-3 text-xs">
              <div className="flex justify-between items-center py-1.5 border-b border-slate-800 font-bold text-sm text-slate-100">
                <span>Gross Monthly Revenue</span>
                <span className="text-emerald-400">${monthlyGrossRevenue.toLocaleString()}</span>
              </div>

              <div className="flex justify-between items-center py-1 text-slate-300">
                <span className="flex items-center gap-1.5 text-slate-400">
                  <span className="w-2 h-2 rounded-full bg-teal-400"></span> Less: COGS ({100 - grossMarginPercent}%)
                </span>
                <span className="text-slate-200">-${monthlyCOGS.toLocaleString()}</span>
              </div>

              <div className="flex justify-between items-center py-1 font-semibold text-slate-200 bg-slate-950/40 px-2 rounded">
                <span>Gross Profit</span>
                <span className="text-emerald-400">${(monthlyGrossRevenue - monthlyCOGS).toLocaleString()}</span>
              </div>

              {/* Operating Expenses */}
              <div className="pt-2 text-[11px] font-bold uppercase tracking-wider text-slate-500">
                Operating Expenses (OPEX)
              </div>

              <div className="flex justify-between items-center py-1 text-slate-300">
                <span className="flex items-center gap-1.5 text-slate-400">
                  <span className="w-2 h-2 rounded-full bg-blue-400"></span> Base Rent & CAM
                </span>
                <span className="text-slate-200">-${totalMonthlyOccupancy.toLocaleString()}</span>
              </div>

              <div className="flex justify-between items-center py-1 text-slate-300">
                <span className="flex items-center gap-1.5 text-slate-400">
                  <span className="w-2 h-2 rounded-full bg-indigo-400"></span> Payroll & Labor ({staffFTE} FTE)
                </span>
                <span className="text-slate-200">-${totalMonthlyLabor.toLocaleString()}</span>
              </div>

              <div className="flex justify-between items-center py-1 text-slate-300">
                <span className="flex items-center gap-1.5 text-slate-400">
                  <span className="w-2 h-2 rounded-full bg-purple-400"></span> Utilities, POS & Tech
                </span>
                <span className="text-slate-200">-${monthlyUtilitiesAndTech.toLocaleString()}</span>
              </div>

              <div className="flex justify-between items-center py-1 text-slate-300">
                <span className="flex items-center gap-1.5 text-slate-400">
                  <span className="w-2 h-2 rounded-full bg-amber-400"></span> Local Marketing & Promos
                </span>
                <span className="text-slate-200">-${monthlyLocalMarketing.toLocaleString()}</span>
              </div>

              <div className="flex justify-between items-center py-1 text-slate-300">
                <span className="flex items-center gap-1.5 text-slate-400">
                  <span className="w-2 h-2 rounded-full bg-slate-400"></span> Insurance & Licensing
                </span>
                <span className="text-slate-200">-${monthlyInsuranceAndOps.toLocaleString()}</span>
              </div>

              <div className="flex justify-between items-center py-1.5 border-t border-slate-800 font-semibold text-slate-300">
                <span>Total Monthly Expenses</span>
                <span className="text-rose-400">-${totalMonthlyOpex.toLocaleString()}</span>
              </div>

              {/* Net Profit Banner */}
              <div className={`p-4 rounded-xl border flex items-center justify-between mt-3 ${
                monthlyNetOperatingIncome >= 0
                  ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-300'
                  : 'bg-rose-500/10 border-rose-500/30 text-rose-300'
              }`}>
                <div>
                  <div className="text-[11px] uppercase tracking-wider font-bold">
                    Net Operating Income (NOI)
                  </div>
                  <div className="text-xs opacity-80">
                    After all occupancy, staff & product costs
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-xl font-black">
                    ${monthlyNetOperatingIncome.toLocaleString()}
                  </div>
                  <div className="text-xs font-semibold">
                    {netProfitMarginPercent}% Margin
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Breakeven Safety Target */}
          <div className="p-3.5 bg-slate-950/80 rounded-xl border border-slate-800 text-xs space-y-1.5">
            <div className="text-slate-300 font-semibold flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              Minimum Breakeven Requirement:
            </div>
            <p className="text-slate-400">
              Need <strong className="text-slate-200">{breakevenDailyCustomers} paying customers per day</strong> (~${breakevenMonthlyRevenue.toLocaleString()}/mo gross revenue) to cover all operating overhead.
            </p>
          </div>
        </div>
      </div>

      {/* 3-Year Cumulative Financial Projections Table */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-4">
        <h3 className="text-base font-bold text-slate-100 flex items-center gap-2">
          <Calendar className="w-4 h-4 text-emerald-400" />
          3-Year Growth & Cumulative Cash Flow Forecast
        </h3>

        <div className="overflow-x-auto">
          <table className="w-full text-xs text-left">
            <thead className="bg-slate-950/80 text-slate-400 uppercase text-[10px] tracking-wider border-b border-slate-800">
              <tr>
                <th className="p-3">Timeline</th>
                <th className="p-3">Annual Gross Revenue</th>
                <th className="p-3">Annual Total Opex</th>
                <th className="p-3">Annual Net Profit</th>
                <th className="p-3">Net Margin</th>
                <th className="p-3">Cumulative Net Cash</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 text-slate-300">
              {/* Year 1 */}
              <tr className="hover:bg-slate-800/40">
                <td className="p-3 font-semibold text-slate-100">Year 1 (Ramp Up)</td>
                <td className="p-3">${(monthlyGrossRevenue * 12).toLocaleString()}</td>
                <td className="p-3">${(totalMonthlyOpex * 12).toLocaleString()}</td>
                <td className="p-3 text-emerald-400 font-bold">${(monthlyNetOperatingIncome * 12).toLocaleString()}</td>
                <td className="p-3">{netProfitMarginPercent}%</td>
                <td className="p-3 font-semibold text-slate-200">
                  ${(monthlyNetOperatingIncome * 12 - initialCapex).toLocaleString()}
                  <span className="text-[10px] text-slate-500 block">after ${initialCapex.toLocaleString()} capex</span>
                </td>
              </tr>

              {/* Year 2 */}
              <tr className="hover:bg-slate-800/40">
                <td className="p-3 font-semibold text-slate-100">Year 2 (+12% Growth)</td>
                <td className="p-3">${Math.round(monthlyGrossRevenue * 12 * 1.12).toLocaleString()}</td>
                <td className="p-3">${Math.round(totalMonthlyOpex * 12 * 1.05).toLocaleString()}</td>
                <td className="p-3 text-emerald-400 font-bold">
                  ${Math.round(monthlyGrossRevenue * 12 * 1.12 - totalMonthlyOpex * 12 * 1.05).toLocaleString()}
                </td>
                <td className="p-3">
                  {((Math.round(monthlyGrossRevenue * 12 * 1.12 - totalMonthlyOpex * 12 * 1.05) / (monthlyGrossRevenue * 12 * 1.12)) * 100).toFixed(1)}%
                </td>
                <td className="p-3 font-semibold text-slate-200">
                  ${(
                    (monthlyNetOperatingIncome * 12 - initialCapex) +
                    Math.round(monthlyGrossRevenue * 12 * 1.12 - totalMonthlyOpex * 12 * 1.05)
                  ).toLocaleString()}
                </td>
              </tr>

              {/* Year 3 */}
              <tr className="hover:bg-slate-800/40">
                <td className="p-3 font-semibold text-slate-100">Year 3 (+22% Mature)</td>
                <td className="p-3">${Math.round(monthlyGrossRevenue * 12 * 1.22).toLocaleString()}</td>
                <td className="p-3">${Math.round(totalMonthlyOpex * 12 * 1.08).toLocaleString()}</td>
                <td className="p-3 text-emerald-400 font-bold">
                  ${Math.round(monthlyGrossRevenue * 12 * 1.22 - totalMonthlyOpex * 12 * 1.08).toLocaleString()}
                </td>
                <td className="p-3">
                  {((Math.round(monthlyGrossRevenue * 12 * 1.22 - totalMonthlyOpex * 12 * 1.08) / (monthlyGrossRevenue * 12 * 1.22)) * 100).toFixed(1)}%
                </td>
                <td className="p-3 font-semibold text-emerald-400 font-bold">
                  ${(
                    (monthlyNetOperatingIncome * 12 - initialCapex) +
                    Math.round(monthlyGrossRevenue * 12 * 1.12 - totalMonthlyOpex * 12 * 1.05) +
                    Math.round(monthlyGrossRevenue * 12 * 1.22 - totalMonthlyOpex * 12 * 1.08)
                  ).toLocaleString()}
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
