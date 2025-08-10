@echo off
set ORIGINAL_DIR=%cd%
echo ============================================
echo          FARMIO MICROSERVICES STARTER
echo ============================================
echo.

REM Set the profile to local
set SPRING_PROFILES_ACTIVE=local

echo Setting up environment...
echo SPRING_PROFILES_ACTIVE=%SPRING_PROFILES_ACTIVE%
echo.

echo ============================================
echo Checking prerequisites...
echo ============================================

REM Check if Java is installed
java -version >nul 2>&1
if %errorlevel% neq 0 (
    echo ERROR: Java is not installed or not in PATH
    echo Please install Java 17 or later and add it to your PATH
    pause
    exit /b 1
)

REM Check if Maven is installed
call mvn -version >nul 2>&1
if %errorlevel% neq 0 (
    echo ERROR: Maven is not installed or not in PATH
    echo Please install Maven and add it to your PATH
    pause
    exit /b 1
)

echo Java and Maven are available.
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
echo Starting services in correct order...
echo ============================================
echo.

REM Step 1: Start Eureka Server first
echo [1/14] Starting Eureka Server (Service Registry)...
wt -w 0 nt -d "%~dp0../backend/eureka-server" --title "Eureka Server" cmd /k "echo Starting Eureka Server... && mvn spring-boot:run -Dspring.profiles.active=local"
REM Wait a bit for Eureka to start
echo Waiting 30 seconds for Eureka Server to initialize...
timeout /t 30 /nobreak >nul

REM Step 2: Start Auth Service
echo [2/14] Starting Auth Service...
wt -w 0 nt -d "%~dp0../backend/auth-service" --title "Auth Service" cmd /k "echo Starting Auth Service... && mvn spring-boot:run -Dspring.profiles.active=local"
REM Wait a bit
timeout /t 10 /nobreak >nul

REM Step 3: Start API Gateway
echo [3/14] Starting API Gateway...
wt -w 0 nt -d "%~dp0../backend/api-gateway" --title "API Gateway" cmd /k "echo Starting API Gateway... && mvn spring-boot:run -Dspring.profiles.active=local"
REM Wait a bit
timeout /t 10 /nobreak >nul

REM Step 4: Start Order Service
echo [4/14] Starting Order Service...
wt -w 0 nt -d "%~dp0../backend/order-service" --title "Order Service" cmd /k "echo Starting Order Service... && mvn spring-boot:run -Dspring.profiles.active=local"
REM Wait a bit
timeout /t 5 /nobreak >nul

REM Step 5: Start Crop Listing Service
echo [5/14] Starting Crop Listing Service...
wt -w 0 nt -d "%~dp0../backend/crop-listing-service" --title "Crop Listing Service" cmd /k "echo Starting Crop Listing Service... && mvn spring-boot:run -Dspring.profiles.active=local"
REM Wait a bit
timeout /t 5 /nobreak >nul

REM Step 6: Start Waste Service
echo [6/14] Starting Waste Service...
wt -w 0 nt -d "%~dp0../backend/waste-service" --title "Waste Service" cmd /k "echo Starting Waste Service... && mvn spring-boot:run -Dspring.profiles.active=local"
REM Wait a bit
timeout /t 5 /nobreak >nul

REM Step 7: Start Transport Service
echo [7/14] Starting Transport Service...
wt -w 0 nt -d "%~dp0../backend/transport-service" --title "Transport Service" cmd /k "echo Starting Transport Service... && mvn spring-boot:run -Dspring.profiles.active=local"
REM Wait a bit
timeout /t 5 /nobreak >nul

REM Step 8: Start Warehouse Service
echo [8/14] Starting Warehouse Service...
wt -w 0 nt -d "%~dp0../backend/warehouse-service" --title "Warehouse Service" cmd /k "echo Starting Warehouse Service... && mvn spring-boot:run -Dspring.profiles.active=local"
REM Wait a bit
timeout /t 5 /nobreak >nul

REM Step 9: Start Analytics Service
echo [9/14] Starting Analytics Service...
wt -w 0 nt -d "%~dp0../backend/analytic-service" --title "Analytics Service" cmd /k "echo Starting Analytics Service... && mvn spring-boot:run -Dspring.profiles.active=local"
REM Wait a bit
timeout /t 5 /nobreak >nul

REM Step 10: Start Chat Service
echo [10/14] Starting Chat Service...
wt -w 0 nt -d "%~dp0../backend/chat-service" --title "Chat Service" cmd /k "echo Starting Chat Service... && mvn spring-boot:run -Dspring.profiles.active=local"
REM Wait a bit
timeout /t 5 /nobreak >nul

REM Step 11: Start Payment Service
echo [11/14] Starting Payment Service...
wt -w 0 nt -d "%~dp0../backend/payment-service" --title "Payment Service" cmd /k "echo Starting Payment Service... && mvn spring-boot:run -Dspring.profiles.active=local"
REM Wait a bit
timeout /t 5 /nobreak >nul

REM Step 12: Start Test Service
echo [12/14] Starting Test Service...
wt -w 0 nt -d "%~dp0../backend/test-service" --title "Test Service" cmd /k "echo Starting Test Service... && mvn spring-boot:run -Dspring.profiles.active=local"
REM Wait a bit
timeout /t 5 /nobreak >nul

REM Step 13: Start Product Service (if needed)
echo [13/14] Starting Product Service...
wt -w 0 nt -d "%~dp0../backend/product-service" --title "Product Service" cmd /k "echo Starting Product Service... && mvn spring-boot:run -Dspring.profiles.active=local"
REM Step 14: Start Frontend (React)
echo [14/14] Starting Frontend (React)...
wt -w 0 nt -d "%~dp0../frontend" --title "Frontend (React)" cmd /k "echo Starting Frontend... && npm run dev"

echo.
echo ============================================
echo All services are being started!
echo ============================================
echo.
echo Service URLs:
echo - Eureka Server: http://localhost:8761
echo - API Gateway: http://localhost:8080
echo - Auth Service: http://localhost:8085
echo - Order Service: http://localhost:8086
echo - Crop Listing: http://localhost:8087
echo - Waste Service: http://localhost:8088
echo - Transport Service: http://localhost:8089
echo - Warehouse Service: http://localhost:8090
echo - Analytics Service: http://localhost:8091
echo - Chat Service: http://localhost:8092
echo - Payment Service: http://localhost:8093
echo - Test Service: http://localhost:8083
echo - Product Service: http://localhost:8081
echo.
echo Wait for all services to register with Eureka before testing.
echo Check Eureka dashboard at: http://localhost:8761
echo.
echo Press any key to exit this window...
pause >nul
cd /d "%ORIGINAL_DIR%"
