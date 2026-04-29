# Data Model: AgriKlima Entities & Relationships

**Date**: 2026-04-29  
**Platform**: MongoDB + Mongoose  
**Scope**: All entities required for AgriKlima MERN stack

---

## 1. User Entity

**Purpose**: Represent a farmer using AgriKlima; manage authentication and profile

**Mongoose Schema**:
```javascript
const userSchema = new Schema({
  _id: ObjectId,
  email: { type: String, required: true, unique: true, lowercase: true },
  passwordHash: { type: String, required: true },  // bcryptjs hashed
  name: { type: String, required: true },
  role: { type: String, enum: ['farmer', 'admin'], default: 'farmer' },
  phone: { type: String, optional: true },
  
  // Profile
  defaultMunicipality: { type: String, enum: [pampangaMunicipalities], required: true },
  
  // Timestamps
  createdAt: { type: Date, default: Date.now },
  lastLoginAt: { type: Date, optional: true },
  updatedAt: { type: Date, default: Date.now },
  
  // Status
  isActive: { type: Boolean, default: true },
  isVerified: { type: Boolean, default: false },  // Email verification flag
  
  // Preferences
  language: { type: String, default: 'en', enum: ['en', 'tl'] },  // English, Tagalog
  theme: { type: String, default: 'light', enum: ['light', 'dark'] },
});

userSchema.index({ email: 1 });
userSchema.index({ defaultMunicipality: 1 });
userSchema.index({ createdAt: -1 });
```

**Validation Rules**:
- Email MUST be valid format (RFC 5322)
- Password MUST be ≥8 characters, include uppercase/lowercase/digit/special character
- Phone (optional) MUST match Philippine number format if provided
- defaultMunicipality MUST be in Pampanga municipalities list

**Relationships**:
- User → Farm (one-to-many: a user has multiple farms)
- User → NewsArticleRead (optional, one-to-many: tracks read articles)

---

## 2. Farm Entity

**Purpose**: Represent a farmer's individual farm location and tracked data

**Mongoose Schema**:
```javascript
const farmSchema = new Schema({
  _id: ObjectId,
  userId: { type: ObjectId, ref: 'User', required: true },
  
  // Farm Identity
  farmName: { type: String, required: true },
  municipality: { type: String, enum: [pampangaMunicipalities], required: true },
  hectares: { type: Number, required: true, min: 0.1, max: 1000 },
  soilType: { type: String, optional: true, enum: ['clay', 'loam', 'sandy', 'unknown'] },
  
  // Current Crops (array of crop references)
  currentCrops: [{
    cropId: { type: ObjectId, ref: 'Crop' },
    plantedDate: { type: Date, required: true },
    expectedHarvestDate: { type: Date, optional: true },
    areaAllocated: { type: Number, required: true },  // hectares for this crop
  }],
  
  // Observations Log
  observations: [{
    date: { type: Date, default: Date.now },
    type: { type: String, enum: ['pest-sighting', 'disease', 'weather-damage', 'note'] },
    description: { type: String, required: true },
    pestId: { type: ObjectId, ref: 'Pest', optional: true },
    imageUrl: { type: String, optional: true },
  }],
  
  // Timestamps
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});

farmSchema.index({ userId: 1 });
farmSchema.index({ municipality: 1 });
```

**Validation Rules**:
- farmName MUST be 1-100 characters, unique per user
- hectares MUST be between 0.1 and 1000
- municipality MUST be in Pampanga list
- currentCrops array MUST not exceed 20 entries (typical farm rotation)
- plantedDate MUST not be in future; expectedHarvestDate MUST be after plantedDate

**Relationships**:
- Farm → User (many-to-one: back-reference)
- Farm → Crop (one-to-many, indirect via currentCrops array)
- Farm → Pest (one-to-many, indirect via observations)

---

## 3. Crop Entity

**Purpose**: Reference database of crops recommended for Pampanga seasons

