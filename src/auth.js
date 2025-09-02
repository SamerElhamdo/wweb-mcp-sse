import crypto from 'crypto';
import { config } from './config.js';

export function authMiddleware(req, res, next) {
  const header = req.headers['authorization'] || '';
  const token = header.startsWith('Bearer ') ? header.slice(7) : (req.query.token || '');
  if (!token || token !== config.authToken) {
    return res.status(401).json({ error: 'unauthorized' });
  }
  return next();
}

export function sign(body, secret) {
  const h = crypto.createHmac('sha256', secret);
  h.update(JSON.stringify(body));
  return h.digest('hex');
}

