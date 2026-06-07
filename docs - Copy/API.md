# API Documentation

## Overview

This document describes all RESTful API endpoints provided by the backend Spring Boot application. The API uses JSON for request/response payloads and follows standard HTTP conventions.

## Base URL

```
Development: http://localhost:8080/api
Production: https://api.example.com/api
```

## Authentication

### JWT Token Authentication

All endpoints (except login/register) require an Authorization header with a Bearer token:

```
Authorization: Bearer <jwt_token>
```

### Token Format
```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "expiresIn": 86400,
  "user": {
    "id": 1,
    "username": "john_doe",
    "role": "user"
  }
}
```

## Response Format

### Success Response

```json
{
  "status": "success",
  "code": 200,
  "message": "Operation completed successfully",
  "data": {
    "id": 1,
    "name": "Example Data"
  }
}
```

### Paginated Response

```json
{
  "status": "success",
  "code": 200,
  "message": "Data retrieved successfully",
  "data": [
    { "id": 1, "name": "Item 1" },
    { "id": 2, "name": "Item 2" }
  ],
  "pagination": {
    "page": 1,
    "pageSize": 20,
    "totalRecords": 100,
    "totalPages": 5
  }
}
```

### Error Response

```json
{
  "status": "error",
  "code": 400,
  "message": "Invalid request parameters",
  "errors": [
    "Field 'email' is required",
    "Field 'password' must be at least 8 characters"
  ]
}
```

## HTTP Status Codes

| Code | Meaning |
|------|---------|
| 200 | OK - Request successful |
| 201 | Created - Resource created |
| 204 | No Content - Successful, no content returned |
| 400 | Bad Request - Invalid input |
| 401 | Unauthorized - Authentication required |
| 403 | Forbidden - Access denied |
| 404 | Not Found - Resource not found |
| 409 | Conflict - Resource conflict (duplicate) |
| 500 | Internal Server Error - Server error |

## API Endpoints

### Authentication Endpoints

#### 1. User Login

**Endpoint**: `POST /auth/login`

**Description**: Authenticate user and receive JWT token

**Request Body**:
```json
{
  "username": "john_doe",
  "password": "password123"
}
```

**Response** (200 OK):
```json
{
  "status": "success",
  "code": 200,
  "message": "Login successful",
  "data": {
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "expiresIn": 86400,
    "user": {
      "id": 1,
      "username": "john_doe",
      "email": "john@example.com",
      "role": "user"
    }
  }
}
```

**Response** (401 Unauthorized):
```json
{
  "status": "error",
  "code": 401,
  "message": "Invalid username or password"
}
```

---

#### 2. User Registration

**Endpoint**: `POST /auth/register`

**Description**: Create a new user account

**Request Body**:
```json
{
  "username": "jane_doe",
  "email": "jane@example.com",
  "password": "password123",
  "passwordConfirm": "password123"
}
```

**Response** (201 Created):
```json
{
  "status": "success",
  "code": 201,
  "message": "User registered successfully",
  "data": {
    "id": 2,
    "username": "jane_doe",
    "email": "jane@example.com",
    "role": "user",
    "createdAt": "2024-01-15T10:30:00Z"
  }
}
```

**Response** (409 Conflict):
```json
{
  "status": "error",
  "code": 409,
  "message": "Username already exists"
}
```

---

#### 3. User Logout

**Endpoint**: `POST /auth/logout`

**Description**: Invalidate user session

**Headers**:
```
Authorization: Bearer <token>
```

**Response** (200 OK):
```json
{
  "status": "success",
  "code": 200,
  "message": "Logout successful"
}
```

---

### Fine Management Endpoints

#### 1. Get All Fines

**Endpoint**: `GET /fines`

**Description**: Retrieve list of fines with pagination and filters

**Headers**:
```
Authorization: Bearer <token>
```

**Query Parameters**:
| Parameter | Type | Description |
|-----------|------|-------------|
| page | integer | Page number (default: 1) |
| pageSize | integer | Records per page (default: 20) |
| status | string | Filter by status (paid/unpaid/disputed) |
| userId | integer | Filter by user ID |
| sortBy | string | Sort field (issuedDate, amount, dueDate) |
| sortOrder | string | Sort order (asc/desc) |

**Example Request**:
```
GET /fines?page=1&pageSize=20&status=unpaid&sortBy=dueDate&sortOrder=asc
```

