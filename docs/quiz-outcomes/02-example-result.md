# Example result: one person, from answers to result

These are the sample answers built into prototype v3 for Maya R., whose result is "Calm hydration, less guesswork" in the wireframes. This shows how the outcome library builds her result.

## Step 1 · Maya's answers

| Code | Question | Answer |
| --- | --- | --- |
| U1 | What would you like help exploring today? | Hair care, Skin care |
| U2 | What would you like to do today? | Find products to explore |
| U3 | How confident do you feel exploring...? | 2 · A little confident |
| U4 | How can Cuidance support you? | Keep things simple, Explain why something may fit |
| H1 | How would you describe your hair texture? | Wavy |
| H2 | What would you like help with most? (hair) | Moisture and dryness, Definition |
| H3 | How do you usually wear or style your hair? | Natural texture, I change it up |
| S1 | How does your skin usually feel by midday? | Shiny in some areas |
| S2 | How would you describe your skin's sensitivity? | Sometimes sensitive |
| S3 | What would you like help with most? (skin) | Moisture and dryness, Fragrance preferences |

## Step 2 · The cards that match

One card per answer she picked. Questions she skipped (makeup, body care, products) stay unknown. Nothing is guessed.

| Answer | Card | What the app says |
| --- | --- | --- |
| Shiny in some areas | SK-S1-03 | "Because shine is limited to some areas, you may prefer adjusting moisturizer by area." |
| Sometimes sensitive | SK-S2-02 | "Because sensitivity happens sometimes, this path keeps changes small and makes room to notice your response." |
| Moisture and dryness (skin) | SK-S3-01 | "Because moisture is your focus, this path explores ways to attract water and help keep it in." |
| Fragrance preferences | SK-S3-03 | "Because fragrance is your focus, this path helps separate scent preference from past reactions." |
| Wavy | HR-H1-02 | "Based on the wavy texture you selected, you may want to explore conditioning and optional hold separately." |
| Moisture and dryness (hair) | HR-H2-01 | "Because dry-feeling hair is your focus, conditioning the lengths may be a useful place to start." |
| Definition | HR-H2-02 | "Because definition is your goal, you may want to compare optional hold products and the feel they leave." |
| Natural texture | HR-H3-01 | "Because you wear your natural texture, this path supports comfort and handling without assuming a different finish." |
| I change it up | HR-H3-05 | "Because you change styles, this path keeps a shared baseline and adds guidance for the method you choose." |

## Step 3 · The rules that fire

Two of her answer pairs have a mixing rule. The rule line replaces the separate card lines, so the result does not repeat itself.

| Pair | Rule | What changes | What the app says |
| --- | --- | --- | --- |
| Shiny in some areas + Moisture and dryness | SK-R02 | Offer a lighter texture on shiny areas and a richer one only where skin feels dry. | "Because you selected both shine in some areas and dryness, you may prefer different amounts of moisturizer in different areas." |
| Wavy + Definition | HR-R08 | Start with a small amount of hold product and compare how it feels before adding more. | "Because definition is your goal, you may want to start with a little hold and explore how it feels." |

## Step 4 · How it is delivered

Her answers to the four "Getting started" questions change the layout and depth, never the advice.

| Answer | Effect |
| --- | --- |
| U2: Find products to explore | Product types come first, as short cards: Purpose, Why it may fit, What to check. No brands. |
| U3: 2 · A little confident | About 100 to 150 words, short examples, and one "Why?" to tap for more on each point. |
| U4: Keep things simple | The short view is the default. Cautions still show. |
| U4: Explain why something may fit | Each point gets one line: what she picked, why it may fit, and any limit. |

## Step 5 · Her result (draft built from the outcome library)

Text below is a suggested draft from the board, compared with the current wireframe 06B.

- **Top bar:** × Your result · Help
- **Eyebrow:** YOUR GUIDANCE
- **Headline:** Calm hydration, less guesswork
- **Subtitle (wireframe 06B):** Light moisture, fragrance-free picks, and a short routine you can build on.
- **Subtitle (library draft):** Light moisture where you need it, fragrance-free picks, and easy wash-day care.
- **Line:** Based on what you selected · edit anytime in Profile
- **You selected chips (wireframe 06B):** shiny in some areas · sometimes sensitive · fragrance preferences
- **You selected chips (library draft):** shiny in some areas · moisture and dryness · wavy hair
- **Why this fits you (library draft):**
  - Because you selected both shine in some areas and dryness, you may prefer different amounts of moisturizer in different areas.
  - Because sensitivity happens sometimes, this path keeps changes small: try one new product at a time.
  - Because fragrance is your focus, fragrance-free options come first while you sort out scent from past reactions.
- **Hair care section (library draft):** Because definition is your goal, you may want to start with a little hold and explore how it feels.
- **Links:** See products that match (Explore · filtered for you) · Education (Explainers for your result)
- **Button:** Save result

### What changes from the wireframe

- **Her hair answers were missing.** Maya picked Hair care too, but the current result only talks about skin. The library adds a hair section.
- **Two answers become one line.** Shine plus dryness is one rule (SK-R02), so the result explains both together instead of contradicting itself.
- **Sensitivity gets a practical step.** "Sometimes sensitive" now comes with something to do: try one new product at a time.
- **Fragrance stays her choice.** The library keeps fragrance-free first but separates a scent preference from a past reaction, instead of assuming.
- **Same title, clearer subtitle.** The title can stay. The subtitle now mentions hair, since she asked about it.
