# Tasks: User Profile Dashboard (002)

**Input**: Design documents from `/specs/002-user-profile-dashboard/`
**Prerequisites**: plan.md ✅, spec.md ✅, research.md ✅, data-model.md ✅, contracts/api.md ✅, quickstart.md ✅

**Tests**: Omitted — testing is explicitly waived per plan.md (constitution check: `II. Strict Testing ⚠️ WAIVED`).

**Organization**: Tasks are grouped by user story to enable independent implementation and testing of each story.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel (different files, no blocking dependencies)
- **[Story]**: Which user story this task belongs to (US1, US2, US3)
- Exact file paths are included in every description

## Path Conventions

- **Backend**: `backend/src/`
- **Frontend**: `frontend/src/`
- Domain folder: `backend/src/profile/` with sub-layers `db/`, `service/`, `controller/`

---

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Extend the existing project for the new profile domain. All 001 code stays unchanged.

- [X] T001 Extend `backend/src/models/User.js` — add optional fields `avatarUrl` (String), `municipality` (String), `bio` (String, maxlength 300) to the existing Mongoose schema
- [X] T002 Create domain folder skeleton `backend/src/profile/db/`, `backend/src/profile/service/`, `backend/src/profile/controller/` (mkdir only, placeholder index files acceptable)
- [X] T003 [P] Verify Cloudinary config exists at `backend/src/config/cloudinary.js` and `.env` contains `CLOUDINARY_CLOUD_NAME`, `CLOUDINARY_API_KEY`, `CLOUDINARY_API_SECRET` — add placeholder keys with comments if missing
- [X] T004 [P] Install/verify npm packages: `multer`, `multer-storage-cloudinary` in `backend/package.json` (run `npm install multer multer-storage-cloudinary` from `backend/`)
- [X] T005 Add `/profile` private route to `frontend/src/App.jsx` pointing to `<PrivateRoute><ProfilePage /></PrivateRoute>` (import stub component until it exists)
- [X] T006 Add "Profile" navigation link to the existing dashboard sidebar/nav component in `frontend/src/`

**Checkpoint**: User model extended, folder skeleton ready, packages installed, route registered.

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Backend middleware wiring and Multer/Cloudinary upload configuration — must be complete before any endpoint is implemented.

**⚠️ CRITICAL**: No user story work can begin until this phase is complete.

- [X] T007 Create Multer + Cloudinary upload middleware in `backend/src/profile/service/avatarService.js` — configure `multer-storage-cloudinary` with `CLOUDINARY_*` env vars, enforce `fileFilter` (JPEG/PNG/WebP only), set `limits.fileSize` to 2 MB (2 097 152 bytes)
- [X] T008 Register all `/api/profile/*` routes in `backend/src/server.js` — mount `profileController` router under `/api/profile`, applying `authenticateJWT` middleware to every route
- [X] T009 Create `backend/src/profile/controller/profileController.js` — Express Router stub with empty handler functions for all 6 endpoints: `GET /dashboard`, `GET /me`, `PUT /me`, `POST /avatar`, `DELETE /avatar`, `PUT /password`

**Checkpoint**: Foundation ready — `GET /api/profile/me` returns 401 for unauthenticated requests (middleware works). All user story work can now begin.

---

## Phase 3: User Story 1 — View Profile Information (Priority: P1) 🎯 MVP

**Goal**: Authenticated users can navigate to `/profile` and see their current name, email, role, avatar (or placeholder), and municipality.

**Independent Test**: Log in, navigate to `/profile`, verify correct user data is displayed. With no avatar set, a placeholder image renders in place of `avatarUrl`.

### Implementation for User Story 1

