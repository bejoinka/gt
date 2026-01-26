# Win Conditions Specification

## Overview

The win condition for Ice Cream Know Your Rights is to ratify the "Bill of Rights" — a document asserting that all desserts were created equal. This is achieved through building social influence and collecting customer signatures.

## The Path to Victory

```
1. Build Social Influence (0 → 50)
2. Unlock "Bill of Rights" at 50 Social Influence
3. Purchase Bill of Rights (stars + snowflakes)
4. Collect Signatures (10 customers × 5 stars each)
5. Present Bill of Rights to King Cone
6. Victory!
```

---

## 1. Social Influence

### What Is It?

Social Influence represents your standing in the Dessert Land community. It's a long-term progress stat that unlocks social actions.

### How to Gain

| Activity | Influence Gain | Notes |
|----------|----------------|-------|
| Serve a customer | +1 | Per serve |
| Complete a community action | +5 | Per action |
| Get a signature | +2 | Per signature |
| Thwart an agent | +3 | Using resistance actions |
| Feed activity | +1 | Per feed post |

### Influence Thresholds

| Threshold | Unlock |
|-----------|--------|
| 10 | Community Event (social impact item) |
| 25 | Town Hall (social impact item) |
| 50 | Bill of Rights (win condition unlock) |

### Display

- Shown in Shop screen
- Progress bar: "Social Influence: [████░░░░] 25/50"
- Qualitative: "Low / Moderate / High / Very High"

---

## 2. Unlocking the Bill of Rights

### Unlock Condition

- **Requirement**: 50 Social Influence
- **Notification**: "The community is ready! Bill of Rights is now available in Ice Cream Social."

### Ice Cream Social Tab

At 50 influence, the Bill of Rights appears in the Ice Cream Social shop tab:

```
┌────────────────────────────────────┐
│  📜 Bill of Rights                 │
│                                    │
│  All desserts were created equal.  │
│  Ratify this document to end       │
│  King Cone's tyranny forever.      │
│                                    │
│  Requires: 50 Social Influence ✓   │
│  Cost: 100 stars + 20 snowflakes   │
│                                    │
│  [ PURCHASE ]                      │
└────────────────────────────────────┘
```

---

## 3. Purchasing the Bill of Rights

### Cost

| Currency | Amount |
|----------|--------|
| Stars | 100 |
| Snowflakes | 20 |

### Purchase Flow

1. Player clicks "Purchase" in Ice Cream Social
2. If player has enough resources:
   - Stars/snowflakes deducted
   - Bill of Rights becomes "Active"
   - Signature collection begins
3. If player doesn't have enough:
   - "You need more [stars/snowflakes] to purchase this."

### Activation State

Once purchased:
- Bill of Rights shows in Ice Cream Social as "Active"
- Progress: "0/10 signatures collected"
- Player can now request signatures from customers

---

## 4. Collecting Signatures

### Signature Request Mechanics

During customer interaction, if Bill of Rights is active:

**Option 3**: "Request signature for Bill of Rights"

**Customer's Cost**: 5 stars

**Customer Decision**:
- Customer checks their own star balance
- Customer checks willingness to sign (based on archetype, loyalty)
- Success/failure determined by:

```typescript
// Simplified logic
const baseChance = customer.willingnessToSign; // 0-100
const loyaltyBonus = customer.stars * 10; // 0-50 bonus for loyalty
const finalChance = baseChance + loyaltyBonus; // 0-150

// Roll against finalChance
const willSign = roll(100) < finalChance;
```

### Outcomes

| Result | Customer Stars | Shop Snowflakes | Progress |
|--------|----------------|-----------------|----------|
| Signs | -5 | +1 | +1 signature |
| Declines | 0 | 0 | No change |
| Can't afford (has <5 stars) | N/A | 0 | No change |

### Customer Dialog

**Success**:
> "Of course I'll sign! This has gone on too long. Here's my signature."
> *Customer gains +1 snowflake*
> *Shop gains +1 snowflake*
> *Progress: 6/10 signatures*

**Decline**:
> "I'm sorry, I can't. It's too risky for me right now."
> *No change*

**Can't afford**:
> "I wish I could, but I don't have the stars to spare."
> *No change*

### Signature Progress Display

Shown in Ice Cream Social section (bottom of customer interaction screen):

```
┌──────────────────────────────────────────┐
│  📜 Bill of Rights                       │
│  Progress: [████████░░] 6/10 signatures  │
│  Next milestone: Present to King Cone    │
└──────────────────────────────────────────┘
```

---

## 5. Presenting to King Cone

### Trigger

When 10 signatures collected:
- Automatic notification: "The Bill of Rights is complete! Present it to King Cone?"
- Or manual "Present" button in Ice Cream Social

### Presentation Sequence

#### Scene: King Cone's Throne Room

**King Cone**:
> "What is this? A... petition?"

**Player**:
> "It's a Bill of Rights. Signed by the people of Dessert Land. All desserts were created equal. Your reign of tyranny ends today."

