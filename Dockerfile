FROM python:3.11-slim-bookworm

WORKDIR /app


# Install system dependencies (including PortAudio for sounddevice, Chromium for Selenium, FFmpeg for audio processing)
RUN apt-get update && apt-get install -y \
    gcc curl portaudio19-dev chromium chromium-driver ffmpeg \
    && rm -rf /var/lib/apt/lists/*

# Install uv

# Copy requirements first for better caching
COPY requirements.txt .

# Install Python dependencies with uv
RUN pip install --no-cache-dir -r requirements.txt

# Copy application code
COPY app/ ./app/
COPY static/ ./static/
COPY alembic.ini .
COPY alembic/ ./alembic/
COPY docker-entrypoint.sh /docker-entrypoint.sh

# Make entrypoint executable and fix ownership
RUN chmod +x /docker-entrypoint.sh && \
    useradd --create-home --shell /bin/bash app && \
    chown app:app /docker-entrypoint.sh && \
    chown -R app:app /app

# Switch to app user
USER app

# Create audio sessions directory as the app user (will be overridden by volume but establishes ownership pattern)
RUN mkdir -p /app/audio_sessions

# Expose port
EXPOSE 8000

# Health check
HEALTHCHECK --interval=30s --timeout=30s --start-period=5s --retries=3 \
    CMD curl -f http://localhost:8000/health || exit 1

# Set entrypoint
ENTRYPOINT ["/docker-entrypoint.sh"]

# Default command (can be overridden by docker-compose)
CMD ["uvicorn", "app.main:app", "--host", "0.0.0.0", "--port", "8000"]
