# Implementation Plan: News, Pests Pages, and Calendar Bug Fix

**Branch**: `005` | **Date**: 2026-05-04 | **Spec**: [specs/005-news-pests/spec.md](spec.md)
**Input**: Feature specification from `specs/005-news-pests/spec.md`

## Summary

Implement News and Pests pages with dummy data initially for News, and establish a data relationship between Pests and Crops. Additionally, fix a critical crash bug in the Calendar where clicking a date with a task causes a white screen.

## Technical Context

**Language/Version**: Node.js, React (Vite)
**Primary Dependencies**: Express, MongoDB (Mongoose), React Router, MUI
**Storage**: MongoDB
**Testing**: Jest
**Target Platform**: Web Application
**Project Type**: Web Application
**Performance Goals**: Fast page loads, <2.5s FCP
**Constraints**: None
**Scale/Scope**: Small to medium agricultural app

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

- [x] Clean Code: Component responsibilities will be cleanly separated.
- [x] Strict Testing Standards: Will add/update unit tests for the bug fix and new pages.
- [x] Responsive UI: Will use MUI grids to ensure the News and Pest pages are responsive.

## Project Structure

### Documentation (this feature)

```text
specs/005-news-pests/
├── plan.md              # This file
├── research.md          # Phase 0 output
├── data-model.md        # Phase 1 output
└── quickstart.md        # Phase 1 output
```

### Source Code (repository root)

```text
backend/
├── src/
│   ├── models/
│   │   ├── Pest.js
│   │   └── Crop.js (updated)
│   ├── controllers/
│   │   └── pestController.js
│   └── routes/
│       └── pestRoutes.js

frontend/
├── src/
│   ├── pages/
│   │   ├── news/
│   │   │   └── NewsPage.jsx
│   │   ├── pests/
│   │   │   └── PestsPage.jsx
│   │   └── calendar/
│   │       └── CalendarPage.jsx (updated)
│   └── components/
│       ├── News/
│       └── Pests/
```

**Structure Decision**: Standard MERN structure following existing patterns in the project.
