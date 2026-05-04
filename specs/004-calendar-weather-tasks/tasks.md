# Tasks: Calendar & Weather Integration with Task Management (Feature 004)

**Feature**: 004-calendar-weather-tasks  
**Status**: Generated  
**Generated**: May 4, 2026  
**Spec**: [spec.md](spec.md) | **Plan**: [plan.md](plan.md)

## Overview

This document defines all actionable tasks required to implement the Calendar & Weather Integration feature with Task Management. Tasks are organized by dependency and user story priority (P1 first, then P2).

**Scope Summary**:
- 6 user stories (3 P1, 3 P2)
- Backend API + Frontend Components
- MongoDB data persistence
- OpenWeather API integration
- Philippine holiday integration
- No tests in MVP phase (deferred to Phase 3)

**Task Count by Phase**:
- Phase 1 (Setup): 5 tasks
- Phase 2 (Backend Foundations): 8 tasks
- Phase 3 (Frontend - US1): 5 tasks
- Phase 4 (Task Creation - US2): 6 tasks
- Phase 5 (Weather - US3): 5 tasks
- Phase 6 (Task Management - US4, US5): 6 tasks
- Phase 7 (Holiday Integration - US6): 4 tasks
- Phase 8 (Integration & Polish): 4 tasks

**Total: 43 tasks**

---

## Phase 1: Project Setup & Dependencies

*Initialize project structure, install dependencies, configure environment.*

**Phase Goal**: Establish development environment and project scaffolding  
**Independent Test**: Verify project builds, dependencies installed, environment configured  
**Implementation Strategy**: Sequential setup tasks; these must complete before any other work

- [X] T001 Create Task collection schema documentation in `backend/src/models/` directory structure
- [X] T002 Create backend .env.example file with OpenWeather API key, MongoDB connection, and JWT secret placeholders in `backend/`
- [X] T003 Install backend dependencies: express-validator, node-schedule (for task reminders, optional v2), dotenv in `backend/`
- [X] T004 Create frontend environment file template for API base URL in `frontend/`
- [X] T005 Install frontend dependencies: react-calendar, date-holidays, axios in `frontend/`

---

## Phase 2: Backend Foundations

*Establish database models, API services, and middleware for task/weather/holiday operations.*

**Phase Goal**: Create reusable backend services that support all user stories  
**Independent Test**: Verify Task model persists to MongoDB, weather/holiday services return data, JWT middleware protects endpoints  
**Acceptance Criteria**: All backend services work independently; API contracts ready for frontend integration  
**Dependencies**: Requires Phase 1 completion

### Task Model & Persistence

- [X] T006 [P] Create Task Mongoose schema in `backend/src/models/Task.js` with fields: userId, title, description, dueDate, dueTime (optional), completionStatus, createdAt, updatedAt
- [X] T007 [P] Create TaskService in `backend/src/services/taskService.js` with methods: createTask, getTasksByUser, getTasksByDate, updateTask, deleteTask, toggleTaskCompletion
- [X] T008 [P] Create TaskController in `backend/src/controllers/taskController.js` with methods: create, getAll, getByDate, update, delete, toggleCompletion (maps to TaskService)

### Weather Service & API Integration

- [X] T009 [P] Create WeatherService in `backend/src/services/weatherService.js` with methods: getCurrentWeather(latitude, longitude), getForecast(latitude, longitude) using OpenWeather API
- [X] T010 [P] Create WeatherController in `backend/src/controllers/weatherController.js` with methods: getCurrent, getForecast (maps to WeatherService; accepts location params)
- [X] T011 [P] Add OpenWeather API key configuration to `backend/src/config/openweather.js` with error handling for API failures

### Holiday Service & Data Integration

- [X] T012 [P] Create HolidayService in `backend/src/services/holidayService.js` with method: getPhilippineHolidays(year) using date-holidays npm package or static data
- [X] T013 [P] Create HolidayController in `backend/src/controllers/holidayController.js` with method: getHolidaysByYear (maps to HolidayService; includes caching logic)

### API Routes Setup

