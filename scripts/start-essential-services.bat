@echo off
set ORIGINAL_DIR=%cd%
echo ============================================
echo     FARMIO ESSENTIAL SERVICES STARTER
echo ============================================
echo.

REM Set the profile to local
set SPRING_PROFILES_ACTIVE=local

echo Starting essential services only...
echo SPRING_PROFILES_ACTIVE=%SPRING_PROFILES_ACTIVE%
echo.

echo ============================================
echo NOTE: Make sure the following are running:
echo - RabbitMQ on localhost:5672
echo - PostgreSQL databases for services
echo ============================================
echo.

echo Do you want to continue? (Y/N)
set /p choice=
if /i "%choice%" neq "Y" (
    echo Cancelled by user.
    pause
    exit /b 0
)

echo.
echo ============================================
echo Starting essential services...
echo ============================================
echo.

REM Step 1: Start Eureka Server first
echo [1/4] Starting Eureka Server (Service Registry)...
wt -w 0 nt -d "%~dp0../backend/eureka-server" --title "Eureka Server" cmd /k "echo Starting Eureka Server... && mvn spring-boot:run -Dspring.profiles.active=local"
REM Wait for Eureka to start
echo Waiting 30 seconds for Eureka Server to initialize...
timeout /t 30 /nobreak >nul

REM Step 2: Start Auth Service
echo [2/4] Starting Auth Service...
wt -w 0 nt -d "%~dp0../backend/auth-service" --title "Auth Service" cmd /k "echo Starting Auth Service... && mvn spring-boot:run -Dspring.profiles.active=local"
REM Wait a bit
timeout /t 15 /nobreak >nul

REM Step 3: Start API Gateway
echo [3/4] Starting API Gateway...
wt -w 0 nt -d "%~dp0../backend/api-gateway" --title "API Gateway" cmd /k "echo Starting API Gateway... && mvn spring-boot:run -Dspring.profiles.active=local"

echo.
echo ============================================
echo Essential services are being started!
echo ============================================
echo.
echo Service URLs:
echo - Eureka Server: http://localhost:8761
echo - API Gateway: http://localhost:8080
echo - Auth Service: http://localhost:8085
echo - Crop Listing: http://localhost:8087
echo.
echo To start additional services, run individual commands or use start-all-services.bat
echo.
echo Press any key to exit this window...
pause >nul
cd /d "%ORIGINAL_DIR%"
