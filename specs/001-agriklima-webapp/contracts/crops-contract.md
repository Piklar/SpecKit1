# API Contract: Crops Module

**Base URL**: `/api/crops`  
**Authentication**: Required (JWT in Authorization header)

---

## GET /api/crops

**Purpose**: Retrieve list of crops recommended for current season in Pampanga

**Headers**:
```
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

**Query Parameters**:
- `municipality` (optional): Filter crops by municipality
- `season` (optional): Filter by season (dry, wet, summer, monsoon)
- `limit` (optional): Max results, default 20, max 100
- `skip` (optional): Pagination offset, default 0

**Request**: No body required

**Response (200 OK)**:
```json
{
  "statusCode": 200,
  "message": "Crops retrieved successfully",
  "data": [
    {
      "cropId": "507f1f77bcf86cd799439011",
      "name": "Rice (Oryza sativa)",
      "commonName": "Pilipinas Rice",
      "localName": "Bigas",
      "waterRequirement": "high",
      "expectedYieldPerHectare": "5-7 tons",
      "growingDurationDays": 120,
      "optimalTemperatureMin": 20,
      "optimalTemperatureMax": 32,
      "seasons": [
        {
          "season": "wet",
          "optimalPlantingStart": "06-01",
          "optimalPlantingEnd": "07-31",
          "expectedHarvestStart": "10-01",
          "expectedHarvestEnd": "11-30",
          "recommendedForMunicipalities": ["Apalit", "Balanga", "Mexico"]
        }
      ],
      "commonPests": [
        "507f1f77bcf86cd799439012",  // Pest ID for Rice Blast
        "507f1f77bcf86cd799439013"   // Pest ID for Brown Planthopper
      ],
      "imageUrl": "https://res.cloudinary.com/agriklima/image/upload/v1619000000/crops/rice.jpg",
      "growingTips": [
        "Water daily during vegetative stage",
        "Apply fertilizer at tiller stage",
        "Use net barriers against birds"
      ]
    },
    {
      "cropId": "507f1f77bcf86cd799439014",
      "name": "Corn (Zea mays)",
      "commonName": "Corn",
      "localName": "Mais",
      "waterRequirement": "medium",
      "expectedYieldPerHectare": "3-5 tons",
      "growingDurationDays": 90,
      "optimalTemperatureMin": 18,
      "optimalTemperatureMax": 30,
      "seasons": [
        {
          "season": "dry",
          "optimalPlantingStart": "12-01",
          "optimalPlantingEnd": "02-28",
          "expectedHarvestStart": "03-01",
          "expectedHarvestEnd": "05-31",
          "recommendedForMunicipalities": ["Apalit", "Mexico", "Porac"]
        }
      ],
      "commonPests": [
        "507f1f77bcf86cd799439015"   // Pest ID for Armyworm
      ],
      "imageUrl": "https://res.cloudinary.com/agriklima/image/upload/v1619000000/crops/corn.jpg",
      "growingTips": [
        "Adequate spacing between plants (25cm)",
        "Provide support stakes for tall varieties",
        "Monitor for armyworm"
      ]
    }
  ],
  "pagination": {
    "total": 12,
    "skip": 0,
    "limit": 20
  }
}
```

**Response (400 Bad Request)**:
```json
{
  "statusCode": 400,
  "error": "ValidationError",
  "message": "Invalid query parameters",
  "details": {
    "municipality": "must be a valid Pampanga municipality"
  }
}
```

---

## GET /api/crops/:cropId

**Purpose**: Retrieve detailed information for a specific crop

**Headers**:
```
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

**Path Parameters**:
- `cropId` (required): Crop ObjectId

**Request**: No body required

**Response (200 OK)**:
```json
{
  "statusCode": 200,
  "message": "Crop details retrieved successfully",
  "data": {
    "cropId": "507f1f77bcf86cd799439011",
    "name": "Rice (Oryza sativa)",
    "commonName": "Pilipinas Rice",
    "localName": "Bigas",
    "description": "Staple grain crop widely cultivated in Pampanga. High water requirement.",
    "waterRequirement": "high",
    "expectedYieldPerHectare": "5-7 tons",
    "growingDurationDays": 120,
    "optimalTemperatureMin": 20,
    "optimalTemperatureMax": 32,
    "seasons": [
      {
        "season": "wet",
        "optimalPlantingStart": "06-01",
        "optimalPlantingEnd": "07-31",
        "expectedHarvestStart": "10-01",
        "expectedHarvestEnd": "11-30",
        "recommendedForMunicipalities": ["Apalit", "Balanga", "Mexico"]
      },
      {
        "season": "dry",
        "optimalPlantingStart": "12-15",
        "optimalPlantingEnd": "01-31",
        "expectedHarvestStart": "04-01",
        "expectedHarvestEnd": "05-31",
        "recommendedForMunicipalities": ["Mexico", "Porac"]
      }
    ],
    "commonPests": [
      {
        "pestId": "507f1f77bcf86cd799439012",
        "name": "Rice Blast",
        "type": "disease"
      }
    ],
    "commonDiseases": ["Blast", "Sheath Blight"],
    "imageUrl": "https://res.cloudinary.com/agriklima/image/upload/v1619000000/crops/rice.jpg",
    "growingTips": [
      "Water daily during vegetative stage",
      "Apply fertilizer at tiller stage",
      "Use net barriers against birds",
      "Monitor water pH (maintain 5.5-6.5)"
    ]
  }
}
```

**Response (404 Not Found)**:
```json
{
  "statusCode": 404,
  "error": "NotFoundError",
  "message": "Crop not found"
}
```

---
