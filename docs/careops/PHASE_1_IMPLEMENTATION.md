# Phase 1: Data Point Foundation - Implementation Guide

> **Status**: Models Complete ✅ | Services Pending 🚧
> **Date**: 2026-01-22
> **Commit**: 1efbcf1e49

## Overview

This document describes what was built for Phase 1 of the Studio Rebuild. Follow this guide to understand the structure and recreate or extend the implementation.

## Prerequisites

1. **Module scaffold created** via `./tooling/scripts/create-module.sh`
   - Creates `packages/module-studio/` with basic Moleculer setup

2. **README warning added** to prevent external usage during development

## What Was Built

### 1. Types System (`packages/module-studio/src/types/index.ts`)

**Purpose**: Central location for all Zod schemas and TypeScript types. Completely new - no imports from other modules.

**Key Types**:
- `CareopsAudit` - Audit trail (at, by)
- `CareopsValueTypeEnum` - string, number, boolean, date, datetime, json, string_array, number_array
- `CareopsDataPointScopeEnum` - patient (cross-careflow), track (local)
- `CareopsDataPointDefinition` - Schema for what data can exist
- `CareopsPatientDataPoint` - Patient-scoped data values
- `CareopsTrackDataPoint` - Track-scoped audit data
- `CareopsNodeContract` - Shared inputs/outputs for all canvas nodes
- `CareopsTrackResult` - Named exit points for tracks
- `CareopsResultDataPoint` - Special `<node_id>.RESULT` data points
- `CareopsNodeTypeEnum` - All canvas node types
- `nodeTypeHasResults()` - Helper to check if node type produces results

**All types are prefixed with `Careops`** to avoid confusion with existing types.

---

### 2. Data Access Layer (`packages/module-studio/src/data-access/`)

Pattern follows `module-agents`:
- `arango.ts` - Database connection (shared across all collections)
- `error.ts` - DataAccessError with Arango error handling
- `index.ts` - Exports all data access modules

#### Data Point Definition (`data-access/data-point-definition/`)

**Files**:
- `collection.ts` - ArangoDB collection setup with indexes
- `functions.ts` - CRUD operations
- `index.ts` - Exports

**Collection**: `CareopsDataPointDefinitions`

**Functions**:
- `create(input, audit)` - Create new definition
- `get(id)` - Get by ID
- `getByKey(org, key)` - Get by key + org
- `list(org, scope?)` - List all or by scope
- `getByIds(ids)` - Batch get
- `update(id, input, audit)` - Update definition
- `delete(id)` - Delete definition
- `keyExists(org, key, excludeId?)` - Check key uniqueness

**Indexes**:
- `organization_slug`
- `organization_slug + key` (unique)
- `scope` (sparse)
- `organization_slug + scope`
- `category` (sparse)

#### Patient Data Point (`data-access/patient-data-point/`)

**Files**: Same pattern as above

**Collection**: `CareopsPatientDataPoints`

**Functions**:
- `set(org, input)` - Upsert (create or update existing)
- `get(id)` - Get by ID
- `getByPatientAndDefinition(patient, definition)` - Get specific value
- `getByPatient(org, patient)` - Get all for patient
- `getByPatientAndDefinitions(org, patient, ids)` - Batch get
- `getByCareflowInstance(instance_id)` - Get from careflow
- `update(id, input)` - Update value
- `delete(id)` - Delete

**Indexes**:
- `patient_id`
- `definition_id`
- `organization_slug`
- `patient_id + definition_id`
- `organization_slug + patient_id`
- `collected_at`
- `source.careflow_instance_id` (sparse)

**Important**: Uses upsert semantics - same patient/definition updates existing record.

#### Track Data Point (`data-access/track-data-point/`)

**Files**: Same pattern as above

**Collection**: `CareopsTrackDataPoints`

**Functions**:
- `set(org, input)` - Create new (ALWAYS creates, never updates for audit)
- `get(id)` - Get by ID
- `getByTrackInstance(track_instance_id)` - Get all for track instance
- `getByTrackInstanceAndDefinitions(track_instance, ids)` - Batch get
- `getByTrackInstanceAndDefinition(track_instance, definition)` - Get latest value
- `getByPatient(org, patient)` - Audit: get all track data for patient

**Indexes**:
- `track_instance_id`
- `patient_id`
- `definition_id`
- `organization_slug`
- `track_instance_id + definition_id`
- `collected_at`

**Important**: Always appends new records (never updates) for audit trail compliance.

---

### 3. Moleculer Services (`packages/module-studio/src/services/`)

**Pattern** follows `module-agents`:
- `service.ts` - Service schema with name
- `actions.ts` - Action handlers
- `events.ts` - Event definitions (optional)
- `index.ts` - Export types and services

#### Service Names

- `studio:data-point-definition` - Data point definition CRUD
- `studio:patient-data-point` - Patient data point operations
- `studio:track-data-point` - Track data point operations

---

### 4. Frontend Folder (`packages/app-careops/app/design/studio/`)

**To be created** - Next step after services complete.

---

## File Tree

```
packages/module-studio/
├── src/
│   ├── types/
│   │   └── index.ts                    # All Zod schemas & TypeScript types
│   ├── data-access/
│   │   ├── arango.ts                   # DB connection
│   │   ├── error.ts                    # Error handling
│   │   ├── index.ts                    # Data access exports
│   │   ├── data-point-definition/
│   │   │   ├── collection.ts
│   │   │   ├── functions.ts
│   │   │   └── index.ts
│   │   ├── patient-data-point/
│   │   │   ├── collection.ts
│   │   │   ├── functions.ts
│   │   │   └── index.ts
│   │   └── track-data-point/
│   │       ├── collection.ts
│   │       ├── functions.ts
│   │       └── index.ts
│   └── services/
│       ├── index.ts                    # Services exports
│       ├── data-point-definition/
│       │   ├── service.ts
│       │   ├── actions.ts
│       │   └── events.ts
│       ├── patient-data-point/
│       │   ├── service.ts
│       │   ├── actions.ts
│       │   └── events.ts
│       └── track-data-point/
│           ├── service.ts
│           ├── actions.ts
│           └── events.ts
└── package.json
```

