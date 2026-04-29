# Implementation Plan: AgriKlima Agricultural Decision-Support Web Application

**Branch**: `001-agriklima-system` | **Date**: 2026-04-29 | **Spec**: [spec.md](spec.md)

---

## Summary

AgriKlima is a localized agricultural information web application serving farmers in Pampanga, Philippines. Using a MERN stack (MongoDB + Express + React + Node.js), it provides real-time weather data, crop recommendations, pest identification, and seasonal planning tools. The system prioritizes mobile-first responsiveness (per Constitution III) and strict TDD practices (per Constitution II) with 80%+ test coverage. All data is geographically scoped to Pampanga municipalities only.

**Primary Value Proposition**: Farmers in Pampanga access actionable, localized agricultural data through a single, responsive web application, reducing crop loss from pest infestations, weather mismanagement, and poor crop selection.

---

## Technical Context

**Language/Version**: JavaScript (Node.js ^18.0.0, npm ^9.0.0); React ^19.1.1  
**Primary Dependencies**: 
- Frontend: React, Vite (^7.1.2), React Router (^7.8.1), Material-UI (^7.3.1), Axios (^1.11.0)
- Backend: Express (^5.1.0), MongoDB + Mongoose (^8.17.1), JWT (^9.0.2), bcryptjs (^3.0.2), Cloudinary (^2.7.0)

**Storage**: MongoDB (cloud via Atlas or local instance)  
**Testing**: Jest + React Testing Library (frontend); Jest + Supertest (backend); 80%+ coverage required per Constitution II  
**Target Platform**: Web browser, mobile-first (iOS Safari, Android Chrome); responsive desktop support  
**Project Type**: Web-service (SPA + REST API)  
**Performance Goals**:
- First Contentful Paint (FCP): ≤2.5s on 4G
- Time to Interactive (TTI): ≤5s on 4G
- API response time: <200ms p95

**Constraints**:
- Geographic scope: Pampanga municipalities ONLY (16 municipalities)
- Authentication: JWT stateless (24-hour expiry, refresh token support)
- Accessibility: WCAG 2.1 AA compliance required (Constitution III)
- Responsive breakpoints: xs (mobile), sm, md, lg, xl (per MUI standards)

**Scale/Scope**: 
- Initial: 1-5k registered farmers (v1 MVP)
- Scalability path: Horizontal scaling via stateless architecture
- Data: ~12 reference crops, ~20 pests, 16 municipalities weather + news feed

---

## Constitution Check

**GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.**

### ✅ Constitution I: Clean Code (NON-NEGOTIABLE)

**Requirement**: All code follows readable, maintainable patterns; complexity monitored; code reviews verify adherence.

**Architecture Compliance**:
- Modular structure: Frontend (components/, pages/, services/); Backend (controllers/, models/, routes/, services/)
- Separation of concerns: UI components isolated from business logic (services layer)
- Code review process: Every PR requires ≥1 approval; reviewers verify readability and documentation
- Complexity tracking: Cyclomatic complexity via ESLint plugins; methods <40 LOC by default

**Evidence in Plan**: [research.md](research.md) Section 5 (State Management) describes modular Context API + hooks; [quickstart.md](quickstart.md) documents folder structure and code organization.

✅ **PASSED** — Architecture enables clean code practices; code review gates established.

---

### ✅ Constitution II: Strict Testing Standards (NON-NEGOTIABLE)

**Requirement**: TDD mandatory; 80%+ code coverage; integration tests verify workflows.

**Architecture Compliance**:
- Test pyramid: Unit tests (50%), Integration tests (35%), Contract tests (10%)
- TDD workflow: Write test (red) → Implement (green) → Refactor
- Coverage gates: PRs fail if coverage <80% or tests fail
- Test organization: tests/unit/, tests/integration/, tests/contract/ per project

**Evidence in Plan**: [research.md](research.md) Section 4 (Testing Strategy) details layered testing approach; [contracts/](contracts/) defines API contracts for test-driven verification; [quickstart.md](quickstart.md) provides testing commands and coverage validation.

