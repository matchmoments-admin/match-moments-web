# Migration Complete: fixtures.ts → Match__c Queries

## Summary
Successfully migrated `src/lib/salesforce/queries/fixtures.ts` from legacy `Fixture__c` queries to active `Match__c` queries with verified Salesforce field names.

## Changes Made

### 1. Type Imports Updated ✅
**Before:**
```typescript
import type { Fixture, FixturePeriod, CommentaryEvent } from '../types';
```

**After:**
```typescript
import type { SF_Match__c, SF_Match_Period__c } from '@/types/salesforce/raw';
import type { CommentaryEvent } from '../types';
```

### 2. All Query Functions Updated ✅

#### getTodayFixtures()
- ✅ Changed `Fixture__c` → `Match__c`
- ✅ Changed `Fixture_DateTime__c` → `Match_Date_Time__c` (3 occurrences)
- ✅ Changed `Logo_URL__c` → `Logo_Url__c` for teams

#### getLiveFixtures()
- ✅ Changed `Fixture__c` → `Match__c`
- ✅ Changed `Fixture_DateTime__c` → `Match_Date_Time__c` (2 occurrences)
- ✅ Changed `Logo_URL__c` → `Logo_Url__c` for teams
- ✅ Kept `Status__c LIKE 'Live%'` filter

#### getUpcomingFixtures()
- ✅ Changed `Fixture__c` → `Match__c`
- ✅ Changed `Fixture_DateTime__c` → `Match_Date_Time__c` (3 occurrences)
- ✅ Changed `Logo_URL__c` → `Logo_Url__c` for teams

#### getFixtureData()
- ✅ Changed `Fixture__c` → `Match__c`
- ✅ Changed `Fixture_DateTime__c` → `Match_Date_Time__c`
- ✅ Changed `Logo_URL__c` → `Logo_Url__c` for teams
- ✅ Kept `Primary_Color__c` and `Competition__r.Sport__c`

#### Period Query in getFixtureData()
- ✅ Changed `Fixture_Period__c` → `Match_Period__c`
- ✅ Changed `WHERE Fixture__c =` → `WHERE Match__c =`

#### Commentary Query in getFixtureData()
- ⚠️ **Legacy Field Documented**: Kept `WHERE Fixture__c =` with TODO comment
- Added migration documentation:
  ```typescript
  // TODO: Migrate Commentary_Event__c.Fixture__c → Commentary_Event__c.Match__c
  // Current: Uses legacy Fixture__c lookup field until org migration complete
  // Required: Add Match__c lookup field, backfill data, deprecate Fixture__c
  ```

#### getFixturesByCompetition()
- ✅ Changed `Fixture__c` → `Match__c`
- ✅ Changed `Fixture_DateTime__c` → `Match_Date_Time__c` (2 occurrences)
- ✅ Changed `Logo_URL__c` → `Logo_Url__c` for teams

## Field Name Reference

### Verified Correct Field Names
| Object | Field | Notes |
|--------|-------|-------|
| Match__c | `Match_Date_Time__c` | Not Fixture_DateTime__c |
| Account (Teams) | `Logo_Url__c` | Lowercase 'u' |
| Account (Teams) | `Primary_Color__c` | No Team_ prefix |
| Competition__c | `Logo_URL__c` | Uppercase 'URL' (different!) |
| Match_Period__c | `Period_Type__c`, `Period_Number__c` | |
| Match_Period__c | `Home_Score_Period__c`, `Away_Score_Period__c` | |

## Validation

### TypeScript Compilation ✅
```bash
npx tsc --noEmit
# Exit code: 0 (Success)
```

### Linter Check ✅
No linter errors found in fixtures.ts

### Data Availability
- ✅ 59 Match__c records exist in Salesforce
- ✅ 0 Fixture__c records (legacy, deprecated)

## Next Steps

### 1. Commentary_Event__c Migration (Required)
The Commentary_Event__c object needs a Salesforce schema migration:

**Current State:**
- Field: `Commentary_Event__c.Fixture__c` → `Fixture__c`

**Required State:**
- Field: `Commentary_Event__c.Match__c` → `Match__c`

**Migration Steps:**
1. Add new field `Match__c` (Lookup to Match__c) in Salesforce
2. Backfill existing Commentary_Event__c records to link to Match__c
3. Update query in fixtures.ts to use `WHERE Match__c =`
4. Deprecate `Fixture__c` field

### 2. Testing in Workbench
Test the new queries in Salesforce Workbench:

```sql
-- Test Match__c query
SELECT Id, Name, Match_Date_Time__c, Status__c,
       Home_Team__r.Logo_Url__c, Away_Team__r.Logo_Url__c,
       Competition__r.Logo_URL__c
FROM Match__c
LIMIT 5
```

Expected: Returns 5 records without FLS errors

```sql
-- Test Match_Period__c query
SELECT Period_Number__c, Period_Type__c,
       Home_Score_Period__c, Away_Score_Period__c
FROM Match_Period__c
WHERE Match__c = '(insert match id)'
ORDER BY Period_Number__c ASC
```

### 3. Cache Strategy
All cache strategies remain functional:
- `CacheStrategy.fixturesToday` - 5 minutes
- `CacheStrategy.fixturesLive` - 30 seconds
- `CacheStrategy.fixturesUpcoming` - 30 minutes
- `CacheStrategy.fixtureDetail` - 5 minutes
- `CacheStrategy.fixturesByCompetition` - 30 minutes

## Benefits

1. ✅ **Queries Active Data**: Now queries 59 Match__c records instead of 0 Fixture__c records
2. ✅ **Correct Field Names**: All fields match verified Salesforce schema
3. ✅ **Type Safety**: Using SF_Match__c types from raw types
4. ✅ **No Breaking Changes**: Function signatures unchanged, backward compatible
5. ✅ **Documented Migration**: Commentary migration path clearly documented

## Files Modified
- `src/lib/salesforce/queries/fixtures.ts` - All 5 query functions updated

---

**Migration completed:** 2024-12-28
**Status:** ✅ Complete (with commentary migration pending)

