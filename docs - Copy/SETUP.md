# Setup and Installation Guide

## Overview

This guide provides step-by-step instructions to set up the development environment for the entire Software Architecture web application (frontend, backend, and database).

## System Requirements

### General Requirements
- **Git**: Version control system
- **Code Editor**: VS Code or similar
- **Terminal**: Command line interface

### Frontend Requirements
- **Node.js**: v18+ (for bun installation)
- **Bun**: Latest version (package manager)
- **RAM**: 2GB minimum
- **Disk Space**: 1GB for dependencies

### Backend Requirements
- **Java**: JDK 11 or higher
- **Maven**: 3.6+ or use Maven wrapper
- **RAM**: 2GB minimum
- **Disk Space**: 1GB for dependencies

### Database Requirements
- **MySQL**: 5.7+ or PostgreSQL 12+
- **RAM**: 1GB minimum
- **Disk Space**: 2GB for data

### Mobile Requirements (Optional)
- **Flutter SDK**: Latest version
- **Android SDK**: For Android development
- **Xcode**: For iOS development (macOS only)

## Step 1: Clone the Repository

```bash
# Navigate to desired location
cd /path/to/workspace

# Clone repository (if using Git)
git clone <repository-url>
cd "Software Architecture"

# Verify directory structure
ls -la
# Should show: backend/, frontend_web/, mobile_app/, docs/
```

## Step 2: Frontend Setup

### 2.1 Install Bun

#### Windows
```powershell
# Using PowerShell
irm https://bun.sh/install.ps1 | iex

# Add Bun to PATH (if needed)
$env:Path += ";$env:USERPROFILE\.bun\bin"
```

#### macOS/Linux
```bash
curl -fsSL https://bun.sh/install | bash

# Add to PATH in ~/.bashrc or ~/.zshrc
export PATH=$HOME/.bun/bin:$PATH
source ~/.bashrc  # or ~/.zshrc
```

### 2.2 Install Frontend Dependencies

```bash
# Navigate to frontend directory
cd frontend_web

# Install dependencies with Bun
bun install

# Verify installation
bun --version
```

### 2.3 Configure Frontend

```bash
# Frontend configuration is in vite.config.ts
# Default development server: http://localhost:5173

# Optional: Modify port in vite.config.ts
# export default defineConfig({
#   server: {
#     port: 3000
#   }
# })
```

## Step 3: Backend Setup

### 3.1 Verify Java Installation

```bash
# Check Java version
java -version

# Should output: Java 11 or higher
# Example: openjdk version "11.0.12" 2021-07-20
```

If Java is not installed:

#### Windows
```powershell
# Using Chocolatey
choco install openjdk

# Or download from: https://jdk.java.net/
```

#### macOS
```bash
# Using Homebrew
brew install openjdk@11

# Add to PATH (add to ~/.zshrc or ~/.bash_profile)
export PATH="/opt/homebrew/opt/openjdk@11/bin:$PATH"
```

#### Linux (Ubuntu/Debian)
```bash
sudo apt-get update
sudo apt-get install openjdk-11-jdk
```

### 3.2 Navigate to Backend

```bash
# From project root
cd backend

# Verify Maven wrapper exists
# Windows: Check for mvnw.cmd
# Unix/Linux/Mac: Check for mvnw
```

### 3.3 Build Backend

```bash
# Windows
mvnw.cmd clean package

# Unix/Linux/Mac
./mvnw clean package

# First build may take 5-10 minutes
# Downloads dependencies and compiles code
```

### 3.4 Configure Backend

Edit `src/main/resources/application.properties`:

```properties
# Server Configuration
server.port=8080
server.servlet.context-path=/api

# Database Configuration (MySQL example)
spring.datasource.url=jdbc:mysql://localhost:3306/traffic_db
spring.datasource.username=root
spring.datasource.password=root
spring.datasource.driver-class-name=com.mysql.cj.jdbc.Driver

# JPA/Hibernate Configuration
spring.jpa.hibernate.ddl-auto=update
spring.jpa.show-sql=false
spring.jpa.properties.hibernate.dialect=org.hibernate.dialect.MySQL8Dialect

# Logging
logging.level.root=INFO
logging.level.traffic.example=DEBUG
```

## Step 4: Database Setup

### 4.1 Install Database

#### MySQL Installation

**Windows**
```bash
# Using Chocolatey
choco install mysql

# Or download installer from: https://dev.mysql.com/downloads/
```

**macOS**
```bash
# Using Homebrew
brew install mysql

# Start MySQL service
brew services start mysql

# Verify installation
mysql --version
```

**Linux (Ubuntu/Debian)**
```bash
sudo apt-get update
sudo apt-get install mysql-server

# Start MySQL service
sudo systemctl start mysql

# Verify installation
mysql --version
```

### 4.2 Create Database

```bash
# Connect to MySQL
mysql -u root -p

# At MySQL prompt, create database
CREATE DATABASE traffic_db;

# Create user (if needed)
CREATE USER 'traffic_user'@'localhost' IDENTIFIED BY 'password123';

# Grant privileges
GRANT ALL PRIVILEGES ON traffic_db.* TO 'traffic_user'@'localhost';

# Flush privileges
FLUSH PRIVILEGES;

# Exit MySQL
EXIT;
```

### 4.3 Import Initial Data

