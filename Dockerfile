# Use Python 3.11 slim image as base
FROM python:3.11-slim

# Set environment variables
ENV PYTHONDONTWRITEBYTECODE=1
ENV PYTHONUNBUFFERED=1
ENV DEBIAN_FRONTEND=noninteractive
ENV CHROME_BIN=/usr/bin/google-chrome
ENV CHROMEDRIVER_PATH=/usr/bin/chromedriver

# Set work directory
WORKDIR /app

# Install system dependencies
RUN apt-get update && apt-get install -y \
    wget \
    gnupg \
    unzip \
    curl \
    xvfb \
    x11vnc \
    fluxbox \
    wmctrl \
    fonts-liberation \
    libasound2 \
    libatk-bridge2.0-0 \
    libdrm2 \
    libxcomposite1 \
    libxdamage1 \
    libxrandr2 \
    libgbm1 \
    libxss1 \
    libnss3 \
    libgconf-2-4 \
    --no-install-recommends

# Add Google Chrome repository and install Chrome
RUN wget -q -O - https://dl.google.com/linux/linux_signing_key.pub | apt-key add - && \
    echo "deb [arch=amd64] http://dl.google.com/linux/chrome/deb/ stable main" > /etc/apt/sources.list.d/google-chrome.list && \
    apt-get update && \
    apt-get install -y google-chrome-stable && \
    rm -rf /var/lib/apt/lists/*

# Create a non-root user for security
RUN groupadd -r chromeuser && useradd -r -g chromeuser -G audio,video chromeuser && \
    mkdir -p /home/chromeuser && \
    chown -R chromeuser:chromeuser /home/chromeuser && \
    chown -R chromeuser:chromeuser /app

# Copy requirements first for better caching
COPY requirements.txt .

# Install Python dependencies
RUN pip install --no-cache-dir --upgrade pip && \
    pip install --no-cache-dir -r requirements.txt

# Copy and set up startup script first (as root)
COPY start.sh /app/start.sh
RUN chmod +x /app/start.sh

# Copy application code
COPY . .

# Create directories for screenshots and logs
RUN mkdir -p /app/screenshots /app/logs && \
    chown -R chromeuser:chromeuser /app

# Switch to non-root user
USER chromeuser

# Expose port for VNC if needed (optional)
EXPOSE 5900

# Set the entrypoint
ENTRYPOINT ["/app/start.sh"]

# Default command
CMD ["python", "test_docker.py"]
