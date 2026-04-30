# Research: User Profile Dashboard (002)

## R1 — Password Validation Strategy

**Decision**: Dual-layer validation — frontend (real-time regex feedback) + backend (service layer enforcement).

**Rationale**: Frontend validation gives immediate user feedback (UX). Backend enforcement is the true security gate since clients can bypass frontend rules. Regex pattern: `/^(?=.*[A-Z])(?=.*[!@#$%^&*])(?=.{8,})/`.

**Alternatives considered**:
- Frontend-only: Rejected — insecure, bypassable via direct API calls.
- Backend-only: Rejected — poor UX, no real-time feedback.

---

## R2 — Avatar Upload Strategy (Cloudinary via Multer)

**Decision**: Use `multer` (with `multer-storage-cloudinary`) as Express middleware for file parsing and Cloudinary for cloud storage.

**Rationale**: Cloudinary is already configured in the existing 001 backend. `multer` is the industry standard for Express multipart form handling. The 2 MB limit and JPEG/PNG/WebP type-checking are enforced at the multer middleware level before upload, reducing wasted bandwidth.

**Alternatives considered**:
- Base64 encoding: Rejected — 33% payload overhead, not suited for image uploads.
- Direct browser-to-Cloudinary upload: Deferred — would expose API secrets on the client without signed upload implementation.

---

## R3 — Dashboard Aggregation Strategy (Farm / Crop / Pest)

**Decision**: Server-side aggregation — a `/api/profile/dashboard` endpoint computes farm count, active crops (by current month/season), and prevalent pests (linked to those crops) in a single response.

**Rationale**: Avoids multiple client-side API calls. The `Farm`, `Crop`, and `Pest` models from 001 are already available. The current season is derived server-side from the current month (Philippines: wet season May–October, dry season November–April).

**Alternatives considered**:
- Multiple client-side calls to `/api/farm`, `/api/crops`, `/api/pests`: Rejected — increases latency, complicates loading state management.

---

## R4 — Calendar Tasks Display

**Decision**: Fetch upcoming `CalendarEvent` documents owned by or relevant to the authenticated user from the existing `/api/calendar` endpoint, displayed as a widget on the profile dashboard.

**Rationale**: `CalendarEvent` model already exists. Showing upcoming tasks (next 30 days) gives actionable agricultural reminders without adding new infrastructure.

**Alternatives considered**:
- External calendar integration (Google Calendar): Deferred — out of scope for this phase.

---

## R5 — Backend Folder Structure

**Decision**: Within `backend/src/`, introduce a new `user/` domain folder with three subfolders: `db/` (Mongoose models/queries), `service/` (business logic), and `controller/` (HTTP handlers). No test folders per user instruction.

**Rationale**: Aligns with user-specified architecture from clarification session. Clean separation of concerns; controller stays thin (HTTP only), service holds validation/business rules, db layer handles Mongoose operations.

**Existing code compatibility**: The existing `001` files in `models/`, `services/`, `controllers/` remain unchanged. New `002` code follows the new domain-folder pattern.

---

## R6 — Protected Route Guard

**Decision**: Reuse the existing `authenticateJWT` middleware for all `/api/profile/*` routes.

**Rationale**: Middleware already implemented and proven in 001. No new auth infrastructure needed.

---

## R7 — Empty State (No Farms Linked)

**Decision**: When no farms are linked, show: (1) a curated list of crops appropriate for the current season (from `/api/crops?season=current`), (2) the latest 3 news items from `/api/news`, and (3) an "Add Farm" CTA button.

**Rationale**: Matches user-specified behavior in spec acceptance scenario 2. Leverages existing APIs.
