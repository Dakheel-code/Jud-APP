'use client';

import { useSearchParams, useRouter } from 'next/navigation';
import { useEffect, useState, Suspense } from 'react';
import { ShoppingCart } from 'lucide-react';

interface AdAccount {
  id: string;
  name: string;
  status: string;
}

function SelectAccountContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [adAccounts, setAdAccounts] = useState<AdAccount[]>([]);
  const [selectedAccountId, setSelectedAccountId] = useState<string>('');
  const [storeName, setStoreName] = useState('');

  useEffect(() => {
    const sessionParam = searchParams.get('session');
    
    if (sessionParam) {
      try {
        const sessionData = JSON.parse(atob(sessionParam));
        setAdAccounts(sessionData.adAccounts || []);
        setStoreName(sessionData.storeName || '');
        
        // اختر الحساب الأول افتراضياً
        if (sessionData.adAccounts && sessionData.adAccounts.length > 0) {
          setSelectedAccountId(sessionData.adAccounts[0].id);
        }
      } catch (err) {
        console.error('Failed to parse session:', err);
        router.push('/?error=invalid_session');
      }
    } else {
      router.push('/');
    }
  }, [searchParams, router]);

  const handleContinue = () => {
    if (!selectedAccountId) {
      alert('يرجى اختيار حساب إعلاني');
      return;
    }

    const sessionParam = searchParams.get('session');
    if (sessionParam) {
      const sessionData = JSON.parse(atob(sessionParam));
      sessionData.selectedAdAccountId = selectedAccountId;
      localStorage.setItem('snapchat_session', JSON.stringify(sessionData));
      router.push('/dashboard');
    }
  };

  if (adAccounts.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-pulse text-gray-600">جاري التحميل...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-xl shadow-lg p-8 max-w-2xl w-full">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-primary-100 rounded-full mb-4">
            <ShoppingCart className="w-8 h-8 text-primary-600" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            اختر الحساب الإعلاني
          </h1>
          <p className="text-gray-600">
            {storeName} - اختر الحساب الإعلاني الذي تريد عرض بياناته
          </p>
        </div>

        <div className="space-y-4 mb-8">
          {adAccounts.map((account) => (
            <label
              key={account.id}
              className={`block p-4 border-2 rounded-lg cursor-pointer transition ${
                selectedAccountId === account.id
                  ? 'border-primary-600 bg-primary-50'
                  : 'border-gray-200 hover:border-primary-300'
              }`}
            >
              <input
                type="radio"
                name="adAccount"
                value={account.id}
                checked={selectedAccountId === account.id}
                onChange={(e) => setSelectedAccountId(e.target.value)}
                className="sr-only"
              />
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-semibold text-gray-900">{account.name}</h3>
                  <p className="text-sm text-gray-600">ID: {account.id}</p>
                </div>
                <span
                  className={`px-3 py-1 rounded-full text-sm font-medium ${
                    account.status === 'ACTIVE'
                      ? 'bg-green-100 text-green-800'
                      : 'bg-gray-100 text-gray-800'
                  }`}
                >
                  {account.status}
                </span>
              </div>
            </label>
          ))}
        </div>

        <button
          onClick={handleContinue}
          className="w-full bg-primary-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-primary-700 transition"
        >
          متابعة إلى لوحة التحكم
        </button>
      </div>
    </div>
  );
}

export default function SelectAccountPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-pulse">جاري التحميل...</div>
      </div>
    }>
      <SelectAccountContent />
    </Suspense>
  );
}
