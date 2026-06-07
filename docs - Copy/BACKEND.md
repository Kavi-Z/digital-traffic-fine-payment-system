# Backend API Documentation

## Overview

The backend is a Java Spring Boot application that provides RESTful APIs for the traffic management system. It handles user authentication, fine management, disputes, payments, and search functionality.

## Technology Stack

- **Framework**: Spring Boot
- **Language**: Java
- **Build Tool**: Maven
- **Database**: (Configured in application.properties)
- **API Type**: RESTful
- **Package Namespace**: `traffic.*`

## Project Structure

```
backend/
├── src/
│   ├── main/
│   │   ├── java/
│   │   │   └── traffic/
│   │   │       └── example/           # Application package
│   │   │           ├── Application.java # Main entry point
│   │   │           ├── controllers/   # REST controllers
│   │   │           ├── services/      # Business logic
│   │   │           ├── models/        # Data models/entities
│   │   │           ├── repositories/  # Data access layer
│   │   │           ├── config/        # Configuration classes
│   │   │           └── utils/         # Utility classes
│   │   └── resources/
│   │       ├── application.properties # Configuration
│   │       └── data.sql               # Database initialization
│   └── test/
│       └── java/
│           └── traffic/
│               └── example/           # Unit tests
├── target/                            # Build output
├── pom.xml                            # Maven configuration
├── mvnw                               # Maven wrapper (Unix)
└── mvnw.cmd                           # Maven wrapper (Windows)
```

## Key Components

### Application Entry Point
- **File**: `src/main/java/traffic/example/Application.java`
- Spring Boot main application class
- Enables auto-configuration and component scanning

### Configuration Files

#### application.properties
Located at: `src/main/resources/application.properties`

Key configurations:
- **Server Port**: API server port
- **Database**: Database connection details
- **JPA/Hibernate**: ORM settings
- **Logging**: Log levels and configuration
- **Spring MVC**: Request/response handling

Example structure:
```properties
server.port=8080
spring.datasource.url=jdbc:mysql://localhost:3306/traffic_db
spring.datasource.username=root
spring.datasource.password=password
spring.jpa.hibernate.ddl-auto=update
spring.jpa.show-sql=false
logging.level.root=INFO
```

#### data.sql
Located at: `src/main/resources/data.sql`

- Database initialization script
- Seed data for development/testing
- Executed on application startup (if configured)

## Architecture Layers

### 1. **Controllers** (`traffic.example.controllers`)
- Handle HTTP requests/responses
- Request validation
- Route API endpoints
- Call services for business logic

Example endpoints:
```
POST   /api/auth/login           - User login
POST   /api/auth/register        - User registration
GET    /api/fines                - List fines
POST   /api/fines                - Create fine
GET    /api/disputes             - List disputes
POST   /api/disputes             - Create dispute
POST   /api/payments             - Process payment
GET    /api/search               - Search functionality
```

### 2. **Services** (`traffic.example.services`)
- Business logic implementation
- Data processing
- External service integration
- Transaction management

Typical services:
- **AuthService**: Authentication and authorization
- **FineService**: Fine management logic
- **DisputeService**: Dispute handling
- **PaymentService**: Payment processing
- **SearchService**: Search queries
- **UserService**: User management

### 3. **Models/Entities** (`traffic.example.models`)
- JPA entities representing database tables
- Data transfer objects (DTOs)
- Domain models

Common entities:
```
User
  - id
  - username
  - password (encrypted)
  - email
  - role
  - createdAt
  - updatedAt

Fine
  - id
  - userId
  - amount
  - description
  - issueDate
  - dueDate
  - status

Dispute
  - id
  - fineId
  - userId
  - reason
  - status
  - createdAt
  - resolvedAt

Payment
  - id
  - fineId
  - userId
  - amount
  - paymentDate
  - method
  - status
```

### 4. **Repositories** (`traffic.example.repositories`)
- Data access objects (DAO)
- Spring Data JPA repositories
- Custom queries and filters

Methods:
- CRUD operations (Create, Read, Update, Delete)
- Custom finder methods
- Pagination and sorting
- Query optimization

