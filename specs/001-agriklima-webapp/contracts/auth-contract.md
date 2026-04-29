# API Contract: Authentication

**Base URL**: `/api/auth`  
**Authentication**: None (auth endpoints)

---

## POST /auth/register

**Purpose**: Create a new farmer account

**Request**:
```json
{
  "email": "farmer@example.com",
  "password": "SecurePass123!",
  "name": "Juan Dela Cruz",
  "phone": "+63-9123456789",
  "defaultMunicipality": "Apalit"
}
```

**Request Validation**:
- `email`: Required, valid email format, unique
- `password`: Required, min 8 chars, must include uppercase/lowercase/digit/special char
- `name`: Required, 2-100 characters
- `phone`: Optional, Philippine format if provided
- `defaultMunicipality`: Required, must be valid Pampanga municipality

**Response (201 Created)**:
```json
{
  "statusCode": 201,
  "message": "User registered successfully",
  "data": {
    "userId": "507f1f77bcf86cd799439011",
    "email": "farmer@example.com",
    "name": "Juan Dela Cruz",
    "role": "farmer",
    "defaultMunicipality": "Apalit",
    "createdAt": "2026-04-29T10:30:00Z"
  }
}
```

**Response (400 Bad Request)**:
```json
{
  "statusCode": 400,
  "error": "ValidationError",
  "message": "Email already exists",
  "details": {
    "email": "must be unique"
  }
}
```

---

## POST /auth/login

**Purpose**: Authenticate a farmer and return JWT

**Request**:
```json
{
  "email": "farmer@example.com",
  "password": "SecurePass123!"
}
```

**Request Validation**:
- `email`: Required, valid email format
- `password`: Required, min 8 characters

**Response (200 OK)**:
```json
{
  "statusCode": 200,
  "message": "Login successful",
  "data": {
    "userId": "507f1f77bcf86cd799439011",
    "email": "farmer@example.com",
    "name": "Juan Dela Cruz",
    "role": "farmer",
    "jwt": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "expiresIn": 86400  // seconds (24 hours)
  }
}
```

**Response (401 Unauthorized)**:
```json
{
  "statusCode": 401,
  "error": "AuthenticationError",
  "message": "Invalid email or password"
}
```

---

## POST /auth/refresh

**Purpose**: Refresh JWT token before expiry

**Headers**:
```
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

**Request**: Empty body

**Response (200 OK)**:
```json
{
  "statusCode": 200,
  "message": "Token refreshed successfully",
  "data": {
    "jwt": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "expiresIn": 86400
  }
}
```

**Response (401 Unauthorized)**:
```json
{
  "statusCode": 401,
  "error": "AuthenticationError",
  "message": "Invalid or expired token"
}
```

---

## POST /auth/logout

**Purpose**: Invalidate user session (client-side JWT deletion)

**Headers**:
```
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

**Request**: Empty body

**Response (200 OK)**:
```json
{
  "statusCode": 200,
  "message": "Logout successful"
}
```

---
