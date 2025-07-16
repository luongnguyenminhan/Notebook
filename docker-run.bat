@echo off
REM Docker build and run script for Chrome Meet Bot (Windows)
REM Author: Auto-generated script

setlocal enabledelayedexpansion

REM Check if Docker is installed
where docker >nul 2>nul
if %errorlevel% neq 0 (
    echo [ERROR] Docker is not installed. Please install Docker Desktop first.
    echo Visit: https://docs.docker.com/desktop/windows/
    exit /b 1
)

REM Check for docker-compose
where docker-compose >nul 2>nul
if %errorlevel% neq 0 (
    docker compose version >nul 2>nul
    if !errorlevel! neq 0 (
        echo [ERROR] Docker Compose is not available.
        exit /b 1
    )
    set COMPOSE_CMD=docker compose
) else (
    set COMPOSE_CMD=docker-compose
)

echo [INFO] Docker is available

REM Create directories
if not exist "screenshots" mkdir screenshots
if not exist "logs" mkdir logs
echo [INFO] Directories created: screenshots/, logs/

REM Handle commands
if "%1"=="build" goto build
if "%1"=="run" goto run
if "%1"=="script" goto script
if "%1"=="logs" goto logs
if "%1"=="stop" goto stop
if "%1"=="clean" goto clean
if "%1"=="help" goto help
if "%1"=="" goto help
goto unknown

:build
echo ================================================
echo   Building Docker Image
echo ================================================
echo [INFO] Building Chrome Meet Bot Docker image...
%COMPOSE_CMD% build
if %errorlevel% equ 0 (
    echo [INFO] Docker image built successfully!
) else (
    echo [ERROR] Docker build failed!
    exit /b 1
)
goto end

:run
echo ================================================
echo   Running Container
echo ================================================
echo [INFO] Stopping any existing containers...
%COMPOSE_CMD% down >nul 2>nul

if "%2"=="-d" (
    echo [INFO] Running in detached mode...
    %COMPOSE_CMD% up -d
    echo [INFO] Container started in background!
    echo [INFO] View logs with: %COMPOSE_CMD% logs -f
    echo [INFO] Stop with: %COMPOSE_CMD% down
) else (
    echo [INFO] Running in interactive mode...
    %COMPOSE_CMD% up
)
goto end

:script
if "%2"=="" (
    echo [ERROR] Please specify a script name
    echo Usage: %0 script ^<filename^>
    exit /b 1
)
echo ================================================
echo   Running Custom Script
echo ================================================
echo [INFO] Running script: %2
%COMPOSE_CMD% run --rm chrome-bot python %2
goto end

:logs
echo ================================================
echo   Container Logs
echo ================================================
%COMPOSE_CMD% logs -f
goto end

:stop
echo [INFO] Stopping containers...
%COMPOSE_CMD% down
goto end

:clean
echo ================================================
echo   Cleanup
echo ================================================
echo [INFO] Stopping and removing containers...
%COMPOSE_CMD% down

if "%2"=="--all" (
    echo [INFO] Removing Docker image...
    %COMPOSE_CMD% down --rmi all
    echo [INFO] Cleaning up volumes...
    docker system prune -f
)
echo [INFO] Cleanup completed!
goto end

:help
echo Chrome Meet Bot Docker Manager (Windows)
echo.
echo Usage: %0 [COMMAND] [OPTIONS]
echo.
echo Commands:
echo   build                    Build the Docker image
echo   run                      Run the container interactively
echo   run -d                   Run the container in background
echo   script ^<filename^>        Run a specific Python script
echo   logs                     Show container logs
echo   stop                     Stop the container
echo   clean                    Stop container and clean up
echo   clean --all              Stop container and remove everything
echo   help                     Show this help message
echo.
echo Examples:
echo   %0 build                 # Build the image
echo   %0 run                   # Run interactively
echo   %0 run -d                # Run in background
echo   %0 script test_docker.py # Run custom script
echo   %0 logs                  # View logs
echo   %0 clean                 # Clean up
goto end

:unknown
echo [ERROR] Unknown command: %1
goto help

:end
echo.
echo Script completed.
