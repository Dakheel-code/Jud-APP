'use client';

import { useSearchParams, useRouter } from 'next/navigation';
import { useEffect, useState, Suspense } from 'react';
import { ExternalLink } from 'lucide-react';

function ConnectPlatformsContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [storeName, setStoreName] = useState('');
  const [storeUrl, setStoreUrl] = useState('');
  const [connectedPlatforms, setConnectedPlatforms] = useState<string[]>([]);

  useEffect(() => {
    const name = searchParams.get('storeName');
    const url = searchParams.get('storeUrl');
    
    if (!name || !url) {
      router.push('/');
      return;
    }
    
    setStoreName(name);
    setStoreUrl(url);
    
    // تحميل المنصات المتصلة
    const connected = JSON.parse(localStorage.getItem('connected_platforms') || '[]');
    setConnectedPlatforms(connected);
  }, [searchParams, router]);

  const handleSnapchatConnect = () => {
    // الانتقال إلى OAuth Snapchat
    const state = Buffer.from(JSON.stringify({ storeName, storeUrl })).toString('base64');
    window.location.href = `/api/auth/snapchat?storeName=${encodeURIComponent(storeName)}&storeUrl=${encodeURIComponent(storeUrl)}`;
  };

  const platforms = [
    {
      id: 'snapchat',
      name: 'سناب شات',
      logo: <span className="text-5xl">👻</span>,
      color: 'bg-yellow-400',
      available: true,
      onClick: handleSnapchatConnect
    },
    {
      id: 'tiktok',
      name: 'تيك توك',
      logo: (
        <svg className="w-12 h-12" viewBox="0 0 24 24" fill="white">
          <path d="M19.59 6.69a4.83 4.83 0 01-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 01-5.2 1.74 2.89 2.89 0 012.31-4.64 2.93 2.93 0 01.88.13V9.4a6.84 6.84 0 00-1-.05A6.33 6.33 0 005 20.1a6.34 6.34 0 0010.86-4.43v-7a8.16 8.16 0 004.77 1.52v-3.4a4.85 4.85 0 01-1-.1z"/>
        </svg>
      ),
      color: 'bg-black',
      available: false
    },
    {
      id: 'meta',
      name: 'ميتا',
      logo: <span className="text-5xl font-bold">f</span>,
      color: 'bg-blue-600',
      available: false
    },
    {
      id: 'google',
      name: 'قوقل',
      logo: <span className="text-5xl font-bold text-blue-600">G</span>,
      color: 'bg-white border-2 border-gray-200',
      available: false
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-xl shadow-lg p-8 max-w-4xl w-full">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            ربط حساباتك الإعلانية
          </h1>
          <p className="text-gray-600">
            {storeName} - اختر المنصات التي تريد ربطها
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {platforms.map((platform) => (
            <div
              key={platform.id}
              className={`relative border-2 rounded-xl p-6 transition ${
                platform.available
                  ? 'border-gray-200 hover:border-primary-400 cursor-pointer hover:shadow-md'
                  : 'border-gray-100 opacity-60'
              }`}
              onClick={platform.available ? platform.onClick : undefined}
            >
              {!platform.available && (
                <div className="absolute top-3 right-3">
                  <span className="bg-red-100 text-red-800 text-xs font-medium px-2.5 py-0.5 rounded-full">
                    غير متوفر
                  </span>
                </div>
              )}

              <div className="flex flex-col items-center text-center">
                <div className={`w-20 h-20 ${platform.color} rounded-full flex items-center justify-center mb-4`}>
                  {platform.logo}
                </div>
                
                <h3 className="text-xl font-bold text-gray-900 mb-2">
                  {platform.name}
                </h3>

                {connectedPlatforms.includes(platform.id) ? (
                  <div className="mt-4 w-full bg-green-100 text-green-800 px-6 py-3 rounded-lg font-semibold flex items-center justify-center gap-2">
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd"/>
                    </svg>
                    تم الربط
                  </div>
                ) : platform.available ? (
                  <button
                    className="mt-4 w-full bg-primary-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-primary-700 transition flex items-center justify-center gap-2"
                  >
                    <ExternalLink className="w-5 h-5" />
                    ربط الحساب
                  </button>
                ) : (
                  <div className="mt-4 w-full bg-gray-100 text-gray-500 px-6 py-3 rounded-lg font-semibold cursor-not-allowed">
                    قريباً
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>

        {connectedPlatforms.length > 0 && (
          <div className="mt-8 text-center">
            <button
              onClick={() => router.push('/dashboard')}
              className="bg-gradient-to-r from-purple-900 via-purple-800 to-blue-900 text-white px-8 py-3 rounded-xl font-bold hover:opacity-90 transition"
            >
              المواصلة إلى لوحة التحكم
            </button>
          </div>
        )}

        <div className="mt-4 text-center">
          <button
            onClick={() => router.push('/')}
            className="text-gray-600 hover:text-gray-900 underline"
          >
            العودة للصفحة الرئيسية
          </button>
        </div>
      </div>
    </div>
  );
}

export default function ConnectPlatformsPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-pulse">جاري التحميل...</div>
      </div>
    }>
      <ConnectPlatformsContent />
    </Suspense>
  );
}
