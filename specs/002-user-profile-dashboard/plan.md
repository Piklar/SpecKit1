# Implementation Plan: User Profile Dashboard (002)

**Feature**: User Profile Dashboard  
**Branch**: `002-user-profile-dashboard`  
**Status**: Ready for Implementation  
**Date**: 2026-04-29

---

## Technical Context

| Item | Decision |
|------|----------|
| Stack | MERN (MongoDB, Express, React, Node.js) |
| Styling | Material-UI (MUI) |
| Auth | JWT via existing `authenticateJWT` middleware |
| Image Storage | Cloudinary (credentials via `.env`) |
| File Upload Middleware | `multer` + `multer-storage-cloudinary` |
| State Management | React Context + local component state |
| Password Validation | Dual-layer: frontend regex + backend service |
| Backend Structure | `profile/db/`, `profile/service/`, `profile/controller/` |
| Testing | No test folders per project decision |

---

## Constitution Check

| Principle | Status | Notes |
|-----------|--------|-------|
| I. Clean Code | ✅ PASS | Domain-folder pattern enforces separation of concerns |
| II. Strict Testing | ⚠️ WAIVED | User explicitly opted out of test folders for this feature |
| III. Responsive UI | ✅ PASS | MUI + responsive breakpoints required; WCAG 2.1 AA target |

---

## Artifacts

| Artifact | Path |
|----------|------|
| Spec | `specs/002-user-profile-dashboard/spec.md` |
| Research | `specs/002-user-profile-dashboard/research.md` |
| Data Model | `specs/002-user-profile-dashboard/data-model.md` |
| API Contracts | `specs/002-user-profile-dashboard/contracts/api.md` |
| Quickstart | `specs/002-user-profile-dashboard/quickstart.md` |
| Tasks | `specs/002-user-profile-dashboard/tasks.md` *(generate next)* |

---

## Phase 1: Backend — Profile Domain

### Backend File Map

```
backend/src/
├── models/
│   └── User.js                   ← EXTEND: add avatarUrl, municipality, bio fields
└── profile/
    ├── db/
    │   └── userProfile.db.js     ← NEW: Mongoose DB query layer
    ├── service/
    │   ├── profileService.js     ← NEW: dashboard aggregation + profile CRUD logic
    │   ├── avatarService.js      ← NEW: Cloudinary upload/delete
    │   └── passwordService.js    ← NEW: password validation + change
    └── controller/
        └── profileController.js  ← NEW: HTTP handlers for all /api/profile/* routes
```

**New routes registered in `server.js`**:
- `GET /api/profile/dashboard`
- `GET /api/profile/me`
- `PUT /api/profile/me`
- `POST /api/profile/avatar`
- `DELETE /api/profile/avatar`
- `PUT /api/profile/password`

---

## Phase 2: Frontend — Profile Dashboard UI

### Frontend File Map

```
frontend/src/
└── pages/
    └── profile/
        ├── ProfilePage.jsx        ← Main dashboard shell (fetches /api/profile/dashboard)
        ├── ProfileHeader.jsx      ← Avatar + name + role + edit button
        ├── EditProfileForm.jsx    ← Name, municipality, bio form
        ├── ChangePasswordForm.jsx ← Inline password change with policy enforcement
        ├── FarmSummaryWidget.jsx  ← Farm count, active crops, prevalent pests
        └── CalendarWidget.jsx     ← Upcoming calendar tasks (next 30 days)
```

**New route** added to `App.jsx`:
- `/profile` → `<PrivateRoute><ProfilePage /></PrivateRoute>`

**Dashboard navigation** updated to add a "Profile" link.

---

## Phase 3: Integration & Polish

- Extend `User` model with `avatarUrl`, `municipality`, `bio` fields
- Wire up Multer + Cloudinary for avatar upload with size/type enforcement
- Add password policy regex on frontend (`ChangePasswordForm.jsx`) and backend (`passwordService.js`)
- Implement empty state: when no farms linked, show seasonal crops + news + CTA
- Verify MUI responsive breakpoints on all new components
- Update `README.md` with new profile API endpoint documentation
