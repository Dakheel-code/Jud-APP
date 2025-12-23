import axios from 'axios';

const SNAPCHAT_API_BASE = 'https://adsapi.snapchat.com/v1';

export interface SnapchatTokenResponse {
  access_token: string;
  refresh_token: string;
  expires_in: number;
  token_type: string;
}

export interface SnapchatAdAccount {
  id: string;
  name: string;
  type: string;
  status: string;
}

export interface SnapchatInsight {
  date: string;
  spend: number;
  impressions: number;
  swipes: number;
  purchases: number;
  purchase_value: number;
}

export async function exchangeCodeForToken(code: string): Promise<SnapchatTokenResponse> {
  const response = await axios.post(
    'https://accounts.snapchat.com/login/oauth2/access_token',
    new URLSearchParams({
      code,
      client_id: process.env.SNAPCHAT_CLIENT_ID!,
      client_secret: process.env.SNAPCHAT_CLIENT_SECRET!,
      grant_type: 'authorization_code',
      redirect_uri: process.env.SNAPCHAT_REDIRECT_URI!,
    }),
    {
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
    }
  );

  return response.data;
}

export async function refreshAccessToken(refreshToken: string): Promise<SnapchatTokenResponse> {
  const response = await axios.post(
    'https://accounts.snapchat.com/login/oauth2/access_token',
    new URLSearchParams({
      refresh_token: refreshToken,
      client_id: process.env.SNAPCHAT_CLIENT_ID!,
      client_secret: process.env.SNAPCHAT_CLIENT_SECRET!,
      grant_type: 'refresh_token',
    }),
    {
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
    }
  );

  return response.data;
}

export async function getAdAccounts(accessToken: string): Promise<SnapchatAdAccount[]> {
  try {
    // أولاً: الحصول على Organizations
    const orgsResponse = await axios.get(`${SNAPCHAT_API_BASE}/me/organizations`, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });

    const organizations = orgsResponse.data.organizations || [];
    
    if (organizations.length === 0) {
      return [];
    }

    console.log(`Found ${organizations.length} organizations`);

    // ثانياً: الحصول على Ad Accounts من جميع Organizations
    const allAdAccounts: SnapchatAdAccount[] = [];

    for (const org of organizations) {
      const orgId = org.organization.id;
      const orgName = org.organization.name;
      
      console.log(`Fetching ad accounts for organization: ${orgName} (${orgId})`);

      try {
        const adAccountsResponse = await axios.get(
          `${SNAPCHAT_API_BASE}/organizations/${orgId}/adaccounts`,
          {
            headers: {
              Authorization: `Bearer ${accessToken}`,
            },
          }
        );

        const adAccounts = adAccountsResponse.data.adaccounts || [];
        console.log(`Found ${adAccounts.length} ad accounts in ${orgName}`);

        const mappedAccounts = adAccounts.map((acc: any) => ({
          id: acc.adaccount.id,
          name: acc.adaccount.name,
          type: acc.adaccount.type,
          status: acc.adaccount.status,
        }));

        allAdAccounts.push(...mappedAccounts);
      } catch (orgError) {
        console.error(`Error fetching ad accounts for org ${orgId}:`, orgError);
        // استمر في جلب الحسابات من Organizations الأخرى
      }
    }

    console.log(`Total ad accounts found: ${allAdAccounts.length}`);
    return allAdAccounts;
  } catch (error) {
    console.error('Error fetching ad accounts:', error);
    throw error;
  }
}

export async function getAdAccountStats(
  accessToken: string,
  adAccountId: string,
  startDate: string,
  endDate: string
): Promise<SnapchatInsight[]> {
  try {
    // تحويل التاريخ إلى صيغة ISO 8601
    const startDateTime = `${startDate}T00:00:00.000Z`;
    const endDateTime = `${endDate}T23:59:59.999Z`;

    console.log(`Fetching stats for account ${adAccountId} from ${startDateTime} to ${endDateTime}`);

    const response = await axios.get(
      `${SNAPCHAT_API_BASE}/adaccounts/${adAccountId}/stats`,
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
        params: {
          granularity: 'DAY',
          start_time: startDateTime,
          end_time: endDateTime,
          fields: 'spend,impressions,swipes,conversion_purchases,conversion_purchases_value',
          swipe_up_attribution_window: '28_DAY',
          view_attribution_window: '7_DAY',
        },
      }
    );

    console.log('Snapchat API Response:', JSON.stringify(response.data, null, 2));

    const stats = response.data.timeseries_stats || [];
    
    // إذا لم تكن هناك بيانات، أرجع مصفوفة فارغة
    if (stats.length === 0) {
      console.log('No stats data returned from Snapchat API - this may be normal if there are no campaigns or no data in the date range');
      
      // إرجاع صف واحد بأصفار لعرض الجدول
      return [
        {
          date: startDate,
          spend: 0,
          impressions: 0,
          swipes: 0,
          purchases: 0,
          purchase_value: 0,
        }
      ];
    }
    
    const mappedStats = stats.map((stat: any) => {
      const statData = stat.stats || {};
      console.log(`Processing stat for ${stat.start_time}:`, statData);
      
      return {
        date: stat.start_time ? stat.start_time.split('T')[0] : startDate,
        spend: statData.spend ? parseFloat(statData.spend) / 1000000 : 0,
        impressions: statData.impressions ? parseInt(statData.impressions) : 0,
        swipes: statData.swipes ? parseInt(statData.swipes) : 0,
        purchases: statData.conversion_purchases ? parseInt(statData.conversion_purchases) : 0,
        purchase_value: statData.conversion_purchases_value ? parseFloat(statData.conversion_purchases_value) / 1000000 : 0,
      };
    });

    console.log(`Returning ${mappedStats.length} stats records`);
    return mappedStats;
  } catch (error: any) {
    console.error('Error fetching Snapchat stats:');
    console.error('Error message:', error.message);
    console.error('Error response:', error.response?.data);
    console.error('Error status:', error.response?.status);
    
    // إرجاع بيانات فارغة مع رسالة خطأ
    throw new Error(`Failed to fetch stats: ${error.response?.data?.error?.message || error.message}`);
  }
}