**King Cone** (laughs):
> "You think a piece of paper can stop me? I am the Cone! The ruler of all sweets!"

**Camera pans to growing crowd outside**:
- Hundreds of customers
- All flavors (even those taken)
- WCU members
- Everyone is holding scoops

**King Cone** (nervous):
> "What... what is this? Why are they all here?"

**Player**:
> "They're with me. Every signature on this document is a person who's ready for change."

**Montage** (if available):
- Flashbacks to customers signing
- Flavors joining the shop
- Resistance actions used
- Community built

**King Cone** (defeated):
> "Fine. Take it. The document. It's... ratified. Are you happy now?"

**Player**:
> "We will be."

**Fade to white**

---

## 6. Victory Screen

### Visual

```
╔═══════════════════════════════════════════════════════════╗
║                                                           ║
║                    ✨ VICTORY ✨                          ║
║                                                           ║
║              The Bill of Rights is Ratified!              ║
║                                                           ║
║           All desserts were created equal.                ║
║                                                           ║
║                                                           ║
║  Days Survived: 24                                        ║
║  Workers Remaining: 4 of 6                               ║
║  Signatures Collected: 10 of 10                           ║
║  Edicts Overcome: 8                                       ║
║                                                           ║
║                                                           ║
║              [ PLAY AGAIN ]    [ MAIN MENU ]              ║
║                                                           ║
╚═══════════════════════════════════════════════════════════╝
```

### Stats Shown

| Stat | Description |
|------|-------------|
| Days Survived | How long the player lasted |
| Workers Remaining | How many of 6 workers are still present |
| Signatures Collected | Total signatures for Bill of Rights |
| Edicts Overcome | How many edicts were protested successfully |
| Customers Served | Total customers served across all days |
| Highest Melt-o-Meter | The highest heat level reached |
| Social Influence Achieved | Final social influence score |

---

## 7. Alternative Victory Conditions

### Quick Victory (Balance consideration?)

*For faster gameplay testing, consider a shorter path:*

| Condition | Requirements |
|-----------|--------------|
| Town Hall Victory | Complete Town Hall (25 influence) |
| Community Victory | Survive 30 days with 3+ workers |

*Note: These are optional difficulty variants, not the main win condition.*

---

## 8. Lose Conditions

### Game Over Scenarios

| Scenario | Trigger | Avoidable? |
|----------|---------|------------|
| Melt-o-Meter Maxed | Heat level reaches 5 | Yes (use resistance actions) |
| Player Taken | Agent "take you away" proclamation | Yes (thwart with action) |
| All Workers Gone | All 6 workers removed | Partially (can recover some) |
| Bankruptcy | No stars to restock | Yes (serve more customers) |

### Game Over Screen

```
╔═══════════════════════════════════════════════════════════╗
║                                                           ║
║                      GAME OVER                            ║
║                                                           ║
║                 The Ice Cream Agents...                   ║
║                     ...have won.                          ║
║                                                           ║
║                                                           ║
║  Days Survived: 12                                       ║
║  Workers Taken: 4 of 6                                   ║
║  Final Melt-o-Meter: 5 (CRITICAL)                        ║
║                                                           ║
║                                                           ║
║              [ TRY AGAIN ]    [ MAIN MENU ]               ║
║                                                           ║
╚═══════════════════════════════════════════════════════════╝
```

---

## 9. Balance Notes

### Snowflake Economy

- Snowflakes are scarce (earned via signatures)
- Each signature costs customer 5 stars
- Shop gains only 1 snowflake per signature
- 20 snowflakes needed for Bill of Rights
- Therefore: ~20-30 signatures needed across game to afford win

### Star Economy

- 100 stars needed for Bill of Rights
- Average serve = 2-3 stars
- Therefore: ~35-50 serves needed

### Time to Win

Estimated play sessions:
- Casual: ~45 minutes (25-30 days)
- Focused: ~30 minutes (15-20 days)
- Speedrun: ~15 minutes (10-12 days)

---

## 10. Implementation Checklist

- [ ] Social influence tracking (0-100 scale)
- [ ] Influence gain logic (serves, signatures, etc.)
- [ ] Bill of Rights unlock at 50 influence
- [ ] Purchase flow (100 stars + 20 snowflakes)
- [ ] Signature request mechanic in customer interactions
- [ ] Customer signing logic (willingness calculation)
- [ ] Signature progress display
- [ ] King Cone presentation sequence
- [ ] Victory screen with stats
- [ ] Game over screen with stats
- [ ] End game state cleanup
- [ ] "Play Again" functionality

---

## 11. Open Questions

- Should player keep stars/snowflakes on replay? (Assume: no, fresh start)
- Should there be achievements? (e.g., "Win with all 6 workers")
- Should victory have multiple endings based on stats? (e.g., "Perfect Victory" with all workers)
- Should there be a New Game+ mode? (Start with bonus)
