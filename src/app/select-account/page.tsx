'use client';

import { useSearchParams, useRouter } from 'next/navigation';
import { useEffect, useState, Suspense } from 'react';
import { ShoppingCart, Search, ChevronLeft, ChevronRight } from 'lucide-react';

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
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const accountsPerPage = 10;

  useEffect(() => {
    // محاولة قراءة البيانات من localStorage أولاً
    const savedSession = localStorage.getItem('snapchat_session');
    
    if (savedSession) {
      try {
        const sessionData = JSON.parse(savedSession);
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
      // إذا لم تكن هناك بيانات في localStorage، حاول من URL (للتوافق مع الإصدارات القديمة)
      const sessionParam = searchParams.get('session');
      if (sessionParam) {
        try {
          const decodedData = decodeURIComponent(escape(atob(sessionParam)));
          const sessionData = JSON.parse(decodedData);
          setAdAccounts(sessionData.adAccounts || []);
          setStoreName(sessionData.storeName || '');
          
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
    }
  }, [searchParams, router]);

  const handleContinue = () => {
    if (!selectedAccountId) {
      alert('يرجى اختيار حساب إعلاني');
      return;
    }

    // قراءة البيانات من localStorage
    const savedSession = localStorage.getItem('snapchat_session');
    if (savedSession) {
      const sessionData = JSON.parse(savedSession);
      sessionData.selectedAdAccountId = selectedAccountId;
      
      // حفظ بيانات الجلسة المحدثة
      localStorage.setItem('snapchat_session', JSON.stringify(sessionData));
      
      // تحديث قائمة المنصات المتصلة
      const connectedPlatforms = JSON.parse(localStorage.getItem('connected_platforms') || '[]');
      if (!connectedPlatforms.includes('snapchat')) {
        connectedPlatforms.push('snapchat');
        localStorage.setItem('connected_platforms', JSON.stringify(connectedPlatforms));
      }
      
      // العودة لصفحة ربط المنصات
      router.push(`/connect-platforms?storeName=${encodeURIComponent(sessionData.storeName)}&storeUrl=${encodeURIComponent(sessionData.storeUrl)}`);
    }
  };

  if (adAccounts.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-pulse text-gray-600">جاري التحميل...</div>
      </div>
    );
  }

  // تصفية الحسابات بناءً على البحث
  const filteredAccounts = adAccounts.filter(account => 
    account.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    account.id.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // حساب عدد الصفحات
  const totalPages = Math.ceil(filteredAccounts.length / accountsPerPage);
  
  // الحسابات المعروضة في الصفحة الحالية
  const startIndex = (currentPage - 1) * accountsPerPage;
  const endIndex = startIndex + accountsPerPage;
  const displayedAccounts = filteredAccounts.slice(startIndex, endIndex);

  // إعادة تعيين الصفحة عند البحث
  const handleSearch = (query: string) => {
    setSearchQuery(query);
    setCurrentPage(1);
  };

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
          <p className="text-sm text-gray-500 mt-2">
            إجمالي الحسابات: {adAccounts.length}
          </p>
        </div>

        {/* حقل البحث */}
        <div className="mb-6">
          <div className="relative">
            <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="ابحث عن حساب بالاسم أو ID..."
              value={searchQuery}
              onChange={(e) => handleSearch(e.target.value)}
              className="w-full pr-10 pl-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            />
          </div>
          {searchQuery && (
            <p className="text-sm text-gray-600 mt-2">
              النتائج: {filteredAccounts.length} من {adAccounts.length}
            </p>
          )}
        </div>

        {/* قائمة الحسابات */}
        <div className="space-y-4 mb-6">
          {displayedAccounts.length > 0 ? (
            displayedAccounts.map((account) => (
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
          ))
          ) : (
            <div className="text-center py-8 text-gray-500">
              لا توجد نتائج للبحث &quot;{searchQuery}&quot;
            </div>
          )}
        </div>

        {/* أزرار التنقل بين الصفحات */}
        {totalPages > 1 && (
          <div className="flex items-center justify-between mb-6 pb-6 border-b">
            <button
              onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
              disabled={currentPage === 1}
              className="flex items-center gap-2 px-4 py-2 rounded-lg border border-gray-300 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition"
            >
              <ChevronRight className="w-5 h-5" />
              السابق
            </button>
            
            <div className="flex items-center gap-2">
              <span className="text-sm text-gray-600">
                صفحة {currentPage} من {totalPages}
              </span>
            </div>
            
            <button
              onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
              disabled={currentPage === totalPages}
              className="flex items-center gap-2 px-4 py-2 rounded-lg border border-gray-300 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition"
            >
              التالي
              <ChevronLeft className="w-5 h-5" />
            </button>
          </div>
        )}

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
