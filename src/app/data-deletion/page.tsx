export default function DataDeletionPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-red-50 via-white to-orange-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white rounded-2xl shadow-xl p-8 md:p-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-8 text-center">
            طلب حذف البيانات
          </h1>
          
          <div className="prose prose-lg max-w-none text-right" dir="rtl">
            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-800 mb-4">
                نظرة عامة
              </h2>
              <p className="text-gray-600 leading-relaxed mb-4">
                نحن نحترم حقك في الخصوصية والتحكم في بياناتك الشخصية. توضح هذه الصفحة كيفية طلب حذف بياناتك من منصتنا.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-800 mb-4">
                البيانات التي يمكن حذفها
              </h2>
              <p className="text-gray-600 leading-relaxed mb-4">
                عند طلب حذف بياناتك، سنقوم بحذف المعلومات التالية:
              </p>
              <ul className="list-disc list-inside text-gray-600 space-y-2 mr-4">
                <li>معلومات الحساب الشخصية (الاسم، البريد الإلكتروني)</li>
                <li>بيانات الاتصال بالمنصات الإعلانية (Snapchat، TikTok، Meta)</li>
                <li>رموز الوصول والمصادقة المحفوظة</li>
                <li>البيانات الإحصائية والتقارير المرتبطة بحسابك</li>
                <li>أي معلومات أخرى مرتبطة بحسابك</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-800 mb-4">
                كيفية طلب حذف البيانات
              </h2>
              <p className="text-gray-600 leading-relaxed mb-4">
                لطلب حذف بياناتك، يرجى اتباع الخطوات التالية:
              </p>
              <ol className="list-decimal list-inside text-gray-600 space-y-3 mr-4">
                <li>
                  <strong>إرسال طلب عبر البريد الإلكتروني:</strong>
                  <p className="mr-6 mt-2">
                    أرسل بريداً إلكترونياً إلى: <a href="mailto:dakheel@jud.sa" className="text-blue-600 hover:underline">dakheel@jud.sa</a>
                  </p>
                </li>
                <li>
                  <strong>تضمين المعلومات التالية في طلبك:</strong>
                  <ul className="list-disc list-inside mr-6 mt-2 space-y-1">
                    <li>عنوان البريد الإلكتروني المسجل في حسابك</li>
                    <li>اسم المتجر أو الحساب المرتبط</li>
                    <li>تأكيد رغبتك في حذف جميع البيانات</li>
                  </ul>
                </li>
                <li>
                  <strong>التحقق من الهوية:</strong>
                  <p className="mr-6 mt-2">
                    قد نطلب منك تأكيد هويتك للتأكد من أن الطلب صادر من صاحب الحساب الفعلي.
                  </p>
                </li>
              </ol>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-800 mb-4">
                الإطار الزمني للحذف
              </h2>
              <p className="text-gray-600 leading-relaxed mb-4">
                سنقوم بمعالجة طلب حذف البيانات الخاص بك خلال:
              </p>
              <ul className="list-disc list-inside text-gray-600 space-y-2 mr-4">
                <li><strong>30 يوماً</strong> من تاريخ استلام الطلب</li>
                <li>سنرسل لك تأكيداً عبر البريد الإلكتروني عند اكتمال عملية الحذف</li>
                <li>في حالة وجود أي تأخير، سنقوم بإعلامك بالسبب والإطار الزمني المتوقع</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-800 mb-4">
                البيانات المحتفظ بها
              </h2>
              <p className="text-gray-600 leading-relaxed mb-4">
                قد نحتفظ ببعض البيانات في الحالات التالية:
              </p>
              <ul className="list-disc list-inside text-gray-600 space-y-2 mr-4">
                <li>البيانات المطلوبة للامتثال للالتزامات القانونية</li>
                <li>البيانات اللازمة لحل النزاعات أو إنفاذ الاتفاقيات</li>
                <li>البيانات المجمعة أو المجهولة الهوية للأغراض الإحصائية</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-800 mb-4">
                تأثير حذف البيانات
              </h2>
              <p className="text-gray-600 leading-relaxed mb-4">
                يرجى ملاحظة أن حذف بياناتك سيؤدي إلى:
              </p>
              <ul className="list-disc list-inside text-gray-600 space-y-2 mr-4">
                <li>إنهاء وصولك إلى المنصة وجميع الخدمات المرتبطة</li>
                <li>فقدان جميع التقارير والإحصائيات المحفوظة</li>
                <li>إلغاء ربط جميع الحسابات الإعلانية</li>
                <li>عدم القدرة على استرداد البيانات بعد الحذف</li>
              </ul>
              <div className="mt-4 p-4 bg-yellow-50 border-r-4 border-yellow-400 rounded">
                <p className="text-yellow-800 font-semibold">
                  ⚠️ تنبيه: عملية حذف البيانات نهائية ولا يمكن التراجع عنها.
                </p>
              </div>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-800 mb-4">
                بدائل الحذف الكامل
              </h2>
              <p className="text-gray-600 leading-relaxed mb-4">
                إذا كنت لا ترغب في حذف بياناتك بالكامل، يمكنك:
              </p>
              <ul className="list-disc list-inside text-gray-600 space-y-2 mr-4">
                <li>إلغاء ربط منصات إعلانية معينة فقط</li>
                <li>تعطيل حسابك مؤقتاً</li>
                <li>تحديث أو تصحيح معلوماتك الشخصية</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-800 mb-4">
                الاتصال بنا
              </h2>
              <p className="text-gray-600 leading-relaxed mb-4">
                إذا كان لديك أي أسئلة حول عملية حذف البيانات أو سياسة الخصوصية الخاصة بنا، يرجى التواصل معنا:
              </p>
              <div className="bg-blue-50 p-6 rounded-lg mt-4">
                <p className="text-gray-700 mb-2">
                  <strong>البريد الإلكتروني:</strong> <a href="mailto:dakheel@jud.sa" className="text-blue-600 hover:underline">dakheel@jud.sa</a>
                </p>
                <p className="text-gray-700">
                  <strong>وكالة جود للتسويق الرقمي</strong>
                </p>
              </div>
            </section>

            <div className="mt-12 pt-8 border-t border-gray-200">
              <p className="text-sm text-gray-500 text-center">
                آخر تحديث: ديسمبر 2024
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
