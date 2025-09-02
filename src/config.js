import fs from 'fs';
import path from 'path';

export const config = {
  port: parseInt(process.env.PORT || '3000', 10),
  authToken: process.env.AUTH_TOKEN || 'change-me-very-secret',
  webhookUrl: process.env.WEBHOOK_URL || '',
  webhookSecret: process.env.WEBHOOK_SECRET || '',
  sessionDir: process.env.WWEB_SESSION_DIR || path.join(process.cwd(), 'data', 'session'),
  logLevel: process.env.LOG_LEVEL || 'dev',
};

export function ensureDirs() {
  const dir = config.sessionDir;
  fs.mkdirSync(dir, { recursive: true });
}

