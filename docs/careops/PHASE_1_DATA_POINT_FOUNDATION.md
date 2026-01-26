# Phase 1: Data Point Foundation - Implementation Summary

**Status**: ✅ Completed
**Date**: 2026-01-21

## Overview

Phase 1 establishes the foundational data models for the Studio Rebuild. Data points are the "contract language" that connects tracks, steps, and careflows.

## What Was Implemented

### 1. Studio Package Structure

Created new `@awell/studio` package at `packages/studio/` with:
- `package.json` - Dependencies including zod, arangojs, moleculer
- `tsconfig.json` - TypeScript configuration extending `tsconfig.module.json`
- Proper module structure following existing patterns from `module-agents`

### 2. Data Point Definition Model

**Location**: `packages/studio/src/data-access/data-point-definition/`

Defines schema for what data can exist:

```typescript
// Key fields:
- id, key, title
- scope: 'patient' | 'track'
- value_type: string | number | boolean | date | datetime | json | string_array | number_array
- constraints: allowed_values, min, max, pattern
- fhir_mapping: resource_type, element_path, value_set_uri
- fhir_resolution: fhir_path, extension_url, source_resource, filter (Phase 2)
```

**Functions**:
- `create(organization_slug, input)` - Create new definition
- `get(id)` - Get by ID
- `getByKey(organization_slug, key)` - Get by key + org
- `list(organization_slug, scope?)` - List all or by scope
- `getByIds(ids)` - Batch get by IDs
- `update(id, input)` - Update definition
- `delete(id)` - Delete definition
- `keyExists(organization_slug, key, excludeId?)` - Check key uniqueness

**Collection**: `DataPointDefinitions` with indexes on:
- key (unique)
- organization_slug
- scope
- category (sparse)
- organization_slug + scope (composite)

### 3. Patient Data Point Model

**Location**: `packages/studio/src/data-access/patient-data-point/`

Defines patient-scoped data that persists across careflows:

```typescript
// Key fields:
- id, patient_id, definition_id
- value: string | number | boolean | null
- source: type, careflow_instance_id, track_instance_id, step_id, action_id
- collected_at, organization_slug
```

**Important**: Patient-scoped data is NEVER guaranteed unless declared as a REQUIRED track input.

**Functions**:
- `set(organization_slug, input)` - Create or update (upsert)
- `get(id)` - Get by ID
- `getByPatientAndDefinition(patient_id, definition_id)` - Get specific value
- `getByPatient(organization_slug, patient_id)` - Get all for patient
- `getByPatientAndDefinitions(organization_slug, patient_id, definition_ids)` - Batch get
- `getByCareflowInstance(careflow_instance_id)` - Get all from careflow
- `update(id, input)` - Update value
- `delete(id)` - Delete

**Collection**: `PatientDataPoints` with indexes on:
- patient_id
- definition_id
- organization_slug
- patient_id + definition_id (composite)
- organization_slug + patient_id (composite)
- collected_at
- source.careflow_instance_id (sparse)

### 4. Track Data Point Model

**Location**: `packages/studio/src/data-access/track-data-point/`

Defines track-scoped data for audit/compliance (not for careflow logic):

```typescript
// Key fields:
- id, track_instance_id, patient_id, definition_id
- value: string | number | boolean | null
- source: step_id, action_id
- collected_at, organization_slug
```

**Important**: Track data is persisted for compliance but NOT visible to other careflows. To share data, declare as track OUTPUT.

**Functions**:
- `set(organization_slug, input)` - Create new (always creates, never updates for audit)
- `get(id)` - Get by ID
- `getByTrackInstance(track_instance_id)` - Get all for track instance
- `getByTrackInstanceAndDefinitions(track_instance_id, definition_ids)` - Batch get
- `getByTrackInstanceAndDefinition(track_instance_id, definition_id)` - Get latest value
- `getByPatient(organization_slug, patient_id)` - Audit: get all track data for patient

**Collection**: `TrackDataPoints` with indexes on:
- track_instance_id
- patient_id
- definition_id
- organization_slug
- track_instance_id + definition_id (composite)
- collected_at

### 5. Moleculer Services

**Data Point Definition Service**: `studio:data-point-definition`
- `create` - Create new definition
- `get` - Get by ID
- `getByKey` - Get by key
- `list` - List definitions (optionally by scope)
- `getByIds` - Batch get
- `update` - Update definition
- `delete` - Delete definition

Events:
- `studio:data_point_definition.created`
- `studio:data_point_definition.updated`
- `studio:data_point_definition.deleted`

**Patient Data Point Service**: `studio:patient-data-point`
- `set` - Set patient data point (upsert)
- `get` - Get by ID
- `getByPatientAndDefinition` - Get specific value
- `getByPatient` - Get all for patient
- `getByPatientAndDefinitions` - Batch get
- `getByCareflowInstance` - Get from careflow
- `update` - Update value
- `delete` - Delete

Events:
- `studio:patient_data_point.set`
- `studio:patient_data_point.updated`

## Database Collections

| Collection | Purpose |
|------------|---------|
| DataPointDefinitions | Schema definitions for data points |
| PatientDataPoints | Patient-scoped data values (cross-careflow) |
| TrackDataPoints | Track-scoped data values (audit only) |

## Files Created

```
packages/studio/
├── package.json
├── tsconfig.json
└── src/
    ├── environment.ts
    ├── data-access/
    │   ├── arango.ts
    │   ├── error.ts
    │   ├── index.ts
    │   ├── data-point-definition/
    │   │   ├── type.ts
    │   │   ├── collection.ts
    │   │   ├── functions.ts
    │   │   └── index.ts
    │   ├── patient-data-point/
    │   │   ├── type.ts
    │   │   ├── collection.ts
    │   │   ├── functions.ts
    │   │   └── index.ts
    │   └── track-data-point/
    │       ├── type.ts
    │       ├── collection.ts
    │       ├── functions.ts
    │       └── index.ts
    ├── services/
    │   ├── index.ts
    │   ├── data-point-definition/
    │   │   ├── service.ts
    │   │   ├── actions.ts
    │   │   └── events.ts
    │   └── patient-data-point/
    │       ├── service.ts
    │       ├── actions.ts
    │       └── events.ts
    └── index.ts
```

## Next Steps

Phase 2 will build on this foundation to implement the Track Library with:
- Track model with versioning
- Track contracts (inputs/outputs referencing data point definitions)
- Track triggers
- Publishing validation

## Notes

- All data access follows existing patterns from `module-agents`
- Zod schemas provide runtime validation
- ArangoDB indexes optimized for common query patterns
- Services broadcast events for integration with other systems
- Patient data points use upsert semantics (set = create or update)
- Track data points are always appended (never updated) for audit trail
