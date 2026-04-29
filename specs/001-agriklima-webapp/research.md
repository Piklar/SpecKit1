# Research Findings: AgriKlima MERN Architecture & Geolocation Strategy

**Date**: 2026-04-29  
**Scope**: Technical decisions for AgriKlima frontend/backend MERN stack, geolocation filtering, responsive UI, and testing strategy

---

## 1. MERN Stack Communication Pattern

### Decision: JWT + Axios Client-Server Communication

**Rationale**: 
- JWT (JSON Web Tokens) enables stateless authentication across distributed systems; the backend validates tokens without session storage, scaling horizontally.
- Axios handles all HTTP requests on both frontend (to Express API) and backend (to external weather APIs), providing a consistent HTTP abstraction.
- React Router (v7.8.1) manages client-side routing, avoiding full-page reloads and enabling responsive SPA navigation.

**Pattern**:
1. Frontend: User logs in → Axios sends email/password to `/auth/login` → Backend verifies credentials via bcryptjs, returns JWT
2. Frontend: Stores JWT in localStorage/sessionStorage; includes JWT in Authorization header for all subsequent requests
3. Backend: Express middleware validates JWT on every protected route using jwt.verify(); rejects invalid/expired tokens with 401 Unauthorized
4. Frontend: On 401 response, clears JWT and redirects to login; on 403 response, shows "unauthorized" message

**Implementation Details**:
- JWT Payload: `{ userId, email, role, iat, exp }` where `exp` is set to 24 hours; longer expiry (7 days) for "remember me" feature
- Token Refresh: Backend provides `/auth/refresh` endpoint returning new JWT; frontend proactively refreshes 5 minutes before expiry to avoid mid-action token expiration
- CORS Middleware: Express configured to accept requests from frontend origin only; credentials included in Axios requests for cookie-based fallback (optional)

**Frontend State Management**:
- Axios interceptors handle token injection and refresh logic centrally; eliminates repetitive header configuration in components
- React hooks (useState, useEffect, useContext) manage local state; Context API stores authenticated user data (userId, email, farm details) to avoid prop drilling
- No additional state management library (Redux, Zustand) needed for v1; revisit if multiple global subscriptions emerge

---

## 2. Geolocation & Pampanga-Specific Data Filtering

### Decision: Client-Side Geofencing + Server-Side Validation

**Rationale**:
- Pampanga comprises 16 municipalities; spec requires 100% geographic accuracy (FR-013, SC-003)
- Client-side filtering improves UX responsiveness; server-side validation prevents data leakage via API manipulation
- Dual-layer approach ensures both performance (client) and security (server)

**Pampanga Municipalities Reference**:
```
Apalit, Balanga, Candaba, Capas, Floridablanca, Guagua, Masinloc (note: actually Nueva Ecija),
Lubao, Magalang, Masantol, Mexico, Minalin, Porac, San Fernando, Santa Ana, Santo Tomas
```

**Implementation**:
- Backend: All weather API calls include municipality filter; crop/pest database queries include `municipality: { $in: [list] }` Mongoose filter
- Frontend: City/municipality dropdown populated from hardcoded Pampanga list; React component validates selection before submitting to backend
- API Contract: Weather endpoint returns `{ municipality, temperature, forecast[], timestamp }` with municipality validation; non-Pampanga requests rejected with 400 Bad Request
- Data Validation: Backend middleware checks incoming municipality against whitelist before querying database; log rejections for security auditing

**Weather Data Integration**:
- Weather API (OpenWeatherMap or Local Philippine Service) queried for municipality coordinates; responses cached in Redis for 1-hour TTL to reduce API calls
- Fallback Strategy: If weather API unavailable, frontend displays "Weather data temporarily unavailable" (per US2, acceptance scenario 4); backend returns cached data if available, else 503 Service Unavailable
- Forecast Accuracy: 7-day forecast stored in MongoDB; accuracy validated against actual outcomes for learning/improvement

**Crop & Pest Localization**:
- Reference database includes `cropsForMunicipality: { Apalit: [rice, corn], Balanga: [rice, vegetables], ... }`
- When farmer selects crop, only mitigation strategies verified for that municipality are displayed; organic/chemical recommendations filtered by Pampanga climate zones
- Admin interface (out of scope) enables editing crop/pest associations per municipality

---

## 3. Responsive UI Implementation with MUI + Bootstrap

### Decision: MUI as Primary Component Library with Bootstrap Utilities

**Rationale**:
- MUI (Material-UI v7.3.1) provides pre-built, accessible components (buttons, forms, modals, data grids) with WCAG 2.1 AA built-in
- MUI's responsive breakpoints (xs, sm, md, lg, xl) align with mobile-first design (Constitution III)
- Bootstrap (v5.3.7) included for utility classes (spacing, flexbox, display) where MUI components don't cover edge cases
- Emotion CSS-in-JS enables component-level styling without CSS conflicts

