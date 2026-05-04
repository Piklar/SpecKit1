# Data Model: Crops Directory & Farm Integration

## Entities

### Crop (Updated)
Extends the existing `Crop` schema to support the new directory details.

**New Fields**:
- `type` (String, required): Classification of the crop (e.g., 'Root crop', 'Leafy green', 'Fruit-bearing').
- `farmingTips` (String, required): Best practices and tricks for planting.
- `marketPrice` (Number, required): Current estimated market price (per kg).
- `endProducts` ([String], required): List of foods or materials that can be created from it.

**Existing Fields**:
- `name` (String)
- `season` (Enum: 'wet', 'dry', 'all')
- `growingTimeDays` (Number)
- `waterRequirement` (String)
- `soilType` (String)
- `suitableRegions` ([String])
- `description` (String) - Maps to "Overall summary/description"

### Farm (Updated)
Extends the existing `Farm` schema to track planting dates.

**Modified Field**:
- `plantedCrops` ([Object]): Array of subdocuments containing:
  - `crop` (ObjectId, ref: 'Crop')
  - `plantedDate` (Date, required)

*Note: For backward compatibility, the existing `crops: [ObjectId]` array may be kept or migrated completely to `plantedCrops`. The recommended approach is to transition to `plantedCrops` and update `userProfile.db.js` dashboard aggregation.*
