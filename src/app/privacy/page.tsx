export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white rounded-2xl shadow-xl p-8 md:p-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-8 text-center">
            سياسة الخصوصية
          </h1>
          
          <div className="prose prose-lg max-w-none text-right" dir="rtl">
            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-800 mb-4">
                1. المقدمة
              </h2>
              <p className="text-gray-600 leading-relaxed mb-4">
                نحن في منصة تحليل وتوقع المشتريات نلتزم بحماية خصوصيتك وبياناتك الشخصية. توضح هذه السياسة كيفية جمعنا واستخدامنا وحماية معلوماتك.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-800 mb-4">
                2. المعلومات التي نجمعها
              </h2>
              <p className="text-gray-600 leading-relaxed mb-4">
                نقوم بجمع الأنواع التالية من المعلومات:
              </p>
              <ul className="list-disc list-inside text-gray-600 space-y-2 mr-4">
                <li>معلومات الحساب: الاسم، البريد الإلكتروني، وكلمة المرور المشفرة</li>
                <li>بيانات الاستخدام: معلومات حول كيفية استخدامك للمنصة</li>
                <li>بيانات Snapchat: البيانات التي تمنحنا الإذن للوصول إليها من حسابك الإعلاني</li>
                <li>معلومات تقنية: عنوان IP، نوع المتصفح، ونظام التشغيل</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-800 mb-4">
                3. كيفية استخدام المعلومات
              </h2>
              <p className="text-gray-600 leading-relaxed mb-4">
                نستخدم المعلومات التي نجمعها للأغراض التالية:
              </p>
              <ul className="list-disc list-inside text-gray-600 space-y-2 mr-4">
                <li>تقديم وتحسين خدماتنا</li>
                <li>تحليل حملاتك الإعلانية وتقديم توقعات دقيقة</li>
                <li>التواصل معك بخصوص حسابك والخدمات</li>
                <li>ضمان أمان المنصة ومنع الاحتيال</li>
                <li>الامتثال للمتطلبات القانونية</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-800 mb-4">
                4. مشاركة المعلومات
              </h2>
              <p className="text-gray-600 leading-relaxed mb-4">
                نحن لا نبيع أو نؤجر معلوماتك الشخصية لأطراف ثالثة. قد نشارك معلوماتك فقط في الحالات التالية:
              </p>
              <ul className="list-disc list-inside text-gray-600 space-y-2 mr-4">
                <li>مع موافقتك الصريحة</li>
                <li>مع مزودي الخدمات الذين يساعدوننا في تشغيل المنصة</li>
                <li>عند الضرورة للامتثال للقوانين أو الأوامر القضائية</li>
                <li>لحماية حقوقنا أو سلامة المستخدمين</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-800 mb-4">
                5. أمان البيانات
              </h2>
              <p className="text-gray-600 leading-relaxed mb-4">
                نتخذ إجراءات أمنية صارمة لحماية بياناتك، بما في ذلك:
              </p>
              <ul className="list-disc list-inside text-gray-600 space-y-2 mr-4">
                <li>تشفير البيانات أثناء النقل والتخزين</li>
                <li>استخدام بروتوكولات أمان متقدمة</li>
                <li>مراقبة مستمرة للأنظمة للكشف عن التهديدات</li>
                <li>تقييد الوصول إلى البيانات للموظفين المصرح لهم فقط</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-800 mb-4">
                6. حقوقك
              </h2>
              <p className="text-gray-600 leading-relaxed mb-4">
                لديك الحقوق التالية فيما يتعلق ببياناتك الشخصية:
              </p>
              <ul className="list-disc list-inside text-gray-600 space-y-2 mr-4">
                <li>الوصول إلى بياناتك الشخصية</li>
                <li>تصحيح البيانات غير الدقيقة</li>
                <li>حذف بياناتك (الحق في النسيان)</li>
                <li>تقييد معالجة بياناتك</li>
                <li>نقل بياناتك إلى خدمة أخرى</li>
                <li>الاعتراض على معالجة بياناتك</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-800 mb-4">
                7. ملفات تعريف الارتباط (Cookies)
              </h2>
              <p className="text-gray-600 leading-relaxed mb-4">
                نستخدم ملفات تعريف الارتباط لتحسين تجربتك على المنصة. يمكنك التحكم في ملفات تعريف الارتباط من خلال إعدادات المتصفح الخاص بك.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-800 mb-4">
                8. الاحتفاظ بالبيانات
              </h2>
              <p className="text-gray-600 leading-relaxed mb-4">
                نحتفظببياناتك الشخصية طالما كان حسابك نشطاً أو حسب الحاجة لتقديم خدماتنا. يمكنك طلب حذف بياناتك في أي وقت.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-800 mb-4">
                9. خصوصية الأطفال
              </h2>
              <p className="text-gray-600 leading-relaxed mb-4">
                خدماتنا غير موجهة للأطفال دون سن 18 عاماً. نحن لا نجمع عن قصد معلومات شخصية من الأطفال.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-800 mb-4">
                10. التغييرات على سياسة الخصوصية
              </h2>
              <p className="text-gray-600 leading-relaxed mb-4">
                قد نقوم بتحديث هذه السياسة من وقت لآخر. سنقوم بإخطارك بأي تغييرات جوهرية عبر البريد الإلكتروني أو من خلال إشعار بارز على المنصة.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-800 mb-4">
                11. الاتصال بنا
              </h2>
              <p className="text-gray-600 leading-relaxed mb-4">
                إذا كان لديك أي أسئلة أو استفسارات حول سياسة الخصوصية هذه أو ممارساتنا المتعلقة بالبيانات، يرجى التواصل معنا عبر:
              </p>
              <ul className="list-disc list-inside text-gray-600 space-y-2 mr-4">
                <li>البريد الإلكتروني: dakheel@jud.sa</li>
              </ul>
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
