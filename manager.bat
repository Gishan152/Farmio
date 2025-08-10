@echo off
REM Set working directory to scripts folder
cd /d "%~dp0scripts"
REM Call the main manager script
call farmio-manager.bat
