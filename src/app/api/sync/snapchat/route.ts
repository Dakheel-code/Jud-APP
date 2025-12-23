import { NextResponse } from 'next/server';
import { db } from '@/db';
import { snapConnections, snapInsightsDaily } from '@/db/schema';
import { eq } from 'drizzle-orm';
import { decrypt } from '@/lib/encryption';
import { getAdAccountStats, refreshAccessToken } from '@/lib/snapchat';

export async function GET() {
  try {
    const connections = await db
      .select()
      .from(snapConnections)
      .where(eq(snapConnections.isActive, true));

    let syncedCount = 0;

    for (const connection of connections) {
      try {
        let accessToken = decrypt(connection.accessToken);

        if (new Date() >= connection.tokenExpiresAt) {
          const refreshToken = decrypt(connection.refreshToken);
          const newTokens = await refreshAccessToken(refreshToken);

          accessToken = newTokens.access_token;

          const expiresAt = new Date();
          expiresAt.setSeconds(expiresAt.getSeconds() + newTokens.expires_in);

          await db
            .update(snapConnections)
            .set({
              accessToken: newTokens.access_token,
              refreshToken: newTokens.refresh_token,
              tokenExpiresAt: expiresAt,
            })
            .where(eq(snapConnections.id, connection.id));
        }

        const thirtyDaysAgo = new Date();
        thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

        const startDate = thirtyDaysAgo.toISOString().split('T')[0];
        const endDate = new Date().toISOString().split('T')[0];

        const stats = await getAdAccountStats(
          accessToken,
          connection.adAccountId,
          startDate,
          endDate
        );

        for (const stat of stats) {
          const ctr = stat.impressions > 0 ? stat.swipes / stat.impressions : 0;
          const cpc = stat.swipes > 0 ? stat.spend / stat.swipes : 0;
          const cvr = stat.swipes > 0 ? stat.purchases / stat.swipes : 0;
          const aov = stat.purchases > 0 ? stat.purchase_value / stat.purchases : 0;
          const cpa = stat.purchases > 0 ? stat.spend / stat.purchases : 0;
          const roas = stat.spend > 0 ? stat.purchase_value / stat.spend : 0;

          await db
            .insert(snapInsightsDaily)
            .values({
              date: stat.date,
              storeId: connection.storeId,
              adAccountId: connection.adAccountId,
              spend: stat.spend.toString(),
              impressions: stat.impressions,
              swipes: stat.swipes,
              purchases: stat.purchases,
              purchaseValue: stat.purchase_value.toString(),
              ctr: ctr.toString(),
              cpc: cpc.toString(),
              cvr: cvr.toString(),
              aov: aov.toString(),
              cpa: cpa.toString(),
              roas: roas.toString(),
            })
            .onConflictDoNothing();
        }

        await db
          .update(snapConnections)
          .set({ lastSyncAt: new Date() })
          .where(eq(snapConnections.id, connection.id));

        syncedCount++;
      } catch (error) {
        console.error(`Error syncing connection ${connection.id}:`, error);
      }
    }

    return NextResponse.json({
      success: true,
      synced: syncedCount,
      total: connections.length,
    });
  } catch (error) {
    console.error('Sync error:', error);
    return NextResponse.json(
      { error: 'فشلت عملية المزامنة' },
      { status: 500 }
    );
  }
}
