# Cuidance quiz outcome library

This folder is a text copy of the team's Figma **Cuidance Quiz Outcomes Board** (all 15 pages). It is the source of truth for quiz wording, answer cards, mixing rules, how results are shown, safety lines, skin tone rules and result names.

Claude Code cannot open Figma, so build from these files. If a file here and the Figma board ever differ, the Figma board wins. Flag the difference instead of guessing.

## Rules for using this library

- Use the wording in these files exactly. Text marked **What the app says** is the exact copy the app shows.
- Never invent quiz wording, answer choices, result text, safety lines or result names. If something you need is not here, stop and ask.
- Skipped questions stay unknown. Nothing is guessed.
- When two answers meet, the mixing rule decides. Safety beats preference. If it is unclear, the app asks.
- The rule line replaces the separate card lines, so the result does not repeat itself.
- No brands are named. The app never diagnoses and never says "you have" or "fix."
- Items marked **Source to fix** are citations the team still needs to swap. The advice stands; do not show these notes in the app.
- Evidence labels: **Strong** (experts agree, or the law says so), **Moderate** (some research or expert guidance, with limits), **Limited** (common advice that is not well studied), **Assumption** (our own design call, to be tested).
- This is AI-assisted secondary research (Perplexity), checked by hand. It is not user research.

## How a result is built

1. **You answer.** 4 questions for everyone, then only the questions for the care areas you picked.
2. **Cards match.** The app pulls the card for each answer.
3. **Rules adjust.** When two answers meet, a mixing rule decides.
4. **Result shows.** Up to 3 things to start with, in the depth and layout the person asked for. Everything else is one tap deeper.

Board totals: 101 answer cards, 70 mixing rules, 77 sources checked by hand, 3 citations to fix.

## Files

| File | Board page | What it holds |
| --- | --- | --- |
| 01-quiz-content.md | 03 Quiz at a glance | Every quiz screen, worded exactly as testers see it |
| 02-example-result.md | 04 Example result | One person's answers traced to their result |
| 03-skin-care.md | 05 Skin care | 16 answer cards, 12 mixing rules |
| 04-hair-care.md | 06 Hair care | 17 answer cards, 12 mixing rules |
| 05-makeup.md | 07 Makeup | 30 answer cards, 12 mixing rules, 12 rules using skin answers |
| 06-body-care.md | 08 Body care | 22 answer cards, 12 mixing rules, 10 rules using skin answers |
| 07-products-and-ingredients.md | 09 Products and ingredients | 16 answer cards and how to read a label |
| 08-results-delivery.md | 10 How results are delivered | How the confidence and support answers change the layout |
| 09-safety.md | 11 Safety | Guardrails and exactly when to suggest a professional |
| 10-every-skin-tone.md | 12 Every skin tone | 15 rules from very deep to very light skin |
| 11-decisions.md | 13 Decisions | Open quiz changes for the team to decide |
| 12-result-names.md | 14 Result names | Names for the result screen, with the rules behind them |
| 13-sources.md | 15 Sources | Every source, and what was checked |

## Code key (board page 02)

Codes are addresses so Figma, the spreadsheet and the app point at the same card.

- **Answer card:** `SK-S1-01` = care area (SK skin care) + question (S1) + answer number (01, the 1st choice). So SK-S1-01 is the card for "Tight or dry" on the first skin question.
- **Mixing rule in one area:** `SK-R01` = skin care rule 1 (Tight or dry + Very sensitive).
- **Rule across two areas:** `X-MU-01` = a skin care answer changes makeup advice (Tight or dry + Matte finish).
- **Skin tone rule:** `ST-04` = "no close match" is an honest result.

| Prefix | Means |
| --- | --- |
| SK | Skin care |
| HR | Hair care |
| MU | Makeup |
| BD | Body care |
| PR | Products and ingredients |
| R | Mixing rule (two answers in the same area) |
| X | Rule across two areas (a skin care answer changes makeup or body care) |
| ST | Skin tone rule |
| C | Caution note (spreadsheet only) |

