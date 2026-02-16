@echo off
echo === Jira Connection Quick Test ===
echo.

echo 1. Testing OAuth start endpoint...
curl.exe -s -o nul -w "%%{http_code}" http://localhost:3000/api/oauth/start/jira
echo.

echo 2. Checking environment setup...
curl.exe -s http://localhost:3000/api/debug/jira
echo.

echo 3. Testing tokens endpoint...
curl.exe -s http://localhost:3000/api/oauth/tokens
echo.

echo.
echo If OAuth start returns 302 (redirect), that's good!
echo If you see errors, check the debug output above.
echo.
echo Open this URL to start OAuth:
echo http://localhost:3000/api/oauth/start/jira
echo.
pause