**Testing Layers Defined**:
- **Unit Tests**: Component logic, hooks, utility functions (Jest + React Testing Library frontend; Jest backend)
- **Integration Tests**: User workflows, service interactions, database queries
- **Contract Tests**: API response shapes, error formats, authentication flows

✅ **PASSED** — Testing strategy enables 80%+ coverage; TDD-ready design; contract validation in place.

---

### ✅ Constitution III: Responsive UI (NON-NEGOTIABLE)

**Requirement**: Multi-viewport support (desktop/tablet/mobile); WCAG 2.1 AA accessibility; responsive performance.

**Architecture Compliance**:
- Responsive framework: Material-UI (v7.3.1) with built-in responsive components and breakpoints
- Mobile-first approach: xs (mobile), sm, md, lg, xl breakpoints; primary focus on mobile
- Accessibility: MUI components WCAG 2.1 AA compliant; focus management, keyboard navigation, alt text required
- Performance: Lazy loading, component virtualization, optimized bundle size

**Evidence in Plan**: [research.md](research.md) Section 3 (Responsive UI Implementation) covers MUI breakpoints, WCAG compliance, performance targets; [data-model.md](data-model.md) includes imageUrl fields for accessible media; [quickstart.md](quickstart.md) Section "Responsive Design" provides testing guidance.

**Success Criteria** (from spec.md):
- SC-004: ≤2s main dashboard load on 4G
- SC-005: 95% of farmers can access 3+ modules on first use without documentation
- SC-008: WCAG 2.1 AA compliance verified before UI merge

✅ **PASSED** — Responsive UI architecture in place; accessibility requirements integrated; performance targets defined.

---

### Constitution Re-Check Post-Phase 1

**Scheduled**: After data-model.md, contracts/, and agent context are finalized.

---

## Project Structure

### Documentation (this feature)

```text
specs/001-agriklima-webapp/
├── spec.md                   # Feature specification (8 user stories, requirements)
├── plan.md                   # This file — Implementation plan & architecture
├── research.md               # Phase 0: Research findings, decision rationale
├── data-model.md             # Phase 1: Entity definitions, Mongoose schemas, ERD
├── quickstart.md             # Phase 1: Local dev setup, troubleshooting
├── contracts/                # Phase 1: API endpoint specifications
│   ├── auth-contract.md
│   ├── weather-contract.md
│   ├── crops-contract.md
│   ├── pests-contract.md
│   └── farm-contract.md
├── checklists/
│   └── requirements.md       # Quality validation checklist
└── tasks.md                  # Phase 2 (generated by /speckit.tasks)
```

### Source Code Repository

