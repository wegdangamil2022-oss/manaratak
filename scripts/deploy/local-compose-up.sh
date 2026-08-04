#!/usr/bin/env bash
set -euo pipefail

# Script to start the local container environment via Docker Compose
echo "=================================================="
echo "Starting Local Container Environment (Compose)"
echo "=================================================="

# Check if docker is available
if ! command -v docker &> /dev/null; then
    echo "WARNING: Docker daemon or CLI not found. Please install Docker and try again."
    echo "Note: If running in AI Studio sandbox, docker commands are not supported."
    echo "You can validate configuration statically with other tools."
    exit 1
fi

echo "1. Validating compose configuration..."
docker compose config

echo "2. Starting services in background..."
docker compose up -d --build

echo "Services initiated! You can view logs using:"
echo "  docker compose logs -f"
echo ""
echo "Endpoints:"
echo "  - Public Web App: http://localhost:8080"
echo "  - Admin Workspace: http://localhost:8081"
echo "  - Core API Server: http://localhost:3000"
echo "  - Core API Liveness: http://localhost:3000/api/v1/monitoring/health"
echo "=================================================="
