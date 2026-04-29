# API Contract: Pests Module

**Base URL**: `/api/pests`  
**Authentication**: Required (JWT in Authorization header)

---

## GET /api/pests

**Purpose**: Retrieve list of seasonal pests for Pampanga

**Headers**:
```
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

**Query Parameters**:
- `activeOnly` (optional): Boolean, default true (return only currently active pests)
- `type` (optional): Filter by type (insect, disease, weed, rodent)
- `affectedCrop` (optional): Filter by affected crop ID
- `limit` (optional): Max results, default 20, max 100
- `skip` (optional): Pagination offset, default 0

**Request**: No body required

**Response (200 OK)**:
```json
{
  "statusCode": 200,
  "message": "Pests retrieved successfully",
  "data": [
    {
      "pestId": "507f1f77bcf86cd799439012",
      "name": "Rice Blast",
      "localName": "Tikud ng Palay",
      "scientificName": "Magnaporthe oryzae",
      "type": "disease",
      "description": "Fungal disease causing brown lesions on leaves and panicles. Can lead to complete crop loss.",
      "imageUrl": "https://res.cloudinary.com/agriklima/image/upload/v1619000000/pests/rice_blast.jpg",
      "identificationTips": [
        "Brown diamond-shaped lesions on leaves",
        "Lesions have red/brown borders",
        "White spore mass visible in center of lesions",
        "Appears during cool, humid weather"
      ],
      "lifecycleDurationDays": 7,
      "vulnerableStages": ["Seedling", "Tillering", "Flowering"],
      "seasonalActivityPeriod": [
        {
          "season": "wet",
          "isActive": true,
          "peakMonth": 9
        },
        {
          "season": "dry",
          "isActive": false,
          "peakMonth": null
        }
      ],
      "affectedCrops": ["507f1f77bcf86cd799439011"],  // Rice
      "mitigationStrategies": [
        {
          "type": "preventive",
          "name": "Resistant varieties",
          "description": "Plant blast-resistant rice varieties developed by PhilRice.",
          "applicationTiming": "At planting",
          "efficacy": "high",
          "safetyWarnings": []
        },
        {
          "type": "cultural",
          "name": "Field sanitation",
          "description": "Remove infected plant debris, improve field drainage, avoid over-irrigation.",
          "applicationTiming": "Throughout season",
          "efficacy": "medium",
          "safetyWarnings": []
        },
        {
          "type": "organic",
          "name": "Bacillus subtilis spray",
          "description": "Biological fungicide spray every 7 days starting at tiller stage.",
          "applicationTiming": "At first sign of lesions",
          "efficacy": "medium",
          "safetyWarnings": ["Do not mix with copper fungicides"]
        },
        {
          "type": "chemical",
          "name": "Tricyclazole",
          "description": "Synthetic fungicide. Apply at first disease appearance, repeat every 10 days.",
          "applicationTiming": "At first sign of lesions",
          "efficacy": "high",
          "safetyWarnings": ["Do not apply near water sources", "Wear PPE during application"]
        }
      ],
      "pampangaSpecificNotes": "Rice blast is most severe during the wet season (June-September) in Pampanga. Ensure proper irrigation management."
    },
    {
      "pestId": "507f1f77bcf86cd799439015",
      "name": "Armyworm",
      "localName": "Ulod ng Palad",
      "scientificName": "Spodoptera litura",
      "type": "insect",
      "description": "Polyphagous larva that feeds on multiple crops. Causes severe defoliation.",
      "imageUrl": "https://res.cloudinary.com/agriklima/image/upload/v1619000000/pests/armyworm.jpg",
      "identificationTips": [
        "Dark brown larvae with yellow/white stripes",
        "Up to 40mm long at maturity",
        "Irregular feeding patterns on leaves",
        "Droppings visible on affected plants"
      ],
      "lifecycleDurationDays": 30,
      "vulnerableStages": ["V2-V6 (corn seedling to 6-leaf stage)"],
      "seasonalActivityPeriod": [
        {
          "season": "dry",
          "isActive": true,
          "peakMonth": 2
        },
        {
          "season": "wet",
          "isActive": true,
          "peakMonth": 8
        }
      ],
      "affectedCrops": ["507f1f77bcf86cd799439014"],  // Corn
      "mitigationStrategies": [
        {
          "type": "preventive",
          "name": "Trap crops",
          "description": "Plant sunflower or castor around field perimeter to attract armyworms.",
          "applicationTiming": "Before planting main crop",
          "efficacy": "medium",
          "safetyWarnings": []
        },
        {
          "type": "organic",
          "name": "Bacillus thuringiensis (Bt)",
          "description": "Biological insecticide spray. Apply every 5-7 days.",
          "applicationTiming": "At first appearance of larvae",
          "efficacy": "high",
          "safetyWarnings": ["Most effective on young larvae (1st-2nd instar)"]
        },
        {
          "type": "chemical",
          "name": "Chlorpyrifos",
          "description": "Broad-spectrum organophosphate. Apply at first sign of infestation.",
          "applicationTiming": "At first appearance of larvae",
          "efficacy": "high",
          "safetyWarnings": ["Wear full PPE", "Do not apply during flowering", "Safe harvesting interval: 14 days"]
        }
      ],
      "pampangaSpecificNotes": "Armyworm outbreaks common during dry season transition (Feb-Mar). Monitor fields closely during this period."
    }
  ],
  "pagination": {
    "total": 2,
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
    "type": "must be one of: insect, disease, weed, rodent"
  }
}
```

---

## GET /api/pests/:pestId

**Purpose**: Retrieve detailed information for a specific pest

**Headers**:
```
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

**Path Parameters**:
- `pestId` (required): Pest ObjectId

**Request**: No body required

**Response (200 OK)**:
```json
{
  "statusCode": 200,
  "message": "Pest details retrieved successfully",
  "data": {
    // Full pest object as per GET /api/pests response
  }
}
```

**Response (404 Not Found)**:
```json
{
  "statusCode": 404,
  "error": "NotFoundError",
  "message": "Pest not found"
}
```

---
