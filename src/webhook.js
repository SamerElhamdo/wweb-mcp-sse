import axios from 'axios';
import { config } from './config.js';
import { sign } from './auth.js';

let webhookUrl = config.webhookUrl || '';
let webhookSecret = config.webhookSecret || '';

export function getWebhook() {
  return { url: webhookUrl, hasSecret: Boolean(webhookSecret) };
}

export function setWebhook({ url, secret }) {
  if (typeof url === 'string') webhookUrl = url;
  if (typeof secret === 'string') webhookSecret = secret;
  return getWebhook();
}

export async function dispatch(event, data) {
  if (!webhookUrl) return;
  const body = { event, data, ts: Date.now() };
  const headers = { 'Content-Type': 'application/json' };
  if (webhookSecret) headers['X-Signature'] = sign(body, webhookSecret);
  try {
    await axios.post(webhookUrl, body, { timeout: 5000, headers });
  } catch (err) {
    // swallow errors to not crash event loop
  }
}

