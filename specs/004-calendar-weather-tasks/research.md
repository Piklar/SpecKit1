# Research & Edge Cases: Calendar & Weather Feature (004)

**Feature**: `004-calendar-weather-tasks`  
**Last Updated**: May 4, 2026

---

## Edge Cases Documented

### 1. Past-Date Tasks

**Behavior**: Tasks with past due dates are allowed and displayed normally.  
**Visual distinction**: `CalendarDay` renders past dates with reduced opacity (`color: text.disabled`) for the day number, helping users distinguish past from future.  
**No blocking validation**: The backend `Task` model does not reject past dates — this is intentional for retroactive logging of completed farm activities.

### 2. Multiple Tasks on One Day (up to 10)

**Behavior for ≤ 3 tasks**: Individual colored dots render per task (blue = pending, green = completed).  
**Behavior for 4–10 tasks**: A compact chip (`X tasks`) replaces individual dots to prevent overflow.  
**Overflow cap**: The UI does not currently paginate beyond 10 tasks per day — this is a known limitation for v1 (SC-008 verified at 10 tasks).  
**Future**: Pagination or a "show all" expansion can be added in a later iteration.

### 3. API Failures

#### Task API failure
- `useTasks` sets `error` state with the server message.
- `CalendarPage` displays an `Alert` error banner at the top of the page.
- Calendar renders with existing cached task state (empty on first load).
- `taskService` retries once automatically on 5xx/network errors.

#### Weather API failure
- `useWeather` captures the error.
- `WeatherWidget` shows an error panel with a **Retry** button.
- Retry triggers a fresh `fetchWeather()` call.

#### Holiday API failure
- `useHolidays` captures the error.
- `CalendarPage` shows a yellow `warning` Alert banner.
- Calendar renders without holiday indicators (graceful degradation).
- Holidays are cached in-memory once fetched — a failure on page load won't retry automatically until next navigation.

### 4. Timezone Handling

**Storage**: All `dueDate` values are stored in UTC ISO format in MongoDB.  
**Display**: Dates are interpreted using the browser's local timezone via `date-fns`.  
**Known issue**: A task created at 11:58 PM in UTC+8 stores as the previous UTC date. This is acceptable for v1.  
**Mitigation**: `dueDate` comparisons in `Calendar.jsx` use `toISOString().split('T')[0]` to compare date strings directly, avoiding timezone shift in display.

### 5. Logout / Login Task Persistence

Tasks are tied to `userId` via JWT authentication:
- Creating a task stores `userId` (from decoded JWT) on the backend.
- After logout and re-login, `GET /api/tasks` returns only the authenticated user's tasks.
- Token is read from `localStorage` on every API call — no stale session risk.

### 6. Calendar Re-render Performance

- `Calendar` and `CalendarDay` are both wrapped in `React.memo`.
- `onDateSelect` is wrapped in `useCallback` in `CalendarPage` to prevent unnecessary CalendarDay re-renders.
- `buildDays()` inside `Calendar` runs on every render — acceptable for month-view (max 42 cells).
- With 100 tasks per user, `tasks.filter()` runs 42× per render. At ~100 tasks this is < 1ms per filter call; no memoization needed for v1.

### 7. Holiday Data Accuracy

- Source: `date-holidays` npm package (backend), configured for `PH` (Philippines).
- Covers: National public holidays, special non-working days.
- **Does not cover**: Local/regional holidays (e.g., city fiestas).
- Cached by year in frontend (`holidayCache` object in `useHolidays`).
- Backend caches within the process lifetime; a server restart clears the cache.

### 8. Weather Location

- Default location hardcoded to **Pampanga (15.0794°N, 120.62°E)** in `CalendarPage`.
- In v2: User's farm location (from profile) should be passed dynamically.
- OpenWeather free tier: 60 calls/minute — well within usage for this app.

---

## Technical Decisions

| Decision | Rationale | Alternative Rejected |
|----------|-----------|----------------------|
| `date-fns` for date math | Lightweight, tree-shakeable, no global mutation | `moment.js` (deprecated, heavy) |
| `React.memo` on CalendarDay | 42 cells × any state change = expensive re-render | Redux selector memoization (overkill for v1) |
| In-memory holiday cache | Holidays change once per year — no need for localStorage/IndexedDB | Service Worker cache (too complex for v1) |
| String date comparison (`yyyy-MM-dd`) | Avoids timezone offset bugs in Date object comparison | `isSameDay()` from date-fns (breaks with UTC storage) |
| Optimistic task state updates | Instant UI feedback, better UX | Refetch after every mutation (slow) |
