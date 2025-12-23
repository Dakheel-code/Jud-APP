import { NextRequest, NextResponse } from 'next/server';
import { getAdAccountStats } from '@/lib/snapchat';

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const accessToken = searchParams.get('accessToken');
  const adAccountId = searchParams.get('adAccountId');
  const startDate = searchParams.get('startDate');
  const endDate = searchParams.get('endDate');

  console.log('=== Insights API Called ===');
  console.log('Access Token:', accessToken ? `${accessToken.substring(0, 20)}...` : 'missing');
  console.log('Ad Account ID:', adAccountId);
  console.log('Date Range:', startDate, 'to', endDate);

  if (!accessToken || !adAccountId || !startDate || !endDate) {
    console.error('Missing required parameters');
    return NextResponse.json(
      { error: 'Missing required parameters', params: { accessToken: !!accessToken, adAccountId: !!adAccountId, startDate: !!startDate, endDate: !!endDate } },
      { status: 400 }
    );
  }

  try {
    console.log('Calling getAdAccountStats...');
    
    // جلب البيانات من Snapchat
    const insights = await getAdAccountStats(
      accessToken,
      adAccountId,
      startDate,
      endDate
    );

    console.log(`Received ${insights.length} insight records`);

    // حساب الإحصائيات الإجمالية
    const totalSpend = insights.reduce((sum, i) => sum + (i.spend || 0), 0);
    const totalPurchases = insights.reduce((sum, i) => sum + (i.purchases || 0), 0);
    const totalRevenue = insights.reduce((sum, i) => sum + (i.purchase_value || 0), 0);
    const totalSwipes = insights.reduce((sum, i) => sum + (i.swipes || 0), 0);

    const avgROAS = totalSpend > 0 ? totalRevenue / totalSpend : 0;
    const avgCPA = totalPurchases > 0 ? totalSpend / totalPurchases : 0;

    console.log('Calculated totals:', { totalSpend, totalPurchases, totalRevenue, totalSwipes, avgROAS, avgCPA });

    const response = {
      totalSpend,
      totalPurchases,
      totalRevenue,
      totalSwipes,
      avgROAS,
      avgCPA,
      insights: insights.map(i => ({
        date: i.date,
        spend: i.spend || 0,
        swipes: i.swipes || 0,
        purchases: i.purchases || 0,
        purchaseValue: i.purchase_value || 0,
        impressions: i.impressions || 0
      }))
    };

    console.log('Returning response with', response.insights.length, 'insights');
    return NextResponse.json(response);
  } catch (error: any) {
    console.error('=== Error in Insights API ===');
    console.error('Error type:', error.constructor.name);
    console.error('Error message:', error.message);
    console.error('Error stack:', error.stack);
    
    return NextResponse.json(
      { 
        error: 'Failed to fetch insights', 
        message: error.message,
        details: error.toString()
      },
      { status: 500 }
    );
  }
}
