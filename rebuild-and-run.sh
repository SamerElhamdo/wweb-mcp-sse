#!/bin/bash

# Rebuild and run script for wweb-mcp-sse
# Usage: ./rebuild-and-run.sh [AUTH_TOKEN]

set -e

AUTH_TOKEN=${1:-"change-me-very-secret"}
CONTAINER_NAME="wweb-mcp-sse"

echo "🔄 Rebuilding and restarting wweb-mcp-sse..."

# Stop and remove existing container
if [ "$(docker ps -aq -f name=$CONTAINER_NAME)" ]; then
    echo "🛑 Stopping existing container..."
    docker stop $CONTAINER_NAME
    docker rm $CONTAINER_NAME
fi

# Remove old image to force rebuild
echo "🗑️  Removing old image..."
docker rmi wweb-mcp-sse 2>/dev/null || true

# Build new image
echo "🔨 Building new image..."
docker build -t wweb-mcp-sse .

# Run new container
echo "▶️  Starting new container..."
docker run -d \
    --name $CONTAINER_NAME \
    -p 3000:3000 \
    -e AUTH_TOKEN="$AUTH_TOKEN" \
    -e PORT=3000 \
    -e NODE_ENV=production \
    -e WWEB_SESSION_DIR=/data/session \
    -v "$(pwd)/data:/data" \
    --restart unless-stopped \
    --shm-size=2gb \
    --security-opt seccomp:unconfined \
    wweb-mcp-sse

echo "✅ Container restarted successfully!"
echo "📱 WhatsApp MCP SSE is running on: http://localhost:3000"
echo "🔑 Auth token: $AUTH_TOKEN"
echo ""
echo "📋 Check logs:"
echo "  docker logs -f $CONTAINER_NAME"
echo ""
echo "🧪 Test health:"
echo "  curl http://localhost:3000/health"
