#!/bin/bash

# wweb-mcp-sse Docker Run Script
# Usage: ./docker-run.sh [AUTH_TOKEN]

set -e

# Default values
AUTH_TOKEN=${1:-"change-me-very-secret"}
CONTAINER_NAME="wweb-mcp-sse"
PORT=${PORT:-3000}
DATA_DIR="./data"

echo "🚀 Starting wweb-mcp-sse container..."

# Create data directory if it doesn't exist
mkdir -p "$DATA_DIR"

# Stop and remove existing container if it exists
if [ "$(docker ps -aq -f name=$CONTAINER_NAME)" ]; then
    echo "🛑 Stopping existing container..."
    docker stop $CONTAINER_NAME
    docker rm $CONTAINER_NAME
fi

# Build the image
echo "🔨 Building Docker image..."
docker build -t wweb-mcp-sse .

# Run the container
echo "▶️  Starting container..."
docker run -d \
    --name $CONTAINER_NAME \
    -p $PORT:3000 \
    -e AUTH_TOKEN="$AUTH_TOKEN" \
    -e PORT=3000 \
    -e NODE_ENV=production \
    -e WWEB_SESSION_DIR=/data/session \
    -v "$(pwd)/$DATA_DIR:/data" \
    --restart unless-stopped \
    --shm-size=2gb \
    --security-opt seccomp:unconfined \
    wweb-mcp-sse

echo "✅ Container started successfully!"
echo "📱 WhatsApp MCP SSE is running on: http://localhost:$PORT"
echo "🔑 Auth token: $AUTH_TOKEN"
echo ""
echo "📋 Useful commands:"
echo "  View logs: docker logs -f $CONTAINER_NAME"
echo "  Stop: docker stop $CONTAINER_NAME"
echo "  Remove: docker rm $CONTAINER_NAME"
echo ""
echo "🔗 Endpoints:"
echo "  Health: http://localhost:$PORT/health"
echo "  Tools: http://localhost:$PORT/tools"
echo "  SSE: http://localhost:$PORT/sse"
echo ""
echo "📖 First time setup:"
echo "  1. Subscribe to SSE or call /tools/auth/qr to get QR code"
echo "  2. Scan QR code with WhatsApp"
echo "  3. Session will be saved in ./data directory"
