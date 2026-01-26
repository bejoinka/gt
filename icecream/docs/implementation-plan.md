# Ice Cream Know Your Rights — Implementation Plan

> **Working directory**: `~/dev/icecream`
>
> **Design principle**: Simple objects, complex interactions.

---

## 1. Data Model (Simplified)

### Principle

**Objects are simple. Complexity comes from their interactions.**

---

### CMS Content (Templates, Not Per-Player)

These are shared templates for all players:

```sql
-- Customer ARCHETYPES (not individual customers)
customer_archetypes (
  id, name, archetype_type, base_willingness_to_sign, dialogue_templates
)

-- Flavors (shop flavors you can buy)
flavors (
  id, name, display_name, color, star_cost
)

-- Resistance actions (WCU items)
resistance_actions (
  id, name, description, snowflake_cost, effect_type, effect_magnitude
)

-- Edict types (proclamation templates)
edict_types (
  id, name, description, melt_o_meter_cost, target_type
)
```

### Per-Player Game State (Stored Separately)

```typescript
// The complete game state for one player
interface GameState {
  // Resources
  stars: number;
  snowflakes: number;
  meltOMeter: number; // 0-5
  socialInfluence: number; // 0-100

  // Inventory (with quantities)
  toppings: Record<ToppingId, number>;  // { sprinkles: 3, cherry: 1 }
  resistanceActions: Record<ActionId, number>; // { camera: 2, sunglasses: 1 }

  // Flavors (instances with mutable state)
  // These are workers you've hired - they accumulate stars, snowflakes, etc.
  flavors: Record<FlavorId, FlavorInstance>;

  // Active edicts affecting this player
  activeEdicts: ActiveEdict[];

  // Current queue (customer instances, not archetype references)
  queue: QueueEntity[];

  // Progress
  day: number;
  phase: GamePhase;
  billOfRightsProgress: BillOfRightsState;

  // First-time events flags
  seenFirstAgent: boolean;
  seenFirstWorkerTaken: boolean;
  // etc.
}

// A flavor instance (worker you've hired)
interface FlavorInstance {
  id: FlavorId;
  name: string;
  displayName: string;
  color: string;
  assetId: string;  // References /assets/flavors/{id}.png

  // Mutable state (accumulates over time)
  stars: number;        // Total stars earned from serves
  snowflakes: number;   // Accumulated when served to customers with snowflakes
  present: boolean;     // Is currently working (not taken/hiding)?
}

// A customer instance (created when entering queue)
interface CustomerInstance {
  id: string;
  archetypeId: string;  // Reference to archetype template
  name: string;
  assetId: string;  // References /assets/customers/{archetype}-{variant}.png

  // Mutable state
  stars: number;        // Loyalty (0-5), increases with each serve
  snowflakes: number;   // Earned by signing petitions
  favoriteFlavor: FlavorId;  // Rolled on entry

  // Derived state
  favoriteUnlocked: boolean;  // true when stars >= 3
}

// An entity in the daily queue
type QueueEntity =
  | CustomerInstance |  // Full customer instance
  | AgentEntity;       // Agent with edict

interface AgentEntity {
  type: 'agent';
  edictType: string;
  target: string;  // flavorId, toppingId, or 'player'
}
```

**Key points**:
- **Flavors are instances** - they accumulate stars/snowflakes from being served
- **Customers are instances** - created from archetype templates, with rolled favorite flavors
- Both have mutable state that changes during gameplay

---

### Why This Separation?

| What | Where | Why |
|------|-------|-----|
| Flavor definitions | CMS (Supabase) | Shared content, editable |
| Customer archetypes | CMS (Supabase) | Shared templates |
| Game state | Client (Zustand) + optionally persisted | Per-player, fast, private |
| Saved games | Supabase `saved_games` table | For multiplayer/continuation |

---

## 2. Simplified Supabase Schema

### CMS Tables (Content Templates)

