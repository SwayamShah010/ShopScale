import express from 'express';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import { GoogleGenAI } from '@google/genai';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT ? parseInt(process.env.PORT, 10) : 3000;

app.use(express.json({ limit: '10mb' }));

// Initialize GoogleGenAI SDK as per gemini-api guidelines
let aiClient: GoogleGenAI | null = null;
if (process.env.GEMINI_API_KEY) {
  try {
    aiClient = new GoogleGenAI({
      apiKey: process.env.GEMINI_API_KEY,
      httpOptions: {
        headers: {
          'User-Agent': 'aistudio-build',
        },
      },
    });
  } catch (err) {
    console.error('Error initializing GoogleGenAI:', err);
  }
}

// Health check endpoint
app.get('/api/health', (_req, res) => {
  res.json({
    status: 'ok',
    hasApiKey: !!process.env.GEMINI_API_KEY,
    timestamp: new Date().toISOString(),
  });
});

// Comprehensive AI Territory Evaluation
app.post('/api/expansion/evaluate-territory', async (req, res) => {
  try {
    const {
      businessName,
      businessType,
      currentLocation,
      targetCity,
      targetDistrict,
      storeSizeSqFt,
      monthlyRevenue,
      targetAudience,
      expansionType,
      budgetTier,
    } = req.body;

    if (!businessType || !targetDistrict) {
      return res.status(400).json({ error: 'Missing businessType or targetDistrict' });
    }

    // If Gemini client is available, call gemini-3.8-flash for rich structured analysis
    if (aiClient) {
      const prompt = `You are a world-class retail expansion strategist and commercial real estate demographic intelligence expert.
Analyze the feasibility of opening a new location for this local shop:

BUSINESS DETAILS:
- Shop Name: "${businessName || 'Local Retail Business'}"
- Category: "${businessType}" (e.g. Specialty Coffee, Boutique Apparel, Artisan Bakery, Pet Care, Fitness Studio)
- Current Flagship Location: "${currentLocation || 'City Center'}"
- Current Est. Monthly Revenue: $${monthlyRevenue || 45000}
- Typical Store Size: ${storeSizeSqFt || 1200} sq ft
- Target Customer Profile: "${targetAudience || 'Urban professionals and young families'}"
- Expansion Model: "${expansionType || '2nd Brick-and-Mortar Store'}"
- Budget Tier: "${budgetTier || 'Moderate'}"

PROPOSED EXPANSION TERRITORY:
- Metro Area: "${targetCity || 'Metro Hub'}"
- Target Neighborhood / District: "${targetDistrict}"

Provide a comprehensive, high-utility expansion evaluation formatted strictly as JSON with this structure:
{
  "overallScore": number (0 to 100, e.g. 84),
  "verdict": string ("Prime Expansion Zone" | "High Potential With Nuance" | "Saturated / Cautious" | "High Risk"),
  "summary": string (3-4 sentences summarizing why this area works or what the key hurdle is),
  "demographics": {
    "fitScore": number (0 to 100),
    "primaryAgeCohort": string,
    "medianHouseholdIncome": string,
    "footTrafficIndex": number (0 to 100),
    "daytimeVsEveningPeak": string,
    "residentVsCommuterMix": string
  },
  "competitorLandscape": {
    "saturationScore": number (0 to 100, where 100 is hypersaturated),
    "saturationLevel": string ("Low" | "Moderate" | "High" | "Severe"),
    "estimatedDirectCompetitors": number,
    "whiteSpaceOpportunity": string (1-2 sentences on specific gaps competitors leave open),
    "keyDifferentiatorAdvice": string
  },
  "cannibalizationRisk": {
    "score": number (0 to 100, where higher means higher danger of stealing own customers),
    "riskLevel": string ("Minimal" | "Moderate" | "Significant"),
    "estimatedDistance": string,
    "recommendation": string
  },
  "financialProjections": {
    "estimatedMonthlyGrossMin": number,
    "estimatedMonthlyGrossMax": number,
    "typicalRentPerSqFt": number,
    "estimatedMonthlyRent": number,
    "projectedBreakEvenMonths": number,
    "estimatedInitialCapex": number,
    "projectedNetMargin": number (percentage, e.g. 18.5)
  },
  "idealAnchorNeighbors": [string, string, string],
  "pitfallsToAvoid": [string, string, string],
  "zoningAndPermittingTips": [string, string],
  "hyperlocalPromos": [
    {
      "channel": string,
      "tactic": string,
      "expectedImpact": string
    }
  ]
}

Return ONLY valid JSON without markdown fences.`;

      try {
        const response = await aiClient.models.generateContent({
          model: 'gemini-3.8-flash',
          contents: prompt,
          config: {
            responseMimeType: 'application/json',
          },
        });

        const rawText = response.text?.trim() || '{}';
        // Clean any stray fences just in case
        const cleaned = rawText.replace(/^```json/i, '').replace(/^```/i, '').replace(/```$/, '').trim();
        const parsed = JSON.parse(cleaned);
        return res.json({ success: true, data: parsed, source: 'gemini-ai' });
      } catch (geminiError: any) {
        console.warn('Gemini API call failed or timed out, falling back to algorithmic evaluation:', geminiError?.message);
      }
    }

    // High-fidelity algorithmic evaluation fallback if no API key or on error
    const algorithmicResult = generateAlgorithmicEvaluation({
      businessName,
      businessType,
      currentLocation,
      targetCity,
      targetDistrict,
      storeSizeSqFt: Number(storeSizeSqFt) || 1200,
      monthlyRevenue: Number(monthlyRevenue) || 45000,
      targetAudience,
      expansionType,
      budgetTier,
    });

    return res.json({ success: true, data: algorithmicResult, source: 'algorithmic-engine' });
  } catch (error: any) {
    console.error('Error in evaluate-territory:', error);
    res.status(500).json({ error: error.message || 'Internal server error' });
  }
});

// Hyperlocal Marketing Campaign Generation
app.post('/api/expansion/generate-marketing-campaign', async (req, res) => {
  try {
    const { businessName, businessType, targetDistrict, targetCity, launchBudget } = req.body;

    if (aiClient) {
      const prompt = `Create a 4-pillar Hyperlocal Grand Opening and Customer Acquisition Campaign for:
Shop: "${businessName || 'Local Retail'}" (${businessType || 'Retail'})
Opening in: "${targetDistrict}, ${targetCity || 'Metro Area'}"
Launch Budget: $${launchBudget || 3500}

Format strictly as JSON:
{
  "campaignTheme": string,
  "pillars": [
    {
      "name": string,
      "timing": string,
      "costEstimate": number,
      "actionSteps": [string, string],
      "conversionHook": string
    }
  ],
  "vipSoftOpeningStrategy": string,
  "communityPartnershipIdea": string,
  "openingDayCrowdActivator": string
}
Return ONLY valid JSON.`;

      try {
        const response = await aiClient.models.generateContent({
          model: 'gemini-3.8-flash',
          contents: prompt,
          config: { responseMimeType: 'application/json' },
        });

        const rawText = response.text?.trim() || '{}';
        const cleaned = rawText.replace(/^```json/i, '').replace(/^```/i, '').replace(/```$/, '').trim();
        return res.json({ success: true, data: JSON.parse(cleaned), source: 'gemini-ai' });
      } catch (err: any) {
        console.warn('Gemini campaign generation failed, using fallback:', err?.message);
      }
    }

    // Fallback campaign
    const fallbackCampaign = {
      campaignTheme: `The New Neighborhood Favorite: ${businessName || 'Our Shop'} arrives in ${targetDistrict}`,
      pillars: [
        {
          name: 'Hyperlocal Merchant Cross-Pollination',
          timing: '2 Weeks Prior to Launch',
          costEstimate: 450,
          actionSteps: [
            'Partner with 4 nearby non-competing merchants (boutiques, gyms, salons) to give their staff exclusive preview tokens',
            'Offer co-branded reciprocal 15% discount vouchers for their frequent customers'
          ],
          conversionHook: 'Exclusive "Neighbors First" preview invitation'
        },
        {
          name: 'Geofenced Mobile & Community Buzz',
          timing: '10 Days Prior through Week 1',
          costEstimate: 800,
          actionSteps: [
            'Deploy micro-targeted Instagram and community group ads within a 1.5-mile radius',
            'Sponsor local neighborhood newsletter or community association board'
          ],
          conversionHook: 'First 100 visitors receive customized neighborhood canvas tote + store gift'
        },
        {
          name: 'Golden Hour Soft Launch & Local Tastemakers',
          timing: 'Opening Weekend',
          costEstimate: 950,
          actionSteps: [
            'Host an invite-only tasting/preview session for local micro-creators and neighborhood leaders',
            'Offer instant social-share polaroid wall or signature photo moment'
          ],
          conversionHook: 'Unlock VIP Annual Loyalty Card with inaugural visit'
        },
        {
          name: 'Post-Launch Retention & Habit Formation',
          timing: 'Weeks 2 to 4',
          costEstimate: 600,
          actionSteps: [
            'Launch bounce-back rewards card: "Return within 10 days for $5 off"',
            'Establish weekly recurring neighborhood event (e.g., Weekend Morning Specials or Community Hours)'
          ],
          conversionHook: 'Double loyalty stamps on weekdays to build steady foot-traffic baseline'
        }
      ],
      vipSoftOpeningStrategy: `Invite the top 50 residents living within 500 meters for an evening of complimentary signature items and personal greetings from the founders.`,
      communityPartnershipIdea: `Collaborate with the local public school or community garden fund by donating 10% of opening weekend proceeds to cement goodwill.`,
      openingDayCrowdActivator: `A ceremonial ribbon-cutting with complimentary mini signature samplers and live acoustic music outside the storefront.`
    };

    return res.json({ success: true, data: fallbackCampaign, source: 'algorithmic-engine' });
  } catch (error: any) {
    res.status(500).json({ error: error.message || 'Campaign generation failed' });
  }
});

