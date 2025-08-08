@echo off
title Farmio Microservices Manager

:menu
cls
echo ============================================
echo       FARMIO MICROSERVICES MANAGER
echo ============================================
echo.
echo Please select an option:
echo.
echo === BULK OPERATIONS ===
echo 1. Start ALL services
echo 2. Start ESSENTIAL services only
echo 3. Stop all services
echo 4. Check services status
echo.
echo === FRONTEND ===
echo 5. Start Frontend (React)
echo 6. Open Frontend URL
echo.
echo === INDIVIDUAL SERVICE CONTROL ===
echo 7. Start specific service
echo 8. Stop specific service
echo.
echo === QUICK ACCESS ===
echo 9. Open Eureka Dashboard
echo 10. Open API Gateway
echo 11. Open RabbitMQ Management
echo.
echo 12. Build ALL services
echo 13. Build specific service
echo 0. Exit
echo.
echo ============================================
set /p choice="Enter your choice (0-13): "

if "%choice%"=="1" goto start_all
if "%choice%"=="2" goto start_essential
if "%choice%"=="3" goto stop_all
if "%choice%"=="4" goto check_status
if "%choice%"=="5" goto start_frontend
if "%choice%"=="6" goto open_frontend
if "%choice%"=="7" goto start_specific
if "%choice%"=="8" goto stop_specific
if "%choice%"=="9" goto open_eureka
if "%choice%"=="10" goto open_gateway
if "%choice%"=="11" goto open_rabbitmq
if "%choice%"=="12" goto build_all
if "%choice%"=="13" goto build_specific
if "%choice%"=="0" goto exit
goto invalid

:start_specific
cls
echo ============================================
echo          START SPECIFIC SERVICE
echo ============================================
echo.
echo Available services:
echo.
echo 1.  Eureka Server (Port 8761) - Service Registry
echo 2.  Auth Service (Port 8085) - Authentication
echo 3.  API Gateway (Port 8080) - Entry Point
echo 4.  Product Service (Port 8081) - Product Management
echo 5.  Test Service (Port 8083) - Testing
echo 6.  Order Service (Port 8086) - Order Management
echo 7.  Crop Listing Service (Port 8087) - Crop Listings
echo 8.  Waste Service (Port 8088) - Waste Management
echo 9.  Transport Service (Port 8089) - Transportation
echo 10. Warehouse Service (Port 8090) - Warehouse
echo 11. Analytics Service (Port 8091) - Analytics
echo 12. Chat Service (Port 8092) - Chat/Messaging
echo 13. Payment Service (Port 8093) - Payments
echo.
echo 0. Back to main menu
echo.
set /p service_choice="Enter service number to start (0-13): "

if "%service_choice%"=="0" goto menu
if "%service_choice%"=="1" goto start_eureka
if "%service_choice%"=="2" goto start_auth
if "%service_choice%"=="3" goto start_gateway
if "%service_choice%"=="4" goto start_product
if "%service_choice%"=="5" goto start_test
if "%service_choice%"=="6" goto start_order
if "%service_choice%"=="7" goto start_crop
if "%service_choice%"=="8" goto start_waste
if "%service_choice%"=="9" goto start_transport
if "%service_choice%"=="10" goto start_warehouse
if "%service_choice%"=="11" goto start_analytics
if "%service_choice%"=="12" goto start_chat
if "%service_choice%"=="13" goto start_payment

echo Invalid choice! Please enter a number between 0-13.
timeout /t 2 >nul
goto start_specific

:start_eureka
echo Starting Eureka Server...
wt -w 0 nt -d "%~dp0../backend/eureka-server" cmd /k "echo Starting Eureka Server... && mvn spring-boot:run -Dspring.profiles.active=local"
echo Eureka Server started in new tab.
timeout /t 3 >nul
goto menu

:start_auth
echo Starting Auth Service...
wt -w 0 nt -d "%~dp0../backend/auth-service" cmd /k "echo Starting Auth Service... && mvn spring-boot:run -Dspring.profiles.active=local"
echo Auth Service started in new tab.
timeout /t 3 >nul
goto menu