**Response** (200 OK):
```json
{
  "status": "success",
  "code": 200,
  "message": "Fines retrieved successfully",
  "data": [
    {
      "id": 1,
      "userId": 1,
      "amount": 500.00,
      "description": "Speeding violation",
      "issueDate": "2024-01-01",
      "dueDate": "2024-02-01",
      "status": "unpaid"
    },
    {
      "id": 2,
      "userId": 1,
      "amount": 300.00,
      "description": "Parking violation",
      "issueDate": "2024-01-05",
      "dueDate": "2024-02-05",
      "status": "paid"
    }
  ],
  "pagination": {
    "page": 1,
    "pageSize": 20,
    "totalRecords": 45,
    "totalPages": 3
  }
}
```

---

#### 2. Get Fine by ID

**Endpoint**: `GET /fines/{fineId}`

**Description**: Retrieve detailed information about a specific fine

**Headers**:
```
Authorization: Bearer <token>
```

**Path Parameters**:
| Parameter | Type | Description |
|-----------|------|-------------|
| fineId | integer | Fine ID |

**Response** (200 OK):
```json
{
  "status": "success",
  "code": 200,
  "message": "Fine retrieved successfully",
  "data": {
    "id": 1,
    "userId": 1,
    "amount": 500.00,
    "description": "Speeding violation - 50km/h in 40km/h zone",
    "issueDate": "2024-01-01",
    "dueDate": "2024-02-01",
    "status": "unpaid",
    "officerId": 5,
    "location": "Main Street",
    "vehicleNumber": "AB-1234"
  }
}
```

**Response** (404 Not Found):
```json
{
  "status": "error",
  "code": 404,
  "message": "Fine not found"
}
```

---

#### 3. Create Fine

**Endpoint**: `POST /fines`

**Description**: Create a new traffic fine (Admin only)

**Headers**:
```
Authorization: Bearer <admin_token>
```

**Request Body**:
```json
{
  "userId": 1,
  "amount": 500.00,
  "description": "Speeding violation",
  "issueDate": "2024-01-15",
  "dueDate": "2024-02-15",
  "officerId": 5,
  "location": "Main Street",
  "vehicleNumber": "AB-1234"
}
```

**Response** (201 Created):
```json
{
  "status": "success",
  "code": 201,
  "message": "Fine created successfully",
  "data": {
    "id": 10,
    "userId": 1,
    "amount": 500.00,
    "description": "Speeding violation",
    "issueDate": "2024-01-15",
    "dueDate": "2024-02-15",
    "status": "unpaid",
    "createdAt": "2024-01-15T10:30:00Z"
  }
}
```

---

#### 4. Update Fine

**Endpoint**: `PUT /fines/{fineId}`

**Description**: Update fine information (Admin only)

**Headers**:
```
Authorization: Bearer <admin_token>
```

**Request Body**:
```json
{
  "amount": 600.00,
  "description": "Updated speeding violation",
  "dueDate": "2024-03-01"
}
```

**Response** (200 OK):
```json
{
  "status": "success",
  "code": 200,
  "message": "Fine updated successfully",
  "data": {
    "id": 10,
    "userId": 1,
    "amount": 600.00,
    "description": "Updated speeding violation",
    "issueDate": "2024-01-15",
    "dueDate": "2024-03-01",
    "status": "unpaid",
    "updatedAt": "2024-01-16T10:30:00Z"
  }
}
```

---

#### 5. Delete Fine

**Endpoint**: `DELETE /fines/{fineId}`

**Description**: Delete a fine (Admin only)

**Headers**:
```
Authorization: Bearer <admin_token>
```

**Response** (204 No Content):
```
(Empty response body)
```

---

### Dispute Endpoints

#### 1. Get All Disputes

**Endpoint**: `GET /disputes`

**Description**: Retrieve list of disputes

**Headers**:
```
Authorization: Bearer <token>
```

**Query Parameters**:
| Parameter | Type | Description |
|-----------|------|-------------|
| page | integer | Page number (default: 1) |
| pageSize | integer | Records per page (default: 20) |
| status | string | Filter by status (pending/approved/rejected) |
| userId | integer | Filter by user ID |

**Response** (200 OK):
```json
{
  "status": "success",
  "code": 200,
  "message": "Disputes retrieved successfully",
  "data": [
    {
      "id": 1,
      "fineId": 1,
      "userId": 1,
      "reason": "I was not speeding. The radar was faulty.",
      "status": "pending",
      "createdAt": "2024-01-10T10:30:00Z"
    }
  ],
  "pagination": {
    "page": 1,
    "pageSize": 20,
    "totalRecords": 15,
    "totalPages": 1
  }
}
```

