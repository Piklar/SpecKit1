# Phase 0: Outline & Research

## Calendar Bug Fix
- **Decision**: Debug and wrap `TaskList` and `TaskItem` in error boundaries or add strict null checks. The crash is likely an unhandled property access (e.g., date formatting in `TaskItem` or `DayViewOpen` rendering) when a date with a task is clicked.
- **Rationale**: Since the calendar renders correctly initially, the crash only happens when `selectedDate` evaluates to a date with tasks and the `Dialog` tries to render `TaskList`.

## News Content
- **Decision**: Use seeded static/dummy data on the frontend to render the News page for now.
- **Rationale**: The user confirmed they want B and C (Static dummy data initially, transitioning to Internally Managed Content later). This fulfills the immediate UI requirement quickly.

## Pest and Crop Relationship
- **Decision**: Implement a Many-to-Many or One-to-Many relationship in MongoDB using Mongoose `ObjectId` references between `Crop` and `Pest` models.
- **Rationale**: The spec requires connecting pests to crops so users can navigate between them.
