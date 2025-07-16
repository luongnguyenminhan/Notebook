#!/bin/bash

# Docker build and run script for Chrome Meet Bot
# Author: Auto-generated script

set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

print_status() {
    echo -e "${GREEN}[INFO]${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

print_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

print_header() {
    echo -e "${BLUE}================================================${NC}"
    echo -e "${BLUE}  $1${NC}"
    echo -e "${BLUE}================================================${NC}"
}

# Check if Docker is installed
check_docker() {
    print_status "Checking Docker installation..."
    if ! command -v docker &> /dev/null; then
        print_error "Docker is not installed. Please install Docker first."
        print_status "Visit: https://docs.docker.com/get-docker/"
        exit 1
    fi
    
    if ! command -v docker-compose &> /dev/null && ! docker compose version &> /dev/null; then
        print_error "Docker Compose is not installed. Please install Docker Compose first."
        exit 1
    fi
    
    print_status "Docker is installed: $(docker --version)"
}

# Create necessary directories
create_directories() {
    print_status "Creating necessary directories..."
    mkdir -p screenshots logs
    print_status "Directories created: screenshots/, logs/"
}

# Build Docker image
build_image() {
    print_header "Building Docker Image"
    print_status "Building Chrome Meet Bot Docker image..."
    
    if docker-compose build; then
        print_status "✅ Docker image built successfully!"
    else
        print_error "❌ Docker build failed!"
        exit 1
    fi
}

# Run container
run_container() {
    print_header "Running Container"
    
    # Stop any existing container
    print_status "Stopping any existing containers..."
    docker-compose down 2>/dev/null || true
    
    print_status "Starting Chrome Meet Bot container..."
    
    if [[ "$1" == "--detached" || "$1" == "-d" ]]; then
        print_status "Running in detached mode..."
        docker-compose up -d
        print_status "✅ Container started in background!"
        print_status "View logs with: docker-compose logs -f"
        print_status "Stop with: docker-compose down"
    else
        print_status "Running in interactive mode..."
        docker-compose up
    fi
}

# Run specific script
run_script() {
    local script_name="$1"
    print_header "Running Custom Script"
    print_status "Running script: $script_name"
    
    docker-compose run --rm chrome-bot python "$script_name"
}

# Show logs
show_logs() {
    print_header "Container Logs"
    docker-compose logs -f
}

# Clean up
cleanup() {
    print_header "Cleanup"
    print_status "Stopping and removing containers..."
    docker-compose down
    
    if [[ "$1" == "--all" ]]; then
        print_status "Removing Docker image..."
        docker-compose down --rmi all
        print_status "Cleaning up volumes..."
        docker system prune -f
    fi
    
    print_status "✅ Cleanup completed!"
}

# Show help
show_help() {
    echo "Chrome Meet Bot Docker Manager"
    echo ""
    echo "Usage: $0 [COMMAND] [OPTIONS]"
    echo ""
    echo "Commands:"
    echo "  build                    Build the Docker image"
    echo "  run                      Run the container interactively"
    echo "  run -d|--detached        Run the container in background"
    echo "  script <filename>        Run a specific Python script"
    echo "  logs                     Show container logs"
    echo "  stop                     Stop the container"
    echo "  clean                    Stop container and clean up"
    echo "  clean --all              Stop container and remove everything"
    echo "  help                     Show this help message"
    echo ""
    echo "Examples:"
    echo "  $0 build                 # Build the image"
    echo "  $0 run                   # Run interactively"
    echo "  $0 run -d                # Run in background"
    echo "  $0 script test_docker.py # Run custom script"
    echo "  $0 logs                  # View logs"
    echo "  $0 clean                 # Clean up"
}

# Main script logic
main() {
    case "${1:-help}" in
        "build")
            check_docker
            create_directories
            build_image
            ;;
        "run")
            check_docker
            create_directories
            run_container "$2"
            ;;
        "script")
            if [[ -z "$2" ]]; then
                print_error "Please specify a script name"
                echo "Usage: $0 script <filename>"
                exit 1
            fi
            check_docker
            create_directories
            run_script "$2"
            ;;
        "logs")
            show_logs
            ;;
        "stop")
            docker-compose down
            ;;
        "clean")
            cleanup "$2"
            ;;
        "help"|"--help"|"-h")
            show_help
            ;;
        *)
            print_error "Unknown command: $1"
            show_help
            exit 1
            ;;
    esac
}

# Run main function
main "$@"
