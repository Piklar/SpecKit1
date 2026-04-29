# API Contract: Farm Module

**Base URL**: `/api/farm`  
**Authentication**: Required (JWT in Authorization header)

---

## POST /api/farm

**Purpose**: Create a new farm for the authenticated user

**Headers**:
```
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

**Request Body**:
```json
{
  "farmName": "Dela Cruz Family Farm",
  "municipality": "Apalit",
  "hectares": 2.5,
  "soilType": "loam"
}
```

**Request Validation**:
- `farmName`: Required, 1-100 characters, unique per user
- `municipality`: Required, valid Pampanga municipality
- `hectares`: Required, 0.1-1000, numeric
- `soilType`: Optional, one of: clay, loam, sandy, unknown

**Response (201 Created)**:
```json
{
  "statusCode": 201,
  "message": "Farm created successfully",
  "data": {
    "farmId": "507f1f77bcf86cd799439020",
    "userId": "507f1f77bcf86cd799439011",
    "farmName": "Dela Cruz Family Farm",
    "municipality": "Apalit",
    "hectares": 2.5,
    "soilType": "loam",
    "currentCrops": [],
    "observations": [],
    "createdAt": "2026-04-29T10:30:00Z",
    "updatedAt": "2026-04-29T10:30:00Z"
  }
}
```

**Response (400 Bad Request)**:
```json
{
  "statusCode": 400,
  "error": "ValidationError",
  "message": "Farm name must be unique for this user",
  "details": {
    "farmName": "already exists for this user"
  }
}
```

---

## GET /api/farm

**Purpose**: Retrieve all farms for the authenticated user

**Headers**:
```
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

**Request**: No body required

**Response (200 OK)**:
```json
{
  "statusCode": 200,
  "message": "Farms retrieved successfully",
  "data": [
    {
      "farmId": "507f1f77bcf86cd799439020",
      "farmName": "Dela Cruz Family Farm",
      "municipality": "Apalit",
      "hectares": 2.5,
      "soilType": "loam",
      "currentCrops": [
        {
          "cropId": "507f1f77bcf86cd799439011",
          "plantedDate": "2026-04-01",
          "expectedHarvestDate": "2026-07-30",
          "areaAllocated": 1.5
        }
      ],
      "observationsCount": 3,
      "createdAt": "2026-04-29T10:30:00Z"
    }
  ]
}
```

---

## GET /api/farm/:farmId

**Purpose**: Retrieve detailed information for a specific farm

**Headers**:
```
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

**Path Parameters**:
- `farmId` (required): Farm ObjectId

**Request**: No body required

**Response (200 OK)**:
```json
{
  "statusCode": 200,
  "message": "Farm retrieved successfully",
  "data": {
    "farmId": "507f1f77bcf86cd799439020",
    "userId": "507f1f77bcf86cd799439011",
    "farmName": "Dela Cruz Family Farm",
    "municipality": "Apalit",
    "hectares": 2.5,
    "soilType": "loam",
    "currentCrops": [
      {
        "cropId": "507f1f77bcf86cd799439011",
        "cropName": "Rice",
        "plantedDate": "2026-04-01",
        "expectedHarvestDate": "2026-07-30",
        "areaAllocated": 1.5
      }
    ],
    "observations": [
      {
        "observationId": "507f1f77bcf86cd799439030",
        "date": "2026-04-29",
        "type": "pest-sighting",
        "description": "Observed brown spots on rice leaves, suspected blast.",
        "pestId": "507f1f77bcf86cd799439012",
        "pestName": "Rice Blast",
        "imageUrl": "https://res.cloudinary.com/agriklima/image/upload/v1619000000/obs/blast_001.jpg"
      }
    ],
    "createdAt": "2026-04-29T10:30:00Z",
    "updatedAt": "2026-04-29T10:30:00Z"
  }
}
```

**Response (403 Forbidden)**:
```json
{
  "statusCode": 403,
  "error": "AuthorizationError",
  "message": "You do not have permission to access this farm"
}
```

---

## POST /api/farm/:farmId/crops

**Purpose**: Add a crop to a farm's tracking list

**Headers**:
```
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
Content-Type: application/json
```

**Path Parameters**:
- `farmId` (required): Farm ObjectId

**Request Body**:
```json
{
  "cropId": "507f1f77bcf86cd799439011",
  "plantedDate": "2026-04-01",
  "areaAllocated": 1.5
}
```

**Request Validation**:
- `cropId`: Required, valid Crop ObjectId
- `plantedDate`: Required, date not in future (YYYY-MM-DD format)
- `areaAllocated`: Required, 0.1-farm.hectares

**Response (201 Created)**:
```json
{
  "statusCode": 201,
  "message": "Crop added to farm successfully",
  "data": {
    "farmId": "507f1f77bcf86cd799439020",
    "cropId": "507f1f77bcf86cd799439011",
    "cropName": "Rice",
    "plantedDate": "2026-04-01",
    "expectedHarvestDate": "2026-07-30",
    "areaAllocated": 1.5
  }
}
```

---

## POST /api/farm/:farmId/observations

**Purpose**: Add an observation (pest sighting, disease, etc.) to a farm

**Headers**:
```
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
Content-Type: multipart/form-data  // if image upload included
```

**Path Parameters**:
- `farmId` (required): Farm ObjectId

**Request Body**:
```json
{
  "type": "pest-sighting",
  "description": "Observed brown spots on rice leaves, suspected blast.",
  "pestId": "507f1f77bcf86cd799439012",
  "image": <file>  // Optional: Multer will upload to Cloudinary
}
```

**Request Validation**:
- `type`: Required, one of: pest-sighting, disease, weather-damage, note
- `description`: Required, 10-500 characters
- `pestId`: Required if type is pest-sighting
- `image`: Optional, image file (jpg/png, max 5MB)

**Response (201 Created)**:
```json
{
  "statusCode": 201,
  "message": "Observation recorded successfully",
  "data": {
    "observationId": "507f1f77bcf86cd799439030",
    "farmId": "507f1f77bcf86cd799439020",
    "date": "2026-04-29",
    "type": "pest-sighting",
    "description": "Observed brown spots on rice leaves, suspected blast.",
    "pestId": "507f1f77bcf86cd799439012",
    "pestName": "Rice Blast",
    "imageUrl": "https://res.cloudinary.com/agriklima/image/upload/v1619000000/obs/blast_001.jpg"
  }
}
```

**Response (400 Bad Request)**:
```json
{
  "statusCode": 400,
  "error": "ValidationError",
  "message": "Image size exceeds 5MB limit",
  "details": {
    "image": "max 5MB allowed"
  }
}
```

---
