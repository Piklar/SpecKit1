# API Contracts: Crops Directory & Farm Integration

## 1. GET /api/crops
Fetches crops, optionally filtered by season.
*This endpoint already exists, but the response schema will now include the new crop fields.*

**Query Parameters:**
- `season` (optional): 'wet', 'dry', or 'all'

**Response (200 OK)**
```json
[
  {
    "_id": "60d5ecb8b3b3a20015f8e123",
    "name": "Rice",
    "season": "wet",
    "growingTimeDays": 120,
    "waterRequirement": "high",
    "soilType": "Clay",
    "suitableRegions": ["Pampanga"],
    "description": "Staple food crop grown extensively in flooded fields.",
    "type": "Cereal",
    "farmingTips": "Ensure continuous flooding during early vegetative stage.",
    "marketPrice": 25.50,
    "endProducts": ["White rice", "Rice flour", "Rice bran"]
  }
]
```

## 2. POST /api/farm/:id/crops
Adds a specific crop and its planting date to a user's farm.

**Headers:**
- `Authorization`: `Bearer <token>`

**Path Parameters:**
- `id`: The ObjectId of the farm.

**Request Body:**
```json
{
  "cropId": "60d5ecb8b3b3a20015f8e123",
  "plantedDate": "2026-05-10T00:00:00.000Z"
}
```

**Response (200 OK)**
```json
{
  "_id": "60d5eccfb3b3a20015f8e456",
  "name": "My Main Plot",
  "plantedCrops": [
    {
      "crop": {
        "_id": "60d5ecb8b3b3a20015f8e123",
        "name": "Rice"
      },
      "plantedDate": "2026-05-10T00:00:00.000Z"
    }
  ]
}
```

**Error Responses:**
- `401 Unauthorized`: Missing or invalid token.
- `403 Forbidden`: User does not own the specified farm.
- `404 Not Found`: Farm or Crop not found.
- `400 Bad Request`: Missing required fields (cropId, plantedDate).
