import axios from 'axios';

const META_GRAPH_API_BASE = 'https://graph.facebook.com/v18.0';

export interface MetaTokenResponse {
  access_token: string;
  token_type: string;
  expires_in?: number;
}

export interface MetaAdAccount {
  id: string;
  name: string;
  account_id: string;
  account_status: number;
  currency: string;
}

export interface MetaInsight {
  date: string;
  spend: number;
  impressions: number;
  clicks: number;
  purchases: number;
  purchase_value: number;
}

export async function exchangeCodeForToken(code: string): Promise<MetaTokenResponse> {
  try {
    const response = await axios.get(
      `${META_GRAPH_API_BASE}/oauth/access_token`,
      {
        params: {
          client_id: process.env.META_APP_ID!,
          client_secret: process.env.META_APP_SECRET!,
          redirect_uri: process.env.META_REDIRECT_URI!,
          code,
        },
      }
    );

    return response.data;
  } catch (error: any) {
    console.error('Error exchanging Meta code for token:', error.response?.data || error.message);
    throw new Error('فشل في المصادقة مع Meta');
  }
}

export async function getLongLivedToken(shortLivedToken: string): Promise<MetaTokenResponse> {
  try {
    const response = await axios.get(
      `${META_GRAPH_API_BASE}/oauth/access_token`,
      {
        params: {
          grant_type: 'fb_exchange_token',
          client_id: process.env.META_APP_ID!,
          client_secret: process.env.META_APP_SECRET!,
          fb_exchange_token: shortLivedToken,
        },
      }
    );

    return response.data;
  } catch (error: any) {
    console.error('Error getting long-lived token:', error.response?.data || error.message);
    throw new Error('فشل في الحصول على رمز طويل الأمد');
  }
}

export async function getAdAccounts(accessToken: string): Promise<MetaAdAccount[]> {
  try {
    const response = await axios.get(
      `${META_GRAPH_API_BASE}/me/adaccounts`,
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
        params: {
          fields: 'id,name,account_id,account_status,currency',
          limit: 100,
        },
      }
    );

    const accounts = response.data.data || [];
    
    return accounts.map((account: any) => ({
      id: account.id,
      name: account.name,
      account_id: account.account_id,
      account_status: account.account_status,
      currency: account.currency,
    }));
  } catch (error: any) {
    console.error('Error fetching Meta ad accounts:', error.response?.data || error.message);
    throw new Error('فشل في جلب الحسابات الإعلانية من Meta');
  }
}

export async function getAdAccountInsights(
  accessToken: string,
  adAccountId: string,
  startDate: string,
  endDate: string
): Promise<MetaInsight[]> {
  try {
    const response = await axios.get(
      `${META_GRAPH_API_BASE}/${adAccountId}/insights`,
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
        params: {
          time_range: JSON.stringify({
            since: startDate,
            until: endDate,
          }),
          time_increment: 1,
          level: 'account',
          fields: 'spend,impressions,clicks,actions,action_values',
          action_attribution_windows: ['7d_click', '1d_view'],
        },
        timeout: 30000,
      }
    );

    const insights = response.data.data || [];

    if (insights.length === 0) {
      return [
        {
          date: startDate,
          spend: 0,
          impressions: 0,
          clicks: 0,
          purchases: 0,
          purchase_value: 0,
        },
      ];
    }

    return insights.map((insight: any) => {
      const purchases = insight.actions?.find((action: any) => action.action_type === 'purchase')?.value || 0;
      const purchaseValue = insight.action_values?.find((action: any) => action.action_type === 'purchase')?.value || 0;

      return {
        date: insight.date_start || startDate,
        spend: parseFloat(insight.spend || 0),
        impressions: parseInt(insight.impressions || 0),
        clicks: parseInt(insight.clicks || 0),
        purchases: parseInt(purchases),
        purchase_value: parseFloat(purchaseValue),
      };
    });
  } catch (error: any) {
    console.error('Error fetching Meta insights:', error.response?.data || error.message);
    
    if (error.response?.status === 401 || error.response?.status === 403) {
      throw new Error('انتهت صلاحية الجلسة. يرجى تسجيل الدخول مرة أخرى');
    }
    
    if (error.response?.status === 400) {
      const errorMsg = error.response?.data?.error?.message || 'خطأ في البارامترات المرسلة';
      throw new Error(`خطأ في الطلب: ${errorMsg}`);
    }
    
    throw new Error(`فشل في جلب البيانات من Meta: ${error.message}`);
  }
}

export async function refreshAccessToken(accessToken: string): Promise<MetaTokenResponse> {
  try {
    const response = await axios.get(
      `${META_GRAPH_API_BASE}/oauth/access_token`,
      {
        params: {
          grant_type: 'fb_exchange_token',
          client_id: process.env.META_APP_ID!,
          client_secret: process.env.META_APP_SECRET!,
          fb_exchange_token: accessToken,
        },
      }
    );

    return response.data;
  } catch (error: any) {
    console.error('Error refreshing Meta access token:', error.response?.data || error.message);
    throw new Error('فشل في تحديث رمز الوصول');
  }
}