**Responsive Breakpoints** (aligned to Constitution III & SC-005):
- **xs** (0–599px): Mobile phones (primary Pampanga access method)
- **sm** (600–899px): Large phones, small tablets
- **md** (900–1199px): Tablets
- **lg** (1200–1535px): Desktop
- **xl** (1536px+): Wide desktop

**Layout Strategy**:
- Main Dashboard: Stack vertically on xs/sm; 2-column layout (summary + quick links) on md+; 3-column on lg+
- Weather Module: Temperature/humidity in card grid; forecast in horizontal scrollable on mobile, data grid on desktop
- Crops Directory: List view on xs/sm; card grid on md+; searchable data grid on lg+
- Pests Module: Similar to Crops; filtering sidebar collapses to drawer on mobile
- My Farm: Form-centric; fields stack vertically on xs; 2-column form on md+

**WCAG 2.1 AA Compliance** (SC-008 success criterion):
- All interactive elements (buttons, links, form inputs) have min 44px touch target on mobile
- Color contrast ratios ≥4.5:1 for text, ≥3:1 for graphics
- Keyboard navigation fully supported; no mouse-only interactions
- Alt text on all images (crop photos, pest identification images)
- Form labels explicitly associated with inputs; error messages linked to inputs via aria-describedby

**Performance Targets** (SC-004):
- First Contentful Paint (FCP): ≤2.5s on 4G
- Largest Contentful Paint (LCP): ≤2.5s
- Time to Interactive (TTI): ≤5s
- MUI components lazy-loaded using React.lazy + Suspense on non-critical routes
- Weather forecast data grid (MUI X Data Grid v8.10.2) virtualized to render only visible rows

---

## 4. Testing Strategy: 80%+ Coverage (Constitution II Compliance)

### Decision: Layered Testing with TDD Approach

**Test Pyramid** (80%+ coverage):

**Unit Tests** (~50% of suite, >90% coverage of units):
- Frontend: Jest + React Testing Library for component logic, hooks, utilities
- Backend: Jest + Supertest for route handlers, middleware, Mongoose schema validation
- Example: Weather service unit test verifies that `formatForecast(rawData)` returns correctly structured forecast; municipality whitelist validation returns true for "Apalit", false for "Manila"

**Integration Tests** (~35% of suite, >70% coverage of workflows):
- Frontend + Backend: End-to-end workflows
- Example: "User logs in → JWT stored → API request includes token → protected route responds with 200"
- Database integration: Mongoose schema validation, cascade deletes, unique constraints
- Example: "Create user → Create farm linked to user → Delete user → Verify farm is deleted or orphaned per business rule"

**Contract Tests** (~10% of suite, 100% coverage of API contracts):
- Verify API response shape matches documented schema
- Example: `GET /api/weather/:municipality` response must include `{ municipality, temperature, humidity, forecast[] }` with correct types
- Verify error responses follow standardized format: `{ error, message, statusCode }`

**Contract Test Repository**:
```
contracts/
├── weather-contract.test.js
├── crops-contract.test.js
├── pests-contract.test.js
├── auth-contract.test.js
└── farm-contract.test.js
```

**TDD Workflow** (per Constitution II):
1. Write failing test defining expected behavior (red)
2. Implement minimal code to pass test (green)
3. Refactor to improve code quality (refactor)
4. Repeat for next feature

**Coverage Gates**:
- Pull requests must not decrease coverage below 80%
- CI/CD pipeline runs tests; merges blocked if coverage < 80% or tests fail
- Coverage reports visible in PR checks (e.g., Codecov integration)

---

## 5. State Management & Scalability

### Decision: Context API (v1) + Scalability Path to Redux

**Rationale**:
- Context API sufficient for v1: user auth state, farm data, current municipality selection
- Avoids boilerplate overhead of Redux while maintaining clean separation of concerns
- Migration path to Redux prepared if state complexity grows (e.g., multi-farm management, collaboration features)

**Context Providers** (v1):

**AuthContext**: 
- Stores: `{ isAuthenticated, user, jwt, refreshToken }`
- Provides: `login(email, password)`, `logout()`, `refreshToken()`

**FarmContext**:
- Stores: `{ farms[], selectedFarm, farmData }`
- Provides: `addFarm(details)`, `updateFarm(id, updates)`, `selectFarm(id)`

**LocationContext**:
- Stores: `{ selectedMunicipality, municipalityList }`
- Provides: `selectMunicipality(name)`, `getMunicipalities()`

**Data Fetching Pattern**:
- Axios instance configured with interceptors (attach JWT, handle 401/403 responses)
- useEffect hooks fetch data on component mount; dependencies carefully managed to avoid infinite loops
- Loading/error states managed locally in component; shared critical errors (auth failures) dispatched to AuthContext

**Scalability Path**:
- If state depth increases (multi-level nesting of farm → crops → pests), migrate to Redux
- If real-time collaboration needed, add Socket.io listeners to Redux actions
- If offline support required, add Redux Persist plugin

---

## 6. Architecture Diagram: MERN Data Flow

