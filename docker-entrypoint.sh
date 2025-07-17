#!/bin/bash
set -e

# Fix permissions for audio_sessions directory if it exists and is not writable
if [ -d "/app/audio_sessions" ]; then
    if [ ! -w "/app/audio_sessions" ]; then
        echo "Warning: /app/audio_sessions is not writable by current user"
        # Try to create a subdirectory to test write access
        if ! mkdir -p "/app/audio_sessions/test_$$" 2>/dev/null; then
            echo "Creating fallback audio sessions directory in /tmp"
            export AUDIO_STORAGE_PATH="/tmp/audio_sessions"
            mkdir -p "$AUDIO_STORAGE_PATH"
        else
            # Clean up test directory
            rmdir "/app/audio_sessions/test_$$" 2>/dev/null || true
        fi
    fi
else
    # Create the directory if it doesn't exist
    mkdir -p /app/audio_sessions
fi

# Execute the command passed to the container
exec "$@"
