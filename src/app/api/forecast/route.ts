import { NextRequest, NextResponse } from 'next/server';
import { getDb } from '@/db';
import { snapInsightsDaily } from '@/db/schema';
import { getSession } from '@/lib/auth';
import { eq, gte } from 'drizzle-orm';
import { calculateForecast } from '@/lib/forecast';

export async function POST(request: NextRequest) {
  try {
    const db = getDb();
    const session = await getSession();

    if (!session) {
      return NextResponse.json(
        { error: 'غير مصرح' },
        { status: 401 }
      );
    }

    const { proposedBudget, forecastDays } = await request.json();

    if (!proposedBudget || !forecastDays) {
      return NextResponse.json(
        { error: 'الميزانية وعدد الأيام مطلوبان' },
        { status: 400 }
      );
    }

    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    const insights = await db
      .select()
      .from(snapInsightsDaily)
      .where(
        eq(snapInsightsDaily.storeId, session.storeId)
      );

    if (insights.length === 0) {
      return NextResponse.json(
        { error: 'لا توجد بيانات تاريخية كافية' },
        { status: 400 }
      );
    }

    const historicalData = insights.map((insight) => ({
      spend: parseFloat(insight.spend.toString()),
      impressions: insight.impressions,
      swipes: insight.swipes,
      purchases: insight.purchases,
      purchaseValue: parseFloat(insight.purchaseValue.toString()),
    }));

    const forecast = calculateForecast({
      historicalData,
      proposedBudget,
      forecastDays,
    });

    return NextResponse.json(forecast);
  } catch (error: any) {
    console.error('Forecast error:', error);
    return NextResponse.json(
      { error: error.message || 'حدث خطأ أثناء حساب التوقعات' },
      { status: 500 }
    );
  }
}