---

#### 2. Create Dispute

**Endpoint**: `POST /disputes`

**Description**: Create a dispute for a fine

**Headers**:
```
Authorization: Bearer <token>
```

**Request Body**:
```json
{
  "fineId": 1,
  "reason": "I was not speeding. The radar was faulty."
}
```

**Response** (201 Created):
```json
{
  "status": "success",
  "code": 201,
  "message": "Dispute created successfully",
  "data": {
    "id": 5,
    "fineId": 1,
    "userId": 1,
    "reason": "I was not speeding. The radar was faulty.",
    "status": "pending",
    "createdAt": "2024-01-15T10:30:00Z"
  }
}
```

---

#### 3. Update Dispute Status

**Endpoint**: `PUT /disputes/{disputeId}`

**Description**: Update dispute status (Admin only)

**Headers**:
```
Authorization: Bearer <admin_token>
```

**Request Body**:
```json
{
  "status": "approved",
  "resolution": "Fine cancelled - radar was indeed faulty"
}
```

**Response** (200 OK):
```json
{
  "status": "success",
  "code": 200,
  "message": "Dispute updated successfully",
  "data": {
    "id": 5,
    "fineId": 1,
    "userId": 1,
    "reason": "I was not speeding. The radar was faulty.",
    "status": "approved",
    "resolution": "Fine cancelled - radar was indeed faulty",
    "resolvedAt": "2024-01-16T10:30:00Z"
  }
}
```

---

### Payment Endpoints

#### 1. Get All Payments

**Endpoint**: `GET /payments`

**Description**: Retrieve list of payments

**Headers**:
```
Authorization: Bearer <token>
```

**Query Parameters**:
| Parameter | Type | Description |
|-----------|------|-------------|
| page | integer | Page number (default: 1) |
| pageSize | integer | Records per page (default: 20) |
| status | string | Filter by status (pending/completed/failed) |
| userId | integer | Filter by user ID |

**Response** (200 OK):
```json
{
  "status": "success",
  "code": 200,
  "message": "Payments retrieved successfully",
  "data": [
    {
      "id": 1,
      "fineId": 2,
      "userId": 1,
      "amount": 300.00,
      "paymentDate": "2024-01-12",
      "method": "credit_card",
      "status": "completed",
      "transactionId": "TXN-12345"
    }
  ],
  "pagination": {
    "page": 1,
    "pageSize": 20,
    "totalRecords": 30,
    "totalPages": 2
  }
}
```

---

#### 2. Process Payment

**Endpoint**: `POST /payments`

**Description**: Process a payment for a fine

**Headers**:
```
Authorization: Bearer <token>
```

**Request Body**:
```json
{
  "fineId": 1,
  "amount": 500.00,
  "method": "credit_card",
  "cardNumber": "4532-1234-5678-9010",
  "expiryMonth": "12",
  "expiryYear": "2025",
  "cvv": "123"
}
```

**Response** (201 Created):
```json
{
  "status": "success",
  "code": 201,
  "message": "Payment processed successfully",
  "data": {
    "id": 15,
    "fineId": 1,
    "userId": 1,
    "amount": 500.00,
    "paymentDate": "2024-01-16",
    "method": "credit_card",
    "status": "completed",
    "transactionId": "TXN-67890",
    "receipt": {
      "receiptNumber": "RCP-2024-001",
      "issuedAt": "2024-01-16T10:30:00Z"
    }
  }
}
```

**Response** (400 Bad Request):
```json
{
  "status": "error",
  "code": 400,
  "message": "Payment processing failed",
  "errors": ["Invalid card details"]
}
```

---

### Search Endpoints

#### 1. Search Fines

**Endpoint**: `GET /search/fines`

**Description**: Search fines by various criteria

**Headers**:
```
Authorization: Bearer <token>
```

**Query Parameters**:
| Parameter | Type | Description |
|-----------|------|-------------|
| keyword | string | Search term (description, vehicle number) |
| status | string | Fine status |
| minAmount | decimal | Minimum fine amount |
| maxAmount | decimal | Maximum fine amount |
| fromDate | date | From issue date (YYYY-MM-DD) |
| toDate | date | To issue date (YYYY-MM-DD) |

**Example Request**:
```
GET /search/fines?keyword=speeding&status=unpaid&minAmount=100&maxAmount=1000
```

