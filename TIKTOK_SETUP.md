# دليل إعداد الربط مع TikTok for Business

## 📋 المتطلبات

لربط تطبيقك مع TikTok Ads Manager، تحتاج إلى:

1. **حساب TikTok for Business**
2. **TikTok Developer App**
3. **معرفات التطبيق (App ID & Secret)**

---

## 🚀 خطوات الإعداد

### 1. إنشاء حساب TikTok for Business

1. اذهب إلى: https://ads.tiktok.com/
2. سجّل دخول أو أنشئ حساب جديد
3. أكمل إعداد حسابك التجاري

### 2. إنشاء TikTok Developer App

1. اذهب إلى **TikTok for Developers**: https://developers.tiktok.com/
2. سجّل دخول بحساب TikTok الخاص بك
3. اذهب إلى **My Apps** → **Create an App**
4. املأ معلومات التطبيق:
   - **App Name**: اسم تطبيقك (مثلاً: "Jud Analytics")
   - **App Type**: اختر **TikTok for Business**
   - **Category**: Marketing & Advertising

### 3. إعداد OAuth Settings

بعد إنشاء التطبيق:

1. اذهب إلى **App Settings**
2. في قسم **OAuth**:
   - **Redirect URI**: أضف الرابط التالي:
     ```
     http://localhost:3000/api/auth/tiktok/callback
     ```
     للإنتاج:
     ```
     https://yourdomain.com/api/auth/tiktok/callback
     ```

3. في قسم **Permissions**، فعّل الصلاحيات التالية:
   - ✅ `user.info.basic` - معلومات المستخدم الأساسية
   - ✅ `business.adaccount` - الوصول للحسابات الإعلانية
   - ✅ `business.get` - قراءة بيانات الحملات
   - ✅ `business.insights` - الوصول للإحصائيات

### 4. الحصول على المعرفات

من صفحة **App Settings**:

1. **App ID** (Client Key): انسخ هذا المعرف
2. **App Secret** (Client Secret): انسخ هذا المفتاح السري

⚠️ **مهم**: احتفظ بـ App Secret في مكان آمن ولا تشاركه مع أحد!

### 5. إضافة المعرفات إلى ملف `.env`

افتح ملف `.env` في مشروعك وأضف:

```env
# TikTok OAuth
TIKTOK_CLIENT_KEY=your_app_id_here
TIKTOK_CLIENT_SECRET=your_app_secret_here
TIKTOK_REDIRECT_URI=http://localhost:3000/api/auth/tiktok/callback
```

استبدل `your_app_id_here` و `your_app_secret_here` بالمعرفات الحقيقية.

---

## 🔧 التكوين التقني

### API Endpoints المستخدمة

التطبيق يستخدم TikTok Marketing API:

1. **OAuth Authorization**:
   ```
   https://business-api.tiktok.com/portal/auth
   ```

2. **Token Exchange**:
   ```
   https://business-api.tiktok.com/open_api/v1.3/oauth2/access_token/
   ```

3. **Get Advertisers**:
   ```
   https://business-api.tiktok.com/open_api/v1.3/advertiser/info/
   ```

### الصلاحيات المطلوبة

```javascript
const scopes = [
  'user.info.basic',
  'business.adaccount',
  'business.get',
  'business.insights'
];
```

---

## 🧪 اختبار الربط

### 1. تشغيل التطبيق محلياً

```bash
npm run dev
```

### 2. اختبار OAuth Flow

1. افتح المتصفح: http://localhost:3000
2. أدخل اسم المتجر ورابطه
3. اضغط على "ابدأ التحليل"
4. في صفحة ربط المنصات، اضغط على **تيك توك**
5. سيتم توجيهك إلى صفحة تسجيل دخول TikTok
6. وافق على الصلاحيات المطلوبة
7. سيتم إعادة توجيهك إلى صفحة اختيار الحساب الإعلاني

### 3. التحقق من البيانات

بعد الربط الناجح، تحقق من:
- ✅ ظهور الحسابات الإعلانية
- ✅ إمكانية اختيار حساب
- ✅ الوصول إلى لوحة التحكم

---

## 🔐 الأمان

### حماية المعرفات

1. **لا تضع المعرفات في الكود مباشرة**
2. استخدم ملف `.env` فقط
3. تأكد من أن `.env` موجود في `.gitignore`
4. للإنتاج، استخدم متغيرات البيئة في منصة الاستضافة

### مثال `.gitignore`

```
.env
.env.local
.env.production
```

---

## 🌐 النشر للإنتاج

### 1. تحديث Redirect URI

في TikTok Developer Console:
```
https://yourdomain.com/api/auth/tiktok/callback
```

### 2. تحديث متغيرات البيئة

```env
TIKTOK_REDIRECT_URI=https://yourdomain.com/api/auth/tiktok/callback
NEXT_PUBLIC_APP_URL=https://yourdomain.com
```

### 3. منصات النشر الموصى بها

- **Vercel** (موصى به):
  ```bash
  vercel env add TIKTOK_CLIENT_KEY
  vercel env add TIKTOK_CLIENT_SECRET
  vercel env add TIKTOK_REDIRECT_URI
  ```

- **Netlify**:
  أضف المتغيرات في: Site Settings → Environment Variables

---

## 🐛 حل المشاكل الشائعة

### 1. خطأ "Invalid Redirect URI"

**الحل**:
- تأكد من أن Redirect URI في `.env` يطابق تماماً ما في TikTok Developer Console
- تأكد من عدم وجود `/` في نهاية الرابط

### 2. خطأ "Invalid App ID"

**الحل**:
- تحقق من أن `TIKTOK_CLIENT_KEY` صحيح
- تأكد من عدم وجود مسافات قبل أو بعد المعرف

### 3. خطأ "No Ad Accounts Found"

**الحل**:
- تأكد من أن لديك حساب إعلاني نشط في TikTok Ads Manager
- تحقق من الصلاحيات في Developer Console

### 4. خطأ "Token Exchange Failed"

**الحل**:
- تحقق من `TIKTOK_CLIENT_SECRET`
- تأكد من أن التطبيق في وضع Production وليس Development

---

## 📚 مصادر إضافية

- **TikTok Marketing API Docs**: https://business-api.tiktok.com/portal/docs
- **OAuth 2.0 Guide**: https://developers.tiktok.com/doc/oauth-user-access-token-management
- **API Reference**: https://business-api.tiktok.com/portal/docs?id=1738373164380162

---

## 💡 نصائح

1. **استخدم Sandbox Mode** أثناء التطوير إذا كان متاحاً
2. **احتفظ بنسخة احتياطية** من المعرفات
3. **راقب API Rate Limits** لتجنب الحظر
4. **فعّل 2FA** على حساب TikTok Developer الخاص بك

---

## 📞 الدعم

إذا واجهت مشاكل:
1. راجع TikTok Developer Documentation
2. تحقق من TikTok Developer Forum
3. افتح Support Ticket في TikTok for Business

---

**تم إنشاء هذا الدليل بواسطة Jud Analytics**
آخر تحديث: ديسمبر 2025