```text
agriklima/
├── backend/                           # Express + Node.js (Port 3000)
│   ├── src/
│   │   ├── config/
│   │   │   ├── database.js            # MongoDB connection (Mongoose)
│   │   │   ├── environment.js         # Load .env variables
│   │   │   └── cloudinary.js          # Cloudinary SDK config
│   │   ├── models/
│   │   │   ├── User.js                # User schema + methods
│   │   │   ├── Farm.js                # Farm schema + relationships
│   │   │   ├── Crop.js                # Crop reference schema
│   │   │   ├── Pest.js                # Pest reference schema
│   │   │   ├── Weather.js             # Weather (current + forecast)
│   │   │   ├── NewsArticle.js         # News feed schema
│   │   │   └── CalendarEvent.js       # Seasonal calendar schema
│   │   ├── routes/
│   │   │   ├── auth.js                # POST /register, /login, /refresh
│   │   │   ├── weather.js             # GET /weather/:municipality
│   │   │   ├── crops.js               # GET /crops, /crops/:id
│   │   │   ├── pests.js               # GET /pests, /pests/:id
│   │   │   ├── farm.js                # CRUD /farm operations
│   │   │   ├── news.js                # GET /news (optional Phase 2)
│   │   │   └── calendar.js            # GET /calendar (optional Phase 2)
│   │   ├── controllers/
│   │   │   ├── authController.js      # Auth logic (register, login, refresh)
│   │   │   ├── weatherController.js   # Fetch weather, validate municipality
│   │   │   ├── cropsController.js     # Crop queries, filtering
│   │   │   ├── pestsController.js     # Pest queries, mitigation lookup
│   │   │   ├── farmController.js      # Farm CRUD, observations, crops
│   │   │   ├── newsController.js      # News feed retrieval
│   │   │   └── calendarController.js  # Calendar event queries
│   │   ├── middleware/
│   │   │   ├── authenticateJWT.js     # JWT verification
│   │   │   ├── validateMunicipality.js # Pampanga whitelist check
│   │   │   ├── corsConfig.js          # CORS middleware (frontend origin)
│   │   │   ├── errorHandler.js        # Standardized error responses
│   │   │   └── multer.js              # Image upload (Cloudinary)
│   │   ├── services/
│   │   │   ├── weatherService.js      # External weather API calls, caching
│   │   │   ├── cloudinaryService.js   # Image upload/storage
│   │   │   └── authService.js         # bcryptjs hashing, JWT generation
│   │   ├── utils/
│   │   │   ├── validators.js          # Input validation (email, password)
│   │   │   ├── constants.js           # Pampanga municipalities, enums
│   │   │   └── logger.js              # Structured logging
│   │   ├── seeds/
│   │   │   ├── crops.seed.js          # Reference crop data
│   │   │   ├── pests.seed.js          # Reference pest data
│   │   │   └── calendar.seed.js       # Seasonal calendar events
│   │   └── server.js                  # Express app setup, middleware chain
│   ├── tests/
│   │   ├── unit/
│   │   │   ├── authService.test.js
│   │   │   ├── validators.test.js
│   │   │   └── ... (one test file per service/utility)
│   │   ├── integration/
│   │   │   ├── auth.integration.test.js
│   │   │   ├── weather.integration.test.js
│   │   │   └── ... (one test file per route)
│   │   └── contract/
│   │       ├── auth-contract.test.js
│   │       ├── weather-contract.test.js
│   │       ├── crops-contract.test.js
│   │       ├── pests-contract.test.js
│   │       └── farm-contract.test.js
│   ├── .env.example
│   ├── .env                           # (Git-ignored)
│   ├── .eslintrc.json
│   ├── .prettierrc
│   ├── jest.config.js
│   ├── package.json
│   └── README.md
│
├── frontend/                          # React + Vite (Port 5173)
│   ├── src/
│   │   ├── components/
│   │   │   ├── Navigation/
│   │   │   │   ├── Header.jsx         # Top bar, user menu
│   │   │   │   ├── Sidebar.jsx        # Module navigation
│   │   │   │   └── Navigation.test.jsx
│   │   │   ├── Form/
│   │   │   │   ├── LoginForm.jsx      # Email/password input
│   │   │   │   ├── RegisterForm.jsx   # Farmer registration
│   │   │   │   └── ... (other forms)
│   │   │   ├── Cards/
│   │   │   │   ├── WeatherCard.jsx    # Current weather display
│   │   │   │   ├── CropCard.jsx       # Crop info card
│   │   │   │   └── ... (reusable cards)
│   │   │   ├── Common/
│   │   │   │   ├── Loading.jsx        # Spinner, skeleton
│   │   │   │   ├── ErrorBoundary.jsx
│   │   │   │   └── NotFound.jsx
│   │   │   └── ... (other UI components)
│   │   ├── pages/
│   │   │   ├── auth/
│   │   │   │   ├── LoginPage.jsx
│   │   │   │   ├── RegisterPage.jsx
│   │   │   │   └── auth.test.jsx
│   │   │   ├── dashboard/
│   │   │   │   ├── Dashboard.jsx      # Main dashboard (P1 user story)
│   │   │   │   └── dashboard.test.jsx
│   │   │   ├── weather/
│   │   │   │   ├── WeatherPage.jsx    # Weather module (P1)
│   │   │   │   └── weather.test.jsx
│   │   │   ├── crops/
│   │   │   │   ├── CropsPage.jsx      # Crops directory (P1)
│   │   │   │   ├── CropDetail.jsx     # Individual crop page
│   │   │   │   └── crops.test.jsx
│   │   │   ├── pests/
│   │   │   │   ├── PestsPage.jsx      # Pests database (P2)
│   │   │   │   ├── PestDetail.jsx
│   │   │   │   └── pests.test.jsx
│   │   │   ├── farm/
│   │   │   │   ├── MyFarmPage.jsx     # Farm tracking (P2)
│   │   │   │   ├── AddFarmForm.jsx
│   │   │   │   └── farm.test.jsx
│   │   │   ├── calendar/
│   │   │   │   ├── CalendarPage.jsx   # Seasonal planner (P2)
│   │   │   │   └── calendar.test.jsx
│   │   │   ├── news/
│   │   │   │   ├── NewsPage.jsx       # News feed (P3)
│   │   │   │   └── news.test.jsx
│   │   │   └── about/
│   │   │       └── AboutPage.jsx      # About Us (P3)
│   │   ├── services/
│   │   │   ├── api.js                 # Axios instance + interceptors
│   │   │   ├── authService.js         # Login, register, token refresh
│   │   │   ├── weatherService.js      # Weather API calls
│   │   │   ├── cropsService.js        # Crop API calls
│   │   │   ├── pestsService.js        # Pest API calls
│   │   │   ├── farmService.js         # Farm CRUD calls
│   │   │   └── ... (other service modules)
│   │   ├── contexts/
│   │   │   ├── AuthContext.jsx        # Auth state + methods
│   │   │   ├── FarmContext.jsx        # Farm data + methods
│   │   │   ├── LocationContext.jsx    # Municipality selection
│   │   │   └── useAuth.js, useFarm.js (hooks to access contexts)
│   │   ├── hooks/
│   │   │   ├── useWeather.js          # Fetch weather, caching
│   │   │   ├── useCrops.js            # Fetch crops with filtering
│   │   │   ├── usePests.js            # Fetch pests
│   │   │   └── useLocalStorage.js     # Persist state
│   │   ├── utils/
│   │   │   ├── constants.js           # Pampanga municipalities, etc.
│   │   │   ├── formatters.js          # Date, temperature formatting
│   │   │   ├── validators.js          # Email, password validation
│   │   │   └── errorHandler.js        # Parse API errors
│   │   ├── styles/
│   │   │   ├── theme.js               # MUI theme config
│   │   │   ├── global.css             # Global styles
│   │   │   └── responsive.css         # Responsive utilities
│   │   ├── App.jsx                    # Root component, routes
│   │   ├── main.jsx                   # React entry point
│   │   └── index.html
│   ├── tests/
│   │   ├── unit/
│   │   │   ├── components/
│   │   │   │   ├── LoginForm.test.jsx
│   │   │   │   └── ... (component tests)
│   │   │   ├── services/
│   │   │   │   ├── authService.test.js
│   │   │   │   └── ... (service tests)
│   │   │   └── hooks/
│   │   │       ├── useWeather.test.js
│   │   │       └── ... (hook tests)
│   │   ├── integration/
│   │   │   ├── auth-flow.integration.test.jsx  # Login → Dashboard
│   │   │   ├── weather-flow.integration.test.jsx
│   │   │   └── ... (workflow tests)
│   │   └── e2e/ (optional, Playwright)
│   │       ├── auth.e2e.test.js
│   │       └── ... (end-to-end scenarios)
│   ├── .env.example
│   ├── .env
│   ├── .eslintrc.cjs
│   ├── .prettierrc
│   ├── jest.config.cjs
│   ├── vitest.config.js               # (if using Vitest for React)
│   ├── vite.config.js                 # Vite config (dev server, build)
│   ├── package.json
│   └── README.md
│
├── .gitignore
├── docker-compose.yml                 # (Optional) Local dev environment
└── README.md
```