```sql
-- Customer ARCHETYPES (templates, not instances)
CREATE TABLE customer_archetypes (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  base_willingness_to_sign INTEGER DEFAULT 50,
  dialogue JSONB DEFAULT '{}',
  -- Reference to asset file (see Assets section below)
  asset_id TEXT NOT NULL  -- e.g., 'customer-regular-1'
);

-- Flavors available for purchase
CREATE TABLE flavors (
  id TEXT PRIMARY KEY,
  name TEXT UNIQUE NOT NULL,
  display_name TEXT NOT NULL,
  color TEXT NOT NULL,
  star_cost INTEGER NOT NULL,
  asset_id TEXT NOT NULL  -- e.g., 'flavor-vanilla'
);

-- Resistance actions
CREATE TABLE resistance_actions (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT,
  snowflake_cost INTEGER NOT NULL,
  effect_type TEXT NOT NULL,
  effect_magnitude JSONB DEFAULT '{}',
  asset_id TEXT  -- Optional: icon for the action
);

-- Edict types
CREATE TABLE edict_types (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT,
  target_type TEXT NOT NULL,
  melt_o_meter_cost INTEGER DEFAULT 1
);
```

### Asset Storage

**Store PNGs as static assets in the project**, not in Supabase:

```
public/assets/
  flavors/
    vanilla.png
    chocolate.png
    strawberry.png
    butter-pecan.png
    pistachio.png
    cotton-candy.png

  customers/
    regular-1.png
    regular-2.png
    curious-1.png
    curious-2.png
    skeptical-1.png
    skeptical-2.png
    supportive-1.png
    fearful-1.png
    opportunist-1.png
    ally-1.png
    informant-1.png

  agents/
    ice-cream-agent.png

  actions/
    camera.png
    sunglasses.png
    legal-pad.png
    whistle.png
    ice-shield.png
    recording-device.png
    dessert-wand.png
    whipped-cream-cloud.png
    fake-edict.png
    cone-of-shame.png

  ui/
    star.png
    snowflake.png
    melt-o-meter-icon.png
```

### Asset Lookup

```typescript
// Asset lookup by CMS asset_id
const ASSET_MAP: Record<string, string> = {
  // Flavors
  'flavor-vanilla': '/assets/flavors/vanilla.png',
  'flavor-chocolate': '/assets/flavors/chocolate.png',
  // ... (could also generate from convention: `/assets/${type}/${id}.png`)

  // Customers
  'customer-regular-1': '/assets/customers/regular-1.png',
  'customer-curious-1': '/assets/customers/curious-1.png',

  // Actions
  'action-camera': '/assets/actions/camera.png',
  // ...
};

function getAssetUrl(assetId: string): string {
  return ASSET_MAP[assetId] || `/assets/fallback.png`;
}

// Or use convention over configuration:
function getAssetUrl(type: string, id: string): string {
  return `/assets/${type}/${id}.png`;
}
```

**Why static files?**
- Game content doesn't change dynamically
- Fast loading (bundled, no network calls)
- Simpler deployment
- Can migrate to Supabase Storage later if needed

### Game State Tables (Per-Player)

```sql
-- Saved games (for persistence/continuation)
CREATE TABLE saved_games (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id),
  game_state JSONB NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Optional: player stats for analytics
CREATE TABLE player_stats (
  user_id UUID PRIMARY KEY REFERENCES auth.users(id),
  games_played INTEGER DEFAULT 0,
  games_won INTEGER DEFAULT 0,
  days_survived INTEGER DEFAULT 0,
  workers_lost_total INTEGER DEFAULT 0
);
```

---

## 3. Agent Interaction: State Outcomes

### The Model

Agent interactions don't have "thwart" or "accept" as coded decisions.
**What matters is the state change that results.**

### Interaction Flow

```
┌─────────────────────────────────────────────────────────────┐
│  AGENT ARRIVES                                               │
│                                                             │
│  Edict: Ban Chocolate                                       │
│  Effect: Chocolate cannot work                              │
│                                                             │
│  Your resistance actions: [Camera] [Sunglasses] [None]      │
│                                                             │
│  [ Use Camera ]    [ Leave Empty-Handed ]                  │
└─────────────────────────────────────────────────────────────┘
```

### State Outcomes

When an agent leaves, the game state updates. Here's what can change:

| Action | Resulting State Changes |
|--------|------------------------|
| **Do nothing** | Edict takes full effect |
| **Use Camera** | 70%: Edict blocked, 30%: Edict takes effect |
| **Use Sunglasses** | Edict takes effect, but melt-o-meter doesn't increase |
| **Use Ice Shield** | First violation ignored, edict otherwise applies |
| **Use Whipped Cream Cloud** | Target hidden, edict cannot be applied |

