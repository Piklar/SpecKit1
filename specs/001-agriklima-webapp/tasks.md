---
description: "Task list template for feature implementation"
---

# Tasks: AgriKlima Agricultural Decision-Support Web Application

**Input**: Design documents from `/specs/001-agriklima-webapp/`
**Prerequisites**: plan.md (required), spec.md (required for user stories), research.md, data-model.md, contracts/

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel (different files, no dependencies)
- **[Story]**: Which user story this task belongs to (e.g., US1, US2, US3)

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Project initialization and basic structure

- [X] T001 Initialize backend Node.js/Express project and install dependencies in `backend/`
- [X] T002 Initialize frontend React/Vite project and install dependencies in `frontend/`
- [X] T003 [P] Configure ESLint, Prettier, and Jest for backend
- [X] T004 [P] Configure ESLint, Prettier, and Vitest/RTL for frontend

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Core infrastructure that MUST be complete before ANY user story can be implemented

- [X] T005 Setup MongoDB connection in `backend/src/config/database.js`
- [X] T006 [P] Implement authentication/authorization middleware in `backend/src/middleware/authenticateJWT.js`
- [X] T007 [P] Setup base API routing and error handling in `backend/src/server.js` and `backend/src/middleware/errorHandler.js`
- [X] T008 [P] Configure Cloudinary integration in `backend/src/config/cloudinary.js`
- [X] T009 Setup MUI theme and global responsive styles in `frontend/src/styles/theme.js`
- [X] T010 Setup React Router in `frontend/src/App.jsx`
- [X] T011 [P] Create base Axios API service in `frontend/src/services/api.js`

**Checkpoint**: Foundation ready - user story implementation can now begin in parallel

---

## Phase 3: User Story 1 - Farmer Authentication & Dashboard Access (Priority: P1) 🎯 MVP

**Goal**: A farmer must be able to authenticate into AgriKlima, manage sessions (including logout and timeout), and access a personalized dashboard.

### Tests for User Story 1
- [X] T012 [P] [US1] Write unit tests for authService in `backend/tests/unit/authService.test.js`
- [X] T013 [P] [US1] Write contract tests for auth endpoints in `backend/tests/contract/auth-contract.test.js`
- [X] T014 [P] [US1] Write frontend unit tests for LoginForm in `frontend/tests/unit/components/LoginForm.test.jsx`

### Implementation for User Story 1
- [X] T015 [P] [US1] Create User model in `backend/src/models/User.js`
- [X] T016 [US1] Implement auth service (bcrypt, JWT) in `backend/src/services/authService.js`
- [X] T017 [US1] Implement auth controllers (register, login, logout) in `backend/src/controllers/authController.js`
- [X] T018 [US1] Setup auth routes in `backend/src/routes/auth.js`
- [X] T019 [P] [US1] Create AuthContext (with 30-min idle timeout) in `frontend/src/contexts/AuthContext.jsx`
- [X] T020 [US1] Implement LoginForm and RegisterForm in `frontend/src/components/Form/LoginForm.jsx` and `RegisterForm.jsx`
- [X] T021 [US1] Create LoginPage and RegisterPage in `frontend/src/pages/auth/`
- [X] T022 [US1] Build Main Dashboard layout in `frontend/src/pages/dashboard/Dashboard.jsx`

---

## Phase 4: User Story 2 - Localized Weather Information (Priority: P1)

**Goal**: Provide real-time, location-specific weather data for Pampanga.

### Tests for User Story 2
- [X] T023 [P] [US2] Write unit tests for weatherService in `backend/tests/unit/weatherService.test.js`
- [X] T024 [P] [US2] Write frontend unit tests for WeatherCard in `frontend/tests/unit/components/WeatherCard.test.jsx`

### Implementation for User Story 2
- [X] T025 [P] [US2] Create Weather model in `backend/src/models/Weather.js`
- [X] T026 [US2] Implement weather API integration and hourly cron caching in `backend/src/services/weatherService.js`
- [X] T027 [US2] Create weather controller and route in `backend/src/controllers/weatherController.js` and `backend/src/routes/weather.js`
- [X] T028 [P] [US2] Implement useWeather hook in `frontend/src/hooks/useWeather.js`
- [X] T029 [US2] Build WeatherCard component in `frontend/src/components/Cards/WeatherCard.jsx`
- [X] T030 [US2] Create WeatherPage in `frontend/src/pages/weather/WeatherPage.jsx`

---

## Phase 5: User Story 3 - Seasonal Crop Recommendations (Priority: P1)

**Goal**: Display recommended crops for the current season in Pampanga with specific growing requirements.

### Tests for User Story 3
- [X] T031 [P] [US3] Write contract tests for crops endpoints in `backend/tests/contract/crops-contract.test.js`
- [X] T032 [P] [US3] Write unit tests for crop filtering in `backend/tests/unit/cropsController.test.js`