:start_gateway
echo Starting API Gateway...
wt -w 0 nt -d "%~dp0../backend/api-gateway" cmd /k "echo Starting API Gateway... && mvn spring-boot:run -Dspring.profiles.active=local"
echo API Gateway started in new tab.
timeout /t 3 >nul
goto menu

:start_product
echo Starting Product Service...
wt -w 0 nt -d "%~dp0../backend/product-service" cmd /k "echo Starting Product Service... && mvn spring-boot:run -Dspring.profiles.active=local"
echo Product Service started in new tab.
timeout /t 3 >nul
goto menu

:start_test
echo Starting Test Service...
wt -w 0 nt -d "%~dp0../backend/test-service" cmd /k "echo Starting Test Service... && mvn spring-boot:run -Dspring.profiles.active=local"
echo Test Service started in new tab.
timeout /t 3 >nul
goto menu

:start_order
echo Starting Order Service...
wt -w 0 nt -d "%~dp0../backend/order-service" cmd /k "echo Starting Order Service... && mvn spring-boot:run -Dspring.profiles.active=local"
echo Order Service started in new tab.
timeout /t 3 >nul
goto menu

:start_crop
echo Starting Crop Listing Service...
wt -w 0 nt -d "%~dp0../backend/crop-listing-service" cmd /k "echo Starting Crop Listing Service... && mvn spring-boot:run -Dspring.profiles.active=local"
echo Crop Listing Service started in new tab.
timeout /t 3 >nul
goto menu

:start_waste
echo Starting Waste Service...
wt -w 0 nt -d "%~dp0../backend/waste-service" cmd /k "echo Starting Waste Service... && mvn spring-boot:run -Dspring.profiles.active=local"
echo Waste Service started in new tab.
timeout /t 3 >nul
goto menu

:start_transport
echo Starting Transport Service...
wt -w 0 nt -d "%~dp0../backend/transport-service" cmd /k "echo Starting Transport Service... && mvn spring-boot:run -Dspring.profiles.active=local"
echo Transport Service started in new tab.
timeout /t 3 >nul
goto menu

:start_warehouse
echo Starting Warehouse Service...
wt -w 0 nt -d "%~dp0../backend/warehouse-service" cmd /k "echo Starting Warehouse Service... && mvn spring-boot:run -Dspring.profiles.active=local"
echo Warehouse Service started in new tab.
timeout /t 3 >nul
goto menu

:start_analytics
echo Starting Analytics Service...
wt -w 0 nt -d "%~dp0../backend/analytic-service" cmd /k "echo Starting Analytics Service... && mvn spring-boot:run -Dspring.profiles.active=local"
echo Analytics Service started in new tab.
timeout /t 3 >nul
goto menu

:start_chat
echo Starting Chat Service...
wt -w 0 nt -d "%~dp0../backend/chat-service" cmd /k "echo Starting Chat Service... && mvn spring-boot:run -Dspring.profiles.active=local"
echo Chat Service started in new tab.
timeout /t 3 >nul
goto menu

:start_payment
echo Starting Payment Service...
wt -w 0 nt -d "%~dp0../backend/payment-service" cmd /k "echo Starting Payment Service... && mvn spring-boot:run -Dspring.profiles.active=local"
echo Payment Service started in new tab.
timeout /t 3 >nul
goto menu

:stop_specific
cls
echo ============================================
echo          STOP SPECIFIC SERVICE
echo ============================================
echo.
echo Available methods:
echo.
echo 1. Stop by Port (recommended)
echo 2. Stop by Service Name (less precise)
echo 3. View running Java processes
echo.
echo 0. Back to main menu
echo.
set /p stop_choice="Enter your choice (0-3): "

if "%stop_choice%"=="0" goto menu
if "%stop_choice%"=="1" goto stop_by_port
if "%stop_choice%"=="2" goto stop_by_name
if "%stop_choice%"=="3" goto view_processes

echo Invalid choice!
timeout /t 2 >nul
goto stop_specific