**The UI doesn't show "thwart" or "accept". It shows what happened.**

### Example Outcome Display

```
┌─────────────────────────────────────────────────────────────┐
│  The Camera flashes!                                        │
│                                                             │
│  The agent blinks and steps back.                           │
│  "Paperwork... error. We'll come back with proper docs."    │
│                                                             │
│  Chocolate remains working.                                 │
│  Melt-o-Meter unchanged.                                    │
│                                                             │
│  [ Continue ]                                               │
└─────────────────────────────────────────────────────────────┘
```

Or:

```
┌─────────────────────────────────────────────────────────────┐
│  You had no resistance action ready.                        │
│                                                             │
│  The agent takes Chocolate away.                            │
│                                                             │
│  Chocolate removed from roster.                             │
│  Melt-o-Meter: ██░░░ 2/5                                    │
│                                                             │
│  [ Collect 5 signatures to recover Chocolate ]             │
│                                                             │
│  [ Continue ]                                               │
└─────────────────────────────────────────────────────────────┘
```

---

## 4. Customer & Flavor Instances

### Customer Creation (When Entering Queue)

```typescript
function createCustomer(archetypeId: string): CustomerInstance {
  const archetype = getArchetype(archetypeId); // From CMS

  return {
    id: generateId(),
    archetypeId,
    name: generateName(archetypeId),
    favoriteFlavor: randomFlavor(), // Rolled on entry
    stars: rollInitialStars(),      // 0-1 initially
    snowflakes: 0,
    favoriteUnlocked: false,
  };
}
```

**The customer doesn't exist before they enter the queue.** Each is a new instance.

### Flavor State (Accumulates Over Time)

```typescript
function serveFlavor(flavorId: FlavorId, customer: CustomerInstance): void {
  const flavor = gameState.flavors[flavorId];

  // Flavor gains stars from being served
  flavor.stars += 1;

  // If customer has snowflakes, flavor gains snowflakes too
  if (customer.snowflakes > 0) {
    flavor.snowflakes += 1;
  }

  // Customer gains loyalty
  customer.stars = Math.min(customer.stars + 1, 5);
  customer.favoriteUnlocked = customer.stars >= 3;
}
```

**Flavors accumulate state** - they get more popular (stars) and more targeted (snowflakes) as the game progresses.

### Why This Matters

| Aspect | Reason |
|--------|--------|
| Customer instances | Each customer is unique, with their own loyalty/snowflakes |
| Flavor instances | Workers grow/popularity based on serves; snowflakes make them targets |
| Favorite flavor rolled | Varies naturally; not predetermined |
| Simple CMS | Archetypes are templates, not instances |

---

## 5. Existing Code Analysis (~/dev/icecream)

### What to THROW OUT

| File | Reason |
|------|--------|
| `src/types/encounter.ts` | Complex encounter types, old conversation model |
| `src/types/dialogue.ts` | Complex dialogue trees, not needed |
| `src/lib/encounter-generator/` | **Entire directory** - procedural generation, tone validation, dialogue flows - all built for old complex design |
| `src/lib/dialogue-flow/` | Conversation flow system |
| `src/lib/dialogue/` | Dialogue management |
| `src/lib/system-adapter/` | Old system adapter |
| `src/lib/simulation-harness/` | Old simulation approach |
| `supabase/migrations/001_cms_schema.sql` | Old schema (customers table, encounters table) |

### What to KEEP or ADAPT

| File | Reason |
|------|--------|
| `src/types/core.ts` | Base types (flavors, phases), but simplify |
| `src/lib/game-engine/loop.ts` | Main loop structure, adapt |
| `src/lib/queue-generator.ts` | Queue generation, simplify |
| `src/lib/math-utils.ts` | RNG utilities |
| `src/lib/redis.ts` | Redis for caching |
| `src/lib/supabase*.ts` | Supabase client setup |
| `src/lib/store/` | Zustand store structure |
| Testing infrastructure | Vitest, Playwright |

### What to BUILD NEW