**Mongoose Schema**:
```javascript
const cropSchema = new Schema({
  _id: ObjectId,
  
  // Identity
  name: { type: String, required: true, unique: true },
  commonName: { type: String, optional: true },  // e.g., "Pilipinas Rice" for Oryza sativa
  localName: { type: String, optional: true },  // Tagalog name
  
  // Growing Requirements
  waterRequirement: { type: String, enum: ['low', 'medium', 'high'], required: true },
  expectedYieldPerHectare: { type: String, required: true },  // e.g., "5-7 tons"
  growingDurationDays: { type: Number, required: true },
  optimalTemperatureMin: { type: Number, optional: true },  // Celsius
  optimalTemperatureMax: { type: Number, optional: true },
  
  // Seasonal Info
  seasons: [{
    season: { type: String, enum: ['dry', 'wet', 'summer', 'monsoon'] },
    optimalPlantingStart: { type: String, required: true },  // "MM-DD" format
    optimalPlantingEnd: { type: String, required: true },
    expectedHarvestStart: { type: String, required: true },
    expectedHarvestEnd: { type: String, required: true },
    recommendedForMunicipalities: [String],  // e.g., ["Apalit", "Balanga"]
  }],
  
  // Disease & Pest Risks
  commonPests: [{ type: ObjectId, ref: 'Pest' }],
  commonDiseases: [String],  // e.g., ["Blast", "Sheath Blight"]
  
  // Media
  imageUrl: { type: String, optional: true },  // Cloudinary URL
  
  // Reference Info
  description: { type: String, optional: true },
  growingTips: [String],  // e.g., ["Water daily in dry season", "Apply fertilizer at tiller stage"]
  
  // Metadata
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});

cropSchema.index({ name: 1 });
cropSchema.index({ 'seasons.recommendedForMunicipalities': 1 });
```

**Validation Rules**:
- name MUST be 2-100 characters, case-insensitive unique
- growingDurationDays MUST be 30-365
- Seasonal start/end dates MUST be in MM-DD format; start MUST be before end
- commonPests array limited to 10 entries
- If a crop is deleted, farms with that crop in currentCrops should receive warning

**Relationships**:
- Crop → Pest (one-to-many: a crop has multiple pest risks)
- Crop ← Farm (one-to-many, via Farm.currentCrops)

---

## 4. Pest Entity

**Purpose**: Reference database of seasonal pests & diseases in Pampanga

**Mongoose Schema**:
```javascript
const pestSchema = new Schema({
  _id: ObjectId,
  
  // Identity
  name: { type: String, required: true, unique: true },
  localName: { type: String, optional: true },  // Tagalog
  scientificName: { type: String, optional: true },
  type: { type: String, enum: ['insect', 'disease', 'weed', 'rodent'], required: true },
  
  // Identification
  description: { type: String, required: true },  // Physical description
  imageUrl: { type: String, optional: true },  // Cloudinary URL
  identificationTips: [String],
  
  // Lifecycle in Pampanga
  lifecycleDurationDays: { type: Number, optional: true },
  vulnerableStages: [String],  // e.g., ["Seedling", "Flowering"]
  seasonalActivityPeriod: [{
    season: { type: String, enum: ['dry', 'wet', 'summer', 'monsoon'] },
    isActive: { type: Boolean, default: true },
    peakMonth: { type: Number, optional: true },  // 1-12
  }],
  
  // Crops Affected
  affectedCrops: [{ type: ObjectId, ref: 'Crop' }],
  
  // Mitigation Strategies
  mitigationStrategies: [{
    type: { type: String, enum: ['preventive', 'organic', 'chemical', 'cultural'], required: true },
    name: { type: String, required: true },
    description: { type: String, required: true },
    applicationTiming: { type: String, required: true },  // e.g., "At first sight of infestation"
    efficacy: { type: String, enum: ['low', 'medium', 'high'], optional: true },
    safetyWarnings: [String],  // e.g., ["Do not apply near water sources"]
  }],
  
  // Reference
  pampangaSpecificNotes: { type: String, optional: true },
  
  // Metadata
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});

pestSchema.index({ name: 1 });
pestSchema.index({ 'seasonalActivityPeriod.isActive': 1 });
```

**Validation Rules**:
- name MUST be 2-100 characters, unique
- type MUST be one of: insect, disease, weed, rodent
- affectedCrops array MUST not be empty
- mitigationStrategies array MUST have ≥1 entry
- Each strategy MUST have clear description and application timing

**Relationships**:
- Pest → Crop (many-to-many: a pest affects multiple crops)
- Pest ← Farm (one-to-many, via Farm.observations)

---

## 5. Weather Entity

**Purpose**: Current and forecast weather data for Pampanga municipalities

