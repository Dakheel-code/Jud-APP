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

    // ثانياً: الحصول على Ad Accounts من أول Organization
    const orgId = organizations[0].organization.id;
    const adAccountsResponse = await axios.get(
      `${SNAPCHAT_API_BASE}/organizations/${orgId}/adaccounts`,
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      }
    );

    const adAccounts = adAccountsResponse.data.adaccounts || [];
    
    return adAccounts.map((acc: any) => ({
      id: acc.adaccount.id,
      name: acc.adaccount.name,
      type: acc.adaccount.type,
      status: acc.adaccount.status,
    }));
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
  const response = await axios.get(
    `${SNAPCHAT_API_BASE}/adaccounts/${adAccountId}/stats`,
    {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
      params: {
        granularity: 'DAY',
        start_time: startDate,
        end_time: endDate,
        fields: 'spend,impressions,swipes,purchases,purchase_value',
      },
    }
  );

  const stats = response.data.timeseries_stats || [];
  
  return stats.map((stat: any) => ({
    date: stat.start_time.split('T')[0],
    spend: parseFloat(stat.stats.spend) / 1000000,
    impressions: parseInt(stat.stats.impressions),
    swipes: parseInt(stat.stats.swipes),
    purchases: parseInt(stat.stats.purchases || 0),
    purchase_value: parseFloat(stat.stats.purchase_value || 0) / 1000000,
  }));
}
