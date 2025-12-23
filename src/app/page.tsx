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
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-blue-50 to-purple-100 flex items-center justify-center py-8">
      <div className="container mx-auto px-4">
        <div className="text-center mb-8">
          <h1 className="text-5xl font-bold text-gray-900 mb-4">
            منصة تحليل وتوقع المشتريات
          </h1>
          <p className="text-xl text-gray-700 mb-8">
            حلّل حملاتك الإعلانية على Snapchat وتوقع مبيعاتك بدقة
          </p>
          
          <div className="max-w-md mx-auto bg-gradient-to-br from-purple-900 via-purple-800 to-blue-900 rounded-3xl shadow-2xl p-8 border-4 border-purple-700">
            <h2 className="text-2xl font-bold text-white mb-6">
              ابدأ الآن
            </h2>
            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <label htmlFor="storeName" className="block text-right text-white font-semibold mb-2">
                  اسم المتجر
                </label>
                <input
                  type="text"
                  id="storeName"
                  value={storeName}
                  onChange={(e) => setStoreName(e.target.value)}
                  required
                  className="w-full px-4 py-3 bg-white/10 backdrop-blur-sm border-2 border-white/30 rounded-xl text-white placeholder-white/60 focus:ring-2 focus:ring-white/50 focus:border-white/50 text-right"
                  placeholder="أدخل اسم متجرك"
                />
              </div>
              
              <div>
                <label htmlFor="storeUrl" className="block text-right text-white font-semibold mb-2">
                  رابط المتجر
                </label>
                <input
                  type="url"
                  id="storeUrl"
                  value={storeUrl}
                  onChange={(e) => setStoreUrl(e.target.value)}
                  required
                  className="w-full px-4 py-3 bg-white/10 backdrop-blur-sm border-2 border-white/30 rounded-xl text-white placeholder-white/60 focus:ring-2 focus:ring-white/50 focus:border-white/50 text-right"
                  placeholder="https://example.com"
                />
              </div>
              
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full bg-white text-purple-900 px-8 py-3 rounded-xl font-bold hover:bg-purple-100 transition disabled:opacity-50 disabled:cursor-not-allowed shadow-lg"
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

