# Phase 1: Data Model

## Pest Model (MongoDB)
- `name` (String, required)
- `classification` (String, required)
- `howToGetRid` (String, required)
- `description` (String)
- `images` (Array of Strings)
- `targetedCrops` (Array of ObjectIds referencing `Crop`)

## Crop Model (MongoDB) - Updates
- Add `pests` (Array of ObjectIds referencing `Pest`) to establish the inverse relationship, if needed for faster lookup, or simply query Pests by `targetedCrops`.
