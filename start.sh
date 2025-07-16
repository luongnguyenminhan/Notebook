#!/bin/bash

# Start script for Chrome Meet Bot Docker container
# This script sets up the virtual display and runs the application

set -e

# Colors for output
GREEN='\033[0;32m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

echo -e "${BLUE}🚀 Starting Chrome Meet Bot...${NC}"

# Set display for headless operation
export DISPLAY=:99

# Start Xvfb (X Virtual Framebuffer) for headless display
echo -e "${GREEN}🖥️  Starting virtual display (Xvfb)...${NC}"
Xvfb :99 -screen 0 1920x1080x24 -ac +extension GLX +render -noreset &
XVFB_PID=$!

# Wait for Xvfb to start
echo -e "${GREEN}⏳ Waiting for virtual display to initialize...${NC}"
sleep 3

# Optional: Start window manager for better Chrome compatibility
echo -e "${GREEN}🪟 Starting window manager...${NC}"
fluxbox > /dev/null 2>&1 &
WM_PID=$!

# Wait a bit more for window manager
sleep 2

echo -e "${GREEN}✅ Environment ready!${NC}"

# Function to cleanup on exit
cleanup() {
    echo -e "${BLUE}🧹 Cleaning up...${NC}"
    kill $XVFB_PID 2>/dev/null || true
    kill $WM_PID 2>/dev/null || true
    exit 0
}

# Set trap for cleanup on exit
trap cleanup SIGTERM SIGINT

# Execute the main command
echo -e "${GREEN}🏃 Running application: $@${NC}"
exec "$@"