```bash
# Using MySQL client
mysql -u root -p traffic_db < backend/src/main/resources/data.sql

# Or from MySQL prompt
SOURCE backend/src/main/resources/data.sql;
```

## Step 5: Environment Variables (Optional)

### Create .env files

#### Frontend (.env)
```bash
cd frontend_web

# Create .env.local
VITE_API_BASE_URL=http://localhost:8080/api
VITE_ENV=development
```

#### Backend (Already uses application.properties)
No .env file needed; use `application.properties`

## Step 6: Run Development Servers

### 6.1 Start Backend

```bash
cd backend

# Windows
mvnw.cmd spring-boot:run

# Unix/Linux/Mac
./mvnw spring-boot:run

# Expected output:
# Started Application in X.XXX seconds (JVM running for Y.YYY)
# Application is available at http://localhost:8080
```

### 6.2 Start Frontend (New Terminal)

```bash
cd frontend_web

# Start development server
bun run dev

# Expected output:
# VITE v4.X.X  ready in XXX ms
# Local:    http://localhost:5173/
```

### 6.3 Access Application

- **Frontend**: http://localhost:5173
- **Backend API**: http://localhost:8080/api
- **Login Page**: http://localhost:5173/login

## Step 7: Verify Setup

### Frontend Verification

```bash
# In frontend_web directory
bun run build

# Should complete without errors
# Creates dist/ folder with optimized build
```

### Backend Verification

```bash
# In backend directory
# Windows
mvnw.cmd test

# Unix/Linux/Mac
./mvnw test

# Should run all tests successfully
```

### Database Verification

```bash
# Connect to MySQL
mysql -u root -p

# Check database
SHOW DATABASES;
USE traffic_db;
SHOW TABLES;
SELECT COUNT(*) FROM users;

EXIT;
```

## Step 8: Mobile App Setup (Optional)

### Flutter Installation

```bash
# Download from https://flutter.dev/docs/get-started/install

# Verify installation
flutter --version

# Get dependencies
cd mobile_app
flutter pub get

# Run on Android emulator
flutter run -d android

# Or on iOS simulator (macOS)
flutter run -d ios
```

## Troubleshooting

### Common Issues

#### Frontend Issues

**Issue**: "bun: command not found"
```bash
# Add Bun to PATH
# Windows: Add to Environment Variables
# macOS/Linux: Add to ~/.bashrc or ~/.zshrc
```

**Issue**: Port 5173 already in use
```bash
# Kill existing process or use different port
bun run dev -- --port 3000
```

**Issue**: Module not found errors
```bash
# Reinstall dependencies
bun install

# Clear cache
bun cache clean
```

#### Backend Issues

**Issue**: "Cannot find symbol" during build
```bash
# Clean and rebuild
mvnw.cmd clean package
```

**Issue**: Database connection refused
```bash
# Verify MySQL is running
# Update connection string in application.properties
# Check username and password
```

**Issue**: Port 8080 already in use
```bash
# Change port in application.properties
server.port=8081
```

#### Database Issues

**Issue**: "Access denied for user"
```bash
# Verify credentials
# Reset MySQL root password if needed
mysql -u root
```

**Issue**: Database doesn't exist
```bash
# Create database
mysql -u root -p
CREATE DATABASE traffic_db;
```

## Development Workflow

### Daily Startup

```bash
# Terminal 1: Start Backend
cd backend
mvnw.cmd spring-boot:run  # Windows
./mvnw spring-boot:run    # Mac/Linux

# Terminal 2: Start Frontend
cd frontend_web
bun run dev

# Access application
# Frontend: http://localhost:5173
# Backend: http://localhost:8080
```

### Code Changes

**Frontend**
- Changes auto-reload (HMR enabled)
- No manual restart needed

**Backend**
- Requires manual restart
- Or use Spring Dev Tools for auto-restart

### Building for Production

```bash
# Frontend
cd frontend_web
bun run build
# Output: dist/

# Backend
cd backend
mvnw.cmd clean package  # Windows
./mvnw clean package    # Mac/Linux
# Output: target/application.jar
```

## Security Best Practices

### During Development

1. **Never commit credentials**
   - Use .env files (in .gitignore)
   - Use environment variables

2. **Use strong database passwords**
   - Change default MySQL root password
   - Create separate user for application

3. **Enable CORS carefully**
   - Configure for development environment
   - Restrict in production

4. **Validate all inputs**
   - Frontend validation
   - Backend validation (always!)

## Performance Tips

### Frontend
- Run `bun run build` before deployment
- Enable production mode
- Use CDN for assets

### Backend
- Use connection pooling
- Enable query caching
- Configure appropriate log levels

### Database
- Create indexes on frequently queried columns
- Use connection pooling
- Regular backups

## Next Steps

1. Review [Architecture Documentation](./ARCHITECTURE.md)
2. Read [Frontend Documentation](./FRONTEND.md)
3. Read [Backend Documentation](./BACKEND.md)
4. Review [API Documentation](./API.md)
5. Start developing!

## Getting Help

- Check individual documentation files
- Review error messages carefully
- Check application logs
- Refer to official documentation:
  - [React Documentation](https://react.dev)
  - [Spring Boot Documentation](https://spring.io/projects/spring-boot)
  - [Vite Documentation](https://vitejs.dev)
  - [Bun Documentation](https://bun.sh)
