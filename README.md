# منصة تحليل وتوقع المشتريات – Snapchat Ads

## 🎯 نظرة عامة

منصّة ويب احترافية تمكّن شركات التسويق والمتاجر من:

- ✅ ربط حساب Snapchat Ads مباشرة عبر OAuth
- ✅ سحب بيانات الحملات الإعلانية تلقائيًا
- ✅ تحليل الأداء الفعلي بشكل شامل
- ✅ إنشاء توقعات ذكية للمشتريات (Purchases Forecast)
- ✅ تصدير تقارير PDF عربية احترافية بهوية المتجر

## 🛠️ التقنيات المستخدمة

- **Frontend**: Next.js 14 + TypeScript + Tailwind CSS
- **Backend**: Next.js API Routes
- **Database**: PostgreSQL + Drizzle ORM
- **Auth**: JWT + bcrypt
- **PDF**: Puppeteer
- **API Integration**: Snapchat Marketing API

## 📋 المتطلبات

- Node.js 18+
- PostgreSQL 14+
- حساب Snapchat Ads Developer

## 🚀 التثبيت والإعداد

### 1. تثبيت الحزم

```bash
npm install
```

### 2. إعداد قاعدة البيانات

قم بإنشاء قاعدة بيانات PostgreSQL وأضف رابط الاتصال في ملف `.env`:

```bash
cp .env.example .env
```

عدّل الملف `.env` وأضف المعلومات المطلوبة:

```env
DATABASE_URL=postgresql://user:password@localhost:5432/snapchat_analytics
SNAPCHAT_CLIENT_ID=your_client_id
SNAPCHAT_CLIENT_SECRET=your_client_secret
SNAPCHAT_REDIRECT_URI=http://localhost:3000/api/auth/snapchat/callback
JWT_SECRET=your_super_secret_jwt_key
ENCRYPTION_KEY=your_32_character_encryption_key
```

### 3. تشغيل Migrations

```bash
npm run db:generate
npm run db:migrate
```

### 4. تشغيل المشروع

```bash
npm run dev
```

المنصة ستكون متاحة على: `http://localhost:3000`

## 📱 إعداد Snapchat Ads API

1. سجّل في [Snapchat Business Manager](https://business.snapchat.com/)
2. أنشئ تطبيق جديد في [Snap Kit Portal](https://kit.snapchat.com/)
3. فعّل Snap Marketing API
4. أضف Redirect URI: `http://localhost:3000/api/auth/snapchat/callback`
5. احصل على Client ID و Client Secret

## 🏗️ البنية المعمارية

```
├── src/
│   ├── app/                    # Next.js App Router
│   │   ├── page.tsx           # الصفحة الرئيسية
│   │   ├── auth/              # صفحات المصادقة
│   │   ├── dashboard/         # لوحة التحكم
│   │   └── api/               # API Routes
│   ├── db/                    # Database Schema
│   │   ├── schema.ts          # Drizzle Schema
│   │   └── index.ts           # DB Connection
│   └── lib/                   # Utilities
│       ├── auth.ts            # Authentication
│       ├── snapchat.ts        # Snapchat API
│       ├── forecast.ts        # Forecast Engine
│       ├── encryption.ts      # Token Encryption
│       └── utils.ts           # Helper Functions
```

## 🔐 الأمان

- ✅ كلمات المرور مشفرة باستخدام bcrypt
- ✅ JWT للجلسات
- ✅ OAuth Tokens مشفرة في قاعدة البيانات
- ✅ عزل كامل للبيانات بين المتاجر (Multi-tenant)

## 📊 المميزات الرئيسية

### 1. التحليلات
- مؤشرات الأداء الرئيسية (KPIs)
- تحليل يومي للحملات
- مقارنة الفترات الزمنية

### 2. التوقعات
- توقع المشتريات بناءً على الميزانية
- 3 سيناريوهات (متحفظ - متوقع - متفائل)
- تحذيرات ذكية لتشبع الميزانية

### 3. التقارير
- تصدير PDF بالعربية (RTL)
- هوية المتجر (شعار - اسم - رابط)
- معلومات المستخدم الذي أنشأ التقرير
- رقم تقرير فريد

## 🔄 مزامنة البيانات

يمكن إعداد Cron Job لمزامنة البيانات تلقائياً:

```bash
# في production، استخدم cron job
0 */6 * * * curl http://localhost:3000/api/sync/snapchat
```

## 📝 الترخيص

هذا المشروع مفتوح المصدر ومتاح للاستخدام الشخصي والتجاري.

## 🤝 المساهمة

المساهمات مرحب بها! يرجى فتح Issue أو Pull Request.

## 📧 الدعم

للدعم والاستفسارات، يرجى فتح Issue في المستودع.

---

**ملاحظة**: هذا المشروع في مرحلة MVP. المميزات المتقدمة (AI Forecasting، Multi-platform) قيد التطوير.
