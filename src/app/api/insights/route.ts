import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/db';
import { snapConnections } from '@/db/schema';
import { eq, sql } from 'drizzle-orm';
import { getAdAccountStats } from '@/lib/snapchat';
import { decrypt } from '@/lib/encryption';

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const storeId = searchParams.get('storeId');
  const startDate = searchParams.get('startDate');
  const endDate = searchParams.get('endDate');

  if (!storeId || !startDate || !endDate) {
    return NextResponse.json(
      { error: 'Missing required parameters' },
      { status: 400 }
    );
  }

  try {
    // الحصول على اتصال Snapchat للمتجر
    const connectionResult: any = await db.execute(sql`
      SELECT * FROM snap_connections 
      WHERE store_id = ${storeId} AND is_active = true 
      LIMIT 1
    `);

    if (!connectionResult || connectionResult.length === 0) {
      return NextResponse.json(
        { error: 'No Snapchat connection found' },
        { status: 404 }
      );
    }

    const connection = connectionResult[0];

    // فك تشفير access token
    const accessToken = decrypt(connection.access_token);

    // جلب البيانات من Snapchat
    const insights = await getAdAccountStats(
      accessToken,
      connection.ad_account_id,
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
