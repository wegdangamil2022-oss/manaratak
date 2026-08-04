#!/usr/bin/env bash
set -euo pipefail

# Script to tear down the local container environment via Docker Compose
echo "=================================================="
echo "Tearing Down Local Container Environment (Compose)"
echo "=================================================="

if ! command -v docker &> /dev/null; then
    echo "WARNING: Docker daemon or CLI not found. Please install Docker and try again."
    exit 1
fi

echo "Tearing down containers and volumes..."
docker compose down -v

echo "Cleanup completed successfully!"
echo "=================================================="