:stop_by_port
cls
echo ============================================
echo           STOP SERVICE BY PORT
echo ============================================
echo.
echo Enter the port number of the service to stop:
echo.
echo Common ports:
echo - 8761 (Eureka Server)
echo - 8080 (API Gateway)
echo - 8085 (Auth Service)
echo - 8081 (Product Service)
echo - 8083 (Test Service)
echo - 8086 (Order Service)
echo - 8087 (Crop Listing Service)
echo - 8088 (Waste Service)
echo - 8089 (Transport Service)
echo - 8090 (Warehouse Service)
echo - 8091 (Analytics Service)
echo - 8092 (Chat Service)
echo - 8093 (Payment Service)
echo.
set /p port="Enter port number (or 0 to cancel): "

if "%port%"=="0" goto stop_specific

echo.
echo Finding process running on port %port%...

REM Find the PID of the process using the specified port
for /f "tokens=5" %%i in ('netstat -ano ^| findstr ":%port% "') do (
    set pid=%%i
    goto kill_process
)

echo No process found running on port %port%.
timeout /t 3 >nul
goto stop_specific

:kill_process
if defined pid (
    echo Found process with PID: %pid%
    echo Stopping process...
    taskkill /f /pid %pid% >nul 2>&1
    if %errorlevel% equ 0 (
        echo Successfully stopped service on port %port%.
    ) else (
        echo Failed to stop service on port %port%.
    )
) else (
    echo No process found on port %port%.
)
timeout /t 3 >nul
goto stop_specific

:stop_by_name
cls
echo ============================================
echo        STOP SERVICE BY NAME
echo ============================================
echo.
echo WARNING: This will stop ALL Java processes containing the service name!
echo.
echo Available service names:
echo - eureka-server
echo - auth-service
echo - api-gateway
echo - product-service
echo - test-service
echo - order-service
echo - crop-listing-service
echo - waste-service
echo - transport-service
echo - warehouse-service
echo - analytic-service
echo - chat-service
echo - payment-service
echo.
set /p service_name="Enter service name (or 'cancel' to go back): "

if /i "%service_name%"=="cancel" goto stop_specific

echo.
echo Stopping all processes related to %service_name%...
wmic process where "name='java.exe' and commandline like '%%%service_name%%%'" delete >nul 2>&1
echo Service %service_name% processes stopped.
timeout /t 3 >nul
goto stop_specific

:view_processes
cls
echo ============================================
echo         RUNNING JAVA PROCESSES
echo ============================================
echo.
echo Current Java processes and their PIDs:
echo.
wmic process where "name='java.exe'" get processid,commandline /format:table
echo.
echo You can manually stop a process using: taskkill /f /pid [PID_NUMBER]
echo.
pause
goto stop_specific

:start_all
cls
echo Starting all services...
call start-all-services.bat
goto menu

:start_essential
cls
echo Starting essential services...
call start-essential-services.bat
goto menu

:check_status
cls
call check-services-status.bat
goto menu

:stop_all
cls
call stop-all-services.bat
goto menu

:start_frontend
cls
echo Starting Frontend...
call start-frontend.bat
goto menu

:open_frontend
echo Opening Frontend URL...
start http://localhost:5173
goto menu

:open_eureka
echo Opening Eureka Dashboard...
start http://localhost:8761
goto menu

:open_gateway
echo Opening API Gateway...
start http://localhost:8080
goto menu

:open_rabbitmq
echo Opening RabbitMQ Management...
start http://localhost:15672
goto menu


:build_all
cls
echo Building ALL services...
call build-all.bat
goto menu

:build_specific
cls
echo ============================================
echo         BUILD SPECIFIC SERVICE
echo ============================================
echo.
echo Available services:
echo 1.  Eureka Server
echo 2.  Auth Service
echo 3.  API Gateway
echo 4.  Product Service
echo 5.  Test Service
echo 6.  Order Service
echo 7.  Crop Listing Service
echo 8.  Waste Service
echo 9.  Transport Service
echo 10. Warehouse Service
echo 11. Analytics Service
echo 12. Chat Service
echo 13. Payment Service
echo.
echo 0. Back to main menu
echo.
set /p build_choice="Enter service number to build (0-13): "

