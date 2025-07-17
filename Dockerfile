FROM python:3.11-slim-bookworm

WORKDIR /app


# Install system dependencies (including PortAudio for sounddevice, Chromium for Selenium)
RUN apt-get update && apt-get install -y \
    gcc curl portaudio19-dev chromium chromium-driver \
    && rm -rf /var/lib/apt/lists/*

# Install uv

# Copy requirements first for better caching
COPY requirements.txt .

# Install Python dependencies with uv
RUN pip install --no-cache-dir -r requirements.txt

# Copy application code
COPY app/ ./app/
COPY alembic.ini .
COPY alembic/ ./alembic/

# Create non-root user
RUN useradd --create-home --shell /bin/bash app && chown -R app:app /app
USER app

# Expose port
EXPOSE 8000

# Health check
HEALTHCHECK --interval=30s --timeout=30s --start-period=5s --retries=3 \
    CMD curl -f http://localhost:8000/health || exit 1

# Run the application
CMD ["uvicorn", "app.main:app", "--host", "0.0.0.0", "--port", "8000"]
