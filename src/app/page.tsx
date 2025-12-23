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
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-blue-50 to-purple-100 flex items-center justify-center py-4 md:py-8 px-4">
      <div className="w-full max-w-2xl">
        <div className="text-center mb-6 md:mb-8 animate-fade-in">
          <h1 className="text-3xl md:text-5xl font-bold text-gray-900 mb-3 md:mb-4 animate-slide-down">
            تحليل الحملات الاعلانية
          </h1>
          <p className="text-lg md:text-xl text-gray-700 mb-6 md:mb-8 animate-slide-up">
            حلّل حملاتك الإعلانية وتوقع مبيعاتك بدقة
          </p>
          
          <div className="bg-gradient-to-br from-purple-900 via-purple-800 to-blue-900 rounded-2xl md:rounded-3xl shadow-2xl p-6 md:p-8 border-2 md:border-4 border-purple-700 animate-scale-in">
            <h2 className="text-xl md:text-2xl font-bold text-white mb-4 md:mb-6">
              ابدأ الآن
            </h2>
            <form onSubmit={handleSubmit} className="space-y-4 md:space-y-5">
              <div className="animate-slide-right">
                <label htmlFor="storeName" className="block text-right text-white font-semibold mb-2 text-sm md:text-base">
                  اسم المتجر
                </label>
                <input
                  type="text"
                  id="storeName"
                  value={storeName}
                  onChange={(e) => setStoreName(e.target.value)}
                  required
                  className="w-full px-4 py-2.5 md:py-3 bg-white/10 backdrop-blur-sm border-2 border-white/30 rounded-xl text-white placeholder-white/60 focus:ring-2 focus:ring-white/50 focus:border-white/50 text-right transition-all duration-300 hover:bg-white/20"
                  placeholder="أدخل اسم متجرك"
                />
              </div>
              
              <div className="animate-slide-left">
                <label htmlFor="storeUrl" className="block text-right text-white font-semibold mb-2 text-sm md:text-base">
                  رابط المتجر
                </label>
                <input
                  type="url"
                  id="storeUrl"
                  value={storeUrl}
                  onChange={(e) => setStoreUrl(e.target.value)}
                  required
                  className="w-full px-4 py-2.5 md:py-3 bg-white/10 backdrop-blur-sm border-2 border-white/30 rounded-xl text-white placeholder-white/60 focus:ring-2 focus:ring-white/50 focus:border-white/50 text-right transition-all duration-300 hover:bg-white/20"
                  placeholder="https://example.com"
                />
              </div>
              
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full bg-white text-purple-900 px-6 md:px-8 py-2.5 md:py-3 rounded-xl font-bold hover:bg-purple-100 hover:scale-105 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg animate-pulse-slow"
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