if "%build_choice%"=="0" goto menu
if "%build_choice%"=="1" call :build_eureka & goto build_specific
if "%build_choice%"=="2" call :build_auth & goto build_specific
if "%build_choice%"=="3" call :build_gateway & goto build_specific
if "%build_choice%"=="4" call :build_product & goto build_specific
if "%build_choice%"=="5" call :build_test & goto build_specific
if "%build_choice%"=="6" call :build_order & goto build_specific
if "%build_choice%"=="7" call :build_crop & goto build_specific
if "%build_choice%"=="8" call :build_waste & goto build_specific
if "%build_choice%"=="9" call :build_transport & goto build_specific
if "%build_choice%"=="10" call :build_warehouse & goto build_specific
if "%build_choice%"=="11" call :build_analytics & goto build_specific
if "%build_choice%"=="12" call :build_chat & goto build_specific
if "%build_choice%"=="13" call :build_payment & goto build_specific

echo Invalid choice! Please enter a number between 0-13.
timeout /t 2 >nul
goto build_specific

:build_eureka
echo Building Eureka Server...
wt -w 0 nt -d "%~dp0../backend/eureka-server" cmd /k "echo Building Eureka Server... && mvn clean install -DskipTests"
goto :eof

:build_auth
echo Building Auth Service...
wt -w 0 nt -d "%~dp0../backend/auth-service" cmd /k "echo Building Auth Service... && mvn clean install -DskipTests"
goto :eof

:build_gateway
echo Building API Gateway...
wt -w 0 nt -d "%~dp0../backend/api-gateway" cmd /k "echo Building API Gateway... && mvn clean install -DskipTests"
goto :eof

:build_product
echo Building Product Service...
wt -w 0 nt -d "%~dp0../backend/product-service" cmd /k "echo Building Product Service... && mvn clean install -DskipTests"
goto :eof

:build_test
echo Building Test Service...
wt -w 0 nt -d "%~dp0../backend/test-service" cmd /k "echo Building Test Service... && mvn clean install -DskipTests"
goto :eof

:build_order
echo Building Order Service...
wt -w 0 nt -d "%~dp0../backend/order-service" cmd /k "echo Building Order Service... && mvn clean install -DskipTests"
goto :eof

:build_crop
echo Building Crop Listing Service...
wt -w 0 nt -d "%~dp0../backend/crop-listing-service" cmd /k "echo Building Crop Listing Service... && mvn clean install -DskipTests"
goto :eof

:build_waste
echo Building Waste Service...
wt -w 0 nt -d "%~dp0../backend/waste-service" cmd /k "echo Building Waste Service... && mvn clean install -DskipTests"
goto :eof

:build_transport
echo Building Transport Service...
wt -w 0 nt -d "%~dp0../backend/transport-service" cmd /k "echo Building Transport Service... && mvn clean install -DskipTests"
goto :eof

:build_warehouse
echo Building Warehouse Service...
wt -w 0 nt -d "%~dp0../backend/warehouse-service" cmd /k "echo Building Warehouse Service... && mvn clean install -DskipTests"
goto :eof

:build_analytics
echo Building Analytics Service...
wt -w 0 nt -d "%~dp0../backend/analytic-service" cmd /k "echo Building Analytics Service... && mvn clean install -DskipTests"
goto :eof

:build_chat
echo Building Chat Service...
wt -w 0 nt -d "%~dp0../backend/chat-service" cmd /k "echo Building Chat Service... && mvn clean install -DskipTests"
goto :eof

:build_payment
echo Building Payment Service...
wt -w 0 nt -d "%~dp0../backend/payment-service" cmd /k "echo Building Payment Service... && mvn clean install -DskipTests"
goto :eof

:invalid
echo.
echo Invalid choice! Please enter a number between 0-13.
timeout /t 2 >nul
goto menu

:exit
echo.
echo Thank you for using Farmio Microservices Manager!
timeout /t 2 >nul
exit
