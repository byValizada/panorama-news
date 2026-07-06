@echo off
title Panorama News Portal - Startup Manager
echo Launching Panorama Full Stack Application...
start cmd /k "backend-baslat.bat"
start cmd /k "frontend-baslat.bat"
echo Done.
echo API: http://localhost:5277/api
echo Swagger Docs: http://localhost:5277/openapi/v1.json (Development Mode Only)
echo Frontend Client: http://localhost:5173/
echo Admin Panel: http://localhost:5173/admin
echo Default Admin Credentials:
echo Username: admin
echo Password: Admin123!
echo Email: admin@panorama.az
echo ----------------------------------------------------
echo To stop the servers, close their command windows.
pause
