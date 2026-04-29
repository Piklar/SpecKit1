# API Contract: Weather Module

**Base URL**: `/api/weather`  
**Authentication**: Required (JWT in Authorization header)

---

## GET /api/weather/:municipality

**Purpose**: Fetch current weather and 7-day forecast for a Pampanga municipality

**Parameters**:
- `municipality` (path param, required): Valid Pampanga municipality name
  - Example: "Apalit", "Balanga", "Mexico"

**Headers**:
```
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

**Request**: No body required

**Response (200 OK)**:
```json
{
  "statusCode": 200,
  "message": "Weather data retrieved successfully",
  "data": {
    "municipality": "Apalit",
    "current": {
      "temperature": 31.5,
      "feelsLike": 34.2,
      "humidity": 75,
      "pressure": 1010,
      "windSpeed": 2.5,
      "windDirection": "SE",
      "cloudCover": 60,
      "uvIndex": 8,
      "rainfall": 0,
      "condition": "Partly Cloudy",
      "description": "Partly cloudy with occasional sunshine"
    },
    "forecast": [
      {
        "date": "2026-04-30",
        "temperatureMin": 28,
        "temperatureMax": 33,
        "humidity": 70,
        "windSpeed": 3,
        "rainfallProbability": 10,
        "expectedRainfall": 0,
        "condition": "Clear",
        "uvIndex": 8
      },
      {
        "date": "2026-05-01",
        "temperatureMin": 27,
        "temperatureMax": 32,
        "humidity": 80,
        "windSpeed": 4,
        "rainfallProbability": 40,
        "expectedRainfall": 5,
        "condition": "Rainy",
        "uvIndex": 6
      }
      // ... 5 more days of forecast
    ],
    "dataSourceAPI": "OpenWeatherMap",
    "lastUpdatedAt": "2026-04-29T10:30:00Z",
    "nextUpdateAt": "2026-04-29T11:30:00Z"
  }
}
```

**Response (400 Bad Request)**:
```json
{
  "statusCode": 400,
  "error": "ValidationError",
  "message": "Invalid municipality",
  "details": {
    "municipality": "must be a valid Pampanga municipality"
  }
}
```

**Response (503 Service Unavailable)**:
```json
{
  "statusCode": 503,
  "error": "ServiceError",
  "message": "Weather data temporarily unavailable. Last update: 2026-04-29T08:30:00Z",
  "data": {
    "lastUpdatedAt": "2026-04-29T08:30:00Z",
    "retryAfter": 300  // seconds
  }
}
```

---

## GET /api/weather

**Purpose**: Fetch weather for all Pampanga municipalities (for dashboard overview)

**Headers**:
```
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

**Query Parameters**:
- `includeForcast` (optional): Boolean, default true

**Request**: No body required

**Response (200 OK)**:
```json
{
  "statusCode": 200,
  "message": "Weather data retrieved successfully",
  "data": [
    {
      "municipality": "Apalit",
      "current": { /* current weather object */ },
      "forecast": [ /* forecast array if includeForcast=true */ ]
    },
    {
      "municipality": "Balanga",
      "current": { /* current weather object */ },
      "forecast": [ /* forecast array if includeForcast=true */ ]
    }
    // ... all 16 Pampanga municipalities
  ]
}
```

---
