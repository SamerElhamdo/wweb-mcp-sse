export function getToolsManifest(baseUrl = '') {
  return {
    name: 'wweb-mcp-sse',
    description: 'MCP-style tool surface for WhatsApp Web JS with SSE events and webhook dispatch',
    sse: `${baseUrl}/sse`,
    tools: [
      {
        name: 'message.send',
        description: 'Send a text message to a WhatsApp user by number or chat id',
        method: 'POST',
        path: '/tools/message/send',
        input: {
          type: 'object',
          required: ['to', 'message'],
          properties: {
            to: { type: 'string', description: 'Phone number or chat id. Examples: 15551234567 or 15551234567@c.us' },
            message: { type: 'string', description: 'Text content to send' }
          }
        }
      },
      {
        name: 'webhook.set',
        description: 'Configure the outbound webhook URL and optional secret for signing',
        method: 'POST',
        path: '/tools/webhook/set',
        input: {
          type: 'object',
          required: ['url'],
          properties: {
            url: { type: 'string', description: 'Destination URL to POST events to' },
            secret: { type: 'string', description: 'Optional HMAC secret for X-Signature' }
          }
        }
      },
      {
        name: 'session.status',
        description: 'Get current WhatsApp session status',
        method: 'GET',
        path: '/tools/session/status'
      },
      {
        name: 'session.reset',
        description: 'Logout and reset WhatsApp session (requires re-scan QR)',
        method: 'POST',
        path: '/tools/session/reset'
      },
      {
        name: 'auth.qr',
        description: 'Get latest login QR (if available) as text and data URL',
        method: 'GET',
        path: '/tools/auth/qr'
      }
    ],
    events: [
      { name: 'qr', description: 'QR code string for login', example: { event: 'qr', data: { qr: '...' } } },
      { name: 'authenticated', description: 'Emitted after successful authentication', example: { event: 'authenticated', data: { ok: true } } },
      { name: 'ready', description: 'Client is ready to send/receive messages', example: { event: 'ready', data: { me: '1555...@c.us' } } },
      { name: 'message', description: 'Incoming message payload', example: { event: 'message', data: { from: '...', body: '...' } } }
    ]
  };
}

