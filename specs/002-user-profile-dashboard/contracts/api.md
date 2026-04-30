# API Contracts: User Profile Dashboard (002)

All endpoints require `Authorization: Bearer <token>` unless otherwise noted.
Base URL: `/api/profile`

---

## GET /api/profile/dashboard

Returns the full aggregated dashboard payload for the authenticated user.

**Authentication**: Required (JWT)
**Cache**: `no-store` (user-specific, must always be fresh)

### Response 200 OK
```json
{
  "profile": {
    "_id": "string",
    "name": "string",
    "email": "string",
    "role": "farmer | admin",
    "avatarUrl": "string | null",
    "municipality": "string | null",
    "createdAt": "ISO8601"
  },
  "farms": {
    "count": "number",
    "list": [{ "_id": "string", "name": "string", "sizeHectares": "number | null" }]
  },
  "activeCrops": [{ "_id": "string", "name": "string", "season": "wet | dry | all" }],
  "prevalentPests": [{ "_id": "string", "name": "string", "mitigation": "string" }],
  "upcomingCalendarEvents": [
    { "_id": "string", "title": "string", "date": "ISO8601", "type": "planting | harvest | maintenance" }
  ],
  "emptyStateSuggestions": {
    "seasonalCrops": [],
    "news": []
  }
}
```

### Response 401 Unauthorized
```json
{ "message": "Not authorized, no token" }
```

---

## GET /api/profile/me

Returns the authenticated user's profile fields only (lightweight, no aggregation).

**Authentication**: Required (JWT)

### Response 200 OK
```json
{
  "_id": "string",
  "name": "string",
  "email": "string",
  "role": "string",
  "avatarUrl": "string | null",
  "municipality": "string | null",
  "region": "string",
  "createdAt": "ISO8601"
}
```

---

## PUT /api/profile/me

Updates the authenticated user's profile fields (name, municipality, bio).

**Authentication**: Required (JWT)
**Content-Type**: `application/json`

### Request Body
```json
{
  "name": "string (required)",
  "municipality": "string (optional)",
  "bio": "string (optional, max 300 chars)"
}
```

### Response 200 OK
```json
{
  "_id": "string",
  "name": "string",
  "email": "string",
  "avatarUrl": "string | null",
  "municipality": "string | null"
}
```

### Response 400 Bad Request
```json
{ "message": "Name is required" }
```

---

## POST /api/profile/avatar

Uploads or replaces the user's avatar image via Cloudinary.

**Authentication**: Required (JWT)
**Content-Type**: `multipart/form-data`

### Request Body
| Field | Type | Constraints |
|-------|------|-------------|
| `avatar` | File | Required, JPEG/PNG/WebP, max 2 MB |

### Response 200 OK
```json
{ "avatarUrl": "https://res.cloudinary.com/..." }
```

### Response 400 Bad Request
```json
{ "message": "File must be JPEG, PNG, or WebP and under 2 MB" }
```

---

## DELETE /api/profile/avatar

Removes the user's avatar (resets to null/placeholder).

**Authentication**: Required (JWT)

### Response 200 OK
```json
{ "message": "Avatar removed", "avatarUrl": null }
```

---

## PUT /api/profile/password

Changes the authenticated user's password.

**Authentication**: Required (JWT)
**Content-Type**: `application/json`

### Request Body
```json
{
  "currentPassword": "string (required)",
  "newPassword": "string (required, must meet policy)"
}
```

### Password Policy (enforced server-side)
- Minimum 8 characters
- At least 1 uppercase letter
- At least 1 special character (`!@#$%^&*` etc.)

### Response 200 OK
```json
{ "message": "Password updated successfully" }
```

### Response 400 Bad Request
```json
{ "message": "Password must be at least 8 characters, include 1 uppercase and 1 special character" }
```

### Response 401 Unauthorized
```json
{ "message": "Current password is incorrect" }
```