### Question codes and nicknames

| Code | Screen label | Question | Nickname on cards |
| --- | --- | --- | --- |
| U1 | Getting started · 1 of 4 | What would you like help exploring today? | the care area answer |
| U2 | Getting started · 2 of 4 | What would you like to do today? | the "what to do today" answer |
| U3 | Getting started · 3 of 4 | How confident do you feel exploring the products or routines you selected? | the confidence answer |
| U4 | Getting started · 4 of 4 | How can Cuidance support you? | the support answer |
| N1 | Finding a start | That's okay. What are you hoping to figure out? | the "not sure" follow-up |
| N2 | Finding a start | Here are a few places to start. | the discovery path |
| S1 | Skin care · 1 of 3 | How does your skin usually feel by midday? | the midday-feel answer |
| S2 | Skin care · 2 of 3 | How would you describe your skin's sensitivity? | the sensitivity answer |
| S3 | Skin care · 3 of 3 | What would you like help with most? | the skin goal answer |
| H1 | Hair care · 1 of 3 | How would you describe your hair texture? | the hair texture answer |
| H2 | Hair care · 2 of 3 | What would you like help with most? | the hair goal answer |
| H3 | Hair care · 3 of 3 | How do you usually wear or style your hair? | the styling answer |
| M1 | Makeup · 1 of 4 | What kind of makeup are you exploring? | the makeup area answer |
| M2 | Makeup · 2 of 4 | What would you like help with most? | the makeup goal answer |
| M3 | Makeup · 3 of 4 | What kind of look are you interested in? | the look answer |
| M4 | Makeup · 4 of 4 | What matters most to you when exploring makeup? | the makeup priority answer |
| B1 | Body care · 1 of 3 | What kind of body care are you exploring? | the body care area answer |
| B2 | Body care · 2 of 3 | What would you like help with today? | the body care task answer |
| B3 | Body care · 3 of 3 | What matters most to you? | the body care priority answer |
| P1 | Products and ingredients · 1 of 3 | What would you like to explore? | the product exploration answer |
| P2 | Products and ingredients · 2 of 3 | What would you like help with today? | the product task answer |
| P3 | Products and ingredients · 3 of 3 | What information would be most useful? | the product information answer |

### Caution codes (spreadsheet only; cards write them out under "Watch out for")

| Code | Plain meaning |
| --- | --- |
| SK-C1 | Fragrance can irritate some people. "Unscented" can still hide fragrance. |
| SK-C2 | Retinol and glycolic acid can irritate, especially sensitive skin. |
| SK-C3 | Alcohol-based cleansers can irritate. Fatty alcohols are different. |
| SK-C4 | Check for anything that reacted before. "Hypoallergenic" is not a guarantee. |
| HR-C1 | Fragrance and anything that reacted before. |
| HR-C2 | "Sulfate-free" alone does not prove a shampoo is gentle. |
| HR-C3 | Bleach, dye, relaxers and perms change hair differently. Ask which one. |
| HR-C4 | Some heated smoothing treatments release formaldehyde. |
| HR-C5 | Cetyl and stearyl alcohol condition hair; they are not drying alcohols. |
| MU-C1 | Fragrance and anything that reacted before. |
| MU-C2 | "Hypoallergenic" has no federal definition in the US. |
| MU-C3 | Use products labeled for that area. Lip or cheek color is not automatically eye-safe. |
| MU-C4 | Long-wear claims: check how it comes off, too. |
| MU-C5 | Makeup with pigments is not automatically sunscreen. |
| BD-C1 | Fragrance, including essential oils. |
| BD-C2 | "Hypoallergenic" is not a guarantee. |
| BD-C3 | Exfoliating acids, retinoids and urea are not default suggestions. |
| BD-C4 | Underarm products can cause reactions; aluminum-free is not automatically gentler. |
| BD-C5 | Gel and acrylic nail products can cause allergy; do not peel them off. |
