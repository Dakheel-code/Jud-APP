'use client';

import { useSearchParams } from 'next/navigation';
import { CheckCircle } from 'lucide-react';

export default function SuccessPage() {
  const searchParams = useSearchParams();
  const storeName = searchParams.get('store') || 'متجرك';

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-white rounded-2xl shadow-xl p-8 text-center">
        <div className="mb-6 flex justify-center">
          <CheckCircle className="w-20 h-20 text-green-500" />
        </div>
        
        <h1 className="text-3xl font-bold text-gray-900 mb-4">
          تم الربط بنجاح! 🎉
        </h1>
        
        <p className="text-xl text-gray-600 mb-6">
          تم ربط <span className="font-bold text-primary-600">{storeName}</span> مع Snapchat Ads بنجاح
        </p>
        
        <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-6">
          <p className="text-green-800 text-sm">
            ✅ تم حفظ بيانات متجرك<br/>
            ✅ تم الربط مع Snapchat Ads<br/>
            ✅ يمكنك الآن البدء في تحليل حملاتك
          </p>
        </div>

        <div className="space-y-3">
          <a
            href="/"
            className="block w-full bg-primary-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-primary-700 transition"
          >
            العودة للصفحة الرئيسية
          </a>
          
          <p className="text-sm text-gray-500">
            سيتم إضافة المزيد من المميزات قريباً
          </p>
        </div>
      </div>
    </div>
  );
}
