@echo off
echo ==============================================================
echo   Pacific Remodel and Development - Local Preview Server
echo ==============================================================
echo.
echo Starting local web server...
echo.
echo Press Ctrl+C in this terminal window to stop the server.
echo.
echo Opening http://localhost:8000 in your browser...
start http://localhost:8000
python -m http.server 8000
pause
