import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import { config } from './config.js';
import { authMiddleware } from './auth.js';
import { sseHandler } from './sse.js';
import { startWhatsApp, sendText, getStatus, resetSession, getLastQr } from './whatsapp.js';
import { getWebhook, setWebhook } from './webhook.js';
import { getToolsManifest } from './tools.js';

const app = express();
app.use(helmet());
app.use(cors());
app.use(express.json({ limit: '1mb' }));
app.use(morgan(config.logLevel));

// Health
app.get('/health', (req, res) => res.json({ ok: true }));

// Tools manifest (public description, but require auth to avoid leaking deployment details)
app.get('/tools', authMiddleware, (req, res) => {
  const baseUrl = `${req.protocol}://${req.get('host')}`;
  res.json(getToolsManifest(baseUrl));
});

// SSE stream
app.get('/sse', authMiddleware, sseHandler);

// Tool routes
app.post('/tools/message/send', authMiddleware, async (req, res) => {
  try {
    const { to, message } = req.body || {};
    if (!to || !message) return res.status(400).json({ error: 'missing to or message' });
    const result = await sendText({ to, message });
    res.json({ ok: true, result });
  } catch (err) {
    res.status(500).json({ error: String(err.message || err) });
  }
});

app.post('/tools/webhook/set', authMiddleware, (req, res) => {
  try {
    const { url, secret } = req.body || {};
    if (!url) return res.status(400).json({ error: 'missing url' });
    const data = setWebhook({ url, secret });
    res.json({ ok: true, webhook: data });
  } catch (err) {
    res.status(500).json({ error: String(err.message || err) });
  }
});

app.get('/tools/session/status', authMiddleware, async (req, res) => {
  res.json(await getStatus());
});

app.post('/tools/session/reset', authMiddleware, async (req, res) => {
  try {
    await resetSession();
    res.json({ ok: true });
  } catch (err) {
    res.status(500).json({ error: String(err.message || err) });
  }
});

app.get('/tools/auth/qr', authMiddleware, async (req, res) => {
  const qr = await getLastQr();
  if (!qr) return res.status(404).json({ error: 'no_qr_available' });
  res.json(qr);
});

// Webhook state
app.get('/tools/webhook', authMiddleware, (req, res) => {
  res.json(getWebhook());
});

// Start server
app.listen(config.port, async () => {
  // Start WhatsApp client after server binds, so SSE can receive early events
  startWhatsApp().catch((err) => {
    console.error('Failed to init WhatsApp:', err);
  });
  console.log(`[wweb-mcp-sse] listening on :${config.port}`);
});