| Feature | Notes |
|---------|-------|
| Simplified game state types | See section 1 |
| Customer generator | Roll favorites on entry from archetype template |
| Agent generator | **Simple** - assign edict type + target + dialogue template (replaces entire encounter-generator/) |
| Resistance action effects | See `specs/resistance-actions.md` |
| Edict system | See `specs/edicts-system.md` |
| Debug mode | Save/load state |
| Shop system | All tabs |
| Win condition | Bill of Rights flow |

---

## 6. Phased Implementation

### Phase 0: Foundation + Data Model (1-2 days)

**Tasks**:
- [ ] Define simplified TypeScript types
- [ ] Set up new Supabase migrations (simplified schema)
- [ ] Game state structure (Zustand store)
- [ ] Debug mode: save/load to localStorage
- [ ] Admin page for debug saves

**Deliverables**:
- Clean types
- Working debug save/load
- Can save/restore game state

---

### Phase 1: Core Loop (2-3 days)

**Tasks**:
- [ ] Queue generator (customers with rolled favorites)
- [ ] Agent generator (simple edict assignment)
- [ ] Main game loop (morning → queue → interactions → end of day)
- [ ] Basic customer interaction (serve → gain stars)
- [ ] Basic agent interaction (edict → state change)
- [ ] Melt-o-meter tracking
- [ ] **End-of-day summary screen** (see spec below)

**Deliverables**:
- Playable skeleton
- Can serve customers
- Agents arrive, edicts happen
- Daily summary shows what happened

---

### Phase 2: Resistance Actions (2 days)

**Tasks**:
- [ ] Define 10 resistance actions
- [ ] Action effect resolution
- [ ] WCU shop tab
- [ ] Purchase with snowflakes
- [ ] Use during agent interaction

**Deliverables**:
- Can buy and use resistance actions
- Actions affect state outcomes

---

### Phase 3: Shop System (2-3 days)

**Tasks**:
- [ ] Flavors tab (purchase workers)
- [ ] Toppings tab (consumable inventory)
- [ ] WCU tab (already done in Phase 2)
- [ ] Ice Cream Social tab (Bill of Rights)
- [ ] Edicts view tab

**Deliverables**:
- Full shop working

---

### Phase 4: Edicts System (2 days)

**Tasks**:
- [ ] 8 edict types
- [ ] Edict effects on game state
- [ ] Petition to remove
- [ ] Targeting logic

**Deliverables**:
- All edicts working
- Can petition for recovery

---

### Phase 5: Win Condition (1-2 days)

**Tasks**:
- [ ] Social influence tracking
- [ ] Bill of Rights unlock (50 influence)
- [ ] Purchase (100 stars + 20 snowflakes)
- [ ] Signature collection
- [ ] Victory

**Deliverables**:
- Can win the game

---

### Phase 6: Waves + Balance (2-3 days)

**Tasks**:
- [ ] Wave scaling
- [ ] Phase progression
- [ ] Difficulty tuning
- [ ] Balance adjustments

**Deliverables**:
- Well-balanced game

---

### Phase 7: Polish (2-3 days)

**Tasks**:
- [ ] Missing screens
- [ ] Animations
- [ ] Accessibility
- [ ] Final polish

**Deliverables**:
- Complete game

---

## 7. Debug Mode Specification

### API

```typescript
// Save current state
function saveState(name: string): void;

// Load saved state
function loadState(id: string): void;

// Export state (for AI testing)
function exportState(): string;

// Import state
function importState(json: string): void;

// List all saves
function listSaves(): SavedState[];
```

### Admin UI

```
┌────────────────────────────────────────────┐
│  Debug Mode                                │
│                                            │
│  Save: [ Save ]  Name: _______________     │
│                                            │
│  Saved States:                             │
│  • Day 5, 3 workers   [Load] [Delete]      │
│  • Before agent...    [Load] [Delete]      │
│                                            │
│  Quick Actions:                            │
│  [+1000 Stars] [+50 Flakes] [Skip Day]     │
│                                            │
│  Export/Import:                             │
│  [ Export All ]  [ Import JSON ]            │
└────────────────────────────────────────────┘
```

---

## 8. End-of-Day Summary

### Purpose

Show the player what happened during the day/round. Provides feedback on progress and consequences of choices.

### Timing

Shown after the queue is empty and all interactions are resolved.

```
Queue empty → Day complete → Show summary → Start next day
```

