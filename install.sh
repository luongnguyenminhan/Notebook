#!/bin/bash

# Install script for Chrome driver and Python dependencies
# Author: Auto-generated script
# Date: $(date)

set -e  # Exit on any error

echo "🚀 Starting installation process..."

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Function to print colored output
print_status() {
    echo -e "${GREEN}[INFO]${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

print_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# Check if running on supported OS
check_os() {
    print_status "Checking operating system..."
    if [[ "$OSTYPE" == "linux-gnu"* ]]; then
        OS="linux"
        print_status "Detected Linux OS"
    elif [[ "$OSTYPE" == "darwin"* ]]; then
        OS="mac"
        print_status "Detected macOS"
    elif [[ "$OSTYPE" == "msys" ]] || [[ "$OSTYPE" == "cygwin" ]]; then
        OS="windows"
        print_status "Detected Windows (using Git Bash/Cygwin)"
    else
        print_error "Unsupported operating system: $OSTYPE"
        exit 1
    fi
}

# Install Google Chrome if not present
install_chrome() {
    print_status "Checking for Google Chrome installation..."
    
    if command -v google-chrome &> /dev/null || command -v chrome &> /dev/null; then
        print_status "Google Chrome is already installed"
        return 0
    fi
    
    print_warning "Google Chrome not found. Installing..."
    
    case $OS in
        "linux")
            # Ubuntu/Debian
            if command -v apt-get &> /dev/null; then
                wget -q -O - https://dl.google.com/linux/linux_signing_key.pub | sudo apt-key add -
                echo "deb [arch=amd64] http://dl.google.com/linux/chrome/deb/ stable main" | sudo tee /etc/apt/sources.list.d/google-chrome.list
                sudo apt-get update
                sudo apt-get install -y google-chrome-stable
            # CentOS/RHEL/Fedora
            elif command -v yum &> /dev/null; then
                sudo yum install -y wget
                wget https://dl.google.com/linux/direct/google-chrome-stable_current_x86_64.rpm
                sudo yum localinstall -y google-chrome-stable_current_x86_64.rpm
                rm google-chrome-stable_current_x86_64.rpm
            elif command -v dnf &> /dev/null; then
                sudo dnf install -y wget
                wget https://dl.google.com/linux/direct/google-chrome-stable_current_x86_64.rpm
                sudo dnf localinstall -y google-chrome-stable_current_x86_64.rpm
                rm google-chrome-stable_current_x86_64.rpm
            else
                print_error "Package manager not supported. Please install Google Chrome manually."
                exit 1
            fi
            ;;
        "mac")
            if command -v brew &> /dev/null; then
                brew install --cask google-chrome
            else
                print_warning "Homebrew not found. Please install Google Chrome manually from https://www.google.com/chrome/"
                print_warning "Or install Homebrew first: /bin/bash -c \"\$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)\""
            fi
            ;;
        "windows")
            print_warning "Please install Google Chrome manually from https://www.google.com/chrome/"
            print_warning "Then rerun this script."
            ;;
    esac
}

# Check for Python
check_python() {
    print_status "Checking for Python installation..."
    
    if command -v python3 &> /dev/null; then
        PYTHON_CMD="python3"
        PIP_CMD="pip3"
    elif command -v python &> /dev/null; then
        PYTHON_CMD="python"
        PIP_CMD="pip"
    else
        print_error "Python is not installed. Please install Python 3.7+ first."
        exit 1
    fi
    
    # Check Python version
    PYTHON_VERSION=$($PYTHON_CMD --version 2>&1 | cut -d' ' -f2)
    print_status "Found Python $PYTHON_VERSION"
    
    # Check if pip is available
    if ! command -v $PIP_CMD &> /dev/null; then
        print_error "pip is not installed. Please install pip first."
        exit 1
    fi
    
    print_status "Found pip: $($PIP_CMD --version)"
}

# Install Python dependencies
install_python_deps() {
    print_status "Installing Python dependencies..."
    
    # Check if requirements.txt exists
    if [[ ! -f "requirements.txt" ]]; then
        print_warning "requirements.txt not found. Creating one with default dependencies..."
        cat > requirements.txt << EOF
undetected_chromedriver
selenium
EOF
    fi
    
    print_status "Installing packages from requirements.txt..."
    $PIP_CMD install --upgrade pip
    $PIP_CMD install -r requirements.txt
    
    print_status "✅ Python dependencies installed successfully!"
}

# Verify installation
verify_installation() {
    print_status "Verifying installation..."
    
    # Test Python imports
    $PYTHON_CMD -c "
import sys
print(f'Python version: {sys.version}')

try:
    import selenium
    print(f'✅ Selenium version: {selenium.__version__}')
except ImportError as e:
    print(f'❌ Selenium import failed: {e}')
    sys.exit(1)

try:
    import undetected_chromedriver as uc
    print('✅ undetected_chromedriver imported successfully')
    
    # Test basic functionality
    options = uc.ChromeOptions()
    options.add_argument('--headless')
    options.add_argument('--no-sandbox')
    options.add_argument('--disable-dev-shm-usage')
    
    print('✅ ChromeOptions created successfully')
    print('✅ Installation verification completed!')
    
except ImportError as e:
    print(f'❌ undetected_chromedriver import failed: {e}')
    sys.exit(1)
except Exception as e:
    print(f'❌ Chrome driver test failed: {e}')
    sys.exit(1)
"
    
    if [[ $? -eq 0 ]]; then
        print_status "🎉 All installations verified successfully!"
    else
        print_error "❌ Installation verification failed!"
        exit 1
    fi
}

# Main installation process
main() {
    echo -e "${BLUE}================================================${NC}"
    echo -e "${BLUE}  Chrome Driver & Dependencies Installer${NC}"
    echo -e "${BLUE}================================================${NC}"
    echo ""
    
    check_os
    echo ""
    
    install_chrome
    echo ""
    
    check_python
    echo ""
    
    install_python_deps
    echo ""
    
    verify_installation
    echo ""
    
    echo -e "${GREEN}🎉 Installation completed successfully!${NC}"
    echo -e "${GREEN}You can now run your Python scripts with Chrome automation.${NC}"
    echo ""
    echo -e "${BLUE}Usage example:${NC}"
    echo -e "${BLUE}  python3 test.py${NC}"
    echo ""
}

# Run main function
main "$@"