**Structure Decision**: Decoupled MERN monorepo with separate frontend (Vite SPA) and backend (Express API) folders. This enables:
- **Independent scaling**: Frontend CDN/hosting, backend on dedicated servers
- **Team separation**: Frontend and backend teams work independently
- **Technology decoupling**: Frontend upgrade doesn't require backend changes
- **Deployability**: Each service deploys separately via CI/CD
- **Testability**: Unit tests isolated per service, integration tests bridge boundary

---

## Complexity Tracking

> **Justification for architectural decisions that might seem complex:**

| Architectural Element | Why Needed | Simpler Alternative Rejected Because |
|---|---|---|
| **JWT + Axios interceptors** | Stateless auth scales horizontally; handles token refresh transparently | Session-based auth requires centralized session store, doesn't scale for distributed backend replicas |
| **Dual-layer geofencing (client + server)** | Client filtering improves UX; server validation prevents data leakage | Client-only filtering trusts browser code; API manipulation could leak non-Pampanga data; server-only filtering creates network lag for client |
| **Context API + custom hooks** | Avoids Redux boilerplate while maintaining clean state; flexible for v1 evolution | Global state props drilling creates prop hell; Redux adds complexity for current feature scope |
| **Layered testing (unit/integration/contract)** | Comprehensive coverage catches bugs at multiple levels per Constitution II | Unit tests alone miss integration failures; contract tests alone don't validate business logic |
| **Mongoose schema + validation** | Enforces data integrity at DB layer; reusable validation rules | No schema allows invalid data at persistence; validation only at API layer creates inconsistency |
| **Cloudinary media storage** | Persistent, globally distributed image serving; offloads storage from backend | Local filesystem storage couples media to server instance; doesn't scale horizontally |

