import { NextRequest, NextResponse } from 'next/server';
import { getAdAccountStats } from '@/lib/snapchat';

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const accessToken = searchParams.get('accessToken');
  const adAccountId = searchParams.get('adAccountId');
  const startDate = searchParams.get('startDate');
  const endDate = searchParams.get('endDate');

  if (!accessToken || !adAccountId || !startDate || !endDate) {
    return NextResponse.json(
      { error: 'Missing required parameters' },
      { status: 400 }
    );
  }

  try {
    // جلب البيانات من Snapchat
    const insights = await getAdAccountStats(
      accessToken,
      adAccountId,
      startDate,
      endDate
    );

    // حساب الإحصائيات الإجمالية
    const totalSpend = insights.reduce((sum, i) => sum + i.spend, 0);
    const totalPurchases = insights.reduce((sum, i) => sum + i.purchases, 0);
    const totalRevenue = insights.reduce((sum, i) => sum + i.purchase_value, 0);
    const totalSwipes = insights.reduce((sum, i) => sum + i.swipes, 0);

    const avgROAS = totalSpend > 0 ? totalRevenue / totalSpend : 0;
    const avgCPA = totalPurchases > 0 ? totalSpend / totalPurchases : 0;

    return NextResponse.json({
      totalSpend,
      totalPurchases,
      totalRevenue,
      totalSwipes,
      avgROAS,
      avgCPA,
      insights: insights.map(i => ({
        date: i.date,
        spend: i.spend,
        swipes: i.swipes,
        purchases: i.purchases,
        purchaseValue: i.purchase_value,
        impressions: i.impressions
      }))
    });
  } catch (error) {
    console.error('Error fetching insights:', error);
    return NextResponse.json(
      { error: 'Failed to fetch insights', details: String(error) },
      { status: 500 }
    );
  }
}
