'use client';

import { useState } from 'react';

export default function HomePage() {
  const [storeName, setStoreName] = useState('');
  const [storeUrl, setStoreUrl] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    try {
      if (storeName && storeUrl) {
        // الانتقال إلى صفحة ربط المنصات
        window.location.href = `/connect-platforms?storeName=${encodeURIComponent(storeName)}&storeUrl=${encodeURIComponent(storeUrl)}`;
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

      </div>
    </div>
  );
}

