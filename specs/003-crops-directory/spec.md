# Feature Specification: Crops Directory & Farm Integration

**Feature Branch**: `003-crops-directory`  
**Created**: 2026-04-30  
**Status**: Draft  
**Input**: User description: "Build the 'Crops' module for the AgriKlima system. This page serves as an interactive directory for localized crops and acts as the primary entry point for farmers to track what they are currently planting in the 'My Farm' module..."

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Browse Seasonal Crops (Priority: P1)

Farmers can view an interactive directory of localized crops tailored to the current weather season, allowing them to easily discover suitable crops to plant.

**Why this priority**: Discovering viable crops based on the season is the core value proposition of the directory.

**Independent Test**: Can be fully tested by navigating to the Crops page, verifying the top "Most Recommended Crop" matches the current season, and browsing the grid of other viable seasonal crops.

**Acceptance Scenarios**:

1. **Given** a farmer visits the Crops page, **When** the current season is determined, **Then** the Seasonal Hero Container highlights the single "Most Recommended Crop" for that season.
2. **Given** the farmer is on the Crops page, **When** scrolling past the hero section, **Then** a grid/list displays other viable seasonal crops.

---

### User Story 2 - View Crop Details (Priority: P1)

Farmers can click on any crop to view comprehensive details, helping them make informed decisions about what to plant.

**Why this priority**: Essential for providing the necessary agricultural insights before a farmer decides to plant a crop.

**Independent Test**: Can be fully tested by clicking a crop card in the directory and verifying the modal displays all required data points.

**Acceptance Scenarios**:

1. **Given** a farmer is browsing the crop directory, **When** they click on the Hero crop or a grid item, **Then** a detail modal opens.
2. **Given** the crop detail modal is open, **When** viewing the content, **Then** it displays: overall summary, crop type, estimated grow time, farming tips & tricks, estimated market price, and end-products.

---

### User Story 3 - Add Crop to "My Farm" (Priority: P2)

Farmers can easily track what they are currently planting by adding a crop directly from the detail modal to their "My Farm" module, specifying the planting date.

**Why this priority**: Connects the discovery phase (directory) with the tracking phase (farm dashboard).

**Independent Test**: Can be fully tested by opening a crop modal, clicking "Add to My Farm", providing a date, and verifying the crop and planting date are linked to the user's farm.

**Acceptance Scenarios**:

1. **Given** the crop detail modal is open, **When** the farmer views the actions, **Then** there is a primary CTA button labeled "Add to My Farm".
2. **Given** the farmer clicks "Add to My Farm", **When** prompted, **Then** they can input the specific date they planted the crop.
3. **Given** the farmer has specified a planting date, **When** they submit the form, **Then** the system links the selected crop and planting date to their personalized "My Farm" tracking module.

---

### User Story 4 - Global Sticky Navigation (Priority: P3)

Users can easily navigate the AgriKlima application from any page, including the Crops directory, without having to scroll back to the top.

**Why this priority**: Improves overall UX and navigation flow across the application.

**Independent Test**: Can be fully tested by scrolling down a long page (like the crop directory grid) and verifying the navigation bar remains pinned to the top.

**Acceptance Scenarios**:

1. **Given** a user is on any page, **When** they scroll down, **Then** the main application navigation bar remains persistently pinned to the top of the viewport.

### Edge Cases

- What happens when a user tries to add a crop to their farm but hasn't created a farm yet?
- How does the system handle "Add to My Farm" if the user is not authenticated?
- What happens if the estimated market price data is temporarily unavailable?
- How is the "Most Recommended Crop" chosen if multiple crops have identical seasonal viability scores?

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: The system MUST determine the current agricultural season and display a Seasonal Hero Container highlighting the single most recommended crop for that season.
- **FR-002**: The system MUST display a Crop Directory Grid below the hero section containing other viable crops for the current season.
- **FR-003**: The system MUST open a Crop Detail Modal when a user clicks on any crop (hero or grid).
- **FR-004**: The Crop Detail Modal MUST display: summary, crop type, estimated grow time, farming tips, estimated market price, and end-products.
- **FR-005**: The Crop Detail Modal MUST include a primary CTA button labeled "Add to My Farm".
- **FR-006**: The system MUST prompt the user for a planting date when "Add to My Farm" is clicked.
- **FR-007**: The system MUST link the selected crop and planting date to the user's "My Farm" profile upon form submission.
- **FR-008**: The system MUST prompt the user to select from a dropdown list of their farms when adding a crop. The farm that the user most recently added a crop to MUST be selected by default (placed at the top of the list).
- **FR-009**: The main application navigation bar MUST be globally persistent and pinned to the top of the viewport across all pages.

### Key Entities *(include if feature involves data)*

- **Crop**: Represents an agricultural product in the directory (contains summary, type, grow time, tips, price, end-products, seasonal data).
- **Farm / Planted Crop Association**: Represents the link between a user's farm, a specific crop, and its specified planting date.

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: Users can view the crop directory and open a crop modal within 1 second of page load.
- **SC-002**: Users can successfully add a crop to their farm from the modal with less than 3 clicks (excluding date input typing).
- **SC-003**: The navigation bar remains visible 100% of the time while scrolling.
- **SC-004**: 100% of crop modals display all 6 required data points (summary, type, grow time, tips, price, end-products).

## Assumptions

- The current weather season (wet/dry) logic is already established in the system and can be reused.
- Standard date picker UI components will be used for the planting date specification.
- If a user is not logged in when clicking "Add to My Farm", they will be redirected to the login flow and then returned to complete the action.
- The "My Farm" tracking module already exists or is being built concurrently to receive this linked data.