- [X] T014 Create `/tasks` routes in `backend/src/routes/tasks.js` mapping to TaskController methods (POST, GET, GET/:id, PUT/:id, DELETE/:id)
- [X] T015 Create `/weather` routes in `backend/src/routes/weather.js` mapping to WeatherController methods (GET /current, GET /forecast)
- [X] T016 Create `/holidays` routes in `backend/src/routes/holidays.js` mapping to HolidayController methods (GET /:year)
- [X] T017 Register all routes in `backend/src/server.js` and verify JWT middleware applied to `/tasks` endpoints

---

## Phase 3: Frontend - Calendar View (User Story 1 - P1)

*Implement calendar display with task indicators; foundation for all frontend features.*

**User Story**: US1 - View Calendar with Task Integration (P1)  
**Phase Goal**: Display interactive calendar with task indicators for each day  
**Independent Test**: Navigate to `/calendar` page, verify current month displays, task indicators present  
**Acceptance Criteria**: Calendar renders, task button visible, month navigation works  
**Success Metrics**: Calendar page load <2s (SC-001)  
**Dependencies**: Requires Phase 2 completion

### Calendar Component Structure

- [X] T018 [P] [US1] Create CalendarPage component in `frontend/src/pages/calendar/CalendarPage.jsx` with state for current month, selected day, tasks
- [X] T019 [P] [US1] Create Calendar grid component in `frontend/src/components/Calendar/Calendar.jsx` rendering month view with day cells and navigation
- [X] T020 [P] [US1] Create CalendarDay cell component in `frontend/src/components/Calendar/CalendarDay.jsx` displaying day number, task count/indicator, holiday indicator (if applicable)
- [X] T021 [P] [US1] Create month/year navigation header in `frontend/src/components/Calendar/CalendarHeader.jsx` with previous/next month buttons
- [X] T022 [US1] Connect CalendarPage to useTasks hook and integrate task display logic to show task count/indicator on each day cell

---

## Phase 4: Task Creation & Management (User Story 2 - P1)

*Implement task creation form/modal and API integration.*

**User Story**: US2 - Create a New Task (P1)  
**Phase Goal**: Allow farmers to create tasks for specific calendar days  
**Independent Test**: Click "Add Task", fill form, create task, verify it appears on calendar  
**Acceptance Criteria**: Task form submits, task persists to database, appears on calendar within 1s  
**Success Metrics**: Task creation response <1s (SC-002)  
**Dependencies**: Requires Phase 2, Phase 3 completion

### Task Creation UI Components

- [X] T023 [P] [US2] Create TaskModal component in `frontend/src/components/Task/TaskModal.jsx` handling create/edit modal display with overlay
- [X] T024 [P] [US2] Create TaskForm component in `frontend/src/components/Task/TaskForm.jsx` with fields: title, description, dueDate, dueTime (optional), submit/cancel buttons
- [X] T025 [P] [US2] Create taskService in `frontend/src/services/taskService.js` with methods: createTask, getTasks, updateTask, deleteTask, toggleTask (API calls to backend)

### Task State Management & Integration

- [X] T026 [US2] Create useTasks hook in `frontend/src/hooks/useTasks.js` managing task state: tasks array, loading, error, methods for CRUD operations
- [X] T027 [US2] Integrate TaskModal into CalendarPage: show modal on "Add Task" button click, refresh task list after creation
- [X] T028 [US2] Add "Add Task" button to CalendarPage and connect to TaskModal trigger

---

## Phase 5: Weather Integration (User Story 3 - P1)

*Implement weather display component and API integration.*

**User Story**: US3 - View Weather for Current and Future Days (P1)  
**Phase Goal**: Display current weather and 5-day forecast for user's farm location  
**Independent Test**: Navigate to weather section, verify current conditions and forecast display  
**Acceptance Criteria**: Weather data loads, displays current + forecast, no API errors  
**Success Metrics**: Weather data load <3s (SC-003), holiday data load <1s (SC-010)  
**Dependencies**: Requires Phase 2 completion; can run parallel with Phase 3-4

### Weather Service & Components

