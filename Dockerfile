# Multi-stage to keep image small
FROM node:20-slim AS base

ENV NODE_ENV=production
WORKDIR /app

COPY package.json ./
RUN --mount=type=cache,target=/root/.npm npm ci --only=production || npm install --only=production

COPY src ./src

# Chromium deps needed by whatsapp-web.js/puppeteer
RUN apt-get update && \
    apt-get install -y --no-install-recommends \
      ca-certificates \
      libc6 \
      libgcc1 \
      libstdc++6 \
      libasound2 \
      libx11-6 \
      libx11-xcb1 \
      libxcomposite1 \
      libxcursor1 \
      libxdamage1 \
      libxext6 \
      libxi6 \
      libxfixes3 \
      libxrandr2 \
      libgbm1 \
      libpangocairo-1.0-0 \
      libpango-1.0-0 \
      libcairo2 \
      libatk1.0-0 \
      libatk-bridge2.0-0 \
      libnss3 \
      libdrm2 \
      libatspi2.0-0 \
      libgtk-3-0 \
      wget \
      xdg-utils && \
    rm -rf /var/lib/apt/lists/*

ENV PORT=3000 \
    WWEB_SESSION_DIR=/data/session

VOLUME ["/data"]
EXPOSE 3000

CMD ["node", "src/index.js"]

