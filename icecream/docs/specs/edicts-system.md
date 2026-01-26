# Edicts & Proclamations System

## Overview

Edicts (also called proclamations or bans) are rules issued by King Cone and enforced by ICA agents. They constrain player actions and increase the difficulty of the game. The player must choose whether to comply or resist each edict.

## Core Mechanics

- **Issued by**: King Cone (via periodic announcements) → enforced by ICA agents
- **Delivery**: Agent arrives with proclamation, demands compliance
- **Player choice**: Comply or Resist
- **Effect**: Varies by proclamation type (see below)
- **Duration**: Temporary or permanent

## Proclamation Types

### 1. Warning

**Description**: Agent warns that a flavor or customer is being targeted

**Effect if complied**: No immediate effect; increases melt-o-meter by 1

**Effect if violated**: N/A (warning is informational)

**Duration**: Until next encounter

**Target**: Flavor or customer with high snowflakes

**Agent dialog**:
> "Just so you know, we've had our eye on [flavor/customer]. They've been... active. Best to keep them close."

---

### 2. Ban Topping

**Description**: A specific topping cannot be served

**Effect if complied**: Topping is removed from inventory (temporary)
- Sprinkles: Cannot serve for 3 days
- Cherry: Cannot serve for 5 days

**Effect if violated**: +1 melt-o-meter if served

**Duration**: Temporary (3-5 days)

**Target**: Sprinkles or Cherry

**Agent dialog**:
> "Effective immediately, the sale of [topping] is suspended. King Cone has spoken. Hand it over."

---

### 3. Ban Flavor

**Description**: A specific flavor cannot work in the shop

**Effect if complied**: Flavor goes into hiding (removed from roster)
- Must be petitioned to return
- Worker is not taken permanently

**Effect if violated**: +1 melt-o-meter if served/visible

**Duration**: Until petitioned

**Target**: Any flavor except the player

**Agent dialog**:
> "[Flavor] has been flagged for review. They're to leave the premises immediately. This is for their own protection."

---

### 4. Steal a Worker

**Description**: Agent takes a flavor into custody

**Effect if complied**: Flavor is removed from roster
- Can be protested to recover
- Requires 5 signatures

**Effect if refused**: +2 melt-o-meter

**Duration**: Until protested

**Target**: Any flavor (popular ones targeted more)

**Agent dialog**:
> "We're taking [flavor] in for questioning. They have information we need. This won't take long. Hand them over."

---

### 5. Confiscate Topping

**Description**: Agent seizes all inventory of a topping

**Effect if complied**: Topping removed from inventory
- Must be repurchased after 2 days
- Existing stock is confiscated

**Effect if refused**: +2 melt-o-meter

**Duration**: 2 days

**Target**: Sprinkles or Cherry

**Agent dialog**:
> "We'll be taking your [topping] supply. It's been... flagged. For safety reasons, of course."

---

### 6. Ban Customers

**Description**: Certain customer archetypes are barred

**Effect if complied**: Banned customers no longer appear in queue
- Reduces customer variety
- May reduce overall customer count

**Effect if violated**: +1 melt-o-meter if served

**Duration**: Until petitioned or 5 days (whichever sooner)

**Target**: Specific customer archetype (e.g., "ally", "informant")

**Agent dialog**:
> "We've received reports about [archetype] types causing trouble. They're no longer welcome here. Please turn them away."

---

### 7. Steal a Customer

**Description**: A specific regular customer is taken

**Effect if complied**: Customer removed from customer pool
- Can be protested to recover
- Reduces signature potential

**Effect if refused**: +2 melt-o-meter

**Duration**: Until protested

**Target**: Customer with 5+ stars (loyalty)

**Agent dialog**:
> "This customer [name] has been flagged for additional screening. They'll need to come with us."

---

### 8. Take You Away (Game Over)

**Description**: Agent comes for the player

**Effect if complied**: GAME OVER
- Player is taken away
- Shop closes
- No recovery

**Effect if refused**: GAME OVER (only at melt-o-meter = 5)

**Duration**: Permanent (game over)

**Condition**: Only occurs when melt-o-meter = 5

**Agent dialog**:
> "Your shop has been flagged for repeated violations. You're to come with us. Now."

---

## Targeting Logic

Agents choose targets based on:

1. **Snowflake count**: High-snowflake entities targeted more
2. **Popularity**: Popular flavors targeted more
3. **Randomness**: Some variance to keep it unpredictable
4. **Phase progression**: Targeting becomes more aggressive in later phases

### Targeting Weights

| Factor | Weight |
|--------|--------|
| Customer has 3+ snowflakes | 3x |
| Customer has 5+ snowflakes | 5x |
| Flavor popularity (stars) | 1x per star level |
| Player character | 0.5x (protected initially) |
| Random chance | Always present |

## Duration Tracking

Each edict has:
- **start_date**: When issued
- **end_date**: When expires (if temporary)
- **target**: What the edict affects
- **type**: Proclamation type

**Expiration logic**:
- Temporary edicts expire after N days
- Permanent edicts last until protested
- Petitioning removes edict immediately

## Compliance Flow

### Agent Arrives

1. Agent appears in queue
2. Player clicks to interact
3. Agent reveals proclamation

### Player Choice

#### Option A: Comply

1. Player clicks "Comply"
2. Edict takes effect immediately
3. Agent leaves
4. Melt-o-meter may increase (depends on type)

#### Option B: Resist

1. Player clicks "Resist"
2. Game checks for resistance actions in inventory
3. If none available: must comply
4. If available: player selects action
5. Action resolves (see resistance-actions.md)
6. Agent either leaves (thwarted) or escalates

## Edicts View (Shop Tab)

The Edicts view displays:

| Field | Description |
|-------|-------------|
| Type | Proclamation type (ban, warning, confiscation) |
| Target | Which flavor/topping/customer |
| Issued | Date issued |
| Duration | "Until [date]" or "Until petitioned" |
| Status | Active / Petitioned / Expired |

**Petition button**: If edict is petitionable, shows "Start Petition"

## Petitioning to Remove Edicts

### Which Edicts Can Be Petitioned?

- Ban Flavor (worker in hiding)
- Steal a Worker (worker in custody)
- Steal a Customer (customer taken)
- Ban Customers (archetype barred)

### Petition Costs

| Edict Type | Signatures Needed | Customer Star Cost |
|------------|-------------------|-------------------|
| Ban Flavor | 5 | 3 stars each |
| Steal a Worker | 5 | 4 stars each |
| Steal a Customer | 3 | 2 stars each |
| Ban Customers | 5 | 2 stars each |

### Petition Flow

1. Player starts petition from Edicts view
2. Petition appears in Ice Cream Social section
3. Customers spend their stars to sign
4. When complete, edict is removed
5. Target returns (worker/customer)

## Phase Progression

### Phase 1: Open Operation
- Mostly warnings
- Occasional minor bans (toppings)
- Edicts expire quickly

### Phase 2: Selective Enforcement
- Flavor bans begin
- Worker theft begins
- Edicts last longer

### Phase 3: Procedural Conflict
- Customer bans
- Frequent confiscations
- Multiple simultaneous edicts

### Phase 4: Constraint Saturation
- "Take You Away" threat becomes real
- Most workers gone
- Edicts everywhere

## Implementation Notes

1. **Active edicts stored in game state**: `GameState.activeEdicts[]`
2. **Expiration checked daily**: At start of each day
3. **Melt-o-meter penalties applied immediately**: On violation
4. **Edict stacking**: Multiple edicts can be active simultaneously
5. **Visibility**: Player can always view active edicts from shop

## Data Structure

```typescript
interface Edict {
  id: string;
  type: ProclamationType;
  target: string; // flavor name, topping name, or customer archetype
  issuedAt: Date;
  expiresAt: Date | null; // null for permanent
  isActive: boolean;
  isPetitioned: boolean;
  petitionProgress: number; // signatures collected
  petitionGoal: number; // signatures needed
}

type ProclamationType =
  | "warning"
  | "ban-topping"
  | "ban-flavor"
  | "steal-worker"
  | "confiscate-topping"
  | "ban-customers"
  | "steal-customer"
  | "take-you-away";
```

## Open Questions

- Should edicts stack? (e.g., multiple flavor bans)
- Should there be a "comply streak" bonus? (complying reduces future targeting)
- Should player ever be able to negotiate?
- Should edicts ever be beneficial? (e.g., "ban competitor")