// AI Retail Expansion Strategist Interactive Chat
app.post('/api/expansion/ai-advisor-chat', async (req, res) => {
  try {
    const { messages, shopContext } = req.body;

    if (!messages || !Array.isArray(messages)) {
      return res.status(400).json({ error: 'Messages array is required' });
    }

    if (aiClient) {
      const systemInstruction = `You are ShopScale AI, an elite retail expansion and commercial territory consultant.
You provide sharp, pragmatic, highly realistic advice to local shop owners (coffee shops, boutiques, bakeries, pizzerias, studios, pet shops, etc.) looking to open new locations.
Current Shop Profile Context:
- Shop Name: ${shopContext?.businessName || 'Local Shop'}
- Type: ${shopContext?.businessType || 'Retail / Food & Beverage'}
- Current Store Revenue: $${shopContext?.monthlyRevenue || '40,000'}/month
- Target Area Under Review: ${shopContext?.targetDistrict || 'Target Territory'} (${shopContext?.targetCity || 'Metro'})
- Target Store Size: ${shopContext?.storeSizeSqFt || '1,200'} sq ft

Guidelines:
- Give concrete, numerical guidance whenever possible (e.g., rent-to-sales ratios, lease clauses like Tenant Improvement allowance, foot traffic benchmarks).
- Point out hidden expansion traps: management bandwidth dilution, supply chain bottlenecks, inventory fragmentation, landlord CAM charges, and permit delays.
- Be encouraging yet rigorously protective of their capital.
- Keep answers structured with crisp bullet points and concise paragraphs.`;

      try {
        const lastUserMessage = messages[messages.length - 1]?.content || 'How should I expand safely?';
        const conversationHistory = messages.slice(0, -1).map((m: any) => `${m.role === 'user' ? 'User' : 'Assistant'}: ${m.content}`).join('\n\n');

        const prompt = `${conversationHistory ? `Conversation History:\n${conversationHistory}\n\n` : ''}User Question: ${lastUserMessage}`;

        const response = await aiClient.models.generateContent({
          model: 'gemini-3.8-flash',
          contents: prompt,
          config: {
            systemInstruction,
          },
        });

        return res.json({
          success: true,
          reply: response.text?.trim() || 'Expansion strategy tip: Always insist on an initial rent-free fit-out period of 60 to 90 days before your full lease begins.',
          source: 'gemini-ai',
        });
      } catch (err: any) {
        console.warn('Gemini chat failed, using fallback:', err?.message);
      }
    }

    // Heuristic fallback response
    const lastMsg = (messages[messages.length - 1]?.content || '').toLowerCase();
    let reply = `When expanding into a new location, the golden rule of retail economics is to keep your total occupancy cost (Base Rent + NNN + CAM) under 10% to 14% of projected gross sales. Always request at least 60-90 days of rent abatement (free rent) during your build-out and permitting phase so you don't burn capital before opening your doors.`;

    if (lastMsg.includes('lease') || lastMsg.includes('rent') || lastMsg.includes('landlord')) {
      reply = `Key Lease Negotiation Rules for Store #2:
1. Rent Abatement: Demand 60 to 90 days of free rent while completing architectural permits and build-out.
2. Tenant Improvement (TI) Allowance: Push the landlord for $25 to $50/sq ft towards HVAC or ADA upgrades.
3. Exclusive Use Clause: Ensure the lease prohibits the landlord from renting adjacent space to direct competitors in your category.
4. Renewal Options: Negotiate a 3-year initial term with two 3-year extension options tied to CPI caps rather than arbitrary 5% annual hikes.`;
    } else if (lastMsg.includes('cannibaliz') || lastMsg.includes('distance')) {
      reply = `Cannibalization Thresholds:
For everyday convenience & coffee: A 1.5 to 2.0-mile buffer (or separate natural transit corridor) is sufficient.
For specialty destination retail (apparel, artisan dining): Ensure a 4 to 6-mile radius or distinct demographic sub-market to ensure you expand your customer pool rather than splitting existing loyalists.`;
    } else if (lastMsg.includes('staff') || lastMsg.includes('hire') || lastMsg.includes('manager')) {
      reply = `Branch #2 Staffing Playbook:
Never hire an entirely new team for Store #2. Promote a proven senior team member from Store #1 to General Manager of the new branch, and rotate your founder presence between both locations on alternating days for the first 90 days to maintain your brand standards and culture.`;
    }

    return res.json({ success: true, reply, source: 'algorithmic-engine' });
  } catch (error: any) {
    res.status(500).json({ error: error.message || 'Chat failed' });
  }
});

