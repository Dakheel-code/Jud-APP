'use client';

import { useSearchParams } from 'next/navigation';
import { useEffect, useState, Suspense } from 'react';
import type { ReactNode } from 'react';
import { TrendingUp, DollarSign, MousePointerClick, ShoppingCart } from 'lucide-react';

export const dynamic = 'force-dynamic';

interface InsightData {
  date: string;
  spend: number;
  swipes: number;
  purchases: number;
  purchaseValue: number;
  impressions: number;
}

interface StatsData {
  totalSpend: number;
  totalPurchases: number;
  totalRevenue: number;
  totalSwipes: number;
  avgROAS: number;
  avgCPA: number;
  insights: InsightData[];
}

type DateRange = { startDate: string; endDate: string };

function DashboardContent() {
  const searchParams = useSearchParams();
  
  const [storeName, setStoreName] = useState('متجرك');
  const [adAccounts, setAdAccounts] = useState<Array<{id: string, name: string, status: string}>>([]);
  const [selectedAdAccountId, setSelectedAdAccountId] = useState<string>('');
  const [stats, setStats] = useState<StatsData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const defaultEndDate = new Date().toISOString().split('T')[0];
  const defaultStartDate = new Date(Date.now() - 90 * 24 * 60 * 60 * 1000).toISOString().split('T')[0];
  const [ranges, setRanges] = useState<DateRange[]>([{ startDate: defaultStartDate, endDate: defaultEndDate }]);

  useEffect(() => {
    const savedSession = localStorage.getItem('snapchat_session');
    if (savedSession) {
      const sessionData = JSON.parse(savedSession);
      setStoreName(sessionData.storeName || 'متجرك');
      setAdAccounts(sessionData.adAccounts || []);
      setSelectedAdAccountId(sessionData.selectedAdAccountId || '');
    }
  }, []);

  useEffect(() => {
    const sessionParam = searchParams.get('session');
    
    if (sessionParam) {
      try {
        const sessionData = JSON.parse(atob(sessionParam));
        localStorage.setItem('snapchat_session', JSON.stringify(sessionData));
        window.history.replaceState({}, '', '/dashboard');
      } catch (err) {
        console.error('Failed to parse session:', err);
      }
    }

    const savedSession = localStorage.getItem('snapchat_session');
    if (!savedSession) {
      setError('لا توجد جلسة نشطة. يرجى الربط مع Snapchat من جديد.');
      setLoading(false);
      return;
    }

    fetchStats();
  }, [selectedAdAccountId]);

  const fetchStats = async () => {
    setLoading(true);
    try {
      const savedSession = localStorage.getItem('snapchat_session');
      if (!savedSession) {
        throw new Error('No session found');
      }

      const sessionData = JSON.parse(savedSession);
      const accountId = selectedAdAccountId || sessionData.selectedAdAccountId;
      
      if (!accountId) {
        throw new Error('No ad account selected');
      }

      const validRanges = ranges
        .filter((r) => r.startDate && r.endDate)
        .map((r) => ({
          startDate: r.startDate,
          endDate: r.endDate,
        }));

      if (validRanges.length === 0) {
        throw new Error('يرجى اختيار فترة زمنية واحدة على الأقل');
      }

      const response = await fetch('/api/insights', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          accessToken: sessionData.accessToken,
          refreshToken: sessionData.refreshToken,
          adAccountId: accountId,
          ranges: validRanges,
        }),
      });
      
      if (!response.ok) {
        const errBody = await response.json().catch(() => null);
        const serverMessage = errBody?.message || errBody?.error;
        throw new Error(serverMessage || `فشل في جلب البيانات (${response.status})`);
      }
      
      const data = await response.json();

      if (data?.refreshedTokens?.accessToken) {
        sessionData.accessToken = data.refreshedTokens.accessToken;
        sessionData.refreshToken = data.refreshedTokens.refreshToken;
        sessionData.expiresAt = data.refreshedTokens.expiresAt;
        localStorage.setItem('snapchat_session', JSON.stringify(sessionData));
      }

      setStats(data);
      setError(null);
    } catch (err: any) {
      setError(err?.message || 'حدث خطأ في جلب البيانات');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleAdAccountChange = (accountId: string) => {
    setSelectedAdAccountId(accountId);
    
    // تحديث localStorage
    const savedSession = localStorage.getItem('snapchat_session');
    if (savedSession) {
      const sessionData = JSON.parse(savedSession);
      sessionData.selectedAdAccountId = accountId;
      localStorage.setItem('snapchat_session', JSON.stringify(sessionData));
    }
  };


  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('ar-SA', {
      style: 'currency',
      currency: 'SAR',
      minimumFractionDigits: 2
    }).format(value);
  };

  const formatNumber = (value: number) => {
    return new Intl.NumberFormat('ar-SA').format(value);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-white shadow-sm border-b">
        <div className="container mx-auto px-4 py-4">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">{storeName}</h1>
              <p className="text-sm text-gray-600">لوحة التحكم</p>
            </div>
            <div className="flex gap-4">
              <a
                href="/"
                className="text-gray-600 hover:text-gray-900 px-4 py-2"
              >
                الصفحة الرئيسية
              </a>
              <button
                onClick={() => {
                  localStorage.removeItem('snapchat_session');
                  localStorage.removeItem('connected_platforms');
                  window.location.href = '/';
                }}
                className="bg-red-600 text-white px-4 py-2 rounded-lg font-semibold hover:bg-red-700 transition"
              >
                تسجيل الخروج
              </button>
            </div>
          </div>
        </div>
      </nav>

      <div className="container mx-auto px-4 py-8">
        <div className="bg-white rounded-xl shadow-lg p-6 mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl font-bold text-gray-900">إحصائيات Snapchat</h2>
              <p className="text-sm text-gray-600">البيانات من Snapchat Ads</p>
            </div>
            <button
              onClick={fetchStats}
              className="bg-primary-600 text-white px-6 py-2 rounded-lg font-semibold hover:bg-primary-700 transition"
            >
              تحديث البيانات
            </button>
          </div>

          <div className="mt-6 border-t pt-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-semibold text-gray-900">الفترات الزمنية</h3>
              <button
                type="button"
                onClick={() => setRanges((prev) => [...prev, { startDate: defaultStartDate, endDate: defaultEndDate }])}
                className="px-4 py-2 rounded-lg border border-gray-300 hover:bg-gray-50 transition text-sm"
              >
                إضافة فترة
              </button>
            </div>

            <div className="space-y-3">
              {ranges.map((r, idx) => (
                <div key={idx} className="grid grid-cols-1 md:grid-cols-12 gap-3 items-end">
                  <div className="md:col-span-5">
                    <label className="block text-sm text-gray-600 mb-1">من</label>
                    <input
                      type="date"
                      value={r.startDate}
                      onChange={(e) =>
                        setRanges((prev) =>
                          prev.map((x, i) => (i === idx ? { ...x, startDate: e.target.value } : x))
                        )
                      }
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    />
                  </div>
                  <div className="md:col-span-5">
                    <label className="block text-sm text-gray-600 mb-1">إلى</label>
                    <input
                      type="date"
                      value={r.endDate}
                      onChange={(e) =>
                        setRanges((prev) =>
                          prev.map((x, i) => (i === idx ? { ...x, endDate: e.target.value } : x))
                        )
                      }
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    />
                  </div>
                  <div className="md:col-span-2 flex gap-2">
                    <button
                      type="button"
                      onClick={() => setRanges((prev) => prev.filter((_, i) => i !== idx))}
                      disabled={ranges.length === 1}
                      className="w-full px-4 py-2 rounded-lg bg-red-600 text-white hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed transition text-sm"
                    >
                      حذف
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {loading ? (
          <div className="text-center py-12">
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
            <p className="mt-4 text-gray-600">جاري تحميل البيانات...</p>
          </div>
        ) : error ? (
          <div className="bg-red-50 border border-red-200 rounded-xl p-6 text-center">
            <p className="text-red-800">{error}</p>
            <button
              onClick={fetchStats}
              className="mt-4 bg-red-600 text-white px-6 py-2 rounded-lg font-semibold hover:bg-red-700 transition"
            >
              إعادة المحاولة
            </button>
          </div>
        ) : stats ? (
          <>
            <div className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">
                نظرة عامة
              </h2>
              <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
                <StatCard
                  icon={<DollarSign className="w-8 h-8 text-primary-600" />}
                  title="إجمالي الصرف"
                  value={formatCurrency(stats.totalSpend)}
                  subtitle="الإنفاق الإعلاني"
                />
                <StatCard
                  icon={<ShoppingCart className="w-8 h-8 text-green-600" />}
                  title="إجمالي المبيعات"
                  value={formatNumber(stats.totalPurchases)}
                  subtitle="عدد المشتريات"
                />
                <StatCard
                  icon={<TrendingUp className="w-8 h-8 text-blue-600" />}
                  title="قيمة المبيعات"
                  value={formatCurrency(stats.totalRevenue)}
                  subtitle="إجمالي الإيرادات"
                />
                <StatCard
                  icon={<MousePointerClick className="w-8 h-8 text-purple-600" />}
                  title="العائد على الإنفاق"
                  value={stats.avgROAS.toFixed(2) + 'x'}
                  subtitle={`CPA: ${formatCurrency(stats.avgCPA)}`}
                />
              </div>
            </div>

            <div className="bg-white rounded-xl shadow-lg p-6">
              <h3 className="text-xl font-bold text-gray-900 mb-4">
                الأداء اليومي
              </h3>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b">
                      <th className="text-right py-3 px-4">التاريخ</th>
                      <th className="text-right py-3 px-4">الصرف</th>
                      <th className="text-right py-3 px-4">النقرات</th>
                      <th className="text-right py-3 px-4">المبيعات</th>
                      <th className="text-right py-3 px-4">قيمة المبيعات</th>
                      <th className="text-right py-3 px-4">ROAS</th>
                    </tr>
                  </thead>
                  <tbody>
                    {stats.insights.map((insight, index) => {
                      const roas = insight.spend > 0 ? insight.purchaseValue / insight.spend : 0;
                      
                      return (
                        <tr key={index} className="border-b hover:bg-gray-50">
                          <td className="py-3 px-4">{insight.date}</td>
                          <td className="py-3 px-4">{formatCurrency(insight.spend)}</td>
                          <td className="py-3 px-4">{formatNumber(insight.swipes)}</td>
                          <td className="py-3 px-4">{formatNumber(insight.purchases)}</td>
                          <td className="py-3 px-4">{formatCurrency(insight.purchaseValue)}</td>
                          <td className="py-3 px-4 font-semibold">{roas.toFixed(2)}x</td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          </>
        ) : null}
      </div>
    </div>
  );
}

function StatCard({
  icon,
  title,
  value,
  subtitle,
}: {
  icon: ReactNode;
  title: string;
  value: string;
  subtitle: string;
}) {
  return (
    <div className="bg-white rounded-xl shadow-lg p-6">
      <div className="flex items-start justify-between mb-4">
        {icon}
      </div>
      <h3 className="text-sm text-gray-600 mb-1">{title}</h3>
      <p className="text-2xl font-bold text-gray-900 mb-1">{value}</p>
      <p className="text-xs text-gray-500">{subtitle}</p>
    </div>
  );
}

export default function DashboardPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-pulse">جاري التحميل...</div>
      </div>
    }>
      <DashboardContent />
    </Suspense>
  );
}