### Implementation for User Story 3
- [X] T033 [P] [US3] Create Crop model in `backend/src/models/Crop.js`
- [X] T034 [US3] Create crop seed data for Pampanga in `backend/src/seeds/crops.seed.js`
- [X] T035 [US3] Implement cropsController and routing in `backend/src/controllers/cropsController.js` and `backend/src/routes/crops.js`
- [X] T036 [P] [US3] Create useCrops hook in `frontend/src/hooks/useCrops.js`
- [X] T037 [US3] Build CropCard component in `frontend/src/components/Cards/CropCard.jsx`
- [X] T038 [US3] Create CropsPage and CropDetail in `frontend/src/pages/crops/CropsPage.jsx` and `CropDetail.jsx`

---

## Phase 6: User Story 4 - Pest Identification & Mitigation (Priority: P2)

**Goal**: Allow farmers to identify pests and view mitigation strategies specific to Pampanga.

### Tests for User Story 4
- [X] T039 [P] [US4] Write unit tests for PestsPage rendering in `frontend/tests/unit/pages/PestsPage.test.jsx`

### Implementation for User Story 4
- [X] T040 [P] [US4] Create Pest model in `backend/src/models/Pest.js`
- [X] T041 [US4] Implement pestsController and routing in `backend/src/controllers/pestsController.js` and `backend/src/routes/pests.js`
- [X] T042 [P] [US4] Create usePests hook in `frontend/src/hooks/usePests.js`
- [X] T043 [US4] Create PestsPage and PestDetail in `frontend/src/pages/pests/PestsPage.jsx` and `PestDetail.jsx`

---

## Phase 7: User Story 5 - My Farm Tracking (Priority: P2)

**Goal**: Enable farmers to record and manage their personal farm details, including tracked crops.

### Tests for User Story 5
- [X] T044 [P] [US5] Write contract tests for farm endpoints in `backend/tests/contract/farm-contract.test.js`
- [X] T045 [P] [US5] Write unit tests for FarmContext in `frontend/tests/unit/contexts/FarmContext.test.jsx`

### Implementation for User Story 5
- [X] T046 [P] [US5] Create Farm model in `backend/src/models/Farm.js` (linked to User and Crop)
- [X] T047 [US5] Implement farmController for CRUD operations in `backend/src/controllers/farmController.js`
- [X] T048 [US5] Setup farm routing in `backend/src/routes/farm.js`
- [X] T049 [P] [US5] Create FarmContext to manage active farm state in `frontend/src/contexts/FarmContext.jsx`
- [X] T050 [US5] Build AddFarmForm component in `frontend/src/pages/farm/AddFarmForm.jsx`
- [X] T051 [US5] Create MyFarmPage dashboard in `frontend/src/pages/farm/MyFarmPage.jsx`

---

## Phase 8: User Story 6 - Interactive Seasonal Calendar (Priority: P2)

**Goal**: Provide a visual calendar of planting, maintenance, and harvesting windows.

### Implementation for User Story 6
- [X] T052 [P] [US6] Create CalendarEvent model in `backend/src/models/CalendarEvent.js`
- [X] T053 [US6] Implement calendarController and routing in `backend/src/controllers/calendarController.js` and `backend/src/routes/calendar.js`
- [X] T054 [P] [US6] Build reusable Calendar component (MUI DateCalendar or similar) in `frontend/src/components/Common/CalendarView.jsx`
- [X] T055 [US6] Create CalendarPage to render seasonal events in `frontend/src/pages/calendar/CalendarPage.jsx`

---

## Phase 9: User Story 7 - Agricultural News Feed (Priority: P3)

**Goal**: Display local agricultural news and advisories for Pampanga.

### Implementation for User Story 7
- [X] T056 [P] [US7] Create NewsArticle model in `backend/src/models/NewsArticle.js`
- [X] T057 [US7] Implement newsController and routing in `backend/src/controllers/newsController.js` and `backend/src/routes/news.js`
- [X] T058 [US7] Create NewsPage to display the news feed in `frontend/src/pages/news/NewsPage.jsx`

---

## Phase 10: User Story 8 - About Us (Priority: P3)

**Goal**: Display project information and support details.

### Implementation for User Story 8
- [X] T059 [P] [US8] Create AboutPage in `frontend/src/pages/about/AboutPage.jsx`

---

## Phase 11: Polish & Cross-Cutting Concerns

**Purpose**: Improvements that affect multiple user stories, ensuring constitution alignment.

- [X] T060 [P] Run and fix all backend unit tests to ensure >=80% coverage
- [X] T061 [P] Run and fix all frontend unit tests to ensure >=80% coverage
- [X] T062 Validate responsive design across xs, sm, md, lg breakpoints using DevTools
- [X] T063 Run automated accessibility checks (axe-core or similar) for WCAG 2.1 AA compliance
- [X] T064 Add caching headers to API responses where appropriate
- [X] T065 Documentation updates in `README.md` and API docs