- [X] T010 [US1] Implement `getProfile` DB query in `backend/src/profile/db/userProfile.db.js` — `findById(userId).select('-password')` helper function
- [X] T011 [US1] Implement `getDashboardPayload(userId)` in `backend/src/profile/service/profileService.js` — lightweight call that returns only the user profile fields (no farm aggregation yet; leave `farms`, `activeCrops`, `prevalentPests`, `upcomingCalendarEvents`, `emptyStateSuggestions` as empty stubs for now)
- [X] T012 [US1] Wire `GET /me` handler in `backend/src/profile/controller/profileController.js` — call `getProfile(req.user._id)`, return the profile object per contract in `contracts/api.md`
- [X] T013 [US1] Wire `GET /dashboard` handler in `backend/src/profile/controller/profileController.js` — call `getDashboardPayload(req.user._id)`, return full contract response (farm/crop sections empty for now)
- [X] T014 [P] [US1] Create `frontend/src/pages/profile/ProfilePage.jsx` — main dashboard shell; fetches `GET /api/profile/dashboard` on mount via `useEffect`, passes data to child components; shows loading spinner while fetching
- [X] T015 [P] [US1] Create `frontend/src/pages/profile/ProfileHeader.jsx` — renders avatar image (falls back to a default placeholder SVG/icon when `avatarUrl` is null), user name, email, role chip, and an "Edit" button (stub for US2)
- [X] T016 [US1] Integrate `ProfileHeader` into `ProfilePage.jsx` — pass `profile` slice of dashboard response as props

**Checkpoint**: User Story 1 fully functional — navigate to `/profile`, see real user data with avatar/placeholder rendering correctly.

---

## Phase 4: User Story 2 — Edit Profile Details (Priority: P2)

**Goal**: Users can edit their name, municipality, and bio; upload, replace, or remove their avatar; and change their password inline — all changes persist to the database.

