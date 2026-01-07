# ============================================
# BACKEND DOCKERFILE - .NET 8 API
# ============================================
# Stage 1: Build
FROM mcr.microsoft.com/dotnet/sdk:8.0 AS build
WORKDIR /src

# Copy csproj files and restore dependencies
COPY ["TutorCenterBackend.Presentation/TutorCenterBackend.Presentation.csproj", "TutorCenterBackend.Presentation/"]
COPY ["TutorCenterBackend.Application/TutorCenterBackend.Application.csproj", "TutorCenterBackend.Application/"]
COPY ["TutorCenterBackend.Domain/TutorCenterBackend.Domain.csproj", "TutorCenterBackend.Domain/"]
COPY ["TutorCenterBackend.Infrastructure/TutorCenterBackend.Infrastructure.csproj", "TutorCenterBackend.Infrastructure/"]

RUN dotnet restore "TutorCenterBackend.Presentation/TutorCenterBackend.Presentation.csproj"

# Copy all source code
COPY . .

# Build and publish
WORKDIR "/src/TutorCenterBackend.Presentation"
RUN dotnet build "TutorCenterBackend.Presentation.csproj" -c Release -o /app/build
RUN dotnet publish "TutorCenterBackend.Presentation.csproj" -c Release -o /app/publish /p:UseAppHost=false

# ============================================
# Stage 2: Runtime
# ============================================
FROM mcr.microsoft.com/dotnet/aspnet:8.0 AS runtime
WORKDIR /app

# Install curl for healthcheck
RUN apt-get update && apt-get install -y curl && rm -rf /var/lib/apt/lists/*

# Copy published app
COPY --from=build /app/publish .

# Expose port
EXPOSE 5000

# Health check endpoint
HEALTHCHECK --interval=30s --timeout=3s --start-period=10s --retries=3 \
  CMD curl -f http://localhost:5000/health || exit 1

# Run the application
ENTRYPOINT ["dotnet", "TutorCenterBackend.Presentation.dll"]
