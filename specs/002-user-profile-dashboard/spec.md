# Feature Specification: User Profile Dashboard

**Feature Branch**: `002-user-profile-dashboard`  
**Created**: 2026-04-29  
**Status**: Active  
**Input**: User description: "User Profile Dashboard"

## User Scenarios & Testing *(mandatory)*

### User Story 1 - View Profile Information (Priority: P1)

As an authenticated user, I want to view my profile dashboard so that I can see my current information (name, email, role, avatar) and account status.

**Why this priority**: Viewing the profile is the most fundamental part of a profile dashboard and a prerequisite for editing.

**Independent Test**: Can be fully tested by navigating to the dashboard and verifying that the correct user data is displayed on screen.

**Acceptance Scenarios**:

1. **Given** the user is logged in, **When** they navigate to the profile dashboard, **Then** they see their basic information correctly populated.
2. **Given** the user has no avatar set, **When** they view the dashboard, **Then** a default placeholder avatar is shown.

---

### User Story 2 - Edit Profile Details (Priority: P2)

As a user, I want to edit my profile details so that my information remains accurate and up-to-date.

**Why this priority**: Users need the ability to correct or update their personal information.

**Independent Test**: Can be tested by changing a field (like name) and saving, then verifying the new value is persisted.

**Acceptance Scenarios**:

1. **Given** the user is on the profile dashboard, **When** they click "Edit" and change their name, **Then** the new name is saved and displayed.
2. **Given** the user enters invalid data (e.g., empty name), **When** they attempt to save, **Then** an appropriate error message is shown and the changes are not saved.

---

### User Story 3 - View Recent Activity / Metrics (Priority: P3)

As a user, I want to see a summary of my recent activity or relevant metrics on my dashboard so that I can track my usage.

**Why this priority**: A dashboard typically aggregates data; this adds value beyond basic profile management.

**Independent Test**: Can be tested by performing actions in the app and verifying they appear on the dashboard.

**Acceptance Scenarios**:

1. **Given** the user has farms linked to their account, **When** they view the dashboard, **Then** they see a summary of their farms, active crops by season, and prevalent pests that could affect those crops.
2. **Given** the user has no farms linked, **When** they view the dashboard, **Then** they should be able to see crops that they can farm and news about farming. Also has a prompt to add a farm. 

### Edge Cases

- Avatar upload: Files exceeding **2 MB** or non-image formats (anything other than JPEG, PNG, WebP) must be rejected with a clear error message before upload.
- How does the system handle concurrent edits if the user has the profile open in multiple tabs?
- What happens if the network connection drops while saving profile changes?

## Requirements *(mandatory)*

- **R-001**: System MUST implement the Profile Dashboard as a protected route, accessible only to authenticated users.
- **R-002**: Dashboard should display tasks that the user has inputted to be done in their calendar

### Functional Requirements

- **FR-001**: System MUST allow authenticated users to view their profile information.
- **FR-002**: System MUST allow users to update their personal details (e.g., Name, Municipality).
- **FR-003**: System MUST allow users to upload, change, or remove their profile picture/avatar. Uploads are limited to **2 MB** and must be JPEG, PNG, or WebP format. Files are stored via Cloudinary (credentials provided via `.env`).
- **FR-004**: System MUST display a farm & crop summary on the dashboard: number of linked farms, active crops by current season, and prevalent pests that could affect those crops (sourced from the Pest model filtered by the user's linked crops).
- **FR-005**: System MUST validate all user inputs before saving. Password must meet the following policy: minimum 8 characters, at least 1 uppercase letter, and at least 1 special character. Avatar uploads are rejected if they exceed 2 MB or are not a supported image type.
- **FR-006**: System MUST include an inline password change section within the profile dashboard page. The section requires the user to enter their current password for verification before setting a new one.

### Key Entities *(include if feature involves data)*

- **UserProfile**: Represents the user's display data (Name, Email, Avatar URL, Default Municipality).
- **UserActivity**: Represents the farm/crop/pest summary data aggregated for dashboard display:
  - Linked farms count
  - Active crops (filtered by current season)
  - Prevalent pests (filtered by crops on the user's farms)

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: Users can successfully view and update their profile details in under 1 minute.
- **SC-002**: Profile image uploads complete in under 3 seconds on a standard broadband connection.
- **SC-003**: Form validation errors are displayed immediately, preventing 100% of invalid data submissions.
- **SC-004**: Dashboard loads and renders user data within 1 second.

## Assumptions

- Users are already authenticated and a session mechanism (JWT) is in place.
- Image uploads will be handled by Cloudinary. API keys (`CLOUDINARY_CLOUD_NAME`, `CLOUDINARY_API_KEY`, `CLOUDINARY_API_SECRET`) will be provided by the user via `.env` and are not hardcoded.
- Mobile responsiveness is required for the dashboard layout.
- If a user changes their email, a separate email verification flow might be triggered (assumed standard behavior).

## Architecture Notes

- **Backend folder structure**: Separate folders for `db/` (Mongoose models), `service/` (business logic), and `controller/` (route handlers). No test folders.
- **Password validation** is enforced both on the frontend (real-time feedback) and backend (regex on the service layer).

## Clarifications

### Session 2026-04-29

- Q: Where does the password change form live? → A: Inline section within the profile dashboard page.
- Q: Password policy requirements? → A: Min 8 characters, 1 uppercase, 1 special character (from user input).
- Q: Backend folder structure? → A: Separate `db/`, `service/`, `controller/` folders; no test folders.
- Q: What data appears in the activity/metrics section? → A: Farm & crop summary (linked farms, active crops by season) plus prevalent pests for those crops.
- Q: Avatar upload constraints? → A: Max 2 MB, JPEG/PNG/WebP only. Cloudinary API keys supplied via `.env`.
