# Agent Interaction Specification

## Overview

Agent interactions resolve to **state changes**. The player's choice (use action or not) affects the outcome, but what matters is what actually happens to the game state.

## Flow

```
┌─────────────────────────────────────────────────────────────┐
│  AGENT ARRIVES                                               │
│                                                             │
│  [ Ice Cream Agent icon ]                                   │
│                                                             │
│  "I'm here for Chocolate. They've been flagged."            │
│                                                             │
│  EDICT: Steal a Worker                                      │
│  Target: Chocolate                                          │
│  Effect if applied: Chocolate removed from roster           │
│                                                             │
│  Your Melt-o-Meter: ██░░░ 2/5                               │
│                                                             │
│  Your resistance actions:                                   │
│  [ 📷 Camera:3 ]  [ 🕶️ Sunglasses:4 ]                      │
│                                                             │
│  [ Use Action ]     [ Leave Empty-Handed ]                  │
└─────────────────────────────────────────────────────────────┘
```

## If Player Clicks "Use Action"

Show action selection:

```
┌─────────────────────────────────────────────────────────────┐
│  Select Resistance Action:                                  │
│                                                             │
│  ┌──────────────────┐  ┌──────────────────┐               │
│  │ 📷 Camera        │  │ 🕶️ Sunglasses   │               │
│  │ 3 snowflakes     │  │ 4 snowflakes     │               │
│  │ Reveal papers    │  │ No melt increase │               │
│  └──────────────────┘  └──────────────────┘               │
│                                                             │
│  [ Cancel ]  [ Back ]                                       │
└─────────────────────────────────────────────────────────────┘
```

## If Player Clicks "Leave Empty-Handed"

Or if player has no actions, this is the only option.

## Resolution: State Changes

The agent leaves. The game state updates based on what happened.

### Example 1: Camera Success

```
┌─────────────────────────────────────────────────────────────┐
│  [ Camera animation / sound effect ]                        │
│                                                             │
│  The flash startles the agent!                              │
│                                                             │
│  "Ugh, my eyes... paperwork is incomplete. We'll            │
│   come back with proper documentation."                      │
│                                                             │
│  Agent leaves.                                               │
│                                                             │
│  ┌─────────────────────────────────────────────────────┐   │
│  │  STATE CHANGES:                                     │   │
│  │  • Chocolate: Still working                          │   │
│  │  • Melt-o-Meter: 2/5 (unchanged)                     │   │
│  │  • Inventory: -1 Camera                              │   │
│  └─────────────────────────────────────────────────────┘   │
│                                                             │
│  [ Continue ]                                               │
└─────────────────────────────────────────────────────────────┘
```

### Example 2: No Action Available

```
┌─────────────────────────────────────────────────────────────┐
│  You have no resistance actions ready.                      │
│                                                             │
│  The agent takes Chocolate into custody.                    │
│                                                             │
│  ┌─────────────────────────────────────────────────────┐   │
│  │  STATE CHANGES:                                     │   │
│  │  • Chocolate: Removed from roster                   │   │
│  │  • Melt-o-Meter: ███░░░ 3/5 (+1)                     │   │
│  │  • Workers remaining: 5 of 6                         │   │
│  │  • Active edict: "Chocolate in custody"              │   │
│  └─────────────────────────────────────────────────────┘   │
│                                                             │
│  [ Collect 5 signatures to recover Chocolate ]             │
│                                                             │
│  [ Continue ]                                               │
└─────────────────────────────────────────────────────────────┘
```

### Example 3: Sunglasses (Partial Mitigation)

```
┌─────────────────────────────────────────────────────────────┐
│  You put on the Sunglasses.                                 │
│                                                             │
│  "Whatever. We're taking Chocolate."                        │
│                                                             │
│  Chocolate is taken, but you seem unbothered.               │
│                                                             │
│  ┌─────────────────────────────────────────────────────┐   │
│  │  STATE CHANGES:                                     │   │
│  │  • Chocolate: Removed from roster                   │   │
│  │  • Melt-o-Meter: 2/5 (unchanged - mitigated!)       │   │
│  │  • Workers remaining: 5 of 6                         │   │
│  │  • Active edict: "Chocolate in custody"              │   │
│  │  • Inventory: -1 Sunglasses                          │   │
│  └─────────────────────────────────────────────────────┘   │
│                                                             │
│  [ Continue ]                                               │
└─────────────────────────────────────────────────────────────┘
```

