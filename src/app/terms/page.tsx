export default function TermsPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-blue-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white rounded-2xl shadow-xl p-8 md:p-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-8 text-center">
            الشروط والأحكام
          </h1>
          
          <div className="prose prose-lg max-w-none text-right" dir="rtl">
            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-800 mb-4">
                1. مقدمة
              </h2>
              <p className="text-gray-600 leading-relaxed mb-4">
                مرحباً بك في منصة تحليل وتوقع المشتريات. باستخدامك لهذه المنصة، فإنك توافق على الالتزام بهذه الشروط والأحكام. يرجى قراءتها بعناية قبل استخدام خدماتنا.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-800 mb-4">
                2. استخدام الخدمة
              </h2>
              <p className="text-gray-600 leading-relaxed mb-4">
                تقدم منصتنا خدمات تحليل حملات Snapchat الإعلانية وتوقع المشتريات. يجب عليك:
              </p>
              <ul className="list-disc list-inside text-gray-600 space-y-2 mr-4">
                <li>استخدام الخدمة بشكل قانوني ومسؤول</li>
                <li>عدم محاولة اختراق أو تعطيل النظام</li>
                <li>الحفاظ على سرية بيانات الدخول الخاصة بك</li>
                <li>عدم مشاركة حسابك مع أطراف أخرى</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-800 mb-4">
                3. الخصوصية وحماية البيانات
              </h2>
              <p className="text-gray-600 leading-relaxed mb-4">
                نحن ملتزمون بحماية خصوصيتك. جميع البيانات التي تقدمها يتم تشفيرها وتخزينها بشكل آمن. نحن لا نشارك بياناتك مع أطراف ثالثة دون موافقتك الصريحة.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-800 mb-4">
                4. الملكية الفكرية
              </h2>
              <p className="text-gray-600 leading-relaxed mb-4">
                جميع المحتويات والتصاميم والشعارات والبرمجيات الموجودة على هذه المنصة هي ملكية خاصة ومحمية بموجب قوانين الملكية الفكرية.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-800 mb-4">
                5. إخلاء المسؤولية
              </h2>
              <p className="text-gray-600 leading-relaxed mb-4">
                التوقعات والتحليلات المقدمة هي لأغراض إعلامية فقط ولا تشكل نصيحة مالية أو استثمارية. نحن غير مسؤولين عن أي قرارات تتخذها بناءً على هذه التحليلات.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-800 mb-4">
                6. التعديلات على الشروط
              </h2>
              <p className="text-gray-600 leading-relaxed mb-4">
                نحتفظ بالحق في تعديل هذه الشروط والأحكام في أي وقت. سيتم إخطارك بأي تغييرات جوهرية عبر البريد الإلكتروني أو من خلال إشعار على المنصة.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-800 mb-4">
                7. الاتصال بنا
              </h2>
              <p className="text-gray-600 leading-relaxed mb-4">
                إذا كان لديك أي أسئلة حول هذه الشروط والأحكام، يرجى التواصل معنا عبر البريد الإلكتروني.
              </p>
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
