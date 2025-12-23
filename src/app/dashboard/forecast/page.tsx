'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, TrendingUp, AlertCircle } from 'lucide-react';
import { formatCurrency, formatNumber } from '@/lib/utils';

export default function ForecastPage() {
  const router = useRouter();
  const [budget, setBudget] = useState('');
  const [days, setDays] = useState('7');
  const [forecast, setForecast] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleForecast = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const response = await fetch('/api/forecast', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          proposedBudget: parseFloat(budget),
          forecastDays: parseInt(days),
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'فشل إنشاء التوقع');
      }

      setForecast(data);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-white shadow-sm border-b">
        <div className="container mx-auto px-4 py-4">
          <Link
            href="/dashboard"
            className="inline-flex items-center gap-2 text-primary-600 hover:text-primary-700"
          >
            <ArrowLeft className="w-5 h-5" />
            العودة للوحة التحكم
          </Link>
        </div>
      </nav>

      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            توقع المشتريات والإيرادات
          </h1>
          <p className="text-gray-600">
            احصل على توقعات ذكية بناءً على أداءك التاريخي
          </p>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          <div className="lg:col-span-1">
            <div className="bg-white rounded-xl shadow-lg p-6 sticky top-8">
              <h2 className="text-xl font-bold text-gray-900 mb-4">
                إعدادات التوقع
              </h2>

              <form onSubmit={handleForecast} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    الميزانية المقترحة (USD)
                  </label>
                  <input
                    type="number"
                    value={budget}
                    onChange={(e) => setBudget(e.target.value)}
                    required
                    min="1"
                    step="0.01"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    placeholder="1000"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    عدد الأيام
                  </label>
                  <select
                    value={days}
                    onChange={(e) => setDays(e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  >
                    <option value="7">7 أيام</option>
                    <option value="14">14 يوم</option>
                    <option value="30">30 يوم</option>
                  </select>
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-primary-600 text-white py-3 rounded-lg font-semibold hover:bg-primary-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loading ? 'جاري الحساب...' : 'احسب التوقعات'}
                </button>
              </form>

              {error && (
                <div className="mt-4 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
                  {error}
                </div>
              )}
            </div>
          </div>

          <div className="lg:col-span-2">
            {forecast ? (
              <div className="space-y-6">
                <div className="bg-white rounded-xl shadow-lg p-6">
                  <h3 className="text-xl font-bold text-gray-900 mb-4">
                    المؤشرات الأساسية
                  </h3>
                  <div className="grid md:grid-cols-2 gap-4">
                    <MetricCard
                      title="متوسط CPC"
                      value={formatCurrency(forecast.baselineMetrics.avgCPC)}
                    />
                    <MetricCard
                      title="متوسط CVR"
                      value={(forecast.baselineMetrics.avgCVR * 100).toFixed(2) + '%'}
                    />
                    <MetricCard
                      title="متوسط AOV"
                      value={formatCurrency(forecast.baselineMetrics.avgAOV)}
                    />
                    <MetricCard
                      title="متوسط ROAS"
                      value={forecast.baselineMetrics.avgROAS.toFixed(2) + 'x'}
                    />
                  </div>
                </div>

                {forecast.warnings.length > 0 && (
                  <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-6">
                    <div className="flex items-start gap-3">
                      <AlertCircle className="w-6 h-6 text-yellow-600 flex-shrink-0 mt-1" />
                      <div>
                        <h4 className="font-bold text-yellow-900 mb-2">تنبيهات</h4>
                        <ul className="space-y-1">
                          {forecast.warnings.map((warning: string, i: number) => (
                            <li key={i} className="text-yellow-800">
                              • {warning}
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  </div>
                )}

                <div className="space-y-4">
                  {forecast.scenarios.map((scenario: any) => (
                    <ScenarioCard key={scenario.scenario} scenario={scenario} />
                  ))}
                </div>
              </div>
            ) : (
              <div className="bg-white rounded-xl shadow-lg p-12 text-center">
                <TrendingUp className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                <h3 className="text-xl font-bold text-gray-900 mb-2">
                  ابدأ بإنشاء توقع
                </h3>
                <p className="text-gray-600">
                  أدخل الميزانية المقترحة وعدد الأيام لرؤية التوقعات
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

function MetricCard({ title, value }: { title: string; value: string }) {
  return (
    <div className="bg-gray-50 rounded-lg p-4">
      <p className="text-sm text-gray-600 mb-1">{title}</p>
      <p className="text-2xl font-bold text-gray-900">{value}</p>
    </div>
  );
}

function ScenarioCard({ scenario }: { scenario: any }) {
  const colors = {
    low: 'border-red-200 bg-red-50',
    expected: 'border-green-200 bg-green-50',
    high: 'border-blue-200 bg-blue-50',
  };

  const titles = {
    low: 'السيناريو المتحفظ',
    expected: 'السيناريو المتوقع',
    high: 'السيناريو المتفائل',
  };

  return (
    <div className={`border-2 rounded-xl p-6 ${colors[scenario.scenario as keyof typeof colors]}`}>
      <div className="flex items-center justify-between mb-4">
        <h4 className="text-lg font-bold text-gray-900">
          {titles[scenario.scenario as keyof typeof titles]}
        </h4>
        <span className="text-sm font-semibold text-gray-600">
          ثقة: {scenario.confidence}%
        </span>
      </div>

      <div className="grid md:grid-cols-3 gap-4">
        <div>
          <p className="text-sm text-gray-600 mb-1">النقرات المتوقعة</p>
          <p className="text-xl font-bold text-gray-900">
            {formatNumber(scenario.estimatedClicks)}
          </p>
        </div>
        <div>
          <p className="text-sm text-gray-600 mb-1">المشتريات المتوقعة</p>
          <p className="text-xl font-bold text-gray-900">
            {formatNumber(scenario.estimatedPurchases)}
          </p>
        </div>
        <div>
          <p className="text-sm text-gray-600 mb-1">الإيرادات المتوقعة</p>
          <p className="text-xl font-bold text-gray-900">
            {formatCurrency(scenario.estimatedRevenue)}
          </p>
        </div>
        <div>
          <p className="text-sm text-gray-600 mb-1">CPA المتوقع</p>
          <p className="text-xl font-bold text-gray-900">
            {formatCurrency(scenario.estimatedCPA)}
          </p>
        </div>
        <div>
          <p className="text-sm text-gray-600 mb-1">ROAS المتوقع</p>
          <p className="text-xl font-bold text-gray-900">
            {scenario.estimatedROAS.toFixed(2)}x
          </p>
        </div>
        <div>
          <p className="text-sm text-gray-600 mb-1">الميزانية</p>
          <p className="text-xl font-bold text-gray-900">
            {formatCurrency(scenario.budget)}
          </p>
        </div>
      </div>
    </div>
  );
}
