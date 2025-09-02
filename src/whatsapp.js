import fs from 'fs';
import path from 'path';
import QRCode from 'qrcode';
import { Client, LocalAuth } from 'whatsapp-web.js';
import { config, ensureDirs } from './config.js';
import { broadcast } from './sse.js';
import { dispatch } from './webhook.js';

let client = null;
let lastQr = null;

export function getClient() {
  return client;
}

export async function getLastQr() {
  if (!lastQr) return null;
  const dataUrl = await QRCode.toDataURL(lastQr);
  return { qr: lastQr, dataUrl };
}

export async function startWhatsApp() {
  ensureDirs();
  client = new Client({
    authStrategy: new LocalAuth({ dataPath: config.sessionDir }),
    puppeteer: {
      headless: true,
      args: [
        '--no-sandbox',
        '--disable-setuid-sandbox',
        '--disable-dev-shm-usage',
        '--disable-gpu',
      ],
    },
  });

  client.on('qr', (qr) => {
    lastQr = qr;
    broadcast('qr', { qr });
    dispatch('qr', { qr }).catch(() => {});
  });

  client.on('authenticated', () => {
    broadcast('authenticated', { ok: true });
    dispatch('authenticated', { ok: true }).catch(() => {});
  });

  client.on('ready', () => {
    broadcast('ready', { me: client.info?.wid?._serialized || null });
    dispatch('ready', { me: client.info?.wid?._serialized || null }).catch(() => {});
  });

  client.on('message', async (msg) => {
    const data = {
      id: msg.id._serialized,
      from: msg.from,
      to: msg.to,
      body: msg.body,
      timestamp: msg.timestamp,
      fromMe: msg.fromMe,
      type: msg.type,
      hasMedia: msg.hasMedia,
    };
    broadcast('message', data);
    dispatch('message', data).catch(() => {});
  });

  await client.initialize();
  return client;
}

export async function sendText({ to, message }) {
  if (!client) throw new Error('client_not_ready');
  const chatId = normalizeToWaId(to);
  const result = await client.sendMessage(chatId, message);
  return { id: result.id._serialized, to: chatId };
}

export function normalizeToWaId(to) {
  // Accept raw phone numbers; append @c.us if missing
  const trimmed = String(to).replace(/\D/g, '');
  if (trimmed.endsWith('@c.us') || trimmed.endsWith('@g.us')) return trimmed;
  return `${trimmed}@c.us`;
}

export async function getStatus() {
  const me = client?.info?.wid?._serialized || null;
  const platform = client?.info?.platform || null;
  const pushname = client?.info?.pushname || null;
  return { ready: Boolean(client), me, platform, pushname };
}

export async function resetSession() {
  if (client) {
    try { await client.logout(); } catch (_) {}
    try { await client.destroy(); } catch (_) {}
  }
  // delete session dir
  try {
    fs.rmSync(config.sessionDir, { recursive: true, force: true });
  } catch (_) {}
  return startWhatsApp();
}