**Independent Test**: Change name → save → refresh page → new name displayed. Upload avatar → refresh → avatar persists. Change password → log out → log- [X] T017 [US2] Implement `updateProfile(userId, { name, municipality, bio })` in `backend/src/profile/service/profileService.js` — validate `name` is non-empty, enforce `bio` ≤ 300 chars, call `userProfile.db.js` update helper, return updated document
- [X] T018 [US2] Implement `updateProfile` DB helper in `backend/src/profile/db/userProfile.db.js` — `findByIdAndUpdate(userId, fields, { new: true, runValidators: true }).select('-password')`
- [X] T019 [US2] Wire `PUT /me` handler in `backend/src/profile/controller/profileController.js` — parse body, call `profileService.updateProfile`, return updated profile per contract; respond 400 if name is missing
- [X] T020 [US2] Implement `uploadAvatar(userId, file)` in `backend/src/profile/service/avatarService.js` — upload `file` to Cloudinary via the multer storage engine, update `User.avatarUrl` in DB, return new `avatarUrl`
- [X] T021 [US2] Implement `deleteAvatar(userId)` in `backend/src/profile/service/avatarService.js` — delete image from Cloudinary using stored public ID, set `User.avatarUrl = null`, return `{ avatarUrl: null }`
- [X] T022 [US2] Wire `POST /avatar` handler in `backend/src/profile/controller/profileController.js` — apply multer upload middleware, call `avatarService.uploadAvatar`, return `{ avatarUrl }` per contract; return 400 on file validation failure
- [X] T023 [US2] Wire `DELETE /avatar` handler in `backend/src/profile/controller/profileController.js` — call `avatarService.deleteAvatar`, return `{ message, avatarUrl: null }` per contract
- [X] T024 [US2] Implement `validatePasswordPolicy(password)` in `backend/src/profile/service/passwordService.js` — enforce regex `/^(?=.*[A-Z])(?=.*[!@#$%^&*()_+\-=\[\]{};':"|,.<>\/?]).{8,}$/`, return `{ valid, message }`
- [X] T025 [US2] Implement `changePassword(userId, currentPassword, newPassword)` in `backend/src/profile/service/passwordService.js` — fetch user, `bcrypt.compare` currentPassword, call `validatePasswordPolicy(newPassword)`, hash new password, save
- [X] T026 [US2] Wire `PUT /password` handler in `backend/src/profile/controller/profileController.js` — parse `{ currentPassword, newPassword }`, call `passwordService.changePassword`, return 200/400/401 per contract
- [X] T027 [P] [US2] Create `frontend/src/pages/profile/EditProfileForm.jsx` — MUI form with fields: Name (required), Municipality (optional), Bio (optional, 300 char counter); calls `PUT /api/profile/me`; shows inline validation error on empty name; success shows snackbar notification
- [X] T028 [P] [US2] Create `frontend/src/pages/profile/ChangePasswordForm.jsx` — inline MUI form with Current Password, New Password, Confirm Password fields; real-time regex feedback on New Password (min 8 chars, 1 uppercase, 1 special char indicator); calls `PUT /api/profile/password`
- [X] T029 [US2] Integrate avatar upload/remove UI into `ProfileHeader.jsx` — add "Change Avatar" button (triggers hidden `<input type="file">`, accepts `.jpg,.jpeg,.png,.webp`, max 2 MB client-side check before POST) and "Remove Avatar" button calling `DELETE /api/profile/avatar`
- [X] T030 [US2] Integrate `EditProfileForm` and `ChangePasswordForm` into `ProfilePage.jsx` — render below `ProfileHeader`; collapse/expand with MUI Accordion or conditional staterofilePage.jsx` — render below `ProfileHeader`; collapse/expand with MUI Accordion or conditional state

**Checkpoint**: User Story 2 fully functional — profile edit, avatar management, and password change all work end-to-end.

---

## Phase 5: User Story 3 — View Recent Activity / Metrics (Priority: P3)

**Goal**: Dashboard shows a farm & crop summary (farm count, active crops by season, prevalent pests). When no farms are linked, shows seasonal crops, news items, and an "Add Farm" CTA.

**Independent Test**: With farms linked — dashboard shows farm count, active crop names, and pest names. With no farms — shows seasonal crops list, news items, and "Add Farm" button.

### Implementation for User Story 3

- [X] T031 [US3] Implement season-detection helper in `backend/src/profile/service/profileService.js` — `getCurrentSeason()` returns `'wet'` (May–October) or `'dry'` (November–April) based on `new Date().getMonth()`
- [X] T032 [US3] Implement full `getDashboardPayload(userId)` in `backend/src/profile/service/profileService.js` — populate: `farms` (query Farm by `user`), `activeCrops` (Crop filtered by current season from farm crops), `prevalentPests` (Pest filtered by `affectedCrops` in `activeCrops`), `upcomingCalendarEvents` (CalendarEvent next 30 days for user), `emptyStateSuggestions` (Crop by season + news when `farms.count === 0`)
- [X] T033 [US3] Update `getDashboardPayload` DB queries in `backend/src/profile/db/userProfile.db.js` — add `getFarmsByUser(userId)`, `getCropsBySeason(cropIds, season)`, `getPestsByCrops(cropIds)`, `getUpcomingEvents(userId, fromDate, toDate)`, `getSeasonalCrops(season)` helper functions
- [X] T034 [P] [US3] Create `frontend/src/pages/profile/FarmSummaryWidget.jsx` — MUI Card displaying: farm count badge, list of active crop names, list of prevalent pest names with mitigation tooltip; when `farms.count === 0`, renders empty-state view with seasonal crops grid, news cards, and an "Add Farm" MUI Button
- [X] T035 [P] [US3] Create `frontend/src/pages/profile/CalendarWidget.jsx` — MUI Card listing upcoming `CalendarEvent` items (next 30 days); each item shows title, formatted date, and event type chip; empty state shows "No upcoming tasks"
- [X] T036 [US3] Integrate `FarmSummaryWidget` and `CalendarWidget` into `ProfilePage.jsx` — pass `farms`, `activeCrops`, `prevalentPests`, `upcomingCalendarEvents`, `emptyStateSuggestions` slices from dashboard response as props

**Checkpoint**: All three user stories independently functional — full dashboard renders live farm, crop, pest, and calendar data.

---

## Phase 6: Polish & Cross-Cutting Concerns

**Purpose**: Responsiveness, error handling, UX refinements, and documentation.

- [X] T037 [P] Audit all new MUI components in `frontend/src/pages/profile/` for responsive breakpoints — verify layout renders correctly on mobile (xs), tablet (sm/md), and desktop (lg)
- [X] T038 [P] Add consistent error boundary / fallback UI to `ProfilePage.jsx` — catch fetch errors and display a MUI `Alert` with retry button
- [X] T039 Add concurrency guard to `PUT /me` handler in `backend/src/profile/controller/profileController.js` — use optimistic locking or `updatedAt` check to detect simultaneous edits from multiple tabs; return 409 Conflict if stale
- [X] T040 [P] Handle network-drop UX in `EditProfileForm.jsx` and `ChangePasswordForm.jsx` — disable submit button while request is in-flight; show error snackbar on network failure with "Try again" action
- [X] T041 Update `backend/README.md` (or top-level `README.md`) with new `/api/profile/*` endpoint documentation, example request/response pairs matching `contracts/api.md`
- [X] T042 Run `quickstart.md` test scenarios manually and verify all acceptance criteria pass; fix any discrepancies found

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: No dependencies — can start immediately
- **Foundational (Phase 2)**: Depends on Phase 1 — **BLOCKS all user stories**
- **US1 (Phase 3)**: Depends on Phase 2 — no dependency on US2 or US3
- **US2 (Phase 4)**: Depends on Phase 2 — builds on US1 backend (extends profileService, avatarService); US1 frontend components updated but remain functional
- **US3 (Phase 5)**: Depends on Phase 2 — extends `getDashboardPayload` from US1; independently testable with seeded farm data
- **Polish (Phase 6)**: Depends on all desired user stories being complete

### User Story Dependencies

| Story | Depends On | Can Parallelize With |
|-------|-----------|----------------------|
| US1 (P1) | Phase 2 complete | — |
| US2 (P2) | Phase 2 complete | US3 (backend only) |
| US3 (P3) | Phase 2 complete | US2 (backend only) |

### Within Each User Story

- Models/DB helpers → Service functions → Controller handlers → Frontend components
- Frontend components marked `[P]` can be built simultaneously by different developers
- Backend service functions within the same story should be built before their controller wires them up

---

## Parallel Execution Examples

### Phase 3 (US1) — Two developers

```
Dev A: T010 → T011 → T012 → T013  (backend: DB → Service → Controller)
Dev B: T014 → T015 → T016         (frontend: ProfilePage → ProfileHeader → Integration)
```

### Phase 4 (US2) — Two developers

```
Dev A: T017 → T018 → T019 → T024 → T025 → T026  (backend: profile update + password)
        └── T020 → T021 → T022 → T023            (backend: avatar service + handlers)
Dev B: T027 || T028 → T029 → T030                (frontend: forms in parallel → integrate)
```

### Phase 5 (US3) — Two developers

```
Dev A: T031 → T032 → T033                         (backend: season logic + aggregation)
Dev B: T034 || T035 → T036                        (frontend: widgets in parallel → integrate)
```

---

## Implementation Strategy

### MVP First (User Story 1 Only)

1. Complete Phase 1: Setup
2. Complete Phase 2: Foundational (**CRITICAL** — blocks all stories)
3. Complete Phase 3: User Story 1
4. **STOP and VALIDATE**: Navigate to `/profile`, confirm real user data renders with correct avatar/placeholder behavior
5. Demo/deploy if ready

### Incremental Delivery

1. Setup + Foundational → skeleton ready
2. User Story 1 → profile view works → **Deploy (MVP!)**
3. User Story 2 → edit, avatar, password change all work → **Deploy**
4. User Story 3 → farm/crop/pest summary + calendar widget → **Deploy**
5. Polish → responsive, error-resilient, documented → **Final Release**

---

## Notes

- `[P]` tasks operate on different files with no blocking dependencies — safe to parallelize
- `[Story]` label maps each task to its user story for traceability against `spec.md`
- No test folders — per plan.md constitution waiver; use `quickstart.md` for manual validation
- Avatar Cloudinary public ID should be stored (e.g., in a separate `avatarPublicId` field on User) so `DELETE /avatar` can call `cloudinary.uploader.destroy(publicId)` cleanly
- Password change: always `bcrypt.hash` with the same cost factor used in registration (check `001` User model or auth service for the salt rounds constant)
- Commit after each checkpoint to keep git history aligned with incremental delivery
