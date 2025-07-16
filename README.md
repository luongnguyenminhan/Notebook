# Chrome Meet Bot - Docker Setup

This project runs a Google Meet bot using Python 3.11 and Chrome driver in a Docker container.

## 📁 Project Structure

```
d:\Project\Notebook\
├── Dockerfile              # Docker configuration
├── docker-compose.yml      # Docker Compose configuration  
├── requirements.txt        # Python dependencies
├── test_docker.py          # Docker-optimized bot script
├── test.py                 # Original bot script
├── docker-run.sh           # Linux/Mac run script
├── docker-run.bat          # Windows run script
├── screenshots/            # Generated screenshots
└── logs/                   # Container logs
```

## 🚀 Quick Start

### Prerequisites
- Docker Desktop installed
- Docker Compose available

### 1. Build the Docker Image

**Windows:**
```cmd
docker-run.bat build
```

**Linux/Mac:**
```bash
chmod +x docker-run.sh
./docker-run.sh build
```

### 2. Run the Bot

**Interactive mode (see output in real-time):**
```bash
# Windows
docker-run.bat run

# Linux/Mac
./docker-run.sh run
```

**Background mode (detached):**
```bash
# Windows
docker-run.bat run -d

# Linux/Mac  
./docker-run.sh run -d
```

### 3. View Logs (if running in background)
```bash
# Windows
docker-run.bat logs

# Linux/Mac
./docker-run.sh logs
```

## 🐳 Manual Docker Commands

If you prefer to use Docker directly:

### Build
```bash
docker-compose build
```

### Run
```bash
# Interactive
docker-compose up

# Background
docker-compose up -d

# Run specific script
docker-compose run --rm chrome-bot python test_docker.py
```

### View logs
```bash
docker-compose logs -f
```

### Stop
```bash
docker-compose down
```

## 📸 Screenshots

The bot automatically saves screenshots to the `screenshots/` directory:
- `meet_loaded.png` - After page loads
- `meet_name_entered.png` - After entering name
- `meet_join_clicked.png` - After clicking join

## 🔧 Configuration

### Chrome Options
The Docker version includes optimized Chrome options for containerized environments:
- Headless mode enabled
- No sandbox mode
- Optimized for Docker memory constraints
- Fake media devices for camera/microphone

### Environment Variables
- `DISPLAY=:99` - Virtual display for headless Chrome
- `PYTHONPATH=/app` - Python module path

### Meeting URL
Edit `test_docker.py` to change the meeting URL:
```python
meet_url = "https://meet.google.com/your-meeting-id"
```

## 🛠️ Development

### Running Custom Scripts
```bash
# Windows
docker-run.bat script your_script.py

# Linux/Mac
./docker-run.sh script your_script.py
```

### Debugging
To run the container with shell access:
```bash
docker-compose run --rm chrome-bot bash
```

### Accessing the Container
```bash
# Get container ID
docker ps

# Access running container
docker exec -it <container_id> bash
```

## 🧹 Cleanup

### Stop and remove containers
```bash
# Windows
docker-run.bat clean

# Linux/Mac
./docker-run.sh clean
```

### Complete cleanup (remove images too)
```bash
# Windows
docker-run.bat clean --all

# Linux/Mac
./docker-run.sh clean --all
```

## 📋 Available Commands

### docker-run.sh / docker-run.bat
- `build` - Build the Docker image
- `run` - Run container interactively
- `run -d` - Run container in background
- `script <filename>` - Run specific Python script
- `logs` - Show container logs
- `stop` - Stop containers
- `clean` - Clean up containers
- `clean --all` - Complete cleanup
- `help` - Show help

## 🔍 Troubleshooting

### Chrome crashes
- Increase shared memory: `shm_size: 2gb` in docker-compose.yml
- Add more Chrome arguments in `setup_chrome_options()`

### Permission errors
- Make sure scripts are executable: `chmod +x docker-run.sh`
- Check Docker daemon is running

### Network issues
- Check your internet connection
- Verify meeting URL is accessible

### Memory issues
- Increase Docker memory limits
- Use headless mode (default in Docker version)

## 📝 Notes

- The bot runs in headless mode by default in Docker
- Screenshots are saved to the host machine via volume mounts
- Chrome driver is automatically managed by undetected_chromedriver
- The container runs as a non-root user for security
