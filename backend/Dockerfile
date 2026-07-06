FROM mcr.microsoft.com/dotnet/sdk:10.0-preview AS build
WORKDIR /src

COPY ["Panorama.Api/Panorama.Api.csproj", "Panorama.Api/"]
RUN dotnet restore "Panorama.Api/Panorama.Api.csproj"

COPY . .
WORKDIR "/src/Panorama.Api"
RUN dotnet build "Panorama.Api.csproj" -c Release -o /app/build

FROM build AS publish
RUN dotnet publish "Panorama.Api.csproj" -c Release -o /app/publish /p:UseAppHost=false

FROM mcr.microsoft.com/dotnet/aspnet:10.0-preview AS final
WORKDIR /app
COPY --from=publish /app/publish .

EXPOSE 8080
ENTRYPOINT ["dotnet", "Panorama.Api.dll"]
