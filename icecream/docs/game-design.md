# Ice Cream Know Your Rights — Game Design Document

## 1. Concept & Theme

**Ice Cream Know Your Rights** is a satirical survival game. You are a flavor of ice cream who has just opened a new ice cream shop in Dessert Land. Under the thumb of King Cone and his Ice Cream Agents (ICA), you must serve your customers, grow your shop, and help ratify a new constitution stating that all desserts were created equal.

### The Cast

| Character                           | Role                                                                 |
| ----------------------------------- | -------------------------------------------------------------------- |
| **You**                             | A flavor of ice cream, shop owner                                    |
| **Customers**                       | Sweet treats from Dessert Land; give stars when served               |
| **Flavors**                         | Other ice cream flavors; join your shop to expand capabilities       |
| **Ice Cream Agents (ICA)**          | Enforcers of King Cone's proclamations; issue bans, warrants, edicts |
| **Whipped Cream Underground (WCU)** | Rebels; provide resistance actions to counter ICA                    |
| **King Cone**                       | Tyrannical ruler; issues proclamations that constrain your shop      |

### The Core Tension

**Snowflakes make you a target.**

Community engagement (petitions, signatures) earns you snowflakes. But snowflakes mark you—and your customers—as dissidents. The ICA targets those with snowflakes. You must balance building the movement to win with staying alive to keep fighting.

---

## 2. Core Mechanics

### Currencies

| Currency             | Source                                                  | Purpose                                    |
| -------------------- | ------------------------------------------------------- | ------------------------------------------ |
| **Stars**            | Serving customers (base + favorites + toppings)         | Buy flavors, toppings, social impact items |
| **Snowflakes**       | Customer signatures, customer snowflake transfer        | Buy resistance actions from WCU            |
| **Social Influence** | Activity feed, completed events                         | Unlocks win condition (Bill of Rights)     |

### Stats & Resources

| Resource              | Description                                                    |
| --------------------- | -------------------------------------------------------------- |
| **Stars**             | Your popularity; accumulated per-customer; spent in shop       |
| **Snowflakes (shop)** | Community engagement; spent on resistance actions              |
| **Melt-o-Meter**      | Political heat; 0-5 scale; at 5, you're taken away (game over) |
| **Community**         | Likelihood of successfully capturing a signature               |

---

## 3. Game Structure

### Waves

The game progresses in waves. Each wave consists of characters arriving one-by-one in random order. Difficulty scales each wave with more customers, more ICA agents, and periodic proclamations from King Cone.

<!-- TODO: Wave scaling specifics, ICA/WCU appearance rates are in Fast Followers -->

## 4. Screens & Interactions

### 4.1 Shop Screen

**Purpose:** Central hub for all purchases and status. Always accessible from any interaction.

**Elements:**

- **Current resources:** Stars, Snowflakes, Melt-o-Meter, Social Influence
- **Current inventory:** Flavors, toppings, resistance actions
- **Shop tabs:**
  - **Flavors** — Purchase new flavors (star costs)
  - **Toppings** — Purchase replenishable toppings (star costs)
  - **WCU** — Purchase resistance actions (snowflake costs)
  - **Ice Cream Social** — Purchase social impact items (star/snowflake costs)
  - **Edicts** — View active proclamations/bans from King Cone

**UX:** <!-- TODO: No screen yet. -->

**Flavor Purchase Behavior:**
When you purchase a flavor, the flavor joins immediately with a message like:

> "I'd love to come work with you! [flavor-specific dialog]"

The flavor is now in your inventory. No yes/no prompt.

**Access:** Shop button available from all interaction screens.

---

### 4.2 Customer Interaction

**Purpose:** Serve customers, earn stars, optionally collect signatures

**UX:** See `docs/ux/customer-interaction.png`

**Screen Elements:**

- **Customer identity:** Name, appearance
- **Customer stats:**
  - Loyalty/stars (0-5)
  - Snowflakes (if any)
  - Favorite flavor/topping (unlocks at 3 stars)
- **Action buttons (3 choices):**
  1. "Sorry, we can't help you right now" — Decline
  2. "Serve [flavor]" — Serve ice cream (optional topping)
  3. "Request signature" — Only available if community action is active

**Ice Cream Social Section (bottom panel):**

- Active community action (if any)
- Signature progress (e.g., "Bill of Rights: 0/10 signatures")

**Serve Flow:**

1. Click "Serve [flavor]"
2. Select flavor from inventory (if multiple)
3. Optionally select topping
4. Confirm serve

**Serve Outcomes:**

