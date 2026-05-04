---
description: "Task list for Crops Directory & Farm Integration"
---

# Tasks: Crops Directory & Farm Integration

**Input**: Design documents from `/specs/003-crops-directory/`
**Prerequisites**: plan.md, spec.md, research.md, data-model.md, contracts/api.md

**Organization**: Tasks are grouped by user story to enable independent implementation and testing of each story.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel (different files, no dependencies)
- **[Story]**: Which user story this task belongs to (e.g., US1, US2, US3)
- Include exact file paths in descriptions

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Project initialization and basic structure

- [X] T001 Update seed data in `backend/src/seeds/crops.seed.js` with new crop fields (`type`, `farmingTips`, `marketPrice`, `endProducts`)
- [X] T002 Create frontend components directory `frontend/src/pages/crops/`

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Core infrastructure that MUST be complete before ANY user story can be implemented

**⚠️ CRITICAL**: No user story work can begin until this phase is complete

- [X] T003 Extend `Crop` model in `backend/src/models/Crop.js` with new fields (`type`, `farmingTips`, `marketPrice`, `endProducts`)
- [X] T004 Extend `Farm` model in `backend/src/models/Farm.js` with `plantedCrops` subdocument schema
- [X] T005 [P] Register the `/crops` route in `frontend/src/App.jsx` pointing to a placeholder component

**Checkpoint**: Foundation ready - user story implementation can now begin in parallel

---

## Phase 3: User Story 1 - Browse Seasonal Crops (Priority: P1) 🎯 MVP

**Goal**: Farmers can view an interactive directory of localized crops tailored to the current weather season.

**Independent Test**: Navigate to `/crops`, verify the top "Most Recommended Crop" matches the current season, and browse the grid of other viable crops.

### Implementation for User Story 1

- [X] T006 [P] [US1] Create `frontend/src/pages/crops/CropHero.jsx` UI component for the top recommended crop
- [X] T007 [P] [US1] Create `frontend/src/pages/crops/CropGrid.jsx` UI component to display other seasonal crops
- [X] T008 [US1] Implement `frontend/src/pages/crops/CropsPage.jsx` shell component to fetch crops from `/api/crops`, filter the hero crop, and pass the rest to the grid
- [X] T009 [US1] Update `backend/src/controllers/cropsController.js` if necessary to ensure new fields are included in the `GET /api/crops` response

**Checkpoint**: At this point, User Story 1 should be fully functional and testable independently

---

## Phase 4: User Story 2 - View Crop Details (Priority: P1)

**Goal**: Farmers can click on any crop to view comprehensive details in a modal.

**Independent Test**: Click a crop card in the directory and verify the modal displays all required data points.

### Implementation for User Story 2

- [X] T010 [P] [US2] Create `frontend/src/pages/crops/CropModal.jsx` MUI Dialog displaying summary, type, grow time, tips, price, and end-products
- [X] T011 [US2] Integrate `CropModal.jsx` into `CropsPage.jsx` to open on clicks from `CropHero` or `CropGrid`

**Checkpoint**: At this point, User Stories 1 AND 2 should both work independently

---

## Phase 5: User Story 3 - Add Crop to "My Farm" (Priority: P2)

**Goal**: Farmers can easily track what they are currently planting by adding a crop directly from the detail modal to their "My Farm" module.

**Independent Test**: Open a crop modal, click "Add to My Farm", provide a date, and verify the crop and planting date are linked to the user's farm.

### Implementation for User Story 3

- [X] T012 [P] [US3] Implement `POST /api/farm/:id/crops` route in `backend/src/routes/farm.js`
- [X] T013 [P] [US3] Implement controller logic for `POST /api/farm/:id/crops` in `backend/src/controllers/farmController.js` to push to `plantedCrops`
- [X] T014 [US3] Add "Add to My Farm" CTA and date picker to `CropModal.jsx`, handling farm selection by fetching `GET /api/farm`
- [X] T015 [US3] Wire up the Axios `POST` request in `CropModal.jsx` when submitting the date picker form, with success/error handling
- [X] T016 [US3] Update `backend/src/profile/service/profileService.js` to map `plantedCrops` alongside the existing `crops` logic for backward compatibility in dashboard aggregations

**Checkpoint**: All user stories should now be independently functional

---

## Phase 6: User Story 4 - Global Sticky Navigation (Priority: P3)

**Goal**: Users can easily navigate the application from any page without having to scroll back to the top.

**Independent Test**: Scroll down a long page (like the crop directory grid) and verify the navigation bar remains pinned to the top.

### Implementation for User Story 4

- [X] T017 [US4] Update `frontend/src/components/layout/Navbar.jsx` (or active Header) to use MUI `position="sticky"` and ensure a high `z-index`

---

## Phase 7: Polish & Cross-Cutting Concerns

**Purpose**: Improvements that affect multiple user stories

- [X] T018 [P] Audit all new components in `frontend/src/pages/crops/` for responsive breakpoints
- [X] T019 Update `README.md` (or equivalent API docs) with `POST /api/farm/:id/crops` endpoint documentation
- [X] T020 Run `quickstart.md` test scenarios manually and verify all acceptance criteria pass

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: No dependencies - can start immediately
- **Foundational (Phase 2)**: Depends on Setup completion - BLOCKS all user stories
- **User Stories (Phase 3+)**: All depend on Foundational phase completion
  - User stories can then proceed in parallel (if staffed)
  - Or sequentially in priority order (P1 → P2 → P3)
- **Polish (Final Phase)**: Depends on all desired user stories being complete

### User Story Dependencies

- **User Story 1 (P1)**: Can start after Foundational (Phase 2) - No dependencies on other stories
- **User Story 2 (P1)**: Can start after Foundational (Phase 2) - Best implemented after US1 is done, since it requires the grid/hero to click on.
- **User Story 3 (P2)**: Can start after US2 - Extends the modal built in US2.
- **User Story 4 (P3)**: Can start anytime after Setup - Completely independent global UI change.

### Parallel Opportunities

- All Setup tasks marked [P] can run in parallel
- All Foundational tasks marked [P] can run in parallel (within Phase 2)
- Models within a story marked [P] can run in parallel
- Different user stories can be worked on in parallel by different team members

---

## Parallel Example: User Story 1

```bash
# Launch UI components for User Story 1 together:
Task: "Create frontend/src/pages/crops/CropHero.jsx UI component"
Task: "Create frontend/src/pages/crops/CropGrid.jsx UI component"
```

---

## Implementation Strategy

### MVP First (User Story 1 Only)

1. Complete Phase 1: Setup
2. Complete Phase 2: Foundational (CRITICAL - blocks all stories)
3. Complete Phase 3: User Story 1
4. **STOP and VALIDATE**: Test User Story 1 independently
5. Deploy/demo if ready

### Incremental Delivery

1. Complete Setup + Foundational → Foundation ready
2. Add User Story 1 → Test independently → Deploy/Demo (MVP!)
3. Add User Story 2 → Test independently → Deploy/Demo
4. Add User Story 3 → Test independently → Deploy/Demo
5. Each story adds value without breaking previous stories
