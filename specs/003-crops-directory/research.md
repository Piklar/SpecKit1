# Research: Crops Directory & Farm Integration

## 1. Tracking Planting Dates
**Decision**: Modify the `Farm` schema to track planted crops as subdocuments `plantedCrops: [{ cropId, plantedDate }]` while keeping `crops` for backward compatibility or migrating it completely.
**Rationale**: FR-007 requires capturing the user-specified planting date. The existing `crops: [ObjectId]` array cannot store a date. Upgrading the schema to include `plantedCrops` allows tracking the date. To not immediately break 002 dashboard aggregations, we can transition to mapping `plantedCrops` in the dashboard or update `userProfile.db.js`.
**Alternatives considered**: 
- Using the global `CalendarEvent` model. Rejected because calendar events currently lack a `user` and `farm` linkage.
- Changing `crops` array type directly to `{ cropId, date }`. We will take this route but it requires a minor refactor of `getFarmsByUser` aggregation in `profileService.js` / `userProfile.db.js`.

## 2. Global Sticky Navigation
**Decision**: Use Material-UI's `<AppBar position="sticky">` combined with a persistent layout wrapper in React Router.
**Rationale**: Provides a native, performant sticky header that remains pinned across all route changes without requiring manual scrolling manipulation.
**Alternatives considered**: `position: fixed` which requires padding offsets on the main content container. `sticky` is cleaner.

## 3. "Add to My Farm" Flow & Multiple Farms
**Decision**: Fetch user's farms via `GET /api/farm` and populate a Select dropdown in the Modal. Default to the farm that was most recently updated (sorted by `updatedAt` desc). Submit via a new or updated `POST /api/farm/:id/crops` endpoint.
**Rationale**: Meets FR-008. Sorting by `updatedAt` ensures the most recently active farm is pre-selected, reducing clicks.
**Alternatives considered**: Always selecting the first farm created. Rejected as users might switch focus to a newer farm over time.
