'use client';

import { useState } from 'react';
import { BarChart3, TrendingUp, FileText, Shield } from 'lucide-react';
import { useRouter } from 'next/router';

export default function HomePage() {
  const router = useRouter();
  const [storeName, setStoreName] = useState('');
  const [storeUrl, setStoreUrl] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    try {
      if (storeName && storeUrl) {
        // الانتقال إلى صفحة ربط المنصات
        router.push(`/connect-platforms?storeName=${encodeURIComponent(storeName)}&storeUrl=${encodeURIComponent(storeUrl)}`);
      }
    } catch (error) {
      console.error('Error:', error);
      alert('حدث خطأ، يرجى المحاولة مرة أخرى');
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 to-orange-50">
      <div className="container mx-auto px-4 py-16">
        <div className="text-center mb-16">
          <h1 className="text-5xl font-bold text-gray-900 mb-4">
            منصة تحليل وتوقع المشتريات
          </h1>
          <p className="text-xl text-gray-600 mb-8">
            حلّل حملاتك الإعلانية على Snapchat وتوقع مبيعاتك بدقة
          </p>
          
          <div className="max-w-md mx-auto bg-white rounded-2xl shadow-xl p-8 mb-12">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">
              ابدأ الآن
            </h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label htmlFor="storeName" className="block text-right text-gray-700 font-semibold mb-2">
                  اسم المتجر
                </label>
                <input
                  type="text"
                  id="storeName"
                  value={storeName}
                  onChange={(e) => setStoreName(e.target.value)}
                  required
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent text-right"
                  placeholder="أدخل اسم متجرك"
                />
              </div>
              
              <div>
                <label htmlFor="storeUrl" className="block text-right text-gray-700 font-semibold mb-2">
                  رابط المتجر
                </label>
                <input
                  type="url"
                  id="storeUrl"
                  value={storeUrl}
                  onChange={(e) => setStoreUrl(e.target.value)}
                  required
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent text-right"
                  placeholder="https://example.com"
                />
              </div>
              
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full bg-primary-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-primary-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isSubmitting ? 'جاري الحفظ...' : 'ابدأ التحليل'}
              </button>
            </form>
          </div>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 mb-16">
          <FeatureCard
            icon={<BarChart3 className="w-12 h-12 text-primary-600" />}
            title="تحليل شامل"
            description="احصل على تحليل مفصل لأداء حملاتك الإعلانية"
          />
          <FeatureCard
            icon={<TrendingUp className="w-12 h-12 text-primary-600" />}
            title="توقعات ذكية"
            description="توقع المبيعات والإيرادات بناءً على البيانات التاريخية"
          />
          <FeatureCard
            icon={<FileText className="w-12 h-12 text-primary-600" />}
            title="تقارير احترافية"
            description="صدّر تقارير PDF عربية بهوية متجرك"
          />
          <FeatureCard
            icon={<Shield className="w-12 h-12 text-primary-600" />}
            title="أمان وخصوصية"
            description="بياناتك محمية بأعلى معايير الأمان"
          />
        </div>

        <div className="bg-white rounded-2xl shadow-xl p-8 max-w-4xl mx-auto">
          <h2 className="text-3xl font-bold text-gray-900 mb-6 text-center">
            كيف تعمل المنصة؟
          </h2>
          <div className="space-y-6">
            <Step
              number="1"
              title="ربط حساب Snapchat Ads"
              description="اربط حسابك الإعلاني بأمان عبر OAuth"
            />
            <Step
              number="2"
              title="مزامنة البيانات"
              description="سيتم سحب بيانات حملاتك تلقائياً"
            />
            <Step
              number="3"
              title="تحليل الأداء"
              description="شاهد تحليلات مفصلة لجميع المؤشرات"
            />
            <Step
              number="4"
              title="توقع المبيعات"
              description="احصل على توقعات ذكية للمشتريات والإيرادات"
            />
            <Step
              number="5"
              title="تصدير التقارير"
              description="صدّر تقارير PDF احترافية بهوية متجرك"
            />
          </div>
        </div>
      </div>
    </div>
  );
}

function FeatureCard({
  icon,
  title,
  description,
}: {
  icon: React.ReactNode;
  title: string;
  description: string;
}) {
  return (
    <div className="bg-white rounded-xl p-6 shadow-lg hover:shadow-xl transition">
      <div className="mb-4">{icon}</div>
      <h3 className="text-xl font-bold text-gray-900 mb-2">{title}</h3>
      <p className="text-gray-600">{description}</p>
    </div>
  );
}

function Step({
  number,
  title,
  description,
}: {
  number: string;
  title: string;
  description: string;
}) {
  return (
    <div className="flex gap-4 items-start">
      <div className="flex-shrink-0 w-12 h-12 bg-primary-600 text-white rounded-full flex items-center justify-center font-bold text-xl">
        {number}
      </div>
      <div>
        <h4 className="text-lg font-bold text-gray-900 mb-1">{title}</h4>
        <p className="text-gray-600">{description}</p>
      </div>
    </div>
  );
}
