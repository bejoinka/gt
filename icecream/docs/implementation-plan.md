# Ice Cream Know Your Rights — Implementation Plan

## Executive Summary

This document breaks down the implementation of the Ice Cream Know Your Rights game into phases with clear dependencies for parallel development.

**Status**: The game is ~60% implemented. Core infrastructure is solid; main gaps are resistance actions, shop UI completion, and social feed integration.

---

## 1. Confirmed Tech Stack

| Component | Technology | Version | Status |
|-----------|-----------|---------|--------|
| Frontend | Next.js | 16.1.2 | ✅ Implemented |
| UI | React | 19.2.3 | ✅ Implemented |
| Language | TypeScript | 5 | ✅ Implemented |
| Styling | Tailwind CSS | 4 | ✅ Implemented |
| State | Zustand | 5.0.10 | ✅ Implemented |
| Data Fetching | TanStack Query | 5.90.19 | ✅ Implemented |
| Backend | Supabase | 2.90.1 | ✅ Implemented |
| Cache/Queue | Redis (ioredis) | 5.9.1 | ✅ Implemented |
| Testing | Vitest + Playwright | 4 / 1.57 | ✅ Implemented |
| Analytics | PostHog | 1.328.0 | ✅ Implemented |

**No additional stack components needed.**

---

## 2. Existing Codebase Inventory

**Location**: `polecats/nux/icecream/`

### Already Implemented

- ✅ **Core type system** (`src/types/core.ts`) - 900+ lines of comprehensive types
- ✅ **CMS database schema** (migrations 001-006)
  - flavors, workers, customers, encounters, petitions tables
  - test_definitions, game_states, test_runs, agent_encounters
  - events, event_types, event_instances, event_comments
- ✅ **Game engine library** (`src/lib/game-engine/`)
- ✅ **Encounter generator** (`src/lib/encounter-generator/`)
- ✅ **Customer generator** (`src/lib/customer-generator/`)
- ✅ **Agent adapter system** (`src/lib/agent-adapter.ts`)
- ✅ **Supabase integration** (`src/lib/supabase*.ts`)
- ✅ **Redis integration** (`src/lib/redis.ts`)
- ✅ **Session management** (`src/lib/session.ts`)
- ✅ **UI components** (shop, menu, overlays, game, start screens)
- ✅ **Admin panel** (`/admin` routes)
- ✅ **Testing infrastructure** (Playwright E2E tests)

### Main Gaps Identified

1. **Resistance actions** - marked TODO in game-design.md
2. **Shop screen UX** - marked TODO in game-design.md
3. **Edicts view UX** - marked TODO in game-design.md
4. **Social feed integration** - marked TODO in game-design.md
5. **Game Over / Victory screens** - marked TODO in game-design.md

---

## 3. Phased Implementation Plan

### Phase 0: Foundation Cleanup

**Status**: Mostly complete, needs consolidation

**Tasks**:
- [ ] Move working code from `polecats/nux/icecream` to rig root
- [ ] Verify all migrations are ordered correctly
- [ ] Consolidate duplicate migrations (004/005 conflicts noted in git history)
- [ ] Ensure Redis connection is configured for production

**Deliverables**:
- Clean repository structure at `/Users/jb/gt/icecream/`
- Verified migration order (001-009 sequentially)
- Redis connection working

**Can run in parallel with**: Phase 1

**Blocking**: Nothing critical - can be done alongside other work

---

### Phase 1: Core Game Mechanics

**Depends on**: Phase 0 (optional, for clean repo)

**Components**:

#### 1.1 Resistance Actions System
- Define all resistance action types (Camera, Dessert Wand, Sunglasses, etc.)
- Snowflake costs per action
- Effect definitions (what each action does to agent encounters)
- One-use consumable behavior

#### 1.2 Snowflake Transfer Mechanics
- Customer snowflake → served flavor transfer
- Shop snowflake accounting
- Signature collection snowflake rewards

#### 1.3 Edicts/Proclamations Enforcement
- Proclamation types implementation (ban topping, ban flavor, steal worker, etc.)
- Effect tracking (what happens if violated vs complied)
- Duration management (temporary vs permanent)

#### 1.4 Melt-o-Meter Game Over
- 0-5 scale implementation
- Game over trigger at 5
- Visual feedback

#### 1.5 Win Condition
- Bill of Rights purchase (50 social influence unlock)
- Signature collection (10 customers × 5 stars each)
- Presentation to King Cone
- Victory screen

**Sub-docs needed**:
- `docs/specs/resistance-actions.md`
- `docs/specs/edicts-system.md`
- `docs/specs/win-conditions.md`

**Deliverables**:
- Complete resistance actions in game engine
- Edict enforcement working
- Win/lose conditions implemented

