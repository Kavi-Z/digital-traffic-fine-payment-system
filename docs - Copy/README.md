# Web Application Documentation

## Overview

This is a comprehensive documentation for the Software Architecture web application, which consists of a modern frontend application, a Java Spring Boot backend, and a Flutter mobile app.

## Project Structure

```
Software Architecture/
├── backend/                 # Java Spring Boot backend
├── frontend_web/            # React + TypeScript web frontend
├── mobile_app/              # Flutter mobile application
└── docs/                    # Documentation (this folder)
```

## Key Components

### 1. **Frontend Web Application** (React + TypeScript)
- **Framework**: React with TanStack Router
- **Build Tool**: Vite
- **Package Manager**: Bun
- **Language**: TypeScript
- **UI Components**: shadcn/ui component library
- **State Management**: React Context (Auth, Language)

### 2. **Backend API** (Java Spring Boot)
- **Framework**: Spring Boot with Maven
- **Language**: Java
- **Build Tool**: Maven
- **Database**: Configured via application.properties
- **API Type**: RESTful services

### 3. **Mobile Application** (Flutter)
- **Framework**: Flutter
- **Language**: Dart
- **Platform**: Android & iOS
- **Build Tool**: Gradle (Android)

## Quick Navigation

- [Frontend Documentation](./FRONTEND.md) - Detailed frontend setup, architecture, and components
- [Backend Documentation](./BACKEND.md) - Backend structure, APIs, and configuration
- [Architecture Overview](./ARCHITECTURE.md) - System design and integration points
- [Setup Guide](./SETUP.md) - Environment setup and installation instructions
- [API Documentation](./API.md) - API endpoints and integration details

## Technology Stack Summary

| Layer | Technology | Version |
|-------|-----------|---------|
| Frontend | React + TypeScript | Latest |
| Frontend Build | Vite | Latest |
| Frontend Package Manager | Bun | Latest |
| Backend | Spring Boot | TBD |
| Backend Language | Java | TBD |
| Build Tool | Maven | TBD |
| Mobile | Flutter | Latest |
| Mobile Language | Dart | Latest |

## Key Features

- User Authentication (Login page)
- Admin Dashboard
- Fine/Dispute Management
- Payment Processing
- Search Functionality
- Mobile Responsive Design
- Multi-language Support
- 3D Visualizations

## Development Workflow

1. Start with [SETUP.md](./SETUP.md) for initial environment configuration
2. Review [ARCHITECTURE.md](./ARCHITECTURE.md) for system overview
3. Refer to [FRONTEND.md](./FRONTEND.md) for frontend development
4. Refer to [BACKEND.md](./BACKEND.md) for backend development
5. Check [API.md](./API.md) for API integration details

## Common Directories

| Directory | Purpose |
|-----------|---------|
| `backend/src/main/java` | Backend source code |
| `backend/src/main/resources` | Configuration files |
| `frontend_web/src/routes` | Frontend page components |
| `frontend_web/src/components` | Reusable UI components |
| `frontend_web/src/lib` | Utility functions and API calls |
| `mobile_app/lib` | Flutter app source code |
| `mobile_app/lib/screens` | Mobile app screens |

## Support & Documentation

For detailed information about specific areas:
- Frontend development: See [FRONTEND.md](./FRONTEND.md)
- Backend APIs: See [API.md](./API.md)
- System architecture: See [ARCHITECTURE.md](./ARCHITECTURE.md)
- Setup instructions: See [SETUP.md](./SETUP.md)