- [X] T029 [P] [US3] Create weatherService in `frontend/src/services/weatherService.js` with methods: getCurrentWeather(lat, long), getForecast(lat, long) using backend API
- [X] T030 [P] [US3] Create useWeather hook in `frontend/src/hooks/useWeather.js` managing weather state: current conditions, forecast, loading, error
- [X] T031 [P] [US3] Create WeatherWidget component in `frontend/src/components/Weather/WeatherWidget.jsx` displaying current + forecast
- [X] T032 [P] [US3] Create WeatherCurrent component in `frontend/src/components/Weather/WeatherCurrent.jsx` showing temperature, conditions, humidity, wind speed
- [X] T033 [US3] Create WeatherForecast component in `frontend/src/components/Weather/WeatherForecast.jsx` displaying 5-day forecast cards
- [X] T034 [US3] Add WeatherWidget to CalendarPage header or sidebar; integrate useWeather hook and display current location

---

## Phase 6: Task Management Enhancements (User Stories 4 & 5 - P2)

*Implement task detail view, editing, completion marking, and deletion.*

**User Stories**: US4 - View Tasks for Specific Day (P2), US5 - Edit or Delete Tasks (P2)  
**Phase Goal**: Enable viewing all tasks for a day, editing task details, marking complete, deleting tasks  
**Independent Test**: Click day with tasks, verify all tasks display, edit/delete/toggle completion, confirm persistence  
**Acceptance Criteria**: Day view modal shows all tasks, edit/delete/toggle operations work, changes persist  
**Dependencies**: Requires Phase 2, Phase 4 completion

### Task Detail & Management UI

- [X] T035 [P] [US4, US5] Create TaskList component in `frontend/src/components/Task/TaskList.jsx` displaying all tasks for a selected day
- [X] T036 [P] [US4, US5] Create TaskItem component in `frontend/src/components/Task/TaskItem.jsx` showing task title, time, completion status, edit/delete buttons
- [X] T037 [P] [US4, US5] Enhance TaskModal to support edit mode: pre-populate form with existing task data, update submit handler
- [X] T038 [US4] Create DayTaskView modal in CalendarPage triggered by clicking on a calendar day, displays TaskList for that day
- [X] T039 [US5] Add edit handler to TaskItem: open TaskModal in edit mode with task pre-populated
- [X] T040 [US5] Add delete handler to TaskItem with confirmation dialog; call deleteTask in taskService

### Task Completion Status

- [X] T041 [P] [US4, US5] Add toggleCompletion method to taskService frontend; calls backend toggle endpoint
- [X] T042 [US4, US5] Add completion checkbox/toggle to TaskItem; reflect completion status visually (strikethrough, opacity, checkmark)

---

## Phase 7: Holiday Integration (User Story 6 - P2)

*Display Philippine national holidays on calendar.*

**User Story**: US6 - View Philippine Holidays on Calendar (P2)  
**Phase Goal**: Mark Philippine national holidays on calendar with visual distinction and holiday name display  
**Independent Test**: View calendar, verify holidays marked, hover/click to see holiday names, accuracy check  
**Acceptance Criteria**: All Philippine holidays display, visually distinct, holiday name visible on interaction  
**Success Metrics**: 100% Philippine holiday accuracy (SC-009), load <1s (SC-010)  
**Dependencies**: Requires Phase 2, Phase 3 completion

### Holiday Service & Components

- [X] T043 [P] [US6] Create holidayService in `frontend/src/services/holidayService.js` with method: getHolidays(year) calling backend API
- [X] T044 [P] [US6] Create useHolidays hook in `frontend/src/hooks/useHolidays.js` managing holidays state, caching data
- [X] T045 [US6] Enhance CalendarDay component to detect and display holidays: add visual styling (different color/icon), show holiday name on hover or click
- [X] T046 [US6] Add tooltip/popover to CalendarDay showing holiday name when hovered; integrate with existing task display logic to avoid conflicts

---

## Phase 8: Integration, Testing & Polish

*End-to-end integration, performance validation, UI polish, and error handling.*

**Phase Goal**: Verify all features work together, meet performance targets, handle errors gracefully  
**Independent Test**: Complete full user workflows without errors; verify all success criteria met  
**Acceptance Criteria**: All workflows (create task, view calendar, see weather, manage tasks, view holidays) work end-to-end; error handling in place  
**Performance Targets**: Calendar <2s (SC-001), task creation <1s (SC-002), weather <3s (SC-003), holidays <1s (SC-010)  
**Dependencies**: Requires Phase 3-7 completion