All complexity above is **essential and justified** per feature requirements and constitutional constraints.

---

## Data & Entity Design Summary

**7 Core Entities** (detailed in [data-model.md](data-model.md)):

1. **User**: Authentication identity, profile, preferences
2. **Farm**: Farmer's agricultural land record, tracked crops, observations
3. **Crop**: Reference database of Pampanga crops with seasonal data
4. **Pest**: Reference database of pests with mitigation strategies
5. **Weather**: Current conditions + 7-day forecast for municipalities
6. **NewsArticle**: Local agricultural news & advisories
7. **CalendarEvent**: Seasonal activity calendar (planting, harvest windows)

**Key Relationships**:
- User → Farm (1:N) — Each farmer has one or more farms
- Farm → Crop (N:M via currentCrops array) — Farm tracks multiple crops
- Crop → Pest (N:M) — Crops have multiple pest risks
- Weather (read-only reference) — No direct entity link
- NewsArticle → Municipality (filtered by applicableMunicipalities)

---

## API & Contract Summary

**5 Core API Modules** (detailed in [contracts/](contracts/)):

1. **Authentication** (/auth): Register, Login, Refresh JWT
2. **Weather** (/weather): Get current & forecast for municipality
3. **Crops** (/crops): Browse crops by season/municipality
4. **Pests** (/pests): Search pests, view mitigation strategies
5. **Farm** (/farm): CRUD farms, track crops, record observations
6. **News** (/news): Retrieve feed of agricultural announcements (Phase 2+)
7. **Calendar** (/calendar): Fetch seasonal activity calendar (Phase 2+)

**Standardized Response Format**:
```json
{
  "statusCode": 200,
  "message": "Operation successful",
  "data": { /* response payload */ },
  "pagination": { "total": 50, "skip": 0, "limit": 20 }  // if applicable
}
```

**Error Response Format**:
```json
{
  "statusCode": 400,
  "error": "ValidationError",
  "message": "User-facing error message",
  "details": { /* field-level errors */ }
}
```

---

## Next Steps (Post-Planning)

### Phase 2: Task Generation

Run `/speckit.tasks` to generate:
- Dependency-ordered implementation tasks (T001–TNxx)
- Organized by user story (US1 P1, US2 P1, etc.)
- Each task independently testable per Constitution II
- Estimated story point complexity (optional)

### Phase 3: Implementation & Testing

Follow the TDD workflow (Constitution II):
1. Write failing test (unit/integration/contract) → RED
2. Implement minimal code to pass test → GREEN
3. Refactor for clarity & performance → REFACTOR
4. Repeat for next task

Maintain 80%+ test coverage throughout.

### Phase 4: Code Review & Quality Gates