### Example 4: Ice Shield (Violation Blocked)

```
┌─────────────────────────────────────────────────────────────┐
│  The Ice Shield flares as the ban takes effect!             │
│                                                             │
│  "Hey! They were supposed to be banned. Nice trick."        │
│                                                             │
│  Chocolate works today, but can't work tomorrow.            │
│                                                             │
│  ┌─────────────────────────────────────────────────────┐   │
│  │  STATE CHANGES:                                     │   │
│  │  • Chocolate: Still working (shielded today)        │   │
│  │  • Melt-o-Meter: 2/5 (unchanged)                     │   │
│  │  • Active edict: "Ban Chocolate (starts tomorrow)"   │   │
│  │  • Inventory: -1 Ice Shield                          │   │
│  └─────────────────────────────────────────────────────┘   │
│                                                             │
│  [ Continue ]                                               │
└─────────────────────────────────────────────────────────────┘
```

## State Change Outcomes

Each resistance action produces specific state changes:

| Action | State Changes (if successful) |
|--------|------------------------------|
| **Camera** | Edict blocked, target safe, melt-o-meter unchanged |
| **Sunglasses** | Edict happens, melt-o-meter unchanged |
| **Legal Pad** | Edict delayed 1 day, or blocked if no papers |
| **Community Whistle** | Edict pressure reduced (may not apply) |
| **Ice Shield** | First violation ignored |
| **Recording Device** | Edict happens, but -1 signature needed for recovery |
| **Dessert Wand** | Edict redirected to random different target |
| **Whipped Cream Cloud** | Target hidden, edict cannot apply |
| **Fake Edict** | 50%: blocked, 50%: edict happens +2 melt-o-meter |
| **Cone of Shame** | Edict blocked, -2 melt-o-meter, agent won't return |

## No "Thwart" or "Accept" in Code

The code doesn't have boolean flags like `thwarted: true`. Instead:

```typescript
interface AgentInteractionResult {
  edictApplied: boolean;          // Did the edict happen?
  targetRemoved: boolean;         // Was the target taken?
  meltOMeterChange: number;       // -2, -1, 0, +1, +2
  signatureDiscount?: number;     // For Recording Device
  edictDelayed?: number;          // Days delayed
  inventoryChanges: {
    removed: string[];            // Actions consumed
  };
}
```

## Agent Dialog Templates

Simple, direct announcements:

| Edict Type | Dialog |
|------------|--------|
| Warning | "We're watching [target]." |
| Ban Topping | "[Topping] is banned. Hand it over." |
| Ban Flavor | "[Flavor] is flagged. They're leaving." |
| Steal Worker | "We're taking [flavor] in for questioning." |
| Confiscate Topping | "We're taking your [topping] supply." |
| Ban Customers | "[Archetype] types are barred." |
| Steal Customer | "This customer is coming with us." |
| Take You Away | "Your shop is shut down. You're coming with us." |

## Data Structures

```typescript
// Agent in the queue
interface AgentEntity {
  type: 'agent';
  edictType: EdictType;
  target: string;  // flavor, topping, or 'player'
}

// What the player sees
interface AgentEncounter {
  agent: AgentEntity;
  announcement: string;
  edictEffectDescription: string;
  meltOMeterCost: number;
}

// Result of interaction
interface AgentInteractionResult {
  edictApplied: boolean;
  targetRemoved?: boolean;
  meltOMeterChange: number;
  signatureDiscount?: number;
  edictDelayedDays?: number;
  inventoryRemoved: string[];
  narrative: string;  // For display
}

type EdictType =
  | 'warning'
  | 'ban-topping'
  | 'ban-flavor'
  | 'steal-worker'
  | 'confiscate-topping'
  | 'ban-customers'
  | 'steal-customer'
  | 'take-you-away';
```

## Related Specs

- `resistance-actions.md` - Action definitions and effects
- `edicts-system.md` - Edict types and recovery
- `implementation-plan.md` - Overall plan