```
┌──────────────────────────────────────────────────────────────────┐
│ FRONTEND (React 19 + Vite)                                       │
│                                                                  │
│  ┌─────────────────────────────────────────────────────────────┐ │
│  │ UI Layer (MUI Components + React Router)                   │ │
│  │ - Dashboard, Weather, Crops, Pests, MyFarm, Calendar       │ │
│  │ - Responsive Grid: xs/sm (mobile) → md+ (desktop)          │ │
│  └─────────────────────────────────────────────────────────────┘ │
│           ↓ User Input / Mount Event                             │
│  ┌─────────────────────────────────────────────────────────────┐ │
│  │ State Layer (Context API + React Hooks)                    │ │
│  │ - AuthContext (jwt, user)                                  │ │
│  │ - FarmContext (farms, selectedFarm)                        │ │
│  │ - LocationContext (municipality)                           │ │
│  └─────────────────────────────────────────────────────────────┘ │
│           ↓ useEffect Hook Triggered                             │
│  ┌─────────────────────────────────────────────────────────────┐ │
│  │ HTTP Layer (Axios)                                         │ │
│  │ - Interceptors: Inject JWT, handle 401/403                 │ │
│  │ - Request: POST/GET to Express API                         │ │
│  │ - Response: Parse JSON, update state                       │ │
│  └─────────────────────────────────────────────────────────────┘ │
└──────────────────────────────────────────────────────────────────┘
           ↓ HTTP Request (JWT in Authorization header)
┌──────────────────────────────────────────────────────────────────┐
│ BACKEND (Express + Node.js)                                      │
│                                                                  │
│  ┌─────────────────────────────────────────────────────────────┐ │
│  │ API Layer (Express Routes)                                 │ │
│  │ - /auth/login, /auth/logout, /auth/refresh                 │ │
│  │ - /api/weather/:municipality                               │ │
│  │ - /api/crops, /api/pests, /api/farm                        │ │
│  │ - /api/news, /api/calendar                                 │ │
│  └─────────────────────────────────────────────────────────────┘ │
│           ↓ Middleware Chain                                     │
│  ┌─────────────────────────────────────────────────────────────┐ │
│  │ Middleware (Authentication, Validation, Error Handling)    │ │
│  │ - JWT Verification: verify token, extract userId           │ │
│  │ - Municipality Validation: whitelist check                  │ │
│  │ - Multer: Parse multipart/form-data (images)               │ │
│  │ - Error Handler: Standardize error responses               │ │
│  └─────────────────────────────────────────────────────────────┘ │
│           ↓ Validated Request                                    │
│  ┌─────────────────────────────────────────────────────────────┐ │
│  │ Controller Layer (Business Logic)                          │ │
│  │ - Parse request data, call services                        │ │
│  │ - Format response JSON                                     │ │
│  └─────────────────────────────────────────────────────────────┘ │
│           ↓ Service/Model Queries                                │
│  ┌─────────────────────────────────────────────────────────────┐ │
│  │ Data Layer (Mongoose + MongoDB)                            │ │
│  │ - User, Farm, Crop, Pest, Weather, NewsArticle schemas    │ │
│  │ - CRUD operations, aggregations, validations               │ │
│  │ - Indexes on: userId, municipality, season                 │ │
│  └─────────────────────────────────────────────────────────────┘ │
│           ↓ Query/Response                                       │
│  ┌─────────────────────────────────────────────────────────────┐ │
│  │ External Services                                          │ │
│  │ - Weather API (OpenWeatherMap, PAGASA)                     │ │
│  │ - Cloudinary (Image Storage)                               │ │
│  │ - MongoDB (Database)                                       │ │
│  └─────────────────────────────────────────────────────────────┘ │
└──────────────────────────────────────────────────────────────────┘
           ↑ Response (JSON)
           └─ Axios Receives → Update React State → Re-render UI
```

---

## Summary of Decisions

| Topic | Decision | Rationale |
|-------|----------|-----------|
| **Auth** | JWT + stateless validation | Scalability, horizontal distribution |
| **Geolocation** | Client validation + server whitelist | Performance + security, 100% accuracy |
| **UI Framework** | MUI (primary) + Bootstrap (utilities) | Accessibility, responsive, WCAG 2.1 AA |
| **Responsive Strategy** | Mobile-first (xs/sm focus) with desktop enhancement | Primary Pampanga access method is mobile |
| **Testing** | Layered (unit 50%, integration 35%, contract 10%) | 80%+ coverage, TDD-ready, testable workflows |
| **State Management** | Context API (v1) → Redux (future) | Balanced complexity/capability for v1 |
| **Error Handling** | Standardized JSON responses with statusCode | Predictable frontend error handling |

---

## Next Steps

1. **Data Model Design**: Define Mongoose schemas and relationships (Phase 1)
2. **API Contract Definition**: Document request/response shapes for each endpoint (Phase 1)
3. **Quickstart Guide**: Setup instructions for local development (Phase 1)
4. **Task Generation**: Break down into independently testable tasks per user story (Phase 2)
