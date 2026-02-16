@echo off
echo === OAuth Setup Quick Test ===
echo.

echo 1. Testing OAuth start endpoints...
echo.
echo   ClickUp:
curl.exe -s -o nul -w "%%{http_code}" http://localhost:3000/api/oauth/start/clickup
echo   Asana:
curl.exe -s -o nul -w "%%{http_code}" http://localhost:3000/api/oauth/start/asana
echo   Calendly (HTTPS):
curl.exe -s -o nul -w "%%{http_code}" http://localhost:3000/api/oauth/start/calendly
echo   Figma:
curl.exe -s -o nul -w "%%{http_code}" http://localhost:3000/api/oauth/start/figma
echo   Dropbox:
curl.exe -s -o nul -w "%%{http_code}" http://localhost:3000/api/oauth/start/dropbox
echo   Box:
curl.exe -s -o nul -w "%%{http_code}" http://localhost:3000/api/oauth/start/box
echo   Confluence:
curl.exe -s -o nul -w "%%{http_code}" http://localhost:3000/api/oauth/start/confluence
echo.

echo 2. Testing tokens endpoint...
curl.exe -s http://localhost:3000/api/oauth/tokens
echo.

echo Testing Confluence OAuth...
curl -X POST http://localhost:3000/api/test/confluence_oauth -H "Content-Type: application/json" -d "{\"testType\": \"basic\"}"
echo.

echo Testing Eventbrite...
curl -X POST http://localhost:3000/api/test/eventbrite -H "Content-Type: application/json" -d "{\"testType\": \"basic\"}"
echo.

echo.
echo If OAuth start returns 302/307 (redirect), that's good!
echo.
echo Open these URLs to start OAuth:
echo   ClickUp:     http://localhost:3000/api/oauth/start/clickup
echo   Asana:       http://localhost:3000/api/oauth/start/asana
echo   Calendly (HTTPS): https://localhost:3000/api/oauth/start/calendly
echo   Figma:       http://localhost:3000/api/oauth/start/figma
echo   Dropbox:     http://localhost:3000/api/oauth/start/dropbox
echo   Box:         http://localhost:3000/api/oauth/start/box
echo   Confluence:  http://localhost:3000/api/oauth/start/confluence
echo.
echo.
echo 3. Test API access:
echo   # Test ClickUp:
node test-clickup.js basic
echo.
echo   # Test Asana:
node test-asana.js basic
echo.
echo   # Test Jotform:
node test-jotform.js basic
echo.
echo   # Test Airtable:
node test-airtable.js basic
echo.
echo   # Test Digisign:
node test-digisign.js basic
echo.
echo   # Test Dropbox:
node test-dropbox.js basic
echo.
echo   # Test Box:
node test-box.js basic
echo.
echo   # Test Figma:
node test-figma.js basic
echo.
pause
