# Docker Setup Guide - wweb-mcp-sse

## تحليل المشروع وضمان التشغيل على Docker

### ✅ حالة المشروع
المشروع **جاهز للتشغيل على Docker** كـ MCP SSE مع التحسينات التالية:

### 🐳 طرق التشغيل

#### 1. استخدام docker-compose (مُوصى به)
```bash
# نسخ ملف البيئة
cp env.template .env
# تعديل المتغيرات في .env
# تشغيل
docker-compose up -d
```

#### 2. استخدام سكريبت التشغيل السريع
```bash
./docker-run.sh your-secret-token
```

#### 3. تشغيل مباشر
```bash
docker build -t wweb-mcp-sse .
docker run -d \
  --name wweb-mcp-sse \
  -p 3000:3000 \
  -e AUTH_TOKEN=your-secret-token \
  -v $(pwd)/data:/data \
  --shm-size=2gb \
  --security-opt seccomp:unconfined \
  wweb-mcp-sse
```

### 🔧 متغيرات البيئة

| المتغير | مطلوب | افتراضي | الوصف |
|---------|-------|---------|--------|
| `AUTH_TOKEN` | ✅ | `change-me-very-secret` | رمز المصادقة |
| `PORT` | ❌ | `3000` | منفذ الخادم |
| `WEBHOOK_URL` | ❌ | - | رابط الـ webhook |
| `WEBHOOK_SECRET` | ❌ | - | سر الـ webhook |
| `WWEB_SESSION_DIR` | ❌ | `/data/session` | مجلد الجلسة |
| `LOG_LEVEL` | ❌ | `dev` | مستوى الـ logging |

### 📡 Endpoints

| المسار | الطريقة | الوصف |
|--------|---------|--------|
| `/health` | GET | فحص صحة الخادم |
| `/tools` | GET | قائمة الأدوات المتاحة |
| `/sse` | GET | Server-Sent Events stream |
| `/tools/message/send` | POST | إرسال رسالة |
| `/tools/session/status` | GET | حالة الجلسة |
| `/tools/session/reset` | POST | إعادة تعيين الجلسة |
| `/tools/auth/qr` | GET | الحصول على QR code |
| `/tools/webhook/set` | POST | تكوين webhook |
| `/tools/webhook` | GET | معلومات webhook |

### 🔐 المصادقة
جميع الـ endpoints (عدا `/health`) تتطلب:
```
Authorization: Bearer your-secret-token
```

### 📱 الإعداد الأولي
1. تشغيل الحاوية
2. الاشتراك في SSE أو استدعاء `/tools/auth/qr`
3. مسح QR code بـ WhatsApp
4. الجلسة ستحفظ في مجلد `./data`

### 🚨 ملاحظات مهمة

#### ✅ نقاط القوة
- Dockerfile محسن مع Chromium dependencies
- MCP SSE compliance كامل
- أمان جيد مع Bearer token
- دعم webhooks
- Volume mount للجلسات
- Health checks

#### ⚠️ تحسينات مقترحة
1. **إضافة health check في الكود**: فحص حالة WhatsApp client
2. **تحسين error handling**: معالجة أفضل للأخطاء
3. **إضافة metrics**: مراقبة الأداء
4. **Rate limiting**: حماية من spam
5. **Logging محسن**: structured logging

#### 🔧 إعدادات Docker المطلوبة
- `--shm-size=2gb`: للـ Chrome
- `--security-opt seccomp:unconfined`: للـ Chrome
- Volume mount للـ session data

### 🧪 اختبار التشغيل
```bash
# فحص الصحة
curl http://localhost:3000/health

# الحصول على قائمة الأدوات
curl -H "Authorization: Bearer your-token" http://localhost:3000/tools

# الاشتراك في SSE
curl -H "Authorization: Bearer your-token" http://localhost:3000/sse
```

### 📊 مراقبة الحاوية
```bash
# عرض الـ logs
docker logs -f wweb-mcp-sse

# فحص الحالة
docker ps

# إحصائيات
docker stats wweb-mcp-sse
```

### 🔄 التحديث
```bash
# إيقاف الحاوية
docker-compose down

# إعادة البناء
docker-compose build --no-cache

# تشغيل جديد
docker-compose up -d
```

---

**الخلاصة**: المشروع جاهز للتشغيل على Docker كـ MCP SSE مع جميع المتطلبات محققة. الـ Dockerfile محسن والكود يتبع معايير MCP بشكل صحيح.
