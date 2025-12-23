# دليل الإعداد التفصيلي

## 📌 الخطوات الأساسية

### 1. تثبيت Node.js و PostgreSQL

تأكد من تثبيت:
- Node.js 18 أو أحدث
- PostgreSQL 14 أو أحدث
- npm أو yarn

### 2. استنساخ المشروع

```bash
cd "C:/Users/PCD/CascadeProjects/jud calculator"
npm install
```

### 3. إعداد قاعدة البيانات

#### إنشاء قاعدة البيانات

```sql
CREATE DATABASE snapchat_analytics;
CREATE USER snap_user WITH PASSWORD 'your_password';
GRANT ALL PRIVILEGES ON DATABASE snapchat_analytics TO snap_user;
```

#### تشغيل Migrations

```bash
npm run db:generate
npm run db:migrate
```

### 4. إعداد Snapchat Ads API

#### الخطوة 1: إنشاء حساب Developer

1. اذهب إلى: https://kit.snapchat.com/
2. سجّل دخول بحساب Snapchat الخاص بك
3. اضغط على "Create App"

#### الخطوة 2: إعداد OAuth

1. في لوحة التحكم، اذهب إلى "OAuth"
2. أضف Redirect URI:
   - Development: `http://localhost:3000/api/auth/snapchat/callback`
   - Production: `https://yourdomain.com/api/auth/snapchat/callback`
3. فعّل "Snap Marketing API"
4. احفظ Client ID و Client Secret

#### الخطوة 3: طلب الصلاحيات

1. في قسم "Permissions"، اطلب:
   - `snapchat-marketing-api`
2. انتظر الموافقة (قد يستغرق 1-2 يوم عمل)

### 5. إعداد ملف .env

```env
# Database
DATABASE_URL=postgresql://snap_user:your_password@localhost:5432/snapchat_analytics

# Snapchat OAuth
SNAPCHAT_CLIENT_ID=your_client_id_here
SNAPCHAT_CLIENT_SECRET=your_client_secret_here
SNAPCHAT_REDIRECT_URI=http://localhost:3000/api/auth/snapchat/callback

# JWT Secret (استخدم مولد عشوائي)
JWT_SECRET=generate_random_64_character_string_here

# Encryption Key (يجب أن يكون 32 حرف بالضبط)
ENCRYPTION_KEY=your_32_character_key_here_12345

# App URL
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

### 6. توليد مفاتيح آمنة

#### JWT Secret

```bash
node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"
```

#### Encryption Key

```bash
node -e "console.log(require('crypto').randomBytes(16).toString('hex'))"
```

### 7. تشغيل المشروع

```bash
npm run dev
```

افتح المتصفح على: http://localhost:3000

## 🧪 اختبار الإعداد

### 1. إنشاء حساب

1. اذهب إلى: http://localhost:3000/auth/register
2. أدخل المعلومات المطلوبة
3. سجّل دخول

### 2. ربط Snapchat Ads

1. في Dashboard، اضغط "ربط Snapchat Ads"
2. سجّل دخول بحساب Snapchat
3. اختر Ad Account
4. وافق على الصلاحيات

### 3. التحقق من البيانات

بعد الربط، يجب أن ترى:
- بيانات الحملات في Dashboard
- إمكانية إنشاء توقعات
- إمكانية تصدير تقارير

## 🐛 حل المشاكل الشائعة

### خطأ: "Cannot connect to database"

```bash
# تحقق من أن PostgreSQL يعمل
pg_isready

# تحقق من رابط الاتصال
psql "postgresql://snap_user:password@localhost:5432/snapchat_analytics"
```

### خطأ: "Snapchat OAuth failed"

- تحقق من Client ID و Client Secret
- تأكد من Redirect URI صحيح
- تحقق من أن Marketing API مفعّل

### خطأ: "No ad accounts found"

- تأكد من أن لديك Ad Account نشط في Snapchat Ads Manager
- تحقق من الصلاحيات

## 🚀 النشر (Production)

### 1. إعداد قاعدة البيانات

استخدم خدمة مثل:
- Supabase (مجاني)
- Neon (مجاني)
- Railway
- Render

### 2. تحديث متغيرات البيئة

```env
DATABASE_URL=your_production_database_url
SNAPCHAT_REDIRECT_URI=https://yourdomain.com/api/auth/snapchat/callback
NEXT_PUBLIC_APP_URL=https://yourdomain.com
```

### 3. النشر على Vercel

```bash
npm install -g vercel
vercel
```

أو استخدم:
- Netlify
- Railway
- Render

## 📊 مزامنة البيانات التلقائية

### إعداد Cron Job

في production، أضف cron job لمزامنة البيانات:

```bash
# كل 6 ساعات
0 */6 * * * curl https://yourdomain.com/api/sync/snapchat
```

أو استخدم خدمات مثل:
- Vercel Cron Jobs
- GitHub Actions
- Uptime Robot

## 🔒 نصائح الأمان

1. **لا تشارك** `.env` أبداً
2. استخدم **مفاتيح قوية** للـ JWT و Encryption
3. فعّل **HTTPS** في production
4. راجع **الصلاحيات** بانتظام
5. احتفظ **بنسخ احتياطية** من قاعدة البيانات

## 📞 الدعم

إذا واجهت مشاكل:
1. تحقق من ملف README.md
2. راجع الـ logs في terminal
3. افتح Issue في GitHub
