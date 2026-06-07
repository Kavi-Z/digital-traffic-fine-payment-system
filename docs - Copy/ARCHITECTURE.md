# System Architecture Documentation

## Overview

This document describes the overall architecture of the Software Architecture web application, which follows a three-tier architecture pattern with separate frontend, backend, and mobile applications.

## Architecture Diagram

```
┌─────────────────────────────────────────────────────────────┐
│                        Client Layer                          │
├─────────────────────────────────────────────────────────────┤
│                                                               │
│  ┌──────────────────────────────────────────────────────┐   │
│  │        React Web Frontend (TypeScript)              │   │
│  │  - TanStack Router                                   │   │
│  │  - Context API (Auth, Language)                     │   │
│  │  - UI Components (shadcn/ui)                        │   │
│  │  - 3D Visualizations (Three.js)                     │   │
│  └──────────────────────────────────────────────────────┘   │
│                                                               │
│  ┌──────────────────────────────────────────────────────┐   │
│  │         Flutter Mobile App (Dart)                    │   │
│  │  - Authentication                                    │   │
│  │  - Payment Services                                  │   │
│  │  - Fine Management                                   │   │
│  └──────────────────────────────────────────────────────┘   │
│                                                               │
└─────────────────────────────────────────────────────────────┘
                           │
                    HTTP/REST API
                           │
┌─────────────────────────────────────────────────────────────┐
│                      API Layer (Backend)                     │
├─────────────────────────────────────────────────────────────┤
│                                                               │
│  Spring Boot Application (Java)                             │
│  ┌─────────────────────────────────────────────────────┐   │
│  │              Controllers Layer                       │   │
│  │  - AuthController                                   │   │
│  │  - FineController                                   │   │
│  │  - DisputeController                                │   │
│  │  - PaymentController                                │   │
│  │  - SearchController                                 │   │
│  └─────────────────────────────────────────────────────┘   │
│                           │                                  │
│  ┌─────────────────────────────────────────────────────┐   │
│  │              Services Layer                         │   │
│  │  - AuthService                                      │   │
│  │  - FineService                                      │   │
│  │  - DisputeService                                   │   │
│  │  - PaymentService                                   │   │
│  │  - SearchService                                    │   │
│  └─────────────────────────────────────────────────────┘   │
│                           │                                  │
│  ┌─────────────────────────────────────────────────────┐   │
│  │             Data Access Layer (Repositories)        │   │
│  │  - UserRepository                                   │   │
│  │  - FineRepository                                   │   │
│  │  - DisputeRepository                                │   │
│  │  - PaymentRepository                                │   │
│  └─────────────────────────────────────────────────────┘   │
│                                                               │
└─────────────────────────────────────────────────────────────┘
                           │
                    JDBC/Connection
                           │
┌─────────────────────────────────────────────────────────────┐
│                    Data Layer (Database)                     │
├─────────────────────────────────────────────────────────────┤
│                                                               │
│  Relational Database (MySQL/PostgreSQL)                      │
│  ┌─────────────────────────────────────────────────────┐   │
│  │  - Users                                            │   │
│  │  - Fines                                            │   │
│  │  - Disputes                                         │   │
│  │  - Payments                                         │   │
│  │  - Transactions Log                                 │   │
│  └─────────────────────────────────────────────────────┘   │
│                                                               │
└─────────────────────────────────────────────────────────────┘
```

## Architectural Patterns

### 1. **Three-Tier Architecture**
- **Presentation Tier**: React Web & Flutter Mobile
- **Application Tier**: Spring Boot Backend
- **Data Tier**: Relational Database

### 2. **Model-View-Controller (MVC)**
- **Model**: Data entities and business logic
- **View**: Frontend components and UI
- **Controller**: API endpoints handling requests

### 3. **Service-Oriented Architecture (SOA)**
- Business logic separated into service classes
- Loosely coupled components
- Reusable services across applications

### 4. **Repository Pattern**
- Data access logic abstraction
- Easy testing with mocks
- Database independence

## Frontend Architecture

### Component Hierarchy
```
App (Root)
│
├── Layout (__root.tsx)
│   ├── Navigation
│   └── Routes
│       ├── Home (/)
│       ├── Login (/login)
│       ├── Admin (/admin)
│       │   └── SriLankaMap3D
│       ├── Officer (/officer)
│       ├── Dispute (/dispute)
│       ├── Pay (/pay)
│       │   └── CreditCard3D
│       └── Search (/search)
│
├── Contexts
│   ├── AuthContext
│   └── LanguageContext
│
├── Components
│   ├── UI Components (shadcn/ui)
│   ├── 3D Components
│   └── Business Components
│
└── Services
    ├── API Client (lib/api.ts)
    └── Utilities (lib/utils.ts)
```

### State Management Strategy
- **Global State**: Authentication, Language (Context API)
- **Local State**: Component-level state (useState)
- **Server State**: Managed through API calls

### Data Flow
```
User Action → Component Handler
    ↓
API Call (lib/api.ts)
    ↓
Backend API
    ↓
Response Processing
    ↓
State Update (Context/useState)
    ↓
Re-render Component
    ↓
Display Update
```

## Backend Architecture

### Request Processing Flow
```
HTTP Request
    ↓
Controller (Route Mapping)
    ↓
Request Validation
    ↓
Service Layer (Business Logic)
    ↓
Repository Layer (Data Access)
    ↓
Database Query
    ↓
Response Serialization
    ↓
HTTP Response
```

### Core Components

