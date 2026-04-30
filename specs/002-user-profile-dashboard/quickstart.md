# Quickstart: User Profile Dashboard (002)

## Overview

This guide describes how the User Profile Dashboard feature integrates into the AgriKlima system for developers working on implementation.

---

## Prerequisites

1. **Feature 001** (AgriKlima core) must be fully implemented and running:
   - MongoDB connected with `User`, `Farm`, `Crop`, `Pest`, `CalendarEvent` collections
   - JWT authentication in place (`/api/auth/*`)
   - Cloudinary configured in `.env`

2. **New `.env` variables required** (user will supply):
   ```env
   CLOUDINARY_CLOUD_NAME=your_cloud_name
   CLOUDINARY_API_KEY=your_api_key
   CLOUDINARY_API_SECRET=your_api_secret
   ```

---

## Backend Structure for 002

New files follow the domain-folder pattern inside `backend/src/`:

```
backend/src/
└── profile/
    ├── db/
    │   └── userProfile.db.js       # Mongoose queries (User model extensions)
    ├── service/
    │   ├── profileService.js        # Business logic: get/update profile, aggregate dashboard
    │   ├── avatarService.js         # Cloudinary upload/delete logic
    │   └── passwordService.js       # Password validation + change logic
    └── controller/
        └── profileController.js     # HTTP handlers for all /api/profile/* routes
```

> The `User` Mongoose schema in `backend/src/models/User.js` is extended with optional fields: `avatarUrl`, `municipality`, `bio`.

---

## Frontend Structure for 002

```
frontend/src/
└── pages/
    └── profile/
        ├── ProfilePage.jsx           # Main dashboard page (protected route)
        ├── ProfileHeader.jsx         # Avatar + name + role display section
        ├── EditProfileForm.jsx       # Name, municipality, bio form
        ├── ChangePasswordForm.jsx    # Inline password change form
        ├── FarmSummaryWidget.jsx     # Farm + crop + pest summary card
        └── CalendarWidget.jsx        # Upcoming calendar tasks widget
```

---

## Key Integration Points

### 1. Aggregated Dashboard Call
```js
// frontend/src/services/api.js
GET /api/profile/dashboard   // returns full dashboard payload
```
The `ProfilePage` dispatches a single call and distributes data to each sub-component.

### 2. Avatar Upload
```js
// multipart/form-data
POST /api/profile/avatar
```
Uses an `<input type="file">` filtered to `image/jpeg,image/png,image/webp`. File size checked client-side before submit; enforced again server-side.

### 3. Password Validation (Frontend)
```js
const PASSWORD_REGEX = /^(?=.*[A-Z])(?=.*[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]).{8,}$/;
```
Real-time feedback shown beneath the password input. Prevent form submit if pattern not matched.

### 4. Empty State Logic
When `dashboard.farms.count === 0`:
- Render `emptyStateSuggestions.seasonalCrops` as a "Crops You Can Plant" card.
- Render `emptyStateSuggestions.news` as a "Latest Farming News" card.
- Show "Add Your Farm" CTA button linking to `/farm/add`.

### 5. Protected Route
The `/profile` route is wrapped in the existing `<PrivateRoute>` component in `App.jsx`.

---

## Testing the Feature Manually

1. Start backend: `node src/server.js`
2. Start frontend: `npm run dev`
3. Register a new user at `/register` — verify password policy enforcement
4. Login and navigate to `/profile`
5. Try editing your name — verify save and persistence
6. Upload an avatar > 2 MB — verify rejection error message
7. Change password using the inline form — verify current password check
8. Add a farm via `/farm/add`, then revisit `/profile` to see the farm/crop/pest summary