**Response** (200 OK):
```json
{
  "status": "success",
  "code": 200,
  "message": "Search results retrieved",
  "data": [
    {
      "id": 1,
      "userId": 1,
      "amount": 500.00,
      "description": "Speeding violation",
      "issueDate": "2024-01-01",
      "dueDate": "2024-02-01",
      "status": "unpaid"
    }
  ]
}
```

---

#### 2. Search Users

**Endpoint**: `GET /search/users`

**Description**: Search users (Admin only)

**Headers**:
```
Authorization: Bearer <admin_token>
```

**Query Parameters**:
| Parameter | Type | Description |
|-----------|------|-------------|
| keyword | string | Username or email |
| role | string | User role |

**Response** (200 OK):
```json
{
  "status": "success",
  "code": 200,
  "message": "Search results retrieved",
  "data": [
    {
      "id": 1,
      "username": "john_doe",
      "email": "john@example.com",
      "role": "user",
      "createdAt": "2024-01-01T10:30:00Z"
    }
  ]
}
```

---

### User Endpoints

#### 1. Get Current User

**Endpoint**: `GET /users/me`

**Description**: Get logged-in user information

**Headers**:
```
Authorization: Bearer <token>
```

**Response** (200 OK):
```json
{
  "status": "success",
  "code": 200,
  "message": "User retrieved successfully",
  "data": {
    "id": 1,
    "username": "john_doe",
    "email": "john@example.com",
    "role": "user",
    "createdAt": "2024-01-01T10:30:00Z",
    "updatedAt": "2024-01-15T10:30:00Z"
  }
}
```

---

#### 2. Update User Profile

**Endpoint**: `PUT /users/me`

**Description**: Update current user information

**Headers**:
```
Authorization: Bearer <token>
```

**Request Body**:
```json
{
  "email": "newemail@example.com",
  "phone": "+94701234567"
}
```

**Response** (200 OK):
```json
{
  "status": "success",
  "code": 200,
  "message": "User updated successfully",
  "data": {
    "id": 1,
    "username": "john_doe",
    "email": "newemail@example.com",
    "phone": "+94701234567",
    "role": "user",
    "updatedAt": "2024-01-16T10:30:00Z"
  }
}
```

---

## Error Codes Reference

| Code | Message | Description |
|------|---------|-------------|
| 1001 | INVALID_CREDENTIALS | Login credentials are invalid |
| 1002 | USER_NOT_FOUND | User account not found |
| 1003 | DUPLICATE_USER | Username/email already exists |
| 2001 | FINE_NOT_FOUND | Fine record not found |
| 2002 | INVALID_FINE_STATUS | Invalid fine status provided |
| 3001 | DISPUTE_NOT_FOUND | Dispute not found |
| 3002 | DISPUTE_ALREADY_EXISTS | Dispute already exists for this fine |
| 4001 | PAYMENT_FAILED | Payment processing failed |
| 4002 | INVALID_AMOUNT | Payment amount is invalid |
| 5001 | UNAUTHORIZED | User not authorized for this action |
| 5002 | INSUFFICIENT_PERMISSIONS | User lacks required permissions |

## Rate Limiting

The API implements rate limiting to prevent abuse:

- **Limit**: 100 requests per minute per IP
- **Headers**: 
  - `X-RateLimit-Limit`: 100
  - `X-RateLimit-Remaining`: Remaining requests
  - `X-RateLimit-Reset`: Reset time (Unix timestamp)

## CORS Configuration

Cross-Origin Resource Sharing (CORS) is configured to allow requests from:
- Development: `http://localhost:5173`, `http://localhost:3000`
- Production: `https://app.example.com`

## Pagination

Paginated endpoints support:
- **page**: Page number (starts from 1)
- **pageSize**: Records per page (max 100)
- **totalRecords**: Total number of records
- **totalPages**: Total number of pages

## Sorting

Supported sort fields vary by endpoint. Use `sortBy` and `sortOrder` parameters:
```
GET /fines?sortBy=dueDate&sortOrder=asc
```

## Testing the API

### Using cURL

```bash
# Login
curl -X POST http://localhost:8080/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"username":"john_doe","password":"password123"}'

# Get fines (using token)
curl -X GET http://localhost:8080/api/fines \
  -H "Authorization: Bearer <token>"
```

### Using Postman

1. Import API collection
2. Set base URL: `http://localhost:8080/api`
3. Create environment variables for token
4. Test endpoints

---

## Related Documentation

- [Architecture Overview](./ARCHITECTURE.md)
- [Backend Documentation](./BACKEND.md)
- [Frontend Documentation](./FRONTEND.md)