### Integration & End-to-End Workflows

- [X] T047 [P] Create comprehensive error handling for API failures in taskService, weatherService, holidayService (fallback messages, retry logic)
- [X] T048 [P] Implement loading states and spinners in CalendarPage, WeatherWidget, TaskModal for better UX
- [X] T049 Verify task persistence across logout/login: create task, logout, login, confirm task still appears
- [X] T050 Test calendar responsiveness: verify month view adapts to mobile (320px+), tablet (768px+), desktop (1024px+)

### Performance & Optimization

- [X] T051 [P] Add caching for holiday data in frontend (cache by year, TTL 24 hours) to meet <1s load requirement
- [X] T052 [P] Optimize calendar re-render: use React.memo for CalendarDay component, implement useCallback for handlers
- [X] T053 Verify no performance degradation with 100 tasks per user: load test CalendarPage with large dataset, profile rendering
- [X] T054 Verify calendar remains readable with 10 tasks on single day: test UI layout, overflow handling

### UI Polish & Accessibility

- [X] T055 [P] Add ARIA labels and keyboard navigation to calendar: navigate with arrow keys, select date with Enter
- [X] T056 [P] Ensure semantic HTML in all components: use `<table>` for calendar grid, `<button>` for interactive elements, `<form>` for task form
- [X] T057 Add visual feedback for interactions: highlight selected day, show loading spinners, display success/error toast messages
- [X] T058 Review and fix styling: calendar.css, tasks.css, weather.css consistent with existing theme, no broken layouts

---

## Phase 9: Cross-Cutting Concerns & Future Considerations

*Documentation, deployment setup, logging, monitoring.*

**Phase Goal**: Prepare feature for production deployment, document implementation, identify future enhancements  
**Dependencies**: All previous phases

### Documentation

- [X] T059 Create/update quickstart.md with developer setup, API endpoint examples, UI component usage
- [X] T060 Document edge cases in research.md: past-date tasks, multiple tasks on one day, API failures, timezone handling

### Future Enhancements (Out of Scope for v1)

- [ ] T061 [FUTURE] Add task reminders via email/push notifications (requires background job scheduler)
- [ ] T062 [FUTURE] Implement week/day view toggle (currently month view only)
- [ ] T063 [FUTURE] Add task categories/tags and filtering
- [ ] T064 [FUTURE] Implement task recurrence (daily, weekly, monthly)

---

## Dependency Graph & Execution Order

```
Phase 1 (Setup) 
├─→ Phase 2 (Backend Foundations)
    ├─→ Phase 3 (Calendar View - US1)
    │   ├─→ Phase 4 (Task Creation - US2)
    │   │   └─→ Phase 6 (Task Management - US4, US5)
    │   │       └─→ Phase 8 (Integration & Polish)
    │   │           └─→ Phase 9 (Documentation)
    │   ├─→ Phase 5 (Weather - US3) [Can run parallel with Phase 4]
    │   └─→ Phase 7 (Holiday Integration - US6)
    │       └─→ Phase 8 (Integration & Polish)
```

**Critical Path**:
1. Phase 1 → Phase 2 (foundation required)
2. Phase 2 → Phase 3 (calendar needs backend)
3. Phase 3 → Phase 4 → Phase 6 (task features sequential)
4. Phase 2 → Phase 5 (weather independent after Phase 2)
5. Phase 3 → Phase 7 (holidays need calendar)
6. All → Phase 8 (integration final)

---

## Parallel Execution Examples

### By User Story (After Phase 2)
- **Parallel Track 1**: Phase 3 → Phase 4 → Phase 6 (Calendar + Tasks)
- **Parallel Track 2**: Phase 5 (Weather - independent)
- **Parallel Track 3**: Phase 7 (Holidays - after Phase 3)
- **Merge**: Phase 8 Integration & Polish

### Within Phase 2 (Backend)
- T006, T007, T008 (Task model & service) can run parallel
- T009, T010, T011 (Weather service) can run parallel
- T012, T013 (Holiday service) can run parallel
- T014-T017 (Routes) must follow model/controller completion