---

## Next Steps

1. **Complete Moleculer services** (in progress)
2. **Create frontend folder** `app-careops/app/design/studio/`
3. **Update module-studio/src/index.ts** to export and init data access
4. **Update module-studio/src/broker.ts** to register services
5. **Run TypeScript compilation** to generate types
6. **Test the services** via broker calls

---

## Key Design Decisions

1. **New types system** - No imports from libs-service or other modules. All prefixed with `Careops`.

2. **Patient data upsert** - Same patient/definition updates existing record (only latest value needed).

3. **Track data append-only** - Always creates new records for audit compliance.

4. **Node contracts** - Shared structure for all canvas nodes (tracks, steps, logic, timer, agent).

5. **Track results** - Named exit points producing `<node_id>.RESULT` data points (like code/decision blocks).

6. **Separate from existing systems** - New ArangoDB collections (`Careops*` prefix), not reusing `design` database.

---

## Worker Assignment: Build Moleculer Services

Models are committed. Workers should build the services following this pattern:

### Service Pattern (from `module-agents`)

**Reference files**:
- `packages/module-agents/src/services/worker-agent-config/service.ts`
- `packages/module-agents/src/services/worker-agent-config/actions.ts`

### 1. Data Point Definition Service

**File**: `packages/module-studio/src/services/data-point-definition/service.ts`

```typescript
import type { ServiceSchema } from 'moleculer'
import { actions } from './actions'

const name = 'studio:data-point-definition'
export type Name = typeof name
export type Actions = typeof actions

export const dataPointDefinitionService: ServiceSchema = {
  name,
  actions,
  events: {
    'studio:data_point_definition.created': {
      group: name,
    },
    'studio:data_point_definition.updated': {
      group: name,
    },
    'studio:data_point_definition.deleted': {
      group: name,
    },
  },
}
```

**File**: `packages/module-studio/src/services/data-point-definition/actions.ts`

Actions to implement (mapping to `dataAccess.dataPointDefinition.*`):
- `create` - Validates input, calls `create()`, emits created event
- `get` - Calls `get()`
- `getByKey` - Calls `getByKey()`
- `list` - Calls `list()`
- `getByIds` - Calls `getByIds()`
- `update` - Calls `update()`, emits updated event
- `delete` - Calls `delete()`, emits deleted event
- `keyExists` - Calls `keyExists()`

**Context metadata**: Expect `{ organization: { organization_slug }, member: { member_id, email_address } }`

**File**: `packages/module-studio/src/services/data-point-definition/events.ts`

```typescript
export const events = {
  created: async (ctx: Context<{ id: string }>) => {
    // Post-processing after creation if needed
  },
  // ... other event handlers
}
```

### 2. Patient Data Point Service

**Service name**: `studio:patient-data-point`

Actions:
- `set` - Calls `set()`, emits set event
- `get` - Calls `get()`
- `getByPatientAndDefinition` - Calls `getByPatientAndDefinition()`
- `getByPatient` - Calls `getByPatient()`
- `getByPatientAndDefinitions` - Calls `getByPatientAndDefinitions()`
- `getByCareflowInstance` - Calls `getByCareflowInstance()`
- `update` - Calls `update()`, emits updated event
- `delete` - Calls `delete()`, emits deleted event

Events: `studio:patient_data_point.set`, `studio:patient_data_point.updated`

### 3. Track Data Point Service

**Service name**: `studio:track-data-point`

Actions:
- `set` - Calls `set()`
- `get` - Calls `get()`
- `getByTrackInstance` - Calls `getByTrackInstance()`
- `getByTrackInstanceAndDefinitions` - Calls `getByTrackInstanceAndDefinitions()`
- `getByTrackInstanceAndDefinition` - Calls `getByTrackInstanceAndDefinition()`
- `getByPatient` - Calls `getByPatient()`

Events: None needed (audit-only)

### 4. Update Service Index

**File**: `packages/module-studio/src/services/index.ts`

```typescript
import { dataPointDefinitionService } from './data-point-definition/service'
import { patientDataPointService } from './patient-data-point/service'
import { trackDataPointService } from './track-data-point/service'

export type {
  Name as DPDName,
  Actions as DPDActions,
} from './data-point-definition/service'
export type {
  Name as PDPName,
  Actions as PDPActions,
} from './patient-data-point/service'
export type {
  Name as TDPName,
  Actions as TDPActions,
} from './track-data-point/service'

export const services = [
  dataPointDefinitionService,
  patientDataPointService,
  trackDataPointService,
]
```

### 5. Update Main Module Files

**File**: `packages/module-studio/src/index.ts`

Add data access initialization:
```typescript
import { dataAccess, init as initDataAccess } from './data-access'

export async function init() {
  await initDataAccess()
  // ...
}

export { dataAccess }
```

**File**: `packages/module-studio/src/broker.ts`

Register services in broker:
```typescript
import { services } from './services'

// ... existing broker setup
broker.createServices(services)
```

### Testing

After implementation:
1. Run `yarn compile` in `packages/module-studio/`
2. Start the module and call actions via broker
3. Verify collections are created in ArangoDB
