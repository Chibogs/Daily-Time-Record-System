# Stage 1 — Build
# Gumagamit ng .NET SDK image para i-compile ang code
FROM mcr.microsoft.com/dotnet/sdk:10.0 AS build
WORKDIR /src

# Copy project files — para ma-restore ang packages

# Copy muna ang .csproj files LANG — hindi pa buong code ex. -> DTR.Domain/DTR.Domain.csproj bago yung DTR.Domain/

# Bakit? Para sa DOCKER LAYER CACHING —
# kung hindi nagbago ang dependencies (.csproj), 
# hindi na uulitin ni Docker ang "dotnet restore" step
# sa susunod na pag-build, kahit magbago ang source code

COPY DTR.Domain/DTR.Domain.csproj DTR.Domain/
COPY DTR.Application/DTR.Application.csproj DTR.Application/
COPY DTR.Infrastructure/DTR.Infrastructure.csproj DTR.Infrastructure/
COPY DTR.Api/DTR.Api.csproj DTR.Api/

# Restore packages
# Download at install ang mga dependencies na nakalista sa .csproj files
RUN dotnet restore DTR.Api/DTR.Api.csproj

# Copy lahat ng source code
COPY . .

# Build at publish ang app
RUN dotnet publish DTR.Api/DTR.Api.csproj -c Release -o /app/publish

# Stage 2 — Runtime
# Gumagamit ng smaller ASP.NET runtime image — hindi na kailangan ng SDK
FROM mcr.microsoft.com/dotnet/aspnet:10.0 AS runtime
WORKDIR /app

# Copy published files mula sa build stage
COPY --from=build /app/publish .

# Expose port 8080 — default ng ASP.NET Core sa containers
EXPOSE 8080

# Start the application
ENTRYPOINT ["dotnet", "DTR.Api.dll"]