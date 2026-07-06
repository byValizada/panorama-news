@echo off
title Panorama News Portal - Backend API
echo Starting C# ASP.NET Core API on http://localhost:5277...
cd backend\Panorama.Api
set PATH=C:\Users\Tural\AppData\Local\dotnet;%PATH%
dotnet run --launch-profile http
pause