**Mongoose Schema**:
```javascript
const weatherSchema = new Schema({
  _id: ObjectId,
  municipality: { type: String, enum: [pampangaMunicipalities], required: true, index: true },
  
  // Current Conditions
  current: {
    temperature: { type: Number, required: true },  // Celsius
    feelsLike: { type: Number, optional: true },
    humidity: { type: Number, required: true, min: 0, max: 100 },  // Percentage
    pressure: { type: Number, optional: true },  // hPa
    windSpeed: { type: Number, required: true },  // m/s
    windDirection: { type: String, optional: true },  // N, NE, E, SE, S, SW, W, NW
    cloudCover: { type: Number, optional: true, min: 0, max: 100 },  // Percentage
    uvIndex: { type: Number, optional: true, min: 0, max: 11 },
    rainfall: { type: Number, optional: true, default: 0 },  // mm
    condition: { type: String, required: true },  // e.g., "Clear", "Rainy", "Cloudy"
    description: { type: String, optional: true },
  },
  
  // Forecast (7 days)
  forecast: [{
    date: { type: Date, required: true },
    temperatureMin: { type: Number, required: true },
    temperatureMax: { type: Number, required: true },
    humidity: { type: Number, optional: true },
    windSpeed: { type: Number, optional: true },
    rainfallProbability: { type: Number, optional: true, min: 0, max: 100 },
    expectedRainfall: { type: Number, optional: true },  // mm
    condition: { type: String, required: true },
    uvIndex: { type: Number, optional: true },
  }],
  
  // Metadata
  dataSourceAPI: { type: String, required: true },  // e.g., "OpenWeatherMap", "PAGASA"
  lastUpdatedAt: { type: Date, default: Date.now },
  nextUpdateAt: { type: Date, default: () => new Date(Date.now() + 3600000) },  // 1 hour from now
});

weatherSchema.index({ municipality: 1, lastUpdatedAt: -1 });
weatherSchema.ttl(3600);  // Auto-delete documents 1 hour after lastUpdatedAt
```

**Validation Rules**:
- temperature MUST be between -10 and 50 Celsius (valid for Philippines)
- humidity MUST be 0-100%
- forecast array MUST contain exactly 7 entries (one per day)
- Each forecast date MUST be consecutive days, starting tomorrow
- rainProbability MUST be 0-100%

**Relationships**:
- Weather (read-only reference for farmers; no direct entity linkage)

---

## 6. NewsArticle Entity

**Purpose**: Local agricultural announcements, advisories, and updates for Pampanga

**Mongoose Schema**:
```javascript
const newsArticleSchema = new Schema({
  _id: ObjectId,
  
  // Content
  title: { type: String, required: true },
  content: { type: String, required: true },  // Full article text
  excerpt: { type: String, optional: true },  // Summary for feed
  
  // Metadata
  articleType: { type: String, enum: ['pest-alert', 'opportunity', 'advisory', 'update', 'announcement'], required: true },
  source: { type: String, required: true },  // e.g., "Agricultural Extension Office", "Local Government"
  
  // Geographic Scope
  applicableMunicipalities: {
    type: [String],
    validate: {
      validator: function(v) { return v.length > 0; },
      message: 'At least one municipality must be specified',
    },
    required: true,
  },
  
  // Imagery
  imageUrl: { type: String, optional: true },  // Cloudinary URL
  
  // Timestamps
  publishedAt: { type: Date, default: Date.now, required: true },
  expiresAt: { type: Date, optional: true },  // Optional: article relevance expires
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
  
  // Admin
  isPublished: { type: Boolean, default: true },
});

newsArticleSchema.index({ publishedAt: -1 });
newsArticleSchema.index({ 'applicableMunicipalities': 1 });
newsArticleSchema.index({ isPublished: 1, publishedAt: -1 });
```

**Validation Rules**:
- title MUST be 5-200 characters
- content MUST be 20-5000 characters
- articleType MUST be one of defined enums
- applicableMunicipalities MUST have ≥1 entry, all valid Pampanga municipalities
- publishedAt MUST not be in the future
- If expiresAt is set, it MUST be after publishedAt

**Relationships**:
- NewsArticle ← User (optional many-to-many via read tracking table, out of scope for v1)

---

## 7. CalendarEvent Entity

**Purpose**: Seasonal farming activity calendar highlighting planting, maintenance, and harvest windows

**Mongoose Schema**:
```javascript
const calendarEventSchema = new Schema({
  _id: ObjectId,
  
  // Event Identity
  cropId: { type: ObjectId, ref: 'Crop', required: true },
  municipality: { type: String, enum: [pampangaMunicipalities], required: true },
  
  // Activity
  activityType: { type: String, enum: ['planting', 'maintenance', 'harvest', 'preparation'], required: true },
  startDate: { type: Date, required: true },  // YYYY-MM-DD
  endDate: { type: Date, required: true },  // YYYY-MM-DD
  
  // Details
  description: { type: String, optional: true },
  recommendedActions: [String],  // e.g., ["Prepare seedbeds", "Water daily"]
  importanceLevel: { type: String, enum: ['low', 'medium', 'high'], default: 'medium' },
  
  // Repeating Event (optional)
  repeats: { type: String, enum: ['yearly', 'never'], default: 'yearly' },
  
  // Metadata
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});

calendarEventSchema.index({ municipality: 1, startDate: 1 });
calendarEventSchema.index({ cropId: 1, startDate: 1 });
```