### Screen Layout

```
┌─────────────────────────────────────────────────────────────┐
│  END OF DAY: 5                                               │
│                                                             │
│  ┌─────────────────────────────────────────────────────┐   │
│  │  RESOURCES TODAY                                    │   │
│  │  ┌────────────────┐  ┌────────────────┐            │   │
│  │  │ ⭐ +24 Stars    │  │ ❄️ +3 Snowflakes │            │   │
│  │  └────────────────┘  └────────────────┘            │   │
│  └─────────────────────────────────────────────────────┘   │
│                                                             │
│  ┌─────────────────────────────────────────────────────┐   │
│  │  NEW BANS                                           │   │
│  │  🚫 Cherry is banned (3 days)                       │   │
│  │  🚫 Sprinkles are banned (5 days)                    │   │
│  └─────────────────────────────────────────────────────┘   │
│                                                             │
│  ┌─────────────────────────────────────────────────────┐   │
│  │  EXPIRED BANS                                       │   │
│  │  ✅ Chocolate ban has expired                        │   │
│  └─────────────────────────────────────────────────────┘   │
│                                                             │
│  ┌─────────────────────────────────────────────────────┐   │
│  │  WORKERS TAKEN                                      │   │
│  │  😿 Strawberry was taken (need 5 signatures)        │   │
│  │  😿 Pistachio was taken (need 5 signatures)         │   │
│  └─────────────────────────────────────────────────────┘   │
│                                                             │
│  ┌─────────────────────────────────────────────────────┐   │
│  │  WORKERS RECOVERED                                  │   │
│  │  😊 Vanilla has returned (petition successful!)      │   │
│  └─────────────────────────────────────────────────────┘   │
│                                                             │
│  ┌─────────────────────────────────────────────────────┐   │
│  │  CURRENT STATUS                                     │   │
│  │  Workers present: 4 of 6                            │   │
│  │  Melt-o-Meter: ██░░░ 2/5                            │   │
│  │  Social Influence: 27/100                           │   │
│  │  Bill of Rights progress: 3/10 signatures            │   │
│  └─────────────────────────────────────────────────────┘   │
│                                                             │
│  [ CONTINUE TO DAY 6 ]                                     │
└─────────────────────────────────────────────────────────────┘
```

### Section Details

#### Resources Today
- Stars gained (total from serves)
- Snowflakes gained (from signatures)

#### New Bans
- Edicts that were applied during the day
- Shows duration if temporary

#### Expired Bans
- Edicts that have run their course
- Flavor/customer can return (unless stolen)

#### Workers Taken
- Which workers were removed
- Signature requirement to recover

#### Workers Recovered
- Which workers returned via petition
- Celebratory message

#### Current Status
- Workers present count
- Melt-o-Meter level
- Social Influence progress
- Bill of Rights progress (if active)

### Data Structure

```typescript
interface DaySummary {
  day: number;

  // Resources gained today
  starsGained: number;
  snowflakesGained: number;

  // Edict changes
  newEdicts: ActiveEdict[];
  expiredEdicts: ActiveEdict[];

  // Worker changes
  workersTaken: FlavorId[];
  workersRecovered: FlavorId[];
  workersPresent: FlavorId[];

  // Current state
  meltOMeter: number;
  socialInfluence: number;
  billOfRightsProgress?: {
    active: boolean;
    signatures: number;
    required: number;
  };
}
```

### Skip Option

For faster playtesting, add a "Skip" button in debug mode:

```
┌─────────────────────────────────────────────────────────────┐
│  END OF DAY: 5                                               │
│  ...summary content...                                       │
│                                                             │
│  [ CONTINUE TO DAY 6 ]    [ SKIP (debug only) ]             │
└─────────────────────────────────────────────────────────────┘
```

---

## 9. Immediate Next Steps

1. Create simplified Supabase migration (clean slate)
2. Define new TypeScript types
3. Implement debug save/load
4. Build customer generator (roll favorites on entry)
5. Build agent generator (simple edict assignment)

---

## 9. Open Questions

1. **Persistence**: Should we persist game state to Supabase or just localStorage?
2. **Analytics**: Do we want player stats tracking?
3. **Social Feed**: Discord integration for v1 or defer?
4. **Mobile**: Is mobile web a target?