### Within Phase 3 (Frontend)
- T018, T019, T020, T021 can run parallel (all calendar components)
- T022 depends on T018-T021

### Within Phase 4 (Task Creation)
- T023, T024, T025 (UI + service) can run parallel
- T026 depends on T025
- T027, T028 depend on T026

---

## Success Criteria Mapping

| Success Criteria | Related Tasks | Validation |
|-----------------|---------------|-----------|
| SC-001: Calendar load <2s | T018-T022, T052-T053 | Performance test with 100 tasks |
| SC-002: Task creation <1s | T023-T028, T052 | API response time measurement |
| SC-003: Weather load <3s | T029-T034, T053 | Page load profiling |
| SC-004: Complete workflows in 5 min | T047-T050, T057 | End-to-end workflow test |
| SC-005: 95% task persistence | T049 | Logout/login test |
| SC-006: 100 tasks no degradation | T053 | Load test with large dataset |
| SC-007: Weather accuracy ±1°C | OpenWeather API | Verified against real data |
| SC-008: 10 tasks/day readable | T054 | UI layout test |
| SC-009: 100% holiday accuracy | T043-T046 | Date verification against official source |
| SC-010: Holiday load <1s | T051 | Cache validation |

---

## Implementation Strategy & MVP Scope

### Recommended MVP Approach

**Phase 1 Completion**: Establish baseline environment and dependencies (~1-2 hours)

**Phase 2 Completion**: Build backend services (all CRUD, weather, holiday APIs) (~4-6 hours)

**Phase 3-5 Completion**: Implement core P1 features (Calendar view, task creation, weather display) (~8-10 hours)

**MVP Scope**: Phases 1-5 (US1, US2, US3)
- Users can view calendar
- Users can create/view tasks
- Weather displays on calendar page
- ~13-18 hours total effort

**Phase 6-7 Completion**: Add P2 features (task management enhancements, holidays) (~4-6 hours)

**Phase 8-9 Completion**: Polish, testing, documentation (~4-6 hours)

**Full Feature Completion**: All phases (~25-36 hours total effort)

### Incremental Delivery Checkpoints

1. **After Phase 2**: Backend APIs ready, can be tested with Postman/curl
2. **After Phase 3**: Frontend users see calendar, no functionality yet
3. **After Phase 4**: Core task creation works end-to-end (MVP value achieved)
4. **After Phase 5**: Weather integrated, P1 features complete
5. **After Phase 6-7**: All P2 features added
6. **After Phase 8**: Production-ready with error handling and optimization
7. **After Phase 9**: Documented and ready for next iteration

---

## Task Scheduling & Team Assignment (Suggested)

**Solo Developer Approach** (Sequential):
- Weeks 1-2: Phases 1-2 (Setup + Backend)
- Weeks 3-4: Phases 3-5 (Frontend + Integration)
- Week 5: Phases 6-8 (Enhancements + Polish)

**Team of 2 Approach** (Parallel Tracks):
- **Developer A**: Phase 1 + Phase 2 (Backend) + Phase 8-9 (Integration)
- **Developer B**: Phase 3-7 (Frontend) in parallel

**Team of 3 Approach** (Highly Parallel):
- **Developer A**: Phase 1 + Phase 2 (Backend setup)
- **Developer B**: Phase 3 + Phase 4 + Phase 6 (Calendar + Tasks)
- **Developer C**: Phase 5 + Phase 7 (Weather + Holidays)
- **Merge**: Phase 8-9 (Collaborative)

---

## Notes & Assumptions

- All tasks assume existing project dependencies are installed and properly configured
- OpenWeather API free tier key must be added to `.env` before Phase 5
- Philippine holiday data sourced from `date-holidays` npm package or manually maintained
- All frontend components use React hooks and functional components (no class components)
- Backend middleware and authentication reuse existing JWT middleware
- No database schema migrations required (new Task collection, Holiday reference)
- Timezone handling defaults to user's browser timezone (display only, actual storage in UTC)
- Tasks created for past dates are allowed but can be visually distinguished in Phase 8 polish