**Validation Rules**:
- startDate MUST be before endDate
- Both dates MUST be valid within the calendar year (repeated yearly per constitution)
- municipality MUST be in Pampanga list
- recommendedActions array limited to 10 entries

**Relationships**:
- CalendarEvent → Crop (many-to-one)

---

## Entity Relationship Diagram (ERD)

```
┌─────────────────────┐
│      User           │
├─────────────────────┤
│ _id (PK)            │
│ email (UNIQUE)      │
│ passwordHash        │
│ name                │
│ role                │
│ defaultMunicipality │
│ createdAt           │
└─────────────────────┘
        │
        │ one-to-many
        ├──────────────────┐
        ↓                  ↓
┌─────────────────────┐  (NewsRead tracking - out of scope v1)
│      Farm           │
├─────────────────────┤
│ _id (PK)            │
│ userId (FK)         │
│ farmName            │
│ municipality        │
│ hectares            │
│ currentCrops[]      │ ──→ Crop (via FK)
│ observations[]      │ ──→ Pest (optional via FK)
│ createdAt           │
└─────────────────────┘

┌─────────────────────┐
│      Crop           │
├─────────────────────┤
│ _id (PK)            │
│ name (UNIQUE)       │
│ commonName          │
│ waterRequirement    │
│ growingDuration     │
│ seasons[]           │
│ commonPests[]       │ ──→ Pest (via FK)
│ imageUrl            │
└─────────────────────┘
        ↑
        │ many-to-many
        │ (direct in Crop.commonPests)
        │
┌─────────────────────┐
│      Pest           │
├─────────────────────┤
│ _id (PK)            │
│ name (UNIQUE)       │
│ type                │
│ description         │
│ affectedCrops[]     │ ──→ Crop (via FK)
│ mitigationStrategies│
│ seasonalActivity[]  │
└─────────────────────┘

┌─────────────────────┐
│    Weather          │
├─────────────────────┤
│ _id (PK)            │
│ municipality        │
│ current {}          │
│ forecast[]          │
│ lastUpdatedAt       │
│ (TTL: 1 hour)       │
└─────────────────────┘

┌─────────────────────┐
│   NewsArticle       │
├─────────────────────┤
│ _id (PK)            │
│ title               │
│ content             │
│ articleType         │
│ source              │
│ applicableMunicip[] │
│ publishedAt         │
│ isPublished         │
└─────────────────────┘

┌─────────────────────┐
│  CalendarEvent      │
├─────────────────────┤
│ _id (PK)            │
│ cropId (FK)         │
│ municipality        │
│ activityType        │
│ startDate           │
│ endDate             │
│ recommendedActions[]│
│ repeats             │
└─────────────────────┘
```

---

## Indexes & Query Performance

**Critical Indexes** (high-traffic queries):
- `User.email`: Fast login lookups
- `Farm.userId`: Retrieve all farms for a user
- `Farm.municipality`: Filter farms by location
- `Crop.name`: Search crops by name
- `Weather.municipality`: Fetch weather for municipality
- `Weather.lastUpdatedAt`: Cache invalidation queries
- `NewsArticle.publishedAt`: Sort articles chronologically
- `NewsArticle.isPublished + publishedAt`: Filter active articles

**Compound Indexes**:
- `Weather(municipality, lastUpdatedAt)`: Latest weather per municipality
- `CalendarEvent(municipality, startDate)`: Fetch events for month view
- `Farm.observations(type, date)`: Filter pest sightings by date range

---

## Database Initialization Script Outline

```javascript
// seeds/init-data.js
1. Load Pampanga municipalities reference list
2. Create reference Crops (rice, corn, vegetables, etc.) with seasonal data
3. Create reference Pests (rice blast, armyworm, etc.) with mitigation strategies
4. Populate CalendarEvent collection with seasonal windows for Crops
5. Create sample Weather documents for each municipality
6. Create sample NewsArticles (pest alerts, opportunities)
```

---

## Next Steps

1. **API Contracts**: Define request/response schemas for each endpoint (contracts/)
2. **Quickstart Guide**: Setup instructions for local dev environment
3. **Task Generation**: Break into independently testable implementation tasks
