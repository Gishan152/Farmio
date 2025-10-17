@echo off
echo Updating application.yml files for all services to support local and Docker profiles...

set ORIGINAL_DIR=%cd%
powershell -ExecutionPolicy Bypass -File "%~dp0\update-application-yml.ps1"

echo.
echo Done! Services can now run both locally and in Docker.
echo To run locally: Set spring.profiles.active=local in application.yml or use -Dspring.profiles.active=local
echo To run in Docker: Use the docker-compose.dev.yml file which sets SPRING_PROFILES_ACTIVE=docker
echo.
pause >nul
cd /d "%ORIGINAL_DIR%"
