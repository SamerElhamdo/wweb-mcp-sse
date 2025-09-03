#!/bin/bash

# Build script for wweb-mcp-sse with BuildKit support
# Usage: ./docker-build.sh [image-name]

set -e

IMAGE_NAME=${1:-"wweb-mcp-sse"}

echo "🔨 Building wweb-mcp-sse Docker image..."

# Check if BuildKit is available
if docker buildx version >/dev/null 2>&1; then
    echo "📦 Using BuildKit for optimized builds..."
    DOCKER_BUILDKIT=1 docker build -t $IMAGE_NAME .
else
    echo "📦 Using standard Docker build..."
    echo "💡 Tip: Enable BuildKit for faster builds: https://docs.docker.com/go/buildkit/"
    docker build -t $IMAGE_NAME .
fi

echo "✅ Build completed successfully!"
echo "🏷️  Image: $IMAGE_NAME"
echo ""
echo "🚀 To run the container:"
echo "  docker run -d --name wweb-mcp-sse -p 3000:3000 -e AUTH_TOKEN=your-token -v \$(pwd)/data:/data --shm-size=2gb --security-opt seccomp:unconfined $IMAGE_NAME"
echo ""
echo "📋 Or use docker-compose:"
echo "  docker-compose up -d"
