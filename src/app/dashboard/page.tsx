'use client';

import { useSearchParams } from 'next/navigation';
import { useEffect, useState, Suspense } from 'react';
import { TrendingUp, DollarSign, MousePointerClick, ShoppingCart, Calendar } from 'lucide-react';

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

function DashboardContent() {
  const searchParams = useSearchParams();
  
  const [storeName, setStoreName] = useState('متجرك');
  const [adAccounts, setAdAccounts] = useState<Array<{id: string, name: string, status: string}>>([]);
  const [selectedAdAccountId, setSelectedAdAccountId] = useState<string>('');
  const [stats, setStats] = useState<StatsData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [dateRange, setDateRange] = useState({
    startDate: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    endDate: new Date().toISOString().split('T')[0]
  });

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
  }, [dateRange, selectedAdAccountId]);

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

      const response = await fetch(
        `/api/insights?accessToken=${sessionData.accessToken}&adAccountId=${accountId}&startDate=${dateRange.startDate}&endDate=${dateRange.endDate}`
      );
      
      if (!response.ok) {
        throw new Error('فشل في جلب البيانات');
      }
      
      const data = await response.json();
      setStats(data);
      setError(null);
    } catch (err) {
      setError('حدث خطأ في جلب البيانات');
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
          <div className="flex items-center gap-4 flex-wrap">
            <Calendar className="w-6 h-6 text-primary-600" />
            <div className="flex items-center gap-4 flex-1">
              <div>
                <label className="block text-sm text-gray-600 mb-1">من تاريخ</label>
                <input
                  type="date"
                  value={dateRange.startDate}
                  onChange={(e) => setDateRange(prev => ({ ...prev, startDate: e.target.value }))}
                  className="border border-gray-300 rounded-lg px-4 py-2"
                />
              </div>
              <div>
                <label className="block text-sm text-gray-600 mb-1">إلى تاريخ</label>
                <input
                  type="date"
                  value={dateRange.endDate}
                  onChange={(e) => setDateRange(prev => ({ ...prev, endDate: e.target.value }))}
                  className="border border-gray-300 rounded-lg px-4 py-2"
                />
              </div>
              <button
                onClick={fetchStats}
                className="bg-primary-600 text-white px-6 py-2 rounded-lg font-semibold hover:bg-primary-700 transition mt-6"
              >
                تحديث
              </button>
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
  icon: React.ReactNode;
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