| Condition              | Stars Gained (Shop) |
| --------------------- | ------------------- |
| Base serve            | +1                  |
| Customer's favorite   | +1                  |
| Sprinkles added       | +1                  |
| Cherry added          | +2                  |

**Special:** If customer has a snowflake, the served flavor also gains +1 snowflake.

**Signature Request:**

Customers spend their OWN stars to sign. Costs vary by action type:

| Action Type        | Customer Star Cost |
| ------------------ | ------------------ |
| Petition           | 2                  |
| Community Event    | 3                  |
| Town Hall          | 4                  |
| Bill of Rights     | 5                  |

**Result:** Customer gains +1 snowflake, shop gains +1 snowflake, signature progress increases.

---

### 4.3 Agent Interaction

**Purpose:** ICA agent enforces proclamation; you choose response

**UX:** See `docs/ux/agent-interaction.png`

**Screen Elements:**

- **Agent identity:** Ice Cream Agent
- **Proclamation:** Authority from King Cone (e.g., "Ban Chocolate")
- **Current Melt-o-Meter:** Displayed
- **Action buttons:**
  - **Comply** — Accept the proclamation
  - **Resist** — Purchase and use resistance action (only if available in inventory)

**Proclamation Types:**

| Proclamation       | Effect If Complied                      | Effect If Violated                   |
| ------------------ | --------------------------------------- | ------------------------------------ |
| Warning            | Warns about a flavor/customer as target | —                                    |
| Ban topping        | Cannot serve that topping               | +1 melt-o-meter if served            |
| Ban flavor         | Cannot serve that flavor                | +1 melt-o-meter if served            |
| Steal a worker     | Flavor removed until protested           | +2 melt-o-meter if refused           |
| Confiscate topping | Topping removed temporarily             | +2 melt-o-meter if refused           |
| Ban customers      | Certain customers barred                | +1 melt-o-meter if served            |
| Steal a customer   | Customer removed until petitioned       | +2 melt-o-meter if refused           |
| Take you away      | (Game over)                             | Game over (only at melt-o-meter = 5) |

**Targeting Logic:**

- High-snowflake customers and flavors are targeted more
- A customer with 3 snowflakes will likely be issued a warning
- A customer cannot be stolen until they have 5 stars
- Popular flavors are targeted more

**Resistance Actions:**

Resistance actions are inventory items purchased from the WCU (snowflake costs). When clicked during an agent interaction:

1. Spend the required snowflakes (already paid when purchased)
2. Execute the action
3. Thwart the agent (if successful)
4. Gain popularity

**Resistance Actions (in inventory):**

<!-- TODO: Specific actions and effects TBD. Examples: Camera, Dessert Wand, Sunglasses, etc. -->

---

### 4.4 Whipped Cream Underground (WCU)

**Purpose:** Provides resistance actions for purchase

**Delivery:** WCU members appear periodically (similar to customers) to announce new resistance actions.

**Dialog:** Simple modal with:
- Message from WCU member
- Description of new resistance action
- Snowflake cost
- Impact (what it does)

**Purchase:** Made in the Shop under the WCU tab. Once purchased, item appears in inventory and can be used during agent interactions.

---

### 4.5 Ice Cream Social

**Purpose:** Purchase and manage community actions that drive toward win condition

**Shop Tab — Ice Cream Social:**

**Social Impact Items:**

| Item            | Social Influence Required | Cost         | Effect                               |
| --------------- | ------------------------- | ------------ | ------------------------------------ |
| Community Event | 10                        | stars/flakes | Large snowflake/stars bonus          |
| Town Hall       | 25                        | stars/flakes | Community bonus; protects a flavor   |
| Bill of Rights  | 50                        | stars/flakes | Win condition; collect signatures    |

**Flow:**

1. **Unlock** — Reach required social influence threshold
2. **Purchase** — Spend stars and/or snowflakes
3. **Activate** — Becomes available for signature collection
4. **Collect** — Customers spend their stars to sign
5. **Complete** — When signatures met, execute effect

**Petition vs Protest:**

| Action     | Purpose                          |
| ---------- | -------------------------------- |
| Petition   | Remove an edict/ban              |
| Protest    | Bring back a stolen customer/flavor |

---

### 4.6 Edicts View

**Purpose:** View all active proclamations/bans from King Cone

**Elements:**

- List of all current edicts
- Type (ban, warning, confiscation, etc.)
- Target (which flavor/topping/customer)
- Duration (if temporary)

**Access:** Via Shop tab.

**UX:** <!-- TODO: No screen yet. -->

---

## 5. Resources & Costs

### Flavors (Star Costs)