#### Authentication Flow
```
Login Request (username, password)
    ↓
AuthController
    ↓
AuthService
    ├─ Hash Password Verification
    ├─ Generate JWT Token
    └─ Create Session
    ↓
Return Token & User Info
    ↓
Client Stores Token
    ↓
Include Token in Future Requests
```

#### Fine Management Flow
```
User Request (GET /api/fines)
    ↓
FineController
    ↓
FineService
    ├─ Check Authorization
    ├─ Apply Filters
    └─ Fetch Data
    ↓
FineRepository
    ↓
Database Query
    ↓
Return Fine List
```

#### Payment Processing Flow
```
Payment Request (POST /api/payments)
    ↓
PaymentController
    ↓
PaymentService
    ├─ Validate Payment Details
    ├─ Process Payment
    ├─ Update Fine Status
    └─ Generate Receipt
    ↓
PaymentRepository
    ↓
Database Update
    ↓
Send Confirmation
```

## Data Model

### Entity Relationships
```
User (1) ──── (M) Fine
         ──── (M) Dispute
         ──── (M) Payment

Fine (1) ──── (M) Dispute
      ──── (M) Payment

Dispute (M) ──── (1) Fine
        (M) ──── (1) User

Payment (M) ──── (1) Fine
        (M) ──── (1) User
```

### Database Schema

#### Users Table
```sql
CREATE TABLE users (
  id INT PRIMARY KEY AUTO_INCREMENT,
  username VARCHAR(100) UNIQUE NOT NULL,
  password VARCHAR(255) NOT NULL,
  email VARCHAR(100),
  role VARCHAR(50),
  created_at TIMESTAMP,
  updated_at TIMESTAMP
);
```

#### Fines Table
```sql
CREATE TABLE fines (
  id INT PRIMARY KEY AUTO_INCREMENT,
  user_id INT NOT NULL,
  amount DECIMAL(10, 2),
  description VARCHAR(255),
  issue_date DATE,
  due_date DATE,
  status VARCHAR(50),
  FOREIGN KEY (user_id) REFERENCES users(id)
);
```

#### Disputes Table
```sql
CREATE TABLE disputes (
  id INT PRIMARY KEY AUTO_INCREMENT,
  fine_id INT NOT NULL,
  user_id INT NOT NULL,
  reason VARCHAR(255),
  status VARCHAR(50),
  created_at TIMESTAMP,
  resolved_at TIMESTAMP,
  FOREIGN KEY (fine_id) REFERENCES fines(id),
  FOREIGN KEY (user_id) REFERENCES users(id)
);
```

#### Payments Table
```sql
CREATE TABLE payments (
  id INT PRIMARY KEY AUTO_INCREMENT,
  fine_id INT NOT NULL,
  user_id INT NOT NULL,
  amount DECIMAL(10, 2),
  payment_date TIMESTAMP,
  method VARCHAR(50),
  status VARCHAR(50),
  FOREIGN KEY (fine_id) REFERENCES fines(id),
  FOREIGN KEY (user_id) REFERENCES users(id)
);
```

## API Communication Protocol

### HTTP Methods
- **GET**: Retrieve data
- **POST**: Create new data
- **PUT**: Update existing data
- **DELETE**: Delete data
- **PATCH**: Partial update

### Request/Response Format
- **Content-Type**: application/json
- **Authentication**: Bearer Token (JWT)
- **Headers**: Authorization, Content-Type, Accept-Language

### Error Handling Strategy
- Standardized error response format
- HTTP status codes
- Error messages and codes
- Validation error details

## Security Architecture

### Authentication
- User credentials validation
- JWT token generation and verification
- Session management
- Token refresh mechanism

### Authorization
- Role-based access control (RBAC)
- Route protection
- Resource-level permissions
- Admin vs User roles

### Data Protection
- Password encryption (bcrypt)
- Sensitive data encryption
- SQL injection prevention
- CORS configuration
- Input validation

## Deployment Architecture

### Development Environment
```
Localhost:3000 (Frontend - Vite Dev Server)
Localhost:8080 (Backend - Spring Boot)
Local Database
```

### Production Environment (Proposed)
```
Frontend Deployment (Static Hosting)
  - CDN for static assets
  - Nginx reverse proxy

Backend Deployment (Container/Server)
  - Docker container or VM
  - Application server
  - Load balancer (if scaled)

Database Deployment
  - Cloud managed database
  - Read replicas for scaling
  - Backup strategy
```

## Scalability Considerations

### Frontend Scaling
- Static asset CDN
- Client-side caching
- Code splitting and lazy loading
- Performance optimization

### Backend Scaling
- Horizontal scaling with load balancer
- Database connection pooling
- Cache layer (Redis)
- Microservices (future consideration)

### Database Scaling
- Read replicas
- Sharding for large datasets
- Indexing strategy
- Query optimization

## Technology Integration Points

### Frontend → Backend
- REST API calls via `lib/api.ts`
- Authentication token exchange
- Data serialization/deserialization
- Error handling

### Backend → Database
- ORM (Hibernate via Spring Data JPA)
- Connection pooling
- Transaction management
- Query optimization

### Frontend → 3D Libraries
- Three.js for 3D rendering
- WebGL context
- Animation loop

## Monitoring & Observability

### Logging Strategy
- Application logs (backend)
- Browser console (frontend)
- Error tracking
- Performance metrics

### Monitoring Points
- API response times
- Database query performance
- Error rates
- User activities
- System resources

## Related Documentation

- [Frontend Documentation](./FRONTEND.md)
- [Backend Documentation](./BACKEND.md)
- [API Documentation](./API.md)
- [Setup Guide](./SETUP.md)