**Blocking**: Phase 2, Phase 3, Phase 4

---

### Phase 2: Shop System

**Depends on**: Phase 1 (needs costs, effects defined)

**Components**:

#### 2.1 Flavors Tab
- Display owned flavors
- Purchase new flavors (3/6/10/15/21 star costs)
- Flavor joining dialog ("I'd love to come work with you!")

#### 2.2 Toppings Tab
- Display topping inventory
- Purchase replenishable toppings
  - Sprinkles: 10 stars, quantity 5
  - Cherry: 28 stars, quantity 3
- Consumable tracking

#### 2.3 WCU Tab
- Display available resistance actions
- Purchase with snowflakes
- Show snowflake balance

#### 2.4 Ice Cream Social Tab
- Community Event (10 social influence, stars/flakes cost)
- Town Hall (25 social influence, stars/flakes cost)
  - Protects a flavor
- Bill of Rights (50 social influence, stars/flakes cost)
  - Win condition unlock

#### 2.5 Edicts View Tab
- List all active proclamations
- Type, target, duration display

**Sub-docs needed**:
- `docs/specs/shop-economy.md`

**Deliverables**:
- Full shop UI implemented
- All tabs functional
- Economy balanced

**Blocking**: Phase 6 (polish)

**Can run in parallel with**: Phase 3 (after Phase 1 complete)

---

### Phase 3: Interaction Screens

**Depends on**: Phase 1 (needs mechanics defined)

**Components**:

#### 3.1 Customer Interaction
- Serve flow (flavor selection, topping selection)
- Star calculation (base + favorite + toppings)
- Signature request (customer spends stars)
- Snowflake transfer on serve
- Decline option

#### 3.2 Agent Interaction
- Proclamation display
- Comply button (accept proclamation)
- Resist button (use resistance action from inventory)
- Melt-o-Meter display
- Outcome resolution

#### 3.3 WCU Dialog
- Modal for WCU member encounters
- New resistance action announcement
- Snowflake cost display
- Impact description

#### 3.4 Signature Collection
- Customer star spend (2/3/4/5 based on action type)
- Progress tracking
- Shop snowflake gain
- Customer snowflake gain

**Sub-docs needed**:
- `docs/specs/customer-interaction-flow.md`
- `docs/specs/agent-interaction-flow.md`

**Deliverables**:
- All interaction screens complete
- Flow mechanics working

**Blocking**: Phase 4, Phase 6

**Can run in parallel with**: Phase 2 (after Phase 1 complete)

---

### Phase 4: Wave System & Difficulty Scaling

**Depends on**: Phase 1, Phase 3

**Components**:

#### 4.1 Wave Progression
- Customer/agent ratios per wave
- Wave 1: Mostly customers, 1 agent
- Wave 2: More customers, 2-3 agents
- Wave 3+: Increased density
- Wave N (final): Survival mode

#### 4.2 King Cone Proclamation System
- Periodic announcements
- Proclamation selection logic
- Edict creation

#### 4.3 Difficulty Scaling per Phase
- Phase 1 (open-operation): Few bans, rare agents
- Phase 2 (selective-enforcement): Bans increase, visibility rises
- Phase 3 (procedural-conflict): Agents dominate
- Phase 4 (constraint-saturation): Many workers gone, survival

#### 4.4 Targeting Logic
- High-snowflake customers targeted more
- 3+ snowflakes → warning likely
- 5 stars → customer can be stolen
- Popular flavors targeted more

**Sub-docs needed**:
- `docs/specs/wave-scaling.md`
- `docs/specs/targeting-algorithm.md`

**Deliverables**:
- Wave system implemented
- Difficulty scaling balanced
- Targeting working as designed

**Blocking**: Phase 6, Phase 7

---

### Phase 5: Social Feed Integration

**Depends on**: Phase 1

**Components**:

#### 5.1 Discord Sync
- Bot or webhook for pinned messages
- Message parsing and storage
- Display in game feed

#### 5.2 Feed UI Component
- Activity feed display
- Source indicators (Discord, WCU, King Cone, customers, ICA)
- Scroll functionality

#### 5.3 Social Influence Tracking
- Feed activity → influence points
- Threshold tracking (10, 25, 50)
- Unlock notifications

#### 5.4 Feed Activity → Influence Conversion
- Define point values per activity type
- Time decay (if any)

**Sub-docs needed**:
- `docs/specs/social-feed-integration.md`

**Deliverables**:
- Discord integration working
- Feed displaying
- Social influence affecting unlocks

**Blocking**: Phase 6

**Can run in parallel with**: Phase 2, 3, 4

---

### Phase 6: Polish & UX

**Depends on**: Phase 2, 3, 4

**Components**:

#### 6.1 Missing UX Screens
- Shop screen layout (tabbed view)
- Edicts view design
- WCU dialog design
- Ice Cream Social tab design

#### 6.2 End Game Screens
- Game Over screen
- Victory screen
- Play Again option

#### 6.3 Animations & Transitions
- Screen transitions
- Action feedback
- Victory celebration

#### 6.4 Accessibility
- Keyboard navigation
- Screen reader support
- Color contrast

**Sub-docs needed**:
- `docs/ux/missing-screens.md`

**Deliverables**:
- All screens designed and implemented
- Smooth user experience
- Accessible gameplay

**Blocking**: Phase 7

---

### Phase 7: Balance & Testing

**Depends on**: All phases

**Components**:

#### 7.1 Playtest Sessions
- Human playtests
- Feedback collection
- Issue tracking

#### 7.2 Balance Tuning
- Star economy adjustments
- Snowflake economy adjustments
- Wave difficulty tuning
- Win rate analysis

#### 7.3 Test Coverage
- E2E tests for all flows
- Unit tests for game logic
- Regression tests via test_definitions

#### 7.4 Performance Optimization
- Load time optimization
- Animation smoothness
- Database query optimization

**Deliverables**:
- Balanced game
- Comprehensive test coverage
- Production-ready performance

**Blocking**: Launch

---

## 4. Dependency Map

```
                    ┌─────────────────┐
                    │   Phase 0       │
                    │ (Foundation)    │
                    └────────┬────────┘
                             │
                ┌────────────┼────────────┐
                │            │            │
                ▼            ▼            ▼
         ┌──────────┐  ┌──────────┐  ┌──────────┐
         │ Phase 2  │  │ Phase 3  │  │ Phase 5  │
         │ (Shop)   │  │ (Inter-  │  │ (Feed)   │
         │          │  │  actions)│  │          │
         └────┬─────┘  └────┬─────┘  └────┬─────┘
              │             │             │
              └──────┬──────┴─────────────┘
                     ▼
              ┌──────────────┐
              │   Phase 1    │
              │ (Mechanics)  │
              └──────┬───────┘
                     │
              ┌──────┴───────┐
              ▼              ▼
       ┌──────────┐    ┌──────────┐
       │ Phase 4  │    │ Phase 6  │
       │ (Waves)  │    │ (Polish) │
       └────┬─────┘    └────┬─────┘
            │               │
            └───────┬───────┘
                    ▼
              ┌──────────┐
              │ Phase 7  │
              │ (Balance)│
              └──────────┘
```

### Parallel Work Opportunities

| Track | Phases | Can Run With |
|-------|--------|--------------|
| A | 0, 2 | Each other |
| B | 3 | Phase 2 (after Phase 1) |
| C | 5 | Phase 2, 3, 4 (independent until integration) |
| D | 4 | Phase 2, 3 (after Phase 1) |

---

## 5. Required Sub-Docs

| Doc | For Phase | Priority | Assigned To |
|-----|-----------|----------|-------------|
| `docs/specs/resistance-actions.md` | 1 | HIGH | Game Design |
| `docs/specs/edicts-system.md` | 1 | HIGH | Game Design |
| `docs/specs/win-conditions.md` | 1 | HIGH | Game Design |
| `docs/specs/shop-economy.md` | 2 | MEDIUM | Game Balance |
| `docs/specs/customer-interaction-flow.md` | 3 | MEDIUM | UX/Impl |
| `docs/specs/agent-interaction-flow.md` | 3 | MEDIUM | UX/Impl |
| `docs/specs/wave-scaling.md` | 4 | MEDIUM | Game Balance |
| `docs/specs/targeting-algorithm.md` | 4 | LOW | Systems |
| `docs/specs/social-feed-integration.md` | 5 | LOW | Backend |
| `docs/ux/missing-screens.md` | 6 | MEDIUM | UX |

---

## 6. Immediate Next Steps

1. **Create sub-docs** for Phase 1 specifications
   - `docs/specs/resistance-actions.md` - Define all actions, costs, effects
   - `docs/specs/edicts-system.md` - Proclamation types, effects, durations
   - `docs/specs/win-conditions.md` - Bill of Rights flow, victory conditions

2. **Move code** from `polecats/nux/icecream` to rig root
   - Consolidate working code
   - Verify migrations

3. **File new beads** for each phase with clear dependencies
   - ic-XXX for Phase 1
   - ic-XXX for Phase 2, etc.

---

## 7. Notes

- This is **NOT a greenfield rewrite** - completing existing implementation
- Core infrastructure is solid
- Main gaps are content specs (resistance actions, edicts) and UX completion
- Code in `polecats/nux/icecream` should be moved to rig root before major new work
