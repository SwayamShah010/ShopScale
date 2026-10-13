export type BusinessCategory =
  | 'Specialty Coffee & Bakery'
  | 'Boutique Apparel & Vintage'
  | 'Artisan Pizzeria & Bistro'
  | 'Pet Care & Boutique Grooming'
  | 'Reformer Pilates & Fitness Studio'
  | 'Specialty Bookstore & Café'
  | 'Craft Beer & Wine Taproom'
  | 'Handmade Ice Cream & Dessert'
  | 'Wellness, Spa & Beauty'
  | 'Organic Grocery & Deli'
  | 'Custom Retail / Other';

export type ExpansionType =
  | '2nd Brick-and-Mortar Store'
  | 'High-Footfall Kiosk / Pop-Up'
  | 'Flagship Experiential Store'
  | 'Micro-Fulfillment / Pickup Node'
  | 'Franchise Partner Branch';

export type BudgetTier = 'Conservative ($40k-$80k)' | 'Moderate ($80k-$150k)' | 'Aggressive ($150k-$300k+)';

export interface ShopProfile {
  id: string;
  name: string;
  category: BusinessCategory;
  city: string;
  flagshipDistrict: string;
  monthlyRevenue: number;
  storeSizeSqFt: number;
  averageTicket: number;
  targetAudience: string;
  expansionType: ExpansionType;
  budgetTier: BudgetTier;
  flagshipCoords: { x: number; y: number }; // Relative 0-100 coordinates for map
}

export interface TerritoryZone {
  id: string;
  name: string;
  city: string;
  coordinates: { x: number; y: number };
  boundaryPath?: string;
  footfallIndex: number; // 0-100
  medianHouseholdIncome: string;
  medianIncomeNum: number;
  avgRentSqFt: number; // Annual $/sqft
  competitorCount: number;
  saturationLevel: 'Low' | 'Moderate' | 'High' | 'Severe';
  opportunityScore: number; // 0-100
  cannibalizationRisk: 'Minimal' | 'Moderate' | 'Significant';
  distanceFromFlagshipMiles: number;
  primaryAudience: string;
  description: string;
  idealAnchors: string[];
  growthVelocityPercent: number; // YoY foot traffic / population growth
  recommendedType: string;
  tags: string[];
}

export interface EvaluationResult {
  overallScore: number;
  verdict: string;
  summary: string;
  demographics: {
    fitScore: number;
    primaryAgeCohort: string;
    medianHouseholdIncome: string;
    footTrafficIndex: number;
    daytimeVsEveningPeak: string;
    residentVsCommuterMix: string;
  };
  competitorLandscape: {
    saturationScore: number;
    saturationLevel: string;
    estimatedDirectCompetitors: number;
    whiteSpaceOpportunity: string;
    keyDifferentiatorAdvice: string;
  };
  cannibalizationRisk: {
    score: number;
    riskLevel: string;
    estimatedDistance: string;
    recommendation: string;
  };
  financialProjections: {
    estimatedMonthlyGrossMin: number;
    estimatedMonthlyGrossMax: number;
    typicalRentPerSqFt: number;
    estimatedMonthlyRent: number;
    projectedBreakEvenMonths: number;
    estimatedInitialCapex: number;
    projectedNetMargin: number;
  };
  idealAnchorNeighbors: string[];
  pitfallsToAvoid: string[];
  zoningAndPermittingTips: string[];
  hyperlocalPromos: Array<{
    channel: string;
    tactic: string;
    expectedImpact: string;
  }>;
}

export interface MarketingPillar {
  name: string;
  timing: string;
  costEstimate: number;
  actionSteps: string[];
  conversionHook: string;
}

export interface CampaignData {
  campaignTheme: string;
  pillars: MarketingPillar[];
  vipSoftOpeningStrategy: string;
  communityPartnershipIdea: string;
  openingDayCrowdActivator: string;
}

export interface LaunchTask {
  id: string;
  phaseId: number;
  title: string;
  description: string;
  category: 'Site & Lease' | 'Permits & Fitout' | 'Staffing & Ops' | 'Marketing & Launch';
  completed: boolean;
  targetWeek: string;
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: string;
}