| Slot                 | Stars |
| -------------------- | ----- |
| 1st purchased flavor | 3     |
| 2nd                  | 6     |
| 3rd                  | 10    |
| 4th                  | 15    |
| 5th                  | 21    |

### Toppings (Star Costs, Replenishable)

| Topping   | Stars | Quantity | Effect             |
| --------- | ----- | -------- | ------------------ |
| Sprinkles | 10    | x5       | +1 star per serve  |
| Cherry    | 28    | x3       | +2 stars per serve |

> **Note:** Toppings are consumable. You can buy more when depleted.

### Resistance Actions (Snowflake Costs)

<!-- TODO: Specific actions and costs TBD. These are expendable, one-use inventory items. -->

---

## 6. Win Condition

### Path to Victory

1. **Build Social Influence** through activity in the feed and completed events
2. **Reach 50 Social Influence** to unlock "Bill of Rights"
3. **Purchase the Bill of Rights** in Ice Cream Social (star/snowflake cost)
4. **Collect signatures** — Customers spend 5 stars each to sign
5. **Complete signature collection** (e.g., 10 signatures)
6. **Present Bill of Rights to King Cone**
7. **Win**

---

## 7. The Ice Cream Social Feed

### Purpose

The feed provides social influence, world-building, and community connection. Activity in the feed drives the social influence stat.

### Feed Sources

| Source                    | Content Type                      |
| ------------------------- | --------------------------------- |
| Discord (pinned messages) | Community posts, strategies       |
| WCU members               | In-game resistance tips           |
| King Cone                 | Proclamations, decrees            |
| Happy customers           | Testimonials                      |
| ICA                       | Newsletters, recruitment messages |

### Social Influence Tracking

Social influence is measured by feed activity. Thresholds unlock social impact items:

- **10** — Unlock Community Event
- **25** — Unlock Town Hall
- **50** — Unlock Bill of Rights (win condition)

---

## 8. Open Questions & TODOs

| Area                    | Question                                  | Status |
| ----------------------- | ----------------------------------------- | ------ |
| Shop screen             | Exact layout for tabbed shop view         | TODO   |
| Edicts view             | How are active bans displayed?            | TODO   |
| Resistance actions      | Specific actions, costs, effects          | TODO   |
| Social impact costs     | Star/snowflake split for each item        | TODO   |
| Feed integration        | Technical implementation of Discord sync  | TODO   |
| Wave 2 sequence         | Define exact Wave 2 sequence              | TODO   |
| Wave 3+ scaling         | Exact customer/agent counts               | TODO   |
| Melt-o-meter decay      | Does it ever decrease without resistance? | TODO   |
| Game Over / Victory     | Screens and messaging                     | TODO   |

---

## 9. UX Screens

| Screen                | File                               | Status |
| --------------------- | ---------------------------------- | ------ |
| Customer Interaction  | `docs/ux/customer-interaction.png` | ✅     |
| Agent Interaction     | `docs/ux/agent-interaction.png`    | ✅     |
| Shop                  | —                                  | TODO   |
| WCU Dialog            | —                                  | TODO   |
| Ice Cream Social Tab  | —                                  | TODO   |
| Edicts View           | —                                  | TODO   |
| Game Over / Victory   | —                                  | TODO   |

---

## 10. Character Traits & Preferences

### Customer Properties

- **Name:** Unique identifier
- **Loyalty (stars):** 0-5, increases with each successful serve
- **Snowflakes:** 0+, gained by signing petitions
- **Favorite flavor:** Unlocks at 3 stars
- **Favorite topping:** Unlocks at 3 stars

### Flavor Properties

- **Name:** Unique flavor identifier
- **Popularity (stars):** Accumulated from serves
- **Snowflakes:** Gained when served to customers who have snowflakes

### ICA Agent Properties

- **Proclamation:** Current authority being enforced
- **Base resistance chance:** Difficulty of resisting without actions

---

## 11. Glossary

| Term                 | Definition                                           |
| -------------------- | ---------------------------------------------------- |
| **Stars**            | Popularity currency; spent on inventory              |
| **Snowflakes**       | Community engagement currency; marks you as a target |
| **Melt-o-Meter**     | Political heat; game over at 5                       |
| **Social Influence** | Long-term progress; unlocks win condition            |
| **WCU**              | Whipped Cream Underground; resistance helpers        |
| **ICA**              | Ice Cream Agents; King Cone's enforcers              |
| **Proclamation**     | King Cone's decree; becomes an active ban/edict      |
| **Petition**         | Remove an edict/ban                                  |
| **Protest**          | Bring back a stolen customer/flavor                  |
