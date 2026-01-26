# Ice Cream Know Your Rights

## Summary

Ice Cream Know Your Rights is a satirical survival game that places you, a flavor of ice cream in charge of a new ice cream shop, and under the thumb of a ~tyrannical~ benevolent king cone and his ice cream agents.

Help your fellow citizens to ratify a new constitution, stating all desserts were created equal and have the right to live in dessert land, the home of the sweet.

## Cast of characters:

- Customers (sweet treats from dessert land)
- Ice Cream Agents (ICA)
- The Whipped Cream Underground (rebels against the ICA)
- Flavors
- King cone
- You (a flavor of ice cream)

## Mechanics summary

The game progresses in a series of waves, where a set number of the above characters (excluding king cone) will arrive one-by-one in a random order to visit you in your ice cream shop. Your shop's inventory begins as a single flavor of ice cream (you) that you can use to serve your customers. As new flavors join your team, your shop's capabilities grow and your happy customers help to grow your shop's popularity. While King Cone and the Ice Cream Agents may attempt to thwart your progress through the use of edicts, bans, warrants (judicial or administrative), and threatened closures, the Whipped Cream Underground will band together and help you by teaching you ways to counteract or fend off the agents' advances.

## Early gameplay snippet

Wave 1 is hard-programmed. It begins with 2 customers ("OMG first customer i waited outside all night" and "i cut in line") and another flavor of ice cream. "I saw you just opened. You can't serve just one flavor of ice cream... you need to diversify!"

Cotton Candy would like to join your ice cream shop. Do you accept? "yes"/"no, (but you really should)"

Then, the first agent shows up. "I'm so excited about your new shop! All of the residents of dessert town seem to just love ice cream. I see you hung your permit up in the door."

Serve the agent <your flavor> ice cream.

"Wow, so tasty! Have a great day!"

## Interactions

The interactions are as follows:

- The customer buys ice cream and your popularity increases based on:
  - +1 star for serving the customer
  - +1 star for serving their favorite flavor
  - +1 star for including sprinkles
  - +2 stars for including a cherry
  - +1 snowflake for the flavor if the customer has a snowflake
- The customer provides a signature required for some sort of community action:
  - +1 snowflake on the customer if they sign
- The ICA attempts to thwart your shop's operations based on a proclamation from king cone:
  - Issues a ban for a particular flavor or topping (+1 to melt-o-meter if served)
  - Issues a warning about certain customers (+1 snowflake to flavor and customer if served)
  - Issues a warrant to take a worker (+2 to melt-o-meter if refused)
  - Takes you away to the ice cream truck (if melt-o-meter is at 5)
  - If thwarted, your popularity increases
- WCU unlocks resistance actions that can be purchased and immediately used when interacting with the ICA
  - If successful, your popularity increases and the agent leaves empty-handed
- Flavors may ask to join your shop

More in-depth descriptions below.

### The customer

Properties:

- stars
- snowflakes

The customer always wants some ice cream. At 3 stars, the customer's favorite topping is introduced as a preference.

Each star collected increases the likelihood the customer will perform a community action (e.g. sign a petition)

### The Ice Cream Agent (ICA)

Properties:

- proclamation from king cone
- base resistance chance to lawful attempts at resistance

### The Whipped Cream Underground (WCU)

Properties:

- resistance action

### Flavors

Properties:

- popularity score
- name
- snowflakes

## Objects / Classes

### Stars

As popularity increases, stars are earned. At the beginning of the round, you can elect to use stars to purchase either flavors or toppings.

- First purchased flavor: 3 stars
- Second purchased flavor: 6 stars
- Third purchased flavor: 10 stars
- Fourth purchased flavor: 15 stars
- Fifth purchased flavor: 21 stars

- First purchased topping: 10 stars
- Second purchased topping: 28 stars
- Third purchased topping: 45 stars

### Snowflakes

Snowflakes are representative of community engagement. Every time a customer takes a community action (e.g. signs a petition), they earn a snowflake. Resistance actions can be purchased from the WCU using snowflakes.

Items will cost a certain amount of snowflakes to purchase

### Social Influence

Social influence is the third, and final, currency in the game. It's measured by activity in the activity feed. Higher levels of social influence unlock special achievements.

Achievements (e.g. 10 social influence, 25 social influence, etc.)

- Activate a town hall meeting
- Gain a media spotlight
- Host a community event

The ultimate goal of the game is to gather social influence, which will allow you to petition king cone to step down from the throne.

### Proclamations from king cone

- Warning: ICA more likely to target popular flavors
- Ban topping: ICA more likely to target flavors with that topping
- Steal a worker: ICA most likely to target flavors or customers with highest snowflakes
- Confiscate a topping: ICA
- Take you (if melt-o-meter high): ICA more likely to target you

### Shop Statistics

- Stars: represent your popularity
- Melt-o-meter: represents political heat
- Community: likelihood of successfully capturing a signature

### Ice Cream Social Feed

The feed is connected to a few different sources:

- Discord pinned messages in the ice cream social server
- In-game posts from WCU members
- Proclamations from king cone
- Happy customer testimonials
- ICA Newsletters
- ICA Recruitment messages

Diversified sources allow for a more dynamic and engaging feed. Tying in real world platforms like Discord encourages community involvement and makes it easier for players to share strategies and experiences.

### Resistance actions / items:

Properties:

- type
- impact (snowflakes, melt-o-meter, social influence)

Types:

- Asking for papers / documentation
- Offering ice cream
- Camera
- A can of whipped cream
- Flavowave
- Sunglasses (removes a snowflake from a customer)

### Toppings

Toppings are expensive items that can be added to your inventory. They are a finite resource that can be purchased using stars. Toppings deliver special effects when served to customers.

- sprinkles (x5) - each sprinkles served increases customer stars by 1
- cherry (x3) - each cherry served increases customer stars by 2

## Play / Arc

- First wave has 2 customers, 1 flavor, 1 agent warning
- Second wave has e.g. 4-6 customers and 1-2 agents
- Third wave has customers and 2 agents
- Fourth wave has 10 customers and 3 ICA and 1 WCU
- Fifth wave begins with a proclamation from king cone, and has 12 customers, 4 ICA, and 1 WCU

The stats:

- stars represent your popularity
- melt-o-meter represents political heat
- tea leaves -- accuracy of the feed's predictions
- community is the likelihood of successfully capturing a signature

Proclamations:

- Warning
- Ban topping
- Steal a worker
- Take you (if melt-o-meter)
- Ban customers

Ice Cream Social:

- Petition a lost worker
- Host a town hall meeting
- Share with a friend

The feed is a list of pinned messages inside of a discord channel. Why? Allows people to contribute and find like-minded individuals.

Proclamation every 5 waves

all hail breaks lose
hail king cone

On the ice cream social feed, "we're looking for a sl33t force to join our special team at ICA. UNLIMITED DESSERTS FOR NEW JOINERS"

## Flowchart

Here's an attempt at a flow diagram that describes how the various pieces of the game interact with each other. It may not be complete.

```
flowchart TD
  %% =========================
  %% Core entities and state
  %% =========================
  Y[You shop owner]
  C[Customer]
  ICA[Ice Cream Agent]
  WCU[Whipped Cream Underground]

  F[Flavor inventory]
  T[Topping inventory]

  Stars[(Stars)]
  SnowShop[(Snowflakes shop)]
  Melt{{Melt o meter 0 to 5}}

  Loyalty[(Customer loyalty 0 to 5)]
  SnowCust[(Customer snowflakes)]
  SnowFlavor[(Flavor snowflakes)]

  Bans[Active proclamations and bans]

  %% =========================
  %% Customer arrives
  %% =========================
  C -->|Arrives| Y
  C --> Loyalty

  %% =========================
  %% Player chooses engagement
  %% =========================
  Y -->|Serve ice cream| Serve
  Y -->|Ask for signature| AskSig

  %% =========================
  %% Serve path
  %% =========================
  Serve -->|Choose flavor| F
  Serve -->|Optional topping| T

  Bans -->|Restricts serve options| Serve

  Serve -->|If allowed| StarGain[Gain stars]
  StarGain --> Stars

  Serve -->|If banned flavor or topping| MeltGain[Gain melt point]
  MeltGain --> Melt
  Melt -->|At 5| Fail[Fail state shop shut down]

  Stars -->|Spend stars| BuyFlavor[Unlock more flavors]
  Stars -->|Spend stars| BuyTopping[Unlock more toppings]
  BuyFlavor --> F
  BuyTopping --> T

  %% Snowflake transfer to flavors
  Serve -->|If customer has snowflakes| FlavorAccrue[Flavor gains snowflakes]
  FlavorAccrue --> SnowFlavor

  %% =========================
  %% Signature path
  %% =========================
  AskSig --> SigChance[Chance to sign is loyalty divided by 5]
  SigChance -->|Success| SigOK[Signature collected]
  SigChance -->|Fail| SigFail[No signature]

  SigOK -->|Customer gains snowflake| AddCustFlake[Add customer snowflake]
  AddCustFlake --> SnowCust

  SigOK -->|Shop gains snowflake| AddShopFlake[Add shop snowflake]
  AddShopFlake --> SnowShop

  %% =========================
  %% Snowflakes create targets for ICA
  %% =========================
  SnowCust --> TargetCust[High snowflake customers are targeted more]
  SnowFlavor --> TargetFlavor[High snowflake flavors are targeted more]
  TargetCust --> ICA
  TargetFlavor --> ICA

  %% =========================
  %% ICA proclamations and bans
  %% =========================
  ICA -->|Issues proclamation| Bans

  Bans -->|Ban flavor| BanFlavor[Flavor banned for a time]
  Bans -->|Ban topping| BanTopping[Topping banned for a time]
  Bans -->|Ban customer| BanCustomer[Customer banned for a time]
  Bans -->|Confiscate flavor| Confiscate[Flavor removed for a time]

  Confiscate --> F

  %% =========================
  %% WCU delivers resistance actions
  %% =========================
  WCU -->|Delivers resistance actions over time| ResistMenu[Resistance action menu]

  %% Shop spends snowflakes to execute actions
  SnowShop -->|Spend snowflakes to execute| ResistMenu

  ResistMenu -->|Action reduces bans| ReduceBans[Weaken or delay proclamations]
  ReduceBans --> Bans

  ResistMenu -->|Action restores flavors| Restore[Restore confiscated flavor]
  Restore --> F

  ResistMenu -->|Action reduces melt| ReduceMelt[Reduce or reset melt]
  ReduceMelt --> Melt

  %% =========================
  %% Social impact actions
  %% =========================
  Stars -->|Spend stars| Impact[Social impact actions]
  SnowShop -->|Spend snowflakes| Impact

  Impact -->|Systemic shift reduces agent power| SystemShift[Systemic shift]
  SystemShift --> ICA
  SystemShift --> Bans
```
