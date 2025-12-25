# نشر المشروع على GitHub Pages

## ⚠️ تنبيه مهم

هذا المشروع يحتوي على:
- API Routes (مسارات خادم)
- قاعدة بيانات (Database)
- مصادقة (Authentication)
- عمليات خلفية (Background jobs)

**GitHub Pages يدعم فقط المواقع الثابتة (Static Sites)** ولا يدعم الميزات الخادمية.

## الخيارات المتاحة

### 1. النشر على GitHub Pages (محدود)
- ✅ يمكن نشر واجهة المستخدم فقط
- ❌ لن تعمل API Routes
- ❌ لن تعمل المصادقة
- ❌ لن تعمل قاعدة البيانات

### 2. النشر على منصات تدعم Next.js (موصى به)
اختر إحدى هذه المنصات:

#### **Vercel** (الأفضل لـ Next.js)
```bash
npm i -g vercel
vercel login
vercel
```
- ✅ دعم كامل لـ Next.js
- ✅ نشر تلقائي من GitHub
- ✅ مجاني للمشاريع الشخصية

#### **Netlify**
```bash
npm i -g netlify-cli
netlify login
netlify deploy --prod
```
- ✅ دعم كامل لـ Next.js
- ✅ نشر تلقائي من GitHub

#### **Railway**
- ✅ دعم قواعد البيانات
- ✅ دعم Next.js الكامل
- ✅ نشر من GitHub

## إذا أردت النشر على GitHub Pages فقط

تم إعداد المشروع للنشر الثابت:

### الخطوات:

1. **ارفع المشروع على GitHub:**
```bash
git add .
git commit -m "Setup GitHub Pages deployment"
git push origin main
```

2. **فعّل GitHub Pages:**
   - اذهب إلى Settings → Pages
   - اختر Source: GitHub Actions
   - سيتم النشر تلقائياً

3. **الموقع سيكون متاح على:**
```
https://[username].github.io/jud-calculator/
```

### ⚠️ القيود:
- لن تعمل ميزات تسجيل الدخول
- لن تعمل مزامنة البيانات
- لن تعمل التقارير
- فقط الصفحات الثابتة ستعمل

## التوصية النهائية

**استخدم Vercel أو Netlify** للحصول على تجربة كاملة مع جميع الميزات.

GitHub Pages مناسب فقط للعرض التوضيحي للواجهة.
