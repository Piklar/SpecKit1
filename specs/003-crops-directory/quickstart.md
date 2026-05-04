# Quickstart: Crops Directory & Farm Integration

## Overview
This feature introduces an interactive crops directory with seasonal highlights and a seamless "Add to My Farm" flow. It also standardizes the sticky navigation across the entire web application.

## Test Scenarios

### Scenario 1: Browse Crops & View Details
1. Start the frontend development server and navigate to `/crops` (or the corresponding Crops page).
2. Observe the sticky navigation at the top of the viewport. Scroll down and verify it remains pinned.
3. Observe the "Seasonal Hero Container" highlighting the top recommended crop for the current season.
4. Scroll down to see the Crop Directory Grid containing other seasonal crops.
5. Click on any crop card (Hero or Grid).
6. **Verify**: A modal opens displaying the crop's summary, type, estimated grow time, farming tips, market price, and end-products.

### Scenario 2: Add Crop to My Farm
1. Log in as a farmer user who has at least one existing farm.
2. Navigate to the Crops page and open any crop detail modal.
3. Click the primary "Add to My Farm" button.
4. **Verify**: You are prompted to select a farm (defaulting to the most recently updated one) and specify a planting date.
5. Provide a date and submit.
6. **Verify**: The UI shows a success message.
7. Navigate to the Profile / Dashboard page (`/profile`).
8. **Verify**: The added crop now appears in the dashboard aggregations under your farm.

### Scenario 3: Add to My Farm (Unauthenticated)
1. Ensure you are logged out.
2. Navigate to the Crops page and open a crop modal.
3. Click "Add to My Farm".
4. **Verify**: You are redirected to the login page.
5. (Optional) Log in and verify you can then complete the action.

## Integration Dependencies
- Relies on the `AuthContext` to determine logged-in state and token for `POST /api/farm/:id/crops`.
- The dashboard aggregations in feature 002 must be aware of the new `plantedCrops` schema structure (or gracefully handle both `crops` array and `plantedCrops` array during migration).
