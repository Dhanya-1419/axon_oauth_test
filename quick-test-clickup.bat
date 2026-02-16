@echo off
echo === ClickUp Connection Quick Test ===
echo.

echo 1. Testing OAuth start endpoint...
curl.exe -s -o nul -w "%%{http_code}" http://localhost:3000/api/oauth/start/clickup
echo.

echo 2. Testing OAuth start endpoint...
curl.exe -s -o nul -w "%%{http_code}" http://localhost:3000/api/oauth/start/asana
echo.

echo 3. Testing tokens endpoint...
curl.exe -s http://localhost:3000/api/oauth/tokens
echo.

echo.
echo If OAuth start returns 302 (redirect), that's good!
echo.
echo Open these URLs to start OAuth:
echo   ClickUp: http://localhost:3000/api/oauth/start/clickup
echo   Asana:  http://localhost:3000/api/oauth/start/asana
echo.
pause
