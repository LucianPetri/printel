#!/bin/bash

# Printel - EverShop Installation Script
# This script automates the setup process for the Printel e-commerce store

set -e

echo "╔════════════════════════════════════════════════════════════╗"
echo "║         Printel - EverShop Store Setup Script              ║"
echo "╚════════════════════════════════════════════════════════════╝"
echo ""

# Color codes for output
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

# Check prerequisites
echo -e "${BLUE}[1/6] Checking prerequisites...${NC}"

if ! command -v node &> /dev/null; then
    echo -e "${RED}✗ Node.js is not installed${NC}"
    echo "  Please install Node.js 18+ from https://nodejs.org"
    exit 1
fi
NODE_VERSION=$(node -v)
echo -e "${GREEN}✓ Node.js ${NODE_VERSION} found${NC}"

if ! command -v npm &> /dev/null; then
    echo -e "${RED}✗ npm is not installed${NC}"
    exit 1
fi
NPM_VERSION=$(npm -v)
echo -e "${GREEN}✓ npm ${NPM_VERSION} found${NC}"

if ! command -v docker &> /dev/null; then
    echo -e "${YELLOW}⚠ Docker not found (optional)${NC}"
    echo "  To run PostgreSQL in Docker, install from https://www.docker.com"
else
    echo -e "${GREEN}✓ Docker is available${NC}"
fi

echo ""
echo -e "${BLUE}[2/6] Installing dependencies...${NC}"
npm install
echo -e "${GREEN}✓ Dependencies installed${NC}"

echo ""
echo -e "${BLUE}[3/6] Starting PostgreSQL...${NC}"

if command -v docker &> /dev/null; then
    echo "Starting PostgreSQL container..."
    docker-compose up -d
    echo "Waiting for PostgreSQL to be ready..."
    sleep 5
    echo -e "${GREEN}✓ PostgreSQL started${NC}"
else
    echo -e "${YELLOW}⚠ Docker not available${NC}"
    echo "Please ensure PostgreSQL is running on localhost:5432"
    read -p "Press Enter to continue..."
fi

echo ""
echo -e "${BLUE}[4/6] Running EverShop setup...${NC}"
npm run setup
echo -e "${GREEN}✓ Setup complete${NC}"

echo ""
echo -e "${BLUE}[5/6] Building the site...${NC}"
npm run build
echo -e "${GREEN}✓ Build complete${NC}"

echo ""
echo -e "${BLUE}[6/6] Done!${NC}"
echo ""
echo -e "${GREEN}═══════════════════════════════════════════════════════════${NC}"
echo -e "${GREEN}✓ Printel store is ready!${NC}"
echo -e "${GREEN}═══════════════════════════════════════════════════════════${NC}"
echo ""
echo "Your store is configured and ready to start."
echo ""
echo -e "${BLUE}Next steps:${NC}"
echo "  1. Start development server:"
echo -e "     ${YELLOW}npm run dev${NC}"
echo ""
echo "  2. Or start production server:"
echo -e "     ${YELLOW}npm run start${NC}"
echo ""
echo "  3. Access your store:"
echo -e "     Store:  ${YELLOW}http://localhost:3000${NC}"
echo -e "     Admin:  ${YELLOW}http://localhost:3000/admin${NC}"
echo ""
echo "For more information, see SETUP.md"
echo ""
