export interface ForecastInput {
  historicalData: {
    spend: number;
    impressions: number;
    swipes: number;
    purchases: number;
    purchaseValue: number;
  }[];
  proposedBudget: number;
  forecastDays: number;
}

export interface ForecastScenario {
  scenario: 'low' | 'expected' | 'high';
  budget: number;
  estimatedClicks: number;
  estimatedPurchases: number;
  estimatedRevenue: number;
  estimatedCPA: number;
  estimatedROAS: number;
  confidence: number;
}

export interface ForecastResult {
  scenarios: ForecastScenario[];
  baselineMetrics: {
    avgCPC: number;
    avgCVR: number;
    avgAOV: number;
    avgROAS: number;
  };
  warnings: string[];
}

export function calculateForecast(input: ForecastInput): ForecastResult {
  const { historicalData, proposedBudget, forecastDays } = input;

  if (historicalData.length === 0) {
    throw new Error('لا توجد بيانات تاريخية كافية للتوقع');
  }

  const totalSpend = historicalData.reduce((sum, d) => sum + d.spend, 0);
  const totalSwipes = historicalData.reduce((sum, d) => sum + d.swipes, 0);
  const totalPurchases = historicalData.reduce((sum, d) => sum + d.purchases, 0);
  const totalRevenue = historicalData.reduce((sum, d) => sum + d.purchaseValue, 0);

  const avgCPC = totalSpend / totalSwipes || 0;
  const avgCVR = totalPurchases / totalSwipes || 0;
  const avgAOV = totalRevenue / totalPurchases || 0;
  const avgROAS = totalRevenue / totalSpend || 0;

  const warnings: string[] = [];

  if (historicalData.length < 7) {
    warnings.push('البيانات التاريخية أقل من 7 أيام - قد تكون التوقعات أقل دقة');
  }

  if (avgCVR < 0.01) {
    warnings.push('معدل التحويل منخفض جداً - تحقق من إعدادات التتبع');
  }

  if (proposedBudget > totalSpend * 3) {
    warnings.push('الميزانية المقترحة أعلى بكثير من المتوسط التاريخي - قد يحدث تشبع');
  }

  const saturationFactor = Math.min(1, 1 / (1 + Math.log(proposedBudget / (totalSpend / historicalData.length))));

  const scenarios: ForecastScenario[] = [
    {
      scenario: 'low',
      budget: proposedBudget,
      estimatedClicks: Math.floor((proposedBudget / avgCPC) * 0.7 * saturationFactor),
      estimatedPurchases: 0,
      estimatedRevenue: 0,
      estimatedCPA: 0,
      estimatedROAS: 0,
      confidence: 90,
    },
    {
      scenario: 'expected',
      budget: proposedBudget,
      estimatedClicks: Math.floor((proposedBudget / avgCPC) * saturationFactor),
      estimatedPurchases: 0,
      estimatedRevenue: 0,
      estimatedCPA: 0,
      estimatedROAS: 0,
      confidence: 70,
    },
    {
      scenario: 'high',
      budget: proposedBudget,
      estimatedClicks: Math.floor((proposedBudget / avgCPC) * 1.3 * saturationFactor),
      estimatedPurchases: 0,
      estimatedRevenue: 0,
      estimatedCPA: 0,
      estimatedROAS: 0,
      confidence: 50,
    },
  ];

  scenarios.forEach((scenario) => {
    const cvr = scenario.scenario === 'low' ? avgCVR * 0.7 : scenario.scenario === 'high' ? avgCVR * 1.3 : avgCVR;
    const aov = scenario.scenario === 'low' ? avgAOV * 0.9 : scenario.scenario === 'high' ? avgAOV * 1.1 : avgAOV;

    scenario.estimatedPurchases = Math.floor(scenario.estimatedClicks * cvr);
    scenario.estimatedRevenue = scenario.estimatedPurchases * aov;
    scenario.estimatedCPA = scenario.estimatedPurchases > 0 ? proposedBudget / scenario.estimatedPurchases : 0;
    scenario.estimatedROAS = scenario.estimatedRevenue / proposedBudget;
  });

  return {
    scenarios,
    baselineMetrics: {
      avgCPC,
      avgCVR,
      avgAOV,
      avgROAS,
    },
    warnings,
  };
}
