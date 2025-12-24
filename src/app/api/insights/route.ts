import { NextRequest, NextResponse } from 'next/server';
import { getAdAccountStats, refreshAccessToken } from '@/lib/snapchat';

type DateRange = { startDate: string; endDate: string };

function mergeInsightsByDate(
  chunks: Awaited<ReturnType<typeof getAdAccountStats>>[]
) {
  const byDate = new Map<
    string,
    {
      date: string;
      spend: number;
      impressions: number;
      swipes: number;
      purchases: number;
      purchase_value: number;
    }
  >();

  for (const insights of chunks) {
    for (const i of insights) {
      const date = i.date;
      const prev = byDate.get(date);
      if (!prev) {
        byDate.set(date, {
          date,
          spend: i.spend || 0,
          impressions: i.impressions || 0,
          swipes: i.swipes || 0,
          purchases: i.purchases || 0,
          purchase_value: i.purchase_value || 0,
        });
      } else {
        prev.spend += i.spend || 0;
        prev.impressions += i.impressions || 0;
        prev.swipes += i.swipes || 0;
        prev.purchases += i.purchases || 0;
        prev.purchase_value += i.purchase_value || 0;
      }
    }
  }

  return Array.from(byDate.values()).sort((a, b) => a.date.localeCompare(b.date));
}

function buildResponseFromInsights(insights: Awaited<ReturnType<typeof getAdAccountStats>>) {
  const totalSpend = insights.reduce((sum, i) => sum + (i.spend || 0), 0);
  const totalPurchases = insights.reduce((sum, i) => sum + (i.purchases || 0), 0);
  const totalRevenue = insights.reduce((sum, i) => sum + (i.purchase_value || 0), 0);
  const totalSwipes = insights.reduce((sum, i) => sum + (i.swipes || 0), 0);

  const avgROAS = totalSpend > 0 ? totalRevenue / totalSpend : 0;
  const avgCPA = totalPurchases > 0 ? totalSpend / totalPurchases : 0;

  return {
    totalSpend,
    totalPurchases,
    totalRevenue,
    totalSwipes,
    avgROAS,
    avgCPA,
    insights: insights.map((i) => ({
      date: i.date,
      spend: i.spend || 0,
      swipes: i.swipes || 0,
      purchases: i.purchases || 0,
      purchaseValue: i.purchase_value || 0,
      impressions: i.impressions || 0,
    })),
  };
}

async function fetchInsightsWithOptionalRefresh(params: {
  accessToken: string;
  refreshToken?: string;
  adAccountId: string;
  ranges: DateRange[];
}) {
  let currentAccessToken = params.accessToken;
  let refreshedTokens: null | { accessToken: string; refreshToken: string; expiresAt: string } = null;

  const callAll = async () => {
    const chunks: Awaited<ReturnType<typeof getAdAccountStats>>[] = [];
    for (const r of params.ranges) {
      chunks.push(await getAdAccountStats(currentAccessToken, params.adAccountId, r.startDate, r.endDate));
    }
    return chunks;
  };

  try {
    return { chunks: await callAll(), refreshedTokens };
  } catch (error: any) {
    const msg = String(error?.message || '');
    const isAuthError =
      msg.includes('انتهت صلاحية الجلسة') ||
      error?.response?.status === 401 ||
      error?.response?.status === 403;

    if (!isAuthError || !params.refreshToken) {
      throw error;
    }

    const newTokens = await refreshAccessToken(params.refreshToken);
    currentAccessToken = newTokens.access_token;
    const expiresAt = new Date(Date.now() + newTokens.expires_in * 1000).toISOString();
    refreshedTokens = {
      accessToken: newTokens.access_token,
      refreshToken: newTokens.refresh_token,
      expiresAt,
    };

    return { chunks: await callAll(), refreshedTokens };
  }
}

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
    const insights = await getAdAccountStats(accessToken, adAccountId, startDate, endDate);

    console.log(`Received ${insights.length} insight records`);

    const response = buildResponseFromInsights(insights);
    console.log('Returning response with', response.insights.length, 'insights');
    return NextResponse.json(response);
  } catch (error: any) {
    console.error('=== Error in Insights API ===');
    console.error('Error type:', error.constructor.name);
    console.error('Error message:', error.message);
    console.error('Error stack:', error.stack);

    const msg = String(error?.message || 'Failed to fetch insights');
    const status = msg.includes('انتهت صلاحية الجلسة') ? 401 : 500;
    
    return NextResponse.json(
      { 
        error: 'Failed to fetch insights', 
        message: msg,
        details: error.toString(),
      },
      { status }
    );
  }
}

export async function POST(request: NextRequest) {
  let body: any;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: 'Invalid JSON body' }, { status: 400 });
  }

  const accessToken = body?.accessToken as string | undefined;
  const refreshToken = body?.refreshToken as string | undefined;
  const adAccountId = body?.adAccountId as string | undefined;
  const ranges = body?.ranges as DateRange[] | undefined;
  const startDate = body?.startDate as string | undefined;
  const endDate = body?.endDate as string | undefined;

  const effectiveRanges: DateRange[] = Array.isArray(ranges)
    ? ranges
    : startDate && endDate
      ? [{ startDate, endDate }]
      : [];

  if (!accessToken || !adAccountId || effectiveRanges.length === 0) {
    return NextResponse.json(
      {
        error: 'Missing required parameters',
        params: {
          accessToken: !!accessToken,
          adAccountId: !!adAccountId,
          ranges: effectiveRanges.length,
        },
      },
      { status: 400 }
    );
  }

  if (effectiveRanges.length > 10) {
    return NextResponse.json({ error: 'Too many ranges (max 10)' }, { status: 400 });
  }

  try {
    const { chunks, refreshedTokens } = await fetchInsightsWithOptionalRefresh({
      accessToken,
      refreshToken,
      adAccountId,
      ranges: effectiveRanges,
    });

    const merged = mergeInsightsByDate(chunks);
    const response = buildResponseFromInsights(merged);
    return NextResponse.json({
      ...response,
      refreshedTokens,
    });
  } catch (error: any) {
    const msg = String(error?.message || 'Failed to fetch insights');
    const status = msg.includes('انتهت صلاحية الجلسة') ? 401 : 500;
    return NextResponse.json(
      {
        error: 'Failed to fetch insights',
        message: msg,
        details: error.toString(),
      },
      { status }
    );
  }
}
