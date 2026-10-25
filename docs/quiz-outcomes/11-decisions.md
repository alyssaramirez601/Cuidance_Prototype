# Decisions

What the team needs to decide together. The research suggested 13 quiz changes, and checking the wireframes turned up 2 more issues. Each item gets a decision: **Keep** (make the change), **Edit** (change it differently) or **Cut** (leave as is), plus an owner. Until an item is marked Keep or Edit, build the quiz as written in 01-quiz-content.md. Do not build any suggested change on your own.

Decision and owner boxes are blank on the Figma board as of this copy. Update this file when the team decides.

## From the wireframes: two things to line up before testing

| Issue | Detail | Decision | Owner |
| --- | --- | --- | --- |
| The confidence question is worded two ways | Wireframe: "How confident do you feel exploring the areas you picked?" Prototype: "How confident do you feel exploring the products or routines you selected?" Pick one so testers see the same question. | | |
| The wireframe result leaves out hair | Maya picked Hair and Skin, but result screens 06 and 06B only talk about skin. The library adds a hair section (see 02-example-result.md). | | |

## Quiz changes: quick fixes before Thursday

| Gap | Issue | Suggested change | Why it matters | Decision | Owner |
| --- | --- | --- | --- | --- | --- |
| Gap 1 | Skin care's body location is unclear. | Label the midday-feel and sensitivity questions as facial skin if intended. For body care, ask optionally: "Does that feeling or sensitivity also apply to this area?" | Applying a facial answer to every area is an unsupported Assumption. Products also have area-specific directions and restrictions. Strong for those restrictions. | | |
| Gap 6 | The look question forces a choice between different dimensions. | Split into coverage, finish, and exploration flexibility, or allow one coverage plus one finish. | Coverage and optical finish are different formulation properties. Moderate. This is a design-structure issue, not evidence that one look is preferable. | | |
| Gap 7 | Color guidance lacks the matching goal and adequate universal validation. | Ask: "A close skin match, a particular color, more contrast, or exploring?" Keep undertone labels optional. | The cited shade study is population-specific and cannot validate a universal undertone quiz. Moderate within scope; Limited for universal matching rules. | | |
| Gap 8 | Underarm care does not identify the wanted function. | Optional: "Odor control, less wetness, both, or learning the difference?" | Deodorant and antiperspirant have distinct functions. Strong. Ordinary sweat or odor should not be framed as a defect. | | |

## Quiz changes: talk about later

| Gap | Issue | Suggested change | Why it matters | Decision | Owner |
| --- | --- | --- | --- | --- | --- |
| Gap 3 | Hair washing guidance lacks scalp context. | Optional: "How does your scalp usually feel between washes?" Keep scalp discomfort separate from dry-feeling lengths. | AAD ties washing to oil and dirt; texture alone does not establish frequency. Moderate. | | |
| Gap 4 | Hair treatment history is too broad for precise tailoring. | Ask only when relevant: "Which process was used, temporary color, permanent color, bleach, relaxer, perm, smoothing treatment, or not sure?" | Chemical processes differ in fiber effects and safety requirements. Strong. Do not add a numeric heat limit from texture alone. | | |
| Gap 11 | No optional way to describe skin depth on the shade path. | Add the optional 10-swatch row from ST-02, shown only on shade paths, with "Between two" and "Prefer not to say". Never infer it. | Shade guidance cannot order comparisons without it, and guessing would break the no-inference rule. Moderate (Monk scale is an open reference range). | | |
| Gap 12 | Quiz visual examples have not been checked across skin tones. | Review every swatch, illustration and coverage or finish example against the 10-step scale (ST-12) before testing. | Examples that only show light or medium skin signal who the app is for. Assumption; scale is a review tool. | | |
| Gap 13 | No rule yet for products whose shade range stops short. | Add shade-range fields to the product catalog and a "may not include very deep or very light shades" note (ST-05, ST-06). | Shade count is not the same as range; the Youthforia case shows the cost of a deepest shade nobody tested. Moderate. | | |

## Quiz changes: also open

| Gap | Issue | Suggested change | Why it matters | Decision | Owner |
| --- | --- | --- | --- | --- | --- |
| Gap 2 | "Sensitive" does not distinguish a preference from current or repeated symptoms. | Optional follow-up: "Are you exploring gently, or has a product caused ongoing discomfort or a rash?" Include "Prefer not to say." | Recurring rash or itching can warrant medical assessment; sensitivity alone is not a diagnosis. Strong for referral guidance. | | |
| Gap 5 | "Texture or finish" in skin care is ambiguous. | Reword to "How a product feels or looks on skin." Keep skin-surface concerns in a separate optional route. | The current interpretation as product feel is an Assumption, not something the answer establishes. Formulation references support discussing product texture separately. Moderate. | | |
| Gap 9 | Product lookup lacks identity, market, and source certainty. | Capture exact name/version and country of purchase; allow pasted label text. Flag unresolved differences. | US/EU labels and claim requirements differ. Strong for regulatory differences; Assumption for lookup workflow. Avoid mixing records into an invented formula. | | |
| Gap 10 | The personalization and display limits remain unvalidated. | Prototype and test comprehension, relevance, workload, and preference preservation before treating confidence levels or three-point limits as established. | Clear communication has a research base, but exact Cuidance tailoring, stacking, and word counts do not. Moderate for communication principles; Assumption for the proposed system. | | |

## Source fixes: 3 citations to fix

The advice still holds; these citations just need swapping. The full list is in 13-sources.md.

| Issue | Fix | Decision | Owner |
| --- | --- | --- | --- |
| One hair claim cites only the AAD home page | Replace it with the specific AAD page for that claim. | | |
| One study is called a primer study | It is a 2025 color-corrector study of young Chinese adults. Use it as background only. | | |
| One makeup article is cited for things it doesn't cover | Swap it for the two better cosmetic chemistry articles already in the source list. Light-reflecting pigments have no direct source yet. | | |
