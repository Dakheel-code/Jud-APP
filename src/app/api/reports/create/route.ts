import { NextRequest, NextResponse } from 'next/server';
import { getDb } from '@/db';
import { reports, snapInsightsDaily, stores, users } from '@/db/schema';
import { getSession } from '@/lib/auth';
import { eq, and, gte, lte } from 'drizzle-orm';
import { generateReportId } from '@/lib/utils';

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

    const { dateFrom, dateTo } = await request.json();

    if (!dateFrom || !dateTo) {
      return NextResponse.json(
        { error: 'التواريخ مطلوبة' },
        { status: 400 }
      );
    }

    const [store] = await db
      .select()
      .from(stores)
      .where(eq(stores.id, session.storeId))
      .limit(1);

    const [user] = await db
      .select()
      .from(users)
      .where(eq(users.id, session.userId))
      .limit(1);

    const insights = await db
      .select()
      .from(snapInsightsDaily)
      .where(
        and(
          eq(snapInsightsDaily.storeId, session.storeId),
          gte(snapInsightsDaily.date, dateFrom),
          lte(snapInsightsDaily.date, dateTo)
        )
      );

    const totalSpend = insights.reduce((sum, i) => sum + parseFloat(i.spend.toString()), 0);
    const totalPurchases = insights.reduce((sum, i) => sum + i.purchases, 0);
    const totalRevenue = insights.reduce((sum, i) => sum + parseFloat(i.purchaseValue.toString()), 0);
    const totalSwipes = insights.reduce((sum, i) => sum + i.swipes, 0);
    const totalImpressions = insights.reduce((sum, i) => sum + i.impressions, 0);

    const avgCPC = totalSwipes > 0 ? totalSpend / totalSwipes : 0;
    const avgCVR = totalSwipes > 0 ? totalPurchases / totalSwipes : 0;
    const avgAOV = totalPurchases > 0 ? totalRevenue / totalPurchases : 0;
    const avgROAS = totalSpend > 0 ? totalRevenue / totalSpend : 0;
    const avgCPA = totalPurchases > 0 ? totalSpend / totalPurchases : 0;
    const avgCTR = totalImpressions > 0 ? totalSwipes / totalImpressions : 0;

    const snapshot = {
      store: {
        name: store.storeName,
        url: store.storeUrl,
        logo: store.storeLogoUrl,
        brandColor: store.brandColor,
      },
      user: {
        name: user.fullName,
        email: user.email,
      },
      period: {
        from: dateFrom,
        to: dateTo,
      },
      metrics: {
        totalSpend,
        totalPurchases,
        totalRevenue,
        totalSwipes,
        totalImpressions,
        avgCPC,
        avgCVR,
        avgAOV,
        avgROAS,
        avgCPA,
        avgCTR,
      },
      dailyData: insights.map((i) => ({
        date: i.date,
        spend: parseFloat(i.spend.toString()),
        purchases: i.purchases,
        revenue: parseFloat(i.purchaseValue.toString()),
        swipes: i.swipes,
        impressions: i.impressions,
      })),
    };

    const reportId = generateReportId();

    const [newReport] = await db
      .insert(reports)
      .values({
        reportId,
        storeId: session.storeId,
        createdByUserId: session.userId,
        dateFrom,
        dateTo,
        snapshotJson: snapshot,
        pdfUrl: null,
      })
      .returning();

    return NextResponse.json({
      success: true,
      report: newReport,
    });
  } catch (error) {
    console.error('Error creating report:', error);
    return NextResponse.json(
      { error: 'حدث خطأ أثناء إنشاء التقرير' },
      { status: 500 }
    );
  }
}
