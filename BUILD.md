# Quick Build Guide

## 🚀 البناء السريع

### الطريقة الأسهل (بدون BuildKit)
```bash
docker build -t wweb-mcp-sse .
```

### مع BuildKit (أسرع)
```bash
export DOCKER_BUILDKIT=1
docker build -t wweb-mcp-sse .
```

### استخدام السكريبت
```bash
./docker-build.sh
```

### استخدام docker-compose
```bash
docker-compose up -d
```

## 🔧 حل مشاكل البناء

### مشكلة: `--mount option requires BuildKit`
**الحل**: استخدم الـ Dockerfile العادي (تم إصلاحه)
```bash
docker build -t wweb-mcp-sse .
```

### مشكلة: Docker daemon غير مشغل
```bash
# على macOS
open -a Docker

# على Linux
sudo systemctl start docker
```

### مشكلة: مساحة القرص ممتلئة
```bash
# تنظيف Docker
docker system prune -a
```

## 📋 ملفات البناء المتاحة

- `Dockerfile` - للبناء العادي (بدون BuildKit)
- `Dockerfile.buildkit` - للبناء مع BuildKit
- `docker-compose.yml` - للتشغيل العادي
- `docker-compose.buildkit.yml` - للتشغيل مع BuildKit

## ✅ التحقق من البناء
```bash
# فحص الصورة
docker images wweb-mcp-sse

# تشغيل سريع
docker run --rm -p 3000:3000 -e AUTH_TOKEN=test wweb-mcp-sse
```
