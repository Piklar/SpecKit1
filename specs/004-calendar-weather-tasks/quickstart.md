# Quickstart: Calendar & Weather Feature (004)

**Feature**: `004-calendar-weather-tasks`  
**Branch**: `004-calendar-weather-tasks`  
**Stack**: Node.js + Express (backend) · React + Vite + MUI (frontend) · MongoDB

---

## Prerequisites

| Tool | Min Version |
|------|-------------|
| Node.js | 18+ |
| npm | 9+ |
| MongoDB | 6+ (local or Atlas) |
| OpenWeather API key | Free tier |

---

## Environment Setup

### Backend (`backend/.env`)

```env
PORT=3000
MONGODB_URI=mongodb://localhost:27017/agriklima
JWT_SECRET=your_jwt_secret_here
OPENWEATHER_API_KEY=your_openweather_key_here
```

### Frontend (`frontend/.env`)

```env
VITE_API_BASE_URL=http://localhost:3000
```

---

## Running Locally

```powershell
# Terminal 1 — Backend
cd backend
npm install
node src/server.js

# Terminal 2 — Frontend
cd frontend
npm install
npm run dev
```

Navigate to `http://localhost:5173` and log in. The **Calendar** page is available from the sidebar.

---

## API Endpoints

### Tasks (`/api/tasks`) — JWT required

| Method | Route | Description |
|--------|-------|-------------|
| `GET` | `/api/tasks` | Get all tasks for authenticated user |
| `POST` | `/api/tasks` | Create a new task |
| `PUT` | `/api/tasks/:id` | Update a task |
| `PATCH` | `/api/tasks/:id/toggle` | Toggle completion status |
| `DELETE` | `/api/tasks/:id` | Delete a task |
| `GET` | `/api/tasks/date/:date` | Get tasks for a specific date (`yyyy-MM-dd`) |

**Sample POST body**:
```json
{
  "title": "Water the rice fields",
  "description": "Check water levels and irrigate Section B",
  "dueDate": "2026-05-15",
  "dueTime": "06:00"
}
```

### Weather (`/api/weather`) — No auth required

| Method | Route | Description |
|--------|-------|-------------|
| `GET` | `/api/weather/current?lat=15.07&lon=120.62` | Current weather |
| `GET` | `/api/weather/forecast?lat=15.07&lon=120.62` | 5-day forecast |

### Holidays (`/api/holidays`) — No auth required

| Method | Route | Description |
|--------|-------|-------------|
| `GET` | `/api/holidays/:year` | Philippine national holidays for a year |

**Sample response**:
```json
[
  { "date": "2026-01-01", "name": "New Year's Day" },
  { "date": "2026-04-09", "name": "Araw ng Kagitingan" }
]
```

---

## Frontend Component Usage

### CalendarPage
The root page component. Renders the calendar grid and weather sidebar, and manages all modal state.

```jsx
// Accessible via app routing at /calendar
<CalendarPage />
```

### Calendar Grid
```jsx
<Calendar
  currentMonth={new Date()}    // current Date object
  selectedDate={selectedDate}  // Date | null
  onDateSelect={handleSelect}  // (day: Date) => void
  tasks={tasks}                // Task[]
  holidays={holidays}          // { date: string, name: string }[]
/>
```

### CalendarDay
Auto-highlights **today** with a blue circle badge and gradient background. Shows task dots (≤3 tasks) or a chip (4+ tasks). Rendered via `React.memo` for performance.

### TaskModal
```jsx
<TaskModal
  open={boolean}
  onClose={() => {}}
  taskToEdit={task | null}     // null = create mode, task = edit mode
  onSaveSuccess={() => {}}
/>
```

### WeatherWidget
```jsx
<WeatherWidget
  lat={15.0794}   // latitude
  lon={120.62}    // longitude
/>
```
Includes automatic retry on API failure and a **Retry** button in the error state.

---

## Integration Scenarios

### 1. View Today's Tasks
1. Navigate to `/calendar` — today's date is automatically highlighted with a blue circle.
2. Click the highlighted cell to open the Day Task View showing today's tasks.

### 2. Add a Task
1. Click **Add Task** (top-right of calendar) or the **Add Task** button inside the Day View.
2. Fill in title, optional description, date, and optional time.
3. Submit — task appears as a dot indicator on the calendar.

### 3. Complete a Task
1. Click a day cell with tasks.
2. Check the checkbox next to any task.
3. Completed tasks move to a "COMPLETED" section with strikethrough styling.

### 4. Navigate Months
1. Use `‹` / `›` arrows to change months.
2. When not on the current month, a **Today** button appears to jump back instantly.

---

## Performance Notes

- **Calendar**: React.memo on `Calendar` and `CalendarDay` prevents unnecessary re-renders.
- **Holidays**: Cached in-memory by year (`useHolidays`) — subsequent month navigations within same year are instant.
- **Tasks**: Optimistic state updates — UI reflects changes immediately before server confirms.
- **Weather**: Skeleton loading states shown while data loads; error state includes retry.
