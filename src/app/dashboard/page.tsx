import { redirect } from 'next/navigation';
import { getSession } from '@/lib/auth';
import { db } from '@/db';
import { snapConnections, snapInsightsDaily, stores } from '@/db/schema';
import { eq, desc, and, gte } from 'drizzle-orm';
import Link from 'next/link';
import { TrendingUp, DollarSign, MousePointerClick, ShoppingCart } from 'lucide-react';
import { formatCurrency, formatNumber, formatPercentage } from '@/lib/utils';

export default async function DashboardPage() {
  const session = await getSession();

  if (!session) {
    redirect('/auth/login');
  }

  const [store] = await db
    .select()
    .from(stores)
    .where(eq(stores.id, session.storeId))
    .limit(1);

  const [connection] = await db
    .select()
    .from(snapConnections)
    .where(and(eq(snapConnections.storeId, session.storeId), eq(snapConnections.isActive, true)))
    .limit(1);

  const thirtyDaysAgo = new Date();
  thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

  const insights = await db
    .select()
    .from(snapInsightsDaily)
    .where(
      and(
        eq(snapInsightsDaily.storeId, session.storeId),
        gte(snapInsightsDaily.date, thirtyDaysAgo.toISOString().split('T')[0])
      )
    )
    .orderBy(desc(snapInsightsDaily.date));

  const totalSpend = insights.reduce((sum, i) => sum + parseFloat(i.spend.toString()), 0);
  const totalPurchases = insights.reduce((sum, i) => sum + i.purchases, 0);
  const totalRevenue = insights.reduce((sum, i) => sum + parseFloat(i.purchaseValue.toString()), 0);
  const totalSwipes = insights.reduce((sum, i) => sum + i.swipes, 0);

  const avgROAS = totalSpend > 0 ? totalRevenue / totalSpend : 0;
  const avgCPA = totalPurchases > 0 ? totalSpend / totalPurchases : 0;

  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-white shadow-sm border-b">
        <div className="container mx-auto px-4 py-4">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">{store.storeName}</h1>
              <p className="text-sm text-gray-600">مرحباً، {session.email}</p>
            </div>
            <div className="flex gap-4">
              <Link
                href="/dashboard/forecast"
                className="bg-primary-600 text-white px-6 py-2 rounded-lg font-semibold hover:bg-primary-700 transition"
              >
                التوقعات
              </Link>
              <Link
                href="/dashboard/reports"
                className="bg-white text-primary-600 px-6 py-2 rounded-lg font-semibold border-2 border-primary-600 hover:bg-primary-50 transition"
              >
                التقارير
              </Link>
              <form action="/api/auth/logout" method="POST">
                <button
                  type="submit"
                  className="text-gray-600 hover:text-gray-900 px-4 py-2"
                >
                  تسجيل الخروج
                </button>
              </form>
            </div>
          </div>
        </div>
      </nav>

      <div className="container mx-auto px-4 py-8">
        {!connection ? (
          <div className="bg-white rounded-xl shadow-lg p-8 text-center">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              ابدأ بربط حساب Snapchat Ads
            </h2>
            <p className="text-gray-600 mb-6">
              اربط حسابك الإعلاني لبدء تحليل حملاتك وتوقع المبيعات
            </p>
            <Link
              href="/api/auth/snapchat"
              className="inline-block bg-primary-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-primary-700 transition"
            >
              ربط Snapchat Ads
            </Link>
          </div>
        ) : (
          <>
            <div className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">
                نظرة عامة - آخر 30 يوم
              </h2>
              <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
                <StatCard
                  icon={<DollarSign className="w-8 h-8 text-primary-600" />}
                  title="إجمالي الإنفاق"
                  value={formatCurrency(totalSpend)}
                  trend="+12%"
                />
                <StatCard
                  icon={<ShoppingCart className="w-8 h-8 text-green-600" />}
                  title="إجمالي المشتريات"
                  value={formatNumber(totalPurchases)}
                  trend="+8%"
                />
                <StatCard
                  icon={<TrendingUp className="w-8 h-8 text-blue-600" />}
                  title="ROAS"
                  value={avgROAS.toFixed(2) + 'x'}
                  trend="+5%"
                />
                <StatCard
                  icon={<MousePointerClick className="w-8 h-8 text-purple-600" />}
                  title="CPA"
                  value={formatCurrency(avgCPA)}
                  trend="-3%"
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
                      <th className="text-right py-3 px-4">الإنفاق</th>
                      <th className="text-right py-3 px-4">النقرات</th>
                      <th className="text-right py-3 px-4">المشتريات</th>
                      <th className="text-right py-3 px-4">الإيرادات</th>
                      <th className="text-right py-3 px-4">ROAS</th>
                    </tr>
                  </thead>
                  <tbody>
                    {insights.slice(0, 10).map((insight) => {
                      const roas = parseFloat(insight.spend.toString()) > 0
                        ? parseFloat(insight.purchaseValue.toString()) / parseFloat(insight.spend.toString())
                        : 0;
                      
                      return (
                        <tr key={insight.id} className="border-b hover:bg-gray-50">
                          <td className="py-3 px-4">{insight.date}</td>
                          <td className="py-3 px-4">{formatCurrency(parseFloat(insight.spend.toString()))}</td>
                          <td className="py-3 px-4">{formatNumber(insight.swipes)}</td>
                          <td className="py-3 px-4">{formatNumber(insight.purchases)}</td>
                          <td className="py-3 px-4">{formatCurrency(parseFloat(insight.purchaseValue.toString()))}</td>
                          <td className="py-3 px-4">{roas.toFixed(2)}x</td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

function StatCard({
  icon,
  title,
  value,
  trend,
}: {
  icon: React.ReactNode;
  title: string;
  value: string;
  trend: string;
}) {
  return (
    <div className="bg-white rounded-xl shadow-lg p-6">
      <div className="flex items-start justify-between mb-4">
        {icon}
        <span className="text-sm text-green-600 font-semibold">{trend}</span>
      </div>
      <h3 className="text-sm text-gray-600 mb-1">{title}</h3>
      <p className="text-2xl font-bold text-gray-900">{value}</p>
    </div>
  );
}