- PR requires ≥1 approval
- Tests must pass (npm run test)
- Coverage must not decrease below 80%
- Linting and formatting must pass
- Code reviewer verifies Constitution compliance (clean code, testing, responsive UI)

### Phase 5: Deployment & Validation

- Merge to main branch
- Run full test suite on CI/CD
- Deploy backend to staging
- Deploy frontend to CDN
- Smoke tests verify live endpoints
- Monitor Pampanga user access

---

## Timeline & Sequencing

**Phase 0 (Research)**: ✅ COMPLETE  
Research findings consolidated in [research.md](research.md)

**Phase 1 (Design & Contracts)**: ✅ COMPLETE  
- Data model: [data-model.md](data-model.md)
- API contracts: [contracts/](contracts/)
- Quickstart: [quickstart.md](quickstart.md)
- This plan: plan.md

**Phase 2 (Task Generation)**: PENDING  
Run `/speckit.tasks` to generate [tasks.md](tasks.md)

**Phase 3 (Implementation)**: PENDING  
Development workflow per user story priority (8 user stories, P1→P2→P3)

**Estimated Timeline**:
- P1 User Stories (Auth + Dashboard, Weather, Crops, Pests): 4-6 weeks
- P2 User Stories (My Farm, Calendar): 3-4 weeks
- P3 User Stories (News, About Us): 1-2 weeks
- Testing & Quality (80%+ coverage, code review): Ongoing
- **Total MVP**: 8-12 weeks (full feature + testing)

---

## Risk & Mitigation

| Risk | Impact | Mitigation |
|---|---|---|
| **Weather API unavailability** | Users can't check weather forecast | Implement fallback: cached data + "temporarily unavailable" message (per spec US2) |
| **Pampanga municipality reference data accuracy** | Wrong crop/weather data displayed | Partner with local extension office for data validation; community feedback loop |
| **Mobile performance on 2G networks** | Farmers can't load app in rural areas | Lazy load components, compress images, minimize bundle; test on 4G with throttling |
| **JWT token expiration during form submission** | User loses data when session expires | Automatic token refresh before expiry; local draft saving for forms |
| **Mongoose schema changes require migrations** | Database inconsistency on updates | Create migration scripts; test migrations on staging before production |
| **Cloudinary API limits exceeded** | Image uploads fail under load | Monitor usage; implement quota alerts; fallback to local storage temporarily |

---

## Success Metrics & Exit Criteria

**Phase 1 Design Complete When**:
- ✅ research.md resolves all architecture unknowns
- ✅ data-model.md defines 7 entities with validation rules
- ✅ contracts/ define all API endpoints with request/response shapes
- ✅ quickstart.md enables local dev setup in <15 minutes
- ✅ Constitution Check passes (clean code, testing, responsive UI)

**Phase 2 Tasks Generated When**:
- ✅ tasks.md lists 50-70 independently testable tasks
- ✅ Tasks grouped by user story for parallel development
- ✅ Each task has acceptance criteria and test requirements
- ✅ Task dependencies clear for sequencing

**Phase 3 Implementation Complete When**:
- ✅ All user stories implemented per spec.md
- ✅ 80%+ test coverage across frontend + backend
- ✅ All acceptance scenarios pass (from spec.md)
- ✅ Performance targets met (SC-004, SC-005, SC-008)
- ✅ Code review approved
- ✅ Staging environment validates live
- ✅ Pampanga geographic scope enforced (FR-013, SC-003)

---

## References

- **Feature Specification**: [spec.md](spec.md)
- **Research Findings**: [research.md](research.md)
- **Data Model**: [data-model.md](data-model.md)
- **API Contracts**: [contracts/](contracts/)
- **Quick Start**: [quickstart.md](quickstart.md)
- **SpecKit Constitution**: [.specify/memory/constitution.md](.specify/memory/constitution.md)
- **Quality Checklist**: [checklists/requirements.md](checklists/requirements.md)

---

## Approval & Signature

**Prepared By**: GitHub Copilot (Spec Kit Planning Agent)  
**Date**: 2026-04-29  
**Status**: Draft — Ready for Phase 2 (Task Generation)

**Next Action**: Run `/speckit.tasks` to generate implementation task list
