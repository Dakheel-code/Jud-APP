import axios from 'axios';

const TIKTOK_API_BASE = 'https://business-api.tiktok.com/open_api/v1.3';

interface TikTokTokenResponse {
  access_token: string;
  advertiser_ids: string[];
}

interface TikTokAdvertiser {
  advertiser_id: string;
  advertiser_name: string;
}

export async function exchangeTikTokCodeForToken(code: string): Promise<TikTokTokenResponse> {
  try {
    const response = await axios.post(
      'https://business-api.tiktok.com/open_api/v1.3/oauth2/access_token/',
      {
        app_id: process.env.TIKTOK_CLIENT_KEY,
        secret: process.env.TIKTOK_CLIENT_SECRET,
        auth_code: code,
      }
    );

    if (response.data.code !== 0) {
      throw new Error(response.data.message || 'Failed to exchange code for token');
    }

    return {
      access_token: response.data.data.access_token,
      advertiser_ids: response.data.data.advertiser_ids || [],
    };
  } catch (error: any) {
    console.error('Error exchanging TikTok code for token:', error);
    throw new Error('Failed to authenticate with TikTok');
  }
}

export async function getTikTokAdvertisers(accessToken: string): Promise<TikTokAdvertiser[]> {
  try {
    const response = await axios.get(
      `${TIKTOK_API_BASE}/oauth2/advertiser/get/`,
      {
        headers: {
          'Access-Token': accessToken,
        },
        params: {
          app_id: process.env.TIKTOK_CLIENT_KEY,
          secret: process.env.TIKTOK_CLIENT_SECRET,
        },
      }
    );

    if (response.data.code !== 0) {
      throw new Error(response.data.message || 'Failed to get advertisers');
    }

    return response.data.data.list || [];
  } catch (error: any) {
    console.error('Error getting TikTok advertisers:', error);
    throw new Error('Failed to get TikTok ad accounts');
  }
}

export interface TikTokInsight {
  date: string;
  spend: number;
  impressions: number;
  clicks: number;
  conversions: number;
  conversion_value: number;
}

export async function getTikTokAdAccountStats(
  accessToken: string,
  advertiserId: string,
  startDate: string,
  endDate: string
): Promise<TikTokInsight[]> {
  try {
    const response = await axios.get(
      `${TIKTOK_API_BASE}/reports/integrated/get/`,
      {
        headers: {
          'Access-Token': accessToken,
        },
        params: {
          advertiser_id: advertiserId,
          report_type: 'BASIC',
          data_level: 'AUCTION_ADVERTISER',
          dimensions: JSON.stringify(['stat_time_day']),
          metrics: JSON.stringify([
            'spend',
            'impressions',
            'clicks',
            'conversion',
            'total_complete_payment_rate',
          ]),
          start_date: startDate,
          end_date: endDate,
          page_size: 1000,
        },
        timeout: 30000,
      }
    );

    if (response.data.code !== 0) {
      const errorMsg = response.data.message || 'خطأ في جلب البيانات';
      throw new Error(`خطأ من TikTok: ${errorMsg}`);
    }

    const data = response.data.data?.list || [];

    if (data.length === 0) {
      return [
        {
          date: startDate,
          spend: 0,
          impressions: 0,
          clicks: 0,
          conversions: 0,
          conversion_value: 0,
        },
      ];
    }

    return data.map((item: any) => ({
      date: item.dimensions?.stat_time_day || startDate,
      spend: parseFloat(item.metrics?.spend || 0),
      impressions: parseInt(item.metrics?.impressions || 0),
      clicks: parseInt(item.metrics?.clicks || 0),
      conversions: parseInt(item.metrics?.conversion || 0),
      conversion_value: parseFloat(item.metrics?.total_complete_payment_rate || 0),
    }));
  } catch (error: any) {
    console.error('Error fetching TikTok stats:', error);
    
    if (error.response?.status === 401 || error.response?.status === 403) {
      throw new Error('انتهت صلاحية الجلسة. يرجى تسجيل الدخول مرة أخرى');
    }
    
    throw new Error(`فشل في جلب البيانات من TikTok: ${error.message}`);
  }
}
