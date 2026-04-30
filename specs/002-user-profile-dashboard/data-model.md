# Data Model: User Profile Dashboard (002)

## Existing Models (reused from 001, no changes)

### User
| Field | Type | Constraints |
|-------|------|-------------|
| `_id` | ObjectId | Auto |
| `name` | String | Required |
| `email` | String | Required, Unique |
| `password` | String | Required, Hashed (bcrypt) |
| `role` | String | Enum: `['farmer', 'admin']`, default `'farmer'` |
| `region` | String | Default `'Pampanga'` |
| `createdAt` | Date | Auto |
| `updatedAt` | Date | Auto |

### Farm
| Field | Type | Constraints |
|-------|------|-------------|
| `_id` | ObjectId | Auto |
| `user` | ObjectId (ref: User) | Required |
| `name` | String | Required |
| `sizeHectares` | Number | Optional |
| `crops` | [ObjectId] (ref: Crop) | Optional array |

### Crop, Pest, CalendarEvent
> Reused from 001 as-is. No schema changes required.

---

## New / Extended Models for 002

### UserProfile (extends User — stored as update to User document)

New fields added to the existing `User` schema:

| Field | Type | Constraints | Notes |
|-------|------|-------------|-------|
| `avatarUrl` | String | Optional | Cloudinary URL |
| `municipality` | String | Optional | Sub-region within Pampanga |
| `bio` | String | Optional | Max 300 chars |

> These fields are added as optional to the existing `User` Mongoose schema. No new collection needed.

**Password Policy** (enforced on the service layer, not schema):
- Minimum 8 characters
- At least 1 uppercase letter (`[A-Z]`)
- At least 1 special character (`[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]`)
- Regex: `/^(?=.*[A-Z])(?=.*[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]).{8,}$/`

---

## Aggregated Dashboard Payload (not a persisted entity)

The `/api/profile/dashboard` endpoint returns a composed object:

```json
{
  "profile": {
    "_id": "...",
    "name": "...",
    "email": "...",
    "role": "...",
    "avatarUrl": "...",
    "municipality": "...",
    "createdAt": "..."
  },
  "farms": {
    "count": 2,
    "list": [{ "_id": "...", "name": "...", "sizeHectares": 3 }]
  },
  "activeCrops": [{ "_id": "...", "name": "Rice (Palay)", "season": "wet" }],
  "prevalentPests": [{ "_id": "...", "name": "Brown Planthopper", "mitigation": "..." }],
  "upcomingCalendarEvents": [{ "_id": "...", "title": "...", "date": "...", "type": "planting" }],
  "emptyStateSuggestions": {
    "seasonalCrops": [...],
    "news": [...]
  }
}
```

> `emptyStateSuggestions` is only populated when `farms.count === 0`.

---

## Relationships

```
User (1) ──── (many) Farm
Farm (many) ──── (many) Crop
Crop (many) ──── (many) Pest  [via affectedCrops]
User (1) ──── (many) CalendarEvent  [implicitly, via event ownership]
```
