# دليل نشر المشروع على Netlify

## ✅ الطريقة الموصى بها: عبر GitHub

### الخطوة 1: رفع المشروع على GitHub

```bash
# في مجلد المشروع
git init
git add .
git commit -m "Initial commit: Snapchat Ads Analytics Platform"

# أنشئ repository جديد على GitHub ثم:
git remote add origin https://github.com/YOUR_USERNAME/snapchat-ads-analytics.git
git branch -M main
git push -u origin main
```

### الخطوة 2: ربط GitHub مع Netlify

1. اذهب إلى [app.netlify.com](https://app.netlify.com)
2. اضغط "Add new site" → "Import an existing project"
3. اختر "GitHub"
4. اختر repository المشروع
5. إعدادات البناء:
   - **Build command**: `npm run build`
   - **Publish directory**: `.next`
   - **Base directory**: (اتركه فارغاً)

### الخطوة 3: إضافة متغيرات البيئة

في Netlify Dashboard → Site settings → Environment variables، أضف:

```
DATABASE_URL=postgresql://USER:PASSWORD@HOST:5432/DB
JWT_SECRET=your_strong_random_jwt_secret
ENCRYPTION_KEY=your_32_character_encryption_key
NEXT_PUBLIC_APP_URL=https://your-site-name.netlify.app
SNAPCHAT_CLIENT_ID=your_client_id
SNAPCHAT_CLIENT_SECRET=your_client_secret
SNAPCHAT_REDIRECT_URI=https://your-site-name.netlify.app/api/auth/snapchat/callback
```

### الخطوة 4: إعادة النشر

اضغط "Trigger deploy" في Netlify Dashboard

---

## 🔧 الطريقة البديلة: Netlify CLI

إذا كنت تفضل CLI:

```bash
# تسجيل الدخول
netlify login

# إنشاء موقع جديد
netlify sites:create --name snapchat-ads-analytics

# ربط المجلد الحالي
netlify link

# إضافة متغيرات البيئة
netlify env:set DATABASE_URL "postgresql://..."
netlify env:set JWT_SECRET "1b5582f275ceff4870747b7a94ed8abc24ebdea65e4c46ba44281a2d998886a5"
netlify env:set ENCRYPTION_KEY "85e6f3d7e00756c2ec1761f51458db69"

# بناء ونشر
npm run build
netlify deploy --prod --dir=.next
```

---

## ⚠️ ملاحظات مهمة

### 1. Next.js على Netlify

المشروع يستخدم Next.js 14 مع:
- Server-side rendering
- API Routes
- Dynamic routes

**تحتاج إلى:**
- تثبيت `@netlify/plugin-nextjs` (موجود في `netlify.toml`)
- استخدام Netlify Functions للـ API routes

### 2. قاعدة البيانات

المشروع متصل بـ Supabase PostgreSQL:
- ✅ يعمل في Production
- ✅ لا حاجة لتغييرات

### 3. المتغيرات البيئية

**لا تنسَ إضافة جميع المتغيرات في Netlify Dashboard!**

---

## 🎯 بعد النشر

1. **اختبر الموقع**
2. **أنشئ حساب جديد**
3. **تحقق من الاتصال بقاعدة البيانات**
4. **أضف Snapchat API credentials لاحقاً**

---

## 📞 المساعدة

إذا واجهت مشاكل:
- تحقق من Build logs في Netlify
- تأكد من متغيرات البيئة
- راجع [Netlify Next.js Docs](https://docs.netlify.com/frameworks/next-js/)
