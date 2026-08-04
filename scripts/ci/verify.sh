#!/usr/bin/env bash
set -euo pipefail

# Script to verify the monorepo locally or in CI
echo "========================================="
echo "Starting MANARATAK 2.0 CI Verification"
echo "========================================="

echo "1. Checking environment setup..."
node -v
npm -v

echo "2. Running typecheck..."
npm run typecheck

echo "3. Running lint..."
npm run lint

echo "4. Running build..."
npm run build

echo "5. Running unit and integration tests..."
npm run test

echo "6. Running E2E tests..."
npm run e2e

echo "7. Verification Completed Successfully!"
echo "========================================="
