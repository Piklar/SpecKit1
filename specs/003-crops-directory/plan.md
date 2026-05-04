# Implementation Plan: Crops Directory & Farm Integration

**Branch**: `002-user-profile-dashboard` (working branch, to be re-targeted or merged) | **Date**: 2026-04-30 | **Spec**: [specs/003-crops-directory/spec.md](./spec.md)
**Input**: Feature specification from `/specs/003-crops-directory/spec.md`

**Note**: This template is filled in by the `/speckit-plan` command. See `.specify/templates/plan-template.md` for the execution workflow.

## Summary

Build an interactive Crops directory page with a sticky navigation bar, a seasonal hero crop, a grid of viable crops, and a detail modal that allows users to add a crop and its planting date to their Farm profile.

## Technical Context

**Language/Version**: JavaScript (Node.js 18+, React 18+)
**Primary Dependencies**: React (Vite), Material-UI (MUI), React Router, Axios, Node.js, Express.js, MongoDB (Mongoose)
**Storage**: MongoDB
**Testing**: Jest, Supertest (Backend), Vitest, React Testing Library (Frontend)
**Target Platform**: Web (Responsive Desktop/Mobile)
**Project Type**: Web Application
**Performance Goals**: First contentful paint ≤2.5s, interactive ≤5s on 4G networks
**Constraints**: Responsive UI (WCAG 2.1 AA)
**Scale/Scope**: Localized for Pampanga farmers

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

- **Clean Code**: Plan relies on existing Express/Mongoose and React patterns. Models (`Crop`, `Farm`) are extended cleanly without duplicating domain logic.
- **Strict Testing Standards**: 80% coverage required. Unit tests for new Mongoose model fields and integration tests for `GET /api/crops` and `POST /api/farm/:id/crops`. Frontend tests for modal rendering and sticky navigation.
- **Responsive UI**: The grid and modal will be implemented with MUI's responsive grid system. The sticky navigation will use MUI's `AppBar` to ensure cross-device consistency.

## Project Structure

### Documentation (this feature)

```text
specs/003-crops-directory/
├── plan.md              # This file (/speckit-plan command output)
├── research.md          # Phase 0 output (/speckit-plan command)
├── data-model.md        # Phase 1 output (/speckit-plan command)
├── quickstart.md        # Phase 1 output (/speckit-plan command)
├── contracts/           # Phase 1 output (/speckit-plan command)
└── tasks.md             # Phase 2 output (/speckit-tasks command - NOT created by /speckit-plan)
```

### Source Code (repository root)

```text
backend/
├── src/
│   ├── models/
│   │   ├── Crop.js        # Add type, farmingTips, marketPrice, endProducts
│   │   └── Farm.js        # Add plantedCrops subdocument schema
│   ├── routes/
│   │   └── farm.js        # Add POST /:id/crops route
│   └── controllers/
│       └── farmController.js # Implement addPlantedCrop logic
└── tests/

frontend/
├── src/
│   ├── components/
│   │   └── layout/
│   │       └── Navbar.jsx # Add position="sticky"
│   └── pages/
│       └── crops/
│           ├── CropsPage.jsx
│           ├── CropHero.jsx
│           ├── CropGrid.jsx
│           └── CropModal.jsx
└── tests/
```

**Structure Decision**: Extending the existing frontend/backend split (Option 2). The `Crop` and `Farm` models will be expanded, and a new `crops` feature directory will be added to the frontend pages.

## Complexity Tracking

> **Fill ONLY if Constitution Check has violations that must be justified**

| Violation | Why Needed | Simpler Alternative Rejected Because |
|-----------|------------|-------------------------------------|
| *None* | N/A | N/A |
