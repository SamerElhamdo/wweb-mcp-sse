**Overview**
- Purpose: MCP-style HTTP service wrapping `whatsapp-web.js` with SSE events for n8n and tool endpoints for actions, auth, and webhook config.
- Deploys: Docker container, headless (Chromium via puppeteer).
- Auth: Single Bearer token via `AUTH_TOKEN` for all routes including SSE.

**Endpoints**
- `GET /health`: Basic health.
- `GET /tools` (auth): Manifest with tool names, descriptions, schemas, and SSE URL.
- `GET /sse` (auth): Server-Sent Events stream (events: `qr`, `authenticated`, `ready`, `message`).
- `POST /tools/message/send` (auth): Send text. Body: `{ to, message }`.
- `GET /tools/session/status` (auth): WhatsApp session info.
- `POST /tools/session/reset` (auth): Logout and reset session.
- `POST /tools/webhook/set` (auth): Configure outbound webhook `{ url, secret? }`.
- `GET /tools/webhook` (auth): Current webhook info.
- `GET /tools/auth/qr` (auth): Latest QR (if available) `{ qr, dataUrl }`.

**Events & Webhook**
- SSE emits: `qr`, `authenticated`, `ready`, `message` with JSON payloads.
- If `WEBHOOK_URL` is set (or via `/tools/webhook/set`), the same events POST to that URL as `{ event, data, ts }`.
- If `WEBHOOK_SECRET` set, adds `X-Signature: <hex(hmac-sha256(body, secret))>`.

**Auth**
- Set `AUTH_TOKEN`. Call with header: `Authorization: Bearer <token>` (SSE also supports `?token=`).

**Environment**
- `PORT`: default 3000
- `AUTH_TOKEN`: required
- `WEBHOOK_URL`: optional
- `WEBHOOK_SECRET`: optional
- `WWEB_SESSION_DIR`: default `/data/session` (volume recommended)

**Docker**
- Build: `docker build -t wweb-mcp-sse .`
- Run:
  - `docker run -d --name wweb-mcp-sse -p 3000:3000 -e AUTH_TOKEN=change-me -e PORT=3000 -v $(pwd)/data:/data wweb-mcp-sse`

**n8n Usage**
- SSE: Use HTTP Request node in Event mode to `GET http://host:3000/sse` with header `Authorization: Bearer <token>`.
- Webhook: Alternatively set `/tools/webhook/set` to your n8n webhook URL.
- Send message:
  - Method: POST `http://host:3000/tools/message/send`
  - Headers: `Authorization: Bearer <token>`, `Content-Type: application/json`
  - Body: `{ "to": "15551234567", "message": "Hello from n8n" }`

**Tool Manifest**
- `GET /tools` returns a JSON listing of tools with `name`, `description`, `method`, `path`, and `input` schema to enable discovery/advertising.

**Notes**
- First run requires scanning QR: subscribe to SSE or call `/tools/auth/qr` to retrieve it.
- Keep `/data` volume persisted to avoid re-auth during restarts.

