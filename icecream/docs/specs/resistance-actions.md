# Resistance Actions Specification

## Overview

Resistance actions are inventory items purchased from the Whipped Cream Underground (WCU) using snowflakes. They are one-use consumables that can be deployed during agent interactions to thwart or mitigate ICA enforcement actions.

## Core Mechanics

- **Purchase**: Bought in Shop → WCU tab
- **Cost**: Paid in snowflakes at time of purchase
- **Usage**: Clicked during agent interaction when ICA agent makes a demand
- **Consumption**: One-time use, removed from inventory after deployment
- **Effect**: Varies by action type (see below)

## Action Types

### 1. Camera

**Cost**: 3 snowflakes

**Effect**: Documents the agent's presence and papers

**Outcomes**:
- Agent's documentation quality is revealed
- If documentation is "incorrect" or "incomplete", agent leaves empty-handed
- If documentation is "correct", reduces melt-o-meter by 1

**Flavor text**:
> "The flash of your camera startles the agent. They pause to consider whether being photographed is worth it."

**Best against**: Agents with "incomplete" or "incorrect" documentation

### 2. Dessert Wand

**Cost**: 5 snowflakes

**Effect**: Distracts the agent with a magical confection

**Outcomes**:
- Agent forgets their original target
- If targeting a worker, worker is safe for this encounter
- If targeting a topping, topping is safe for this encounter
- Reduces melt-o-meter by 1

**Flavor text**:
> "You wave the Dessert Wand. The agent's eyes glaze over as they become transfixed by the swirling sprinkles."

**Best against**: Any targeting action

### 3. Sunglasses

**Cost**: 4 snowflakes

**Effect**: You appear unbothered, projecting confidence

**Outcomes**:
- Reduces melt-o-meter by 1 regardless of outcome
- Allows you to "comply under protest" without penalty
- Community support increases slightly

**Flavor text**:
> "You put on the sunglasses. The agent can't tell if you're taking them seriously or not."

**Best against**: High-pressure situations where you must comply

### 4. Legal Pad

**Cost**: 6 snowflakes

**Effect**: Take notes, demanding the agent slow down

**Outcomes**:
- Forces agent to show documentation
- If documentation is "none", agent leaves
- If documentation is "incomplete", agent must return with proper papers
- Gives time to consider options

**Flavor text**:
> "You start writing down everything the agent says. 'Hold on, let me make sure I get this exactly right.'"

**Best against**: Agents without proper documentation

### 5. Community Whistle

**Cost**: 7 snowflakes

**Effect**: Alert nearby customers who gather to witness

**Outcomes**:
- 1-3 nearby customers arrive as witnesses
- Agent's pressure is reduced by one level (critical→high→medium→low)
- If agent proceeds despite witnesses, community support increases

**Flavor text**:
> "The sharp whistle cuts through the air. Heads turn. The agent looks around nervously at the gathering crowd."

**Best against**: High and critical pressure encounters

### 6. Ice Shield

**Cost**: 8 snowflakes

**Effect**: Temporary protection from consequences

**Outcomes**:
- If you would violate a ban, the first violation is ignored
- No melt-o-meter increase for this encounter
- Shield breaks after use

**Flavor text**:
> "A shimmering barrier of cold air surrounds you. The agent's demands seem to bounce off it."

**Best against**: Bans you must violate (e.g., serving a banned flavor to a loyal customer)

### 7. Recording Device

**Cost**: 5 snowflakes

**Effect**: Records the interaction for potential later use

**Outcomes**:
- Creates a record that can be used in a petition
- If worker is taken, this action provides -1 signature needed for recovery
- Agent is slightly less aggressive (knows they're being recorded)

**Flavor text**:
> "The small red light blinks. The agent notices but says nothing."

**Best against**: Worker removal threats

### 8. Fake Edict

**Cost**: 9 snowflakes

**Effect**: Present a forged document claiming contradictory orders

**Outcomes**:
- 50% chance: Agent is confused and leaves
- 50% chance: Agent sees through it; +2 melt-o-meter
- Success chance increases with community support

**Flavor text**:
> "You produce a document that appears to be from King Cone himself. The agent squints at it."

**Best against**: High-risk situations (gambling on confusion)

### 9. Whipped Cream Cloud

**Cost**: 10 snowflakes

**Effect**: Obscures the target, making them impossible to find

**Outcomes**:
- Targeted worker or customer is hidden
- Agent cannot complete their objective
- Agent leaves frustrated
- Effect lasts until next encounter

**Flavor text**:
> "A thick cloud of whipped cream materializes. When it clears, the agent's target is nowhere to be found."

**Best against**: Any targeting action (worker or customer removal)

### 10. Cone of Shame

**Cost**: 12 snowflakes

**Effect**: Redirects the agent's embarrassment back at them

**Outcomes**:
- Agent is mocked by customers
- Agent leaves immediately
- Melt-o-meter reduced by 2
- Cannot be used again in same session (agents wise up)

**Flavor text**:
> "With a flourish, you place the Cone of Shame on the agent. The customers snicker. The agent's face turns the color of cherry."

**Best against**: Any agent, but only once per game session

## Action Availability

Resistance actions appear in the WCU inventory based on game progression:

| Game Phase | Actions Available |
|------------|-------------------|
| Phase 1 (open-operation) | Camera, Sunglasses, Legal Pad |
| Phase 2 (selective-enforcement) | + Community Whistle, Recording Device |
| Phase 3 (procedural-conflict) | + Dessert Wand, Ice Shield |
| Phase 4 (constraint-saturation) | + Fake Edict, Whipped Cream Cloud, Cone of Shame |

## WCU Dialog

When a new resistance action becomes available, a WCU member appears:

**WCU Member Dialog**:
> "Psst. We've been working on something new. The agents won't know what hit 'em."

**Modal shows**:
- Action name
- Snowflake cost
- Description of effect
- "Purchase" button (if you have enough snowflakes)
- "Not now" button

## Implementation Notes

1. **Storage**: Resistance actions stored in player inventory as consumable items
2. **UI**: Display as buttons during agent interaction if available
3. **Targeting**: Some actions (Dessert Wand, Whipped Cream Cloud) need target selection
4. **Cooldown**: Cone of Shame has per-game limit
5. **Success chances**: Fake Edict uses community support as modifier

## Balance Considerations

- Snowflakes are scarce (earned by signatures, which cost customer stars)
- High-cost actions should be game-changers
- Low-cost actions are situationally useful
- Cone of Shame is a "nuclear option" - expensive but decisive

## Open Questions

- Should resistance actions have a sell-back value?
- Can you use multiple actions in one encounter? (Assume: yes)
- Do actions expire after certain phases? (Assume: no)