// Algorithmic fallbacks for deep reliability
function generateAlgorithmicEvaluation(params: any) {
  const { businessType, targetDistrict, storeSizeSqFt, monthlyRevenue } = params;

  // District profile benchmarks
  const districtProfiles: Record<string, any> = {
    'Arts & Design Quarter': {
      score: 87,
      verdict: 'Prime Expansion Zone',
      footfall: 88,
      age: '24-38 yrs',
      income: '$88,000 - $115,000',
      rentPerSqFt: 38,
      saturation: 'Moderate',
      saturationScore: 42,
      competitors: 4,
      cannibalScore: 18,
      anchors: ['Indie Bookshops', 'Pilates / Yoga Studios', 'Artisan Coffee Roasters'],
      whitespace: 'High appetite for authentic craftsmanship, premium experiences, and community workshops that competitors lack.',
      risk: 'Evening foot traffic is stellar; weekday morning traffic requires deliberate breakfast or grab-and-go activation.'
    },
    'Midtown Commerce Hub': {
      score: 82,
      verdict: 'High Potential With Nuance',
      footfall: 94,
      age: '28-52 yrs',
      income: '$110,000 - $160,000',
      rentPerSqFt: 54,
      saturation: 'High',
      saturationScore: 72,
      competitors: 9,
      cannibalScore: 28,
      anchors: ['Corporate Towers', 'Metro Transit Hub', 'Executive Gyms'],
      whitespace: 'Fast-casual speed combined with high-grade culinary or boutique standards during 11:30 AM - 2:30 PM lunch peak.',
      risk: 'Weekend drop-off is steep; ensure your cost structure can survive 5-day heavy business cycles or negotiate lower weekend hours.'
    },
    'Greenlake Suburbs & Family District': {
      score: 79,
      verdict: 'High Potential With Nuance',
      footfall: 72,
      age: '32-48 yrs (Young Families)',
      income: '$125,000 - $185,000',
      rentPerSqFt: 28,
      saturation: 'Low',
      saturationScore: 24,
      competitors: 2,
      cannibalScore: 12,
      anchors: ['Elementary / Montessori Schools', 'Organic Farmers Market', 'Pediatric Clinics'],
      whitespace: 'Family-friendly atmosphere with stroller accessibility, kid-friendly touches, and high-margin recurring family visits.',
      risk: 'Peak demand is concentrated during school pick-up hours (2:30 PM - 5:00 PM) and weekend mornings.'
    },
    'University & Innovation Corridor': {
      score: 85,
      verdict: 'Prime Expansion Zone',
      footfall: 91,
      age: '18-30 yrs (Students & Tech Researchers)',
      income: '$45,000 - $78,000',
      rentPerSqFt: 32,
      saturation: 'Moderate',
      saturationScore: 55,
      competitors: 6,
      cannibalScore: 22,
      anchors: ['University Library / Quad', 'Student Housing Complexes', 'Coworking Labs'],
      whitespace: 'Affordable luxury: student discounts, late-night study hours, high-speed WiFi, and loyalty stamp rewards.',
      risk: 'Summer break and holiday seasonality causes a 25-35% revenue dip unless balanced with summer campus programs.'
    },
    'Riverside Promenade': {
      score: 76,
      verdict: 'Cautious / Lifestyle Dependent',
      footfall: 78,
      age: '26-55 yrs',
      income: '$95,000 - $140,000',
      rentPerSqFt: 46,
      saturation: 'Moderate',
      saturationScore: 48,
      competitors: 5,
      cannibalScore: 15,
      anchors: ['Waterfront Marina', 'Cycling Trails', 'Boutique Hotels'],
      whitespace: 'Outdoor patio seating, pet-friendly stations, and weekend lifestyle leisure packages.',
      risk: 'Weather sensitive footfall; rainy weeks cut foot-traffic in half.'
    },
    'Eastside Tech District': {
      score: 91,
      verdict: 'Prime Expansion Zone',
      footfall: 86,
      age: '25-42 yrs (Engineers & Creatives)',
      income: '$120,000 - $175,000',
      rentPerSqFt: 36,
      saturation: 'Low',
      saturationScore: 28,
      competitors: 3,
      cannibalScore: 20,
      anchors: ['Tech Campuses', 'Bouldering Gyms', 'Modern Lofts'],
      whitespace: 'Massive underserved disposable income; workers seeking third-place spaces away from home offices.',
      risk: 'Hybrid work schedules mean Tuesday-Thursday are ultra busy while Monday and Friday are moderate.'
    }
  };

  const key = Object.keys(districtProfiles).find(k => targetDistrict.toLowerCase().includes(k.toLowerCase())) || 'Arts & Design Quarter';
  const profile = districtProfiles[key] || districtProfiles['Arts & Design Quarter'];

  const estRentSqFt = profile.rentPerSqFt;
  const monthlyRent = Math.round(storeSizeSqFt * (estRentSqFt / 12));
  const baseRevenue = Math.max(monthlyRevenue * 0.95, 38000);
  const minGross = Math.round(baseRevenue * 0.85);
  const maxGross = Math.round(baseRevenue * 1.35);
  const avgGross = Math.round((minGross + maxGross) / 2);
  const estimatedCapex = Math.round(storeSizeSqFt * 110);
  const estimatedNetMargin = 17.5;
  const monthlyNet = Math.round(avgGross * (estimatedNetMargin / 100));
  const breakEvenMonths = Math.max(5, Math.min(18, Math.round(estimatedCapex / Math.max(monthlyNet, 3000))));

  return {
    overallScore: profile.score,
    verdict: profile.verdict,
    summary: `${targetDistrict} exhibits exceptional synergy for ${businessType}. Demographic purchasing power is strong with estimated median incomes of ${profile.income}, and competitive saturation remains ${profile.saturation.toLowerCase()}. Expected break-even is projected at ${breakEvenMonths} months.`,
    demographics: {
      fitScore: profile.score > 80 ? 89 : 76,
      primaryAgeCohort: profile.age,
      medianHouseholdIncome: profile.income,
      footTrafficIndex: profile.footfall,
      daytimeVsEveningPeak: profile.score > 80 ? 'Balanced all-day flow with 12pm & 6pm peaks' : 'Concentrated midday flow',
      residentVsCommuterMix: '60% Residents / 40% Daily Commuters & Visitors'
    },
    competitorLandscape: {
      saturationScore: profile.saturationScore,
      saturationLevel: profile.saturation,
      estimatedDirectCompetitors: profile.competitors,
      whiteSpaceOpportunity: profile.whitespace,
      keyDifferentiatorAdvice: `Double-down on your flagship's signature craft reputation and introduce a localized exclusive offering tailored specifically to ${targetDistrict}.`
    },
    cannibalizationRisk: {
      score: profile.cannibalScore,
      riskLevel: profile.cannibalScore > 35 ? 'Moderate' : 'Minimal',
      estimatedDistance: '3.8 miles (approx. 14 min drivetime)',
      recommendation: 'Low cannibalization probability. The geographical buffer ensures you will tap a fresh consumer cluster with minimal retention overlap from your first store.'
    },
    financialProjections: {
      estimatedMonthlyGrossMin: minGross,
      estimatedMonthlyGrossMax: maxGross,
      typicalRentPerSqFt: estRentSqFt,
      estimatedMonthlyRent: monthlyRent,
      projectedBreakEvenMonths: breakEvenMonths,
      estimatedInitialCapex: estimatedCapex,
      projectedNetMargin: estimatedNetMargin
    },
    idealAnchorNeighbors: profile.anchors,
    pitfallsToAvoid: [
      profile.risk,
      'Signing a lease without capping common area maintenance (CAM) annual increases to 4%',
      'Over-investing in custom architectural millwork before testing neighborhood product demand'
    ],
    zoningAndPermittingTips: [
      'Confirm commercial use occupancy permit (Class B/M) with city planning 45 days in advance',
      'Verify whether grease-trap interceptor or dedicated electrical drop upgrades require landlord sign-off'
    ],
    hyperlocalPromos: [
      {
        channel: 'Neighborhood VIP Pass',
        tactic: 'Drop physical invitation keys to the 20 closest retail staff and residential doorpersons',
        expectedImpact: 'Immediate word-of-mouth ambassadors from Day 1'
      },
      {
        channel: 'Micro-Influencer Collab',
        tactic: 'Invite 12 hyper-local lifestyle creators for an exclusive tasting / shopping hour',
        expectedImpact: 'High-density local Instagram and TikTok coverage'
      },
      {
        channel: 'Opening Week Golden Ticket',
        tactic: 'First 50 customers daily receive a limited-edition tote + 1 month of weekly perk stamps',
        expectedImpact: 'Generates line excitement and fast repeat habit formation'
      }
    ]
  };
}

// Development and Production handlers
async function startServer() {
  if (process.env.NODE_ENV !== 'production') {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    app.use(express.static(path.resolve(__dirname, 'dist')));
    app.get('*', (_req, res) => {
      res.sendFile(path.resolve(__dirname, 'dist', 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`🚀 ShopScale expansion engine running on http://0.0.0.0:${PORT}`);
  });
}

startServer().catch((err) => {
  console.error('Failed to start server:', err);
});
