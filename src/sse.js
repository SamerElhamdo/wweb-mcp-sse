const clients = new Set();

export function sseHandler(req, res) {
  res.setHeader('Content-Type', 'text/event-stream');
  res.setHeader('Cache-Control', 'no-cache');
  res.setHeader('Connection', 'keep-alive');
  res.flushHeaders?.();

  const client = { res };
  clients.add(client);

  res.write(`event: ready\n`);
  res.write(`data: ${JSON.stringify({ ok: true })}\n\n`);

  req.on('close', () => {
    clients.delete(client);
  });
}

export function broadcast(event, data) {
  const payload = `event: ${event}\n` +
                  `data: ${JSON.stringify(data)}\n\n`;
  for (const c of clients) {
    try {
      c.res.write(payload);
    } catch (_) {
      // drop on error
    }
  }
}