### 5. **Configuration** (`traffic.example.config`)
- Security configuration (if using Spring Security)
- CORS configuration
- Message converters
- Bean definitions
- Database configuration

## Build & Deployment

### Building

#### Using Maven Wrapper (Recommended)
```bash
# Windows
mvnw.cmd clean package

# Unix/Linux/Mac
./mvnw clean package
```

#### Using Maven (if installed)
```bash
mvn clean package
```

Build output: `target/application.jar`

### Running

#### Development
```bash
# Windows
mvnw.cmd spring-boot:run

# Unix/Linux/Mac
./mvnw spring-boot:run
```

#### Production
```bash
java -jar target/application.jar
```

## API Response Format

### Success Response
```json
{
  "status": "success",
  "code": 200,
  "message": "Operation successful",
  "data": {
    "id": 1,
    "name": "Example"
  }
}
```

### Error Response
```json
{
  "status": "error",
  "code": 400,
  "message": "Invalid request",
  "errors": [
    "Field validation error"
  ]
}
```

## Database Schema

### Tables (Assumed Structure)

**users**
- id (PK)
- username (UNIQUE)
- password (encrypted)
- email
- role
- created_at
- updated_at

**fines**
- id (PK)
- user_id (FK)
- amount
- description
- issue_date
- due_date
- status

**disputes**
- id (PK)
- fine_id (FK)
- user_id (FK)
- reason
- status
- created_at
- resolved_at

**payments**
- id (PK)
- fine_id (FK)
- user_id (FK)
- amount
- payment_date
- method
- status

## Security Considerations

### Authentication
- User login and token generation
- Password encryption (bcrypt recommended)
- Session management

### Authorization
- Role-based access control (RBAC)
- Endpoint protection
- Data access restrictions

### Data Protection
- Input validation
- SQL injection prevention
- XSS protection
- CORS configuration

## Testing

### Unit Tests Location
`src/test/java/traffic/example/`

### Testing Framework
- JUnit 5
- Mockito for mocking
- Spring Boot Test

### Test Categories
1. **Unit Tests**: Individual component testing
2. **Integration Tests**: Component integration testing
3. **Controller Tests**: API endpoint testing

### Running Tests
```bash
# Windows
mvnw.cmd test

# Unix/Linux/Mac
./mvnw test
```

## Logging

### Configuration
Configured in `application.properties`:
```properties
logging.level.root=INFO
logging.level.traffic.example=DEBUG
logging.pattern.console=%d{yyyy-MM-dd HH:mm:ss} - %msg%n
```

### Logging Levels
- **DEBUG**: Detailed debugging information
- **INFO**: General informational messages
- **WARN**: Warning messages
- **ERROR**: Error messages

## Common Issues & Solutions

### Issue: Port Already in Use
```bash
# Change port in application.properties
server.port=8081
```

### Issue: Database Connection Failed
- Verify database is running
- Check connection string in application.properties
- Verify username and password
- Check database credentials

### Issue: Build Fails
```bash
# Clear Maven cache
mvnw.cmd clean

# Rebuild
mvnw.cmd clean package
```

### Issue: Dependencies Not Found
```bash
# Update Maven dependencies
mvnw.cmd dependency:resolve
```

## Performance Optimization

- Database query optimization
- Connection pooling
- Caching strategies
- Response compression
- Pagination for large datasets

## Monitoring & Logging

- Spring Boot Actuator endpoints
- Health checks
- Metrics collection
- Log aggregation

## Dependencies Management

### Maven POM
- Spring Boot Starters
- Data access libraries
- Testing frameworks
- Utility libraries

### Adding Dependencies
Edit `pom.xml` and add dependency, then run:
```bash
mvnw.cmd dependency:resolve
```

## Deployment Checklist

- [ ] Build passes tests
- [ ] Security configurations reviewed
- [ ] Database migrations executed
- [ ] Environment variables configured
- [ ] Logging configured
- [ ] Performance optimized
- [ ] API documented
- [ ] Error handling implemented

## Related Documentation

- [Architecture Overview](./ARCHITECTURE.md)
- [API Documentation](./API.md)
- [Frontend Documentation](./FRONTEND.md)
- [Setup Guide](./SETUP.md)
