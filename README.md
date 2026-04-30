# AgriKlima

AgriKlima is a localized web application designed to empower farmers in Pampanga with tailored agricultural insights. The platform provides localized weather forecasts, seasonal crop recommendations, pest identification strategies, a personalized farm dashboard, and an agricultural calendar.

## Technologies Used
- **Frontend**: React (Vite), Material-UI (MUI), React Router, Axios
- **Backend**: Node.js, Express.js, MongoDB (Mongoose), JSON Web Tokens (JWT), bcryptjs
- **Testing**: Jest, Supertest (Backend), Vitest, React Testing Library (Frontend)

## Prerequisites
- Node.js (v18+ recommended)
- MongoDB running locally or a MongoDB URI
- Cloudinary Account (optional, for image uploads)

## Setup Instructions

### 1. Backend Setup
1. Open a terminal and navigate to the `backend` directory:
   \`\`\`bash
   cd backend
   \`\`\`
2. Install dependencies:
   \`\`\`bash
   npm install
   \`\`\`
3. Create a `.env` file in the `backend` directory and add the following:
   \`\`\`env
   PORT=3000
   MONGO_URI=mongodb://localhost:27017/agriklima
   JWT_SECRET=your_super_secret_jwt_key
   CLOUDINARY_CLOUD_NAME=your_cloud_name
   CLOUDINARY_API_KEY=your_api_key
   CLOUDINARY_API_SECRET=your_api_secret
   \`\`\`
4. Seed the database (optional, seeds the crops collection):
   \`\`\`bash
   node src/seeds/crops.seed.js
   \`\`\`
5. Start the server:
   \`\`\`bash
   node src/server.js
   \`\`\`

### 2. Frontend Setup
1. Open a new terminal and navigate to the `frontend` directory:
   \`\`\`bash
   cd frontend
   \`\`\`
2. Install dependencies:
   \`\`\`bash
   npm install
   \`\`\`
3. Start the development server:
   \`\`\`bash
   npm run dev
   \`\`\`

## API Documentation
The backend exposes the following RESTful endpoints:
- `\`/api/auth/register\`` (POST) - Register a new farmer account
- `\`/api/auth/login\`` (POST) - Authenticate and receive a JWT
- `\`/api/weather\`` (GET) - Fetch cached localized weather data for Pampanga
- `\`/api/crops\`` (GET) - Fetch seasonal crop recommendations (supports `\`?season=wet\`` filter)
- `\`/api/pests\`` (GET) - Fetch pest identification and mitigation strategies
- `\`/api/farm\`` (GET, POST) - Manage user-specific farm profiles (Requires Auth)
- `\`/api/calendar\`` (GET) - Fetch the seasonal agricultural calendar
- `\`/api/news\`` (GET) - Fetch local agricultural news and advisories

### `/api/profile/*` — User Profile Dashboard (Feature 002)

All routes require a valid JWT in the `Authorization: Bearer <token>` header.

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/profile/me` | Get current user profile fields |
| GET | `/api/profile/dashboard` | Get full dashboard payload |
| PUT | `/api/profile/me` | Update name, municipality, bio |
| POST | `/api/profile/avatar` | Upload/replace avatar image |
| DELETE | `/api/profile/avatar` | Remove avatar |
| PUT | `/api/profile/password` | Change password |

#### GET /api/profile/dashboard — Response example
```json
{
  "profile": {
    "_id": "...",
    "name": "Juan dela Cruz",
    "email": "juan@example.com",
    "role": "farmer",
    "avatarUrl": "https://res.cloudinary.com/…/avatar.jpg",
    "municipality": "San Fernando",
    "createdAt": "2026-01-01T00:00:00.000Z"
  },
  "farms": { "count": 2, "list": [{ "_id": "…", "name": "Farm A", "sizeHectares": 1.5 }] },
  "activeCrops": [{ "_id": "…", "name": "Rice", "season": "wet" }],
  "prevalentPests": [{ "_id": "…", "name": "Brown Planthopper", "mitigation": "Apply neem oil…" }],
  "upcomingCalendarEvents": [{ "_id": "…", "title": "Rice harvest", "date": "2026-05-15T…", "type": "harvest" }],
  "emptyStateSuggestions": { "seasonalCrops": [], "news": [] }
}
```

#### PUT /api/profile/me — Request body
```json
{ "name": "Juan dela Cruz", "municipality": "San Fernando", "bio": "Rice farmer since 2010.", "clientUpdatedAt": "2026-01-01T00:00:00.000Z" }
```
Returns: updated profile object. Responds `409 Conflict` if another session saved changes after `clientUpdatedAt`.

#### POST /api/profile/avatar — Request
`multipart/form-data` with field `avatar` (JPEG/PNG/WebP, max 2 MB).
Returns: `{ "avatarUrl": "https://…" }`

#### PUT /api/profile/password — Request body
```json
{ "currentPassword": "OldPass1!", "newPassword": "NewPass1@" }
```
Password policy: min 8 chars, ≥1 uppercase, ≥1 special character.
Returns `401` if current password is wrong, `400` if new password is too weak.
