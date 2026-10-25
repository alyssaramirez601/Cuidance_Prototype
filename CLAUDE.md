# CLAUDE.md: Cuidance

Rules for any Claude agent working in this repo. Follow them on every task. If something here conflicts with a request, ask before going ahead.

_Last updated: Oct 23, 2026 (Week 8: design tokens added in `constants/tokens.ts`; before that, end of Week 7: logo picked, accessible palette, peer validation results, quiz outcome library)._

## Project context

- **Cuidance** is a mobile app for beauty and personal-care guidance. A short quiz asks about hair, skin, makeup and body care, and the app explains what may fit the person and why.
- It's guidance, never a diagnosis. The app never detects attributes from photos. People tell it about themselves.
- Team: Alyssa (research synthesis, build) and Esme (design, design tokens). Both work in this repo, so this file keeps both builds consistent.
- Platforms: iPhone and Android. The beta review path is Expo Go.
- Main features:
  - account creation and sign in, plus a guest preview
  - the guidance quiz: 4 questions for everyone, then branch questions for each area picked
  - the result screen
  - Home, Explore (search, product detail, ingredient lookup, education), Saved (guidance, products, owned, routines), Shop (labeled partner content) and Profile
- The clickable prototype (`docs/prototype/index.html`) is the **reference for flows and copy**. Match it unless a task says otherwise, or unless the "Validated changes" section below says the prototype is wrong.
- The research source is the Figma file **Cuidance Quiz Outcomes Board** (key `aJy5vMBZIB9EWJgfqoXeye`, 15 pages). It holds the answer cards, mixing rules, delivery rules, result names, safety lines and skin tone rules that the result is built from.
- The Week 7 working file (key `RxyA9ci4hNu3M2bd6o8JYL`) holds the validation boards, brand elements and Esme's identity system board.

## Core stack

- Expo (managed workflow) with React Native
- TypeScript (strict)
- Expo Router for file-based navigation
- Built-in React Native components first, then Expo-supported libraries
- Supabase for authentication, user accounts and the database (quiz answers, saved results, saved and owned products, routines)
- Fonts through `expo-font`: **Newsreader** and **Archivo** (see Styling)
- The quiz content (answer cards, rules, result names, safety lines) ships as local typed data in `data/`, not in the database

## General coding rules

- Readability first, then simplicity, consistency, reusability and maintainability.
- Build **one** shared component for each pattern (button, input, chip, card, list row, sheet) and reuse it everywhere. Never make a second version of a component that already exists.
- Keep components small and single-purpose. Put logic in hooks or `lib/`, not in screens.
- Define props with TypeScript types:

```tsx
type ButtonProps = {
  label: string;
  onPress: () => void;
  variant?: 'primary' | 'secondary';
  disabled?: boolean;
};
```

## Project structure

```
app/                 # Expo Router screens (file name = route)
  _layout.tsx        # root layout, fonts, auth gate
  index.tsx          # welcome
  (auth)/            # create-account, sign-in
  quiz/              # [questionId].tsx, result.tsx
  (tabs)/            # home, explore, saved, shop, profile
  proof.tsx          # temporary test screen for sign-in and saving, replaced by quiz/
components/          # shared UI, PascalCase: Button.tsx, Chip.tsx, ListRow.tsx, Sheet.tsx
data/                # quiz.ts, answerCards.ts, rules.ts, delivery.ts, resultNames.ts, safety.ts, skinTone.ts
lib/                 # supabase.ts, buildResult.ts, helpers
hooks/               # useAuth.ts, useQuiz.ts, useSaved.ts
constants/           # tokens.ts: the only source of color, type, spacing and radius
assets/              # images, fonts, logo
docs/prototype/      # reference prototype (do not edit for the app build)
supabase/migrations/ # SQL for the database, run in the Supabase SQL Editor
```

## Repo and branches

- `main` is the default branch. Make changes on a short-lived branch and open a pull request into `main`.
- `gh-pages` hosts the public clickable prototype that testers use. Only update gh-pages through a reviewed pull request, since testers use it.
- Delete a patch branch only after its pull request is merged.
- `README.md` holds the setup notes. Update its "Getting started" and "Project structure" sections whenever setup or folders change.

## Navigation (Expo Router)

- Each file in `app/` is a route: `app/index.tsx` is `/` and `app/(tabs)/profile.tsx` is `/profile`.
- The bottom tab bar has 5 tabs, in this order: Home, Explore, Saved, Shop, Profile. **Pending team decision:** peer testing found the tabs a bit much and routines hard to find under Education. Don't move or merge tabs until Alyssa and Esme decide.
- The quiz runs as its own stack outside the tabs, with "Save and exit" always available.
- The result lives at `quiz/result` and must offer "Change my answers" (back to the last question) and "Start over" (clears the quiz).

## Components

- Use React Native's `View`, `Text`, `Pressable`, `ScrollView`, `FlatList`, `TextInput`, `Image` and `Modal`.
- Use `Pressable` for every tappable element, not `TouchableOpacity`.
- Use `FlatList` for any list that can grow, such as products, saved items and routines.
- Bottom sheets (Privacy & Trust, Save confirmation, Routine detail) all use the shared `Sheet` component.

## Styling and design system

- Style with `StyleSheet.create` and tokens from `constants/tokens.ts`, which is the only place colors, type, spacing and radius come from. Never hard-code a color, size, spacing or radius value in a screen.
- **Colors:** Esme's accessible palette, as color roles in `colors` (names mirror the Figma variables). v1 ships Light mode (`colors.light`). Dark values stay in the file to match Figma, but dark screens are not built in v1. If a value changes, change it in Figma first, then in `tokens.ts`. If this table and `tokens.ts` ever differ, `tokens.ts` wins. Check with Esme before changing roles.

| Role | Name | Light value | Use |
|---|---|---|---|
| `background` | Quiet Paper | `#F4F2EC` | App background |
| `surface` | | `#FFFFFF` | Cards, sheets, inputs |
| `surfaceWarm` | Warm Care | `#F3E6D3` | Supportive backgrounds and care moments |
| `ink` | Guidance Ink | `#111111` | Main text and icons |
| `inkMuted` | | `#57534B` | Secondary and helper text |
| `accent` | Compass Blue | `#1F3FD1` | Links, primary buttons, focus (`onAccent` `#FFFFFF` for text on it) |
| `brand` | Grounded Green | `#21332B` | Brand anchor, dark surfaces, reversed logo (`onBrand` `#F4F2EC` on it) |
| `selected` | Compass Blue | `#1F3FD1` | Selected answers, chips, active tab (`selectedSurface` `#E6EAFB` behind) |
| `highlight` | Care Terracotta | `#A8432A` | Eyebrow labels only |
| `alert` | Wayfinding Orange | `#A94E00` | Alerts and notices (`alertSurface` `#F9E8D7`) |
| `success` | Steady Olive | `#5E6B3D` | Saved and success (`successSurface` `#E9ECDD`) |
| `error`, `info` | | `#70000E`, `#5A1391` | Error and info states, each with its own `Surface` role |
| `partner` | | `#671253` | Partner and sponsored labels only (`partnerSurface` `#F7E6F1`) |
| `border`, `borderStrong` | | `#DDD7CB`, `#7C766B` | Dividers, and input and control outlines |
| `disabledSurface`, `disabledInk` | | `#E6E2D9`, `#8B867C` | Disabled controls |

- Illustration and collage colors live in `graphic` and are never used for meaning or for text.
- Contrast on Quiet Paper: Ink 16.87:1, Green 11.92:1, Blue 6.97:1, Terracotta 5.36:1. **Never use `surfaceWarm` or any `graphic` color for text**, and never use any color as the only signal. Pair it with a label, icon or shape.
- **Type:** use the `type` styles (display 40/46, heading 28/34, title 20/26, body 16/24, label 15/20, caption 13/18). Newsreader (`fontFamily.display`) for display and headings only, Archivo (`fontFamily.body`) for everything else. The custom "Cuidance" lettering is for the logo only and is never typed as text. Use sentence case, never all caps, except partner labels.
- **Logo:** Logo version 4: the circle-over-bowl mark (Logo Mark B) with Wordmark Style B. Use the files in `assets/logo/` only. Never redraw, recolor outside the palette, stretch or rotate it.
  - Clear space around the logo equals the height of the circle in the mark.
  - Minimum sizes: full lockup 160 px wide, stacked lockup 96 px, symbol only 24 px.
- **Illustrations and textures:** use the brand elements sheet (v03): flat screen-print shapes, one curved cut per shape, no outlines or gradients. Textures are accents only and **never sit behind body text, forms or warnings.**
- **Spacing:** only the `space` steps: 4, 8, 12, 16, 24, 32, 48. Never a value in between. Screen side padding is 24 (`layout.screenEdge`) and padding inside a component is 16 (`layout.insideComponent`).
- **Shape:** `radius.small` (8) for inputs, checkboxes, tags and icon tiles, `radius.medium` (16) for cards, sheets and answer options, and `radius.pill` for buttons and chips. Strokes are `stroke.default` (1) and `stroke.strong` (2, for focus and selected). Keep shadows soft or don't use them.
- Feel: warm, calm, honest and supportive. A wellness feel, never clinical and never a glossy makeup app.

## Images, forms, data, loading and errors

- **Images:** use `expo-image` with a fixed aspect ratio and a placeholder color. Every image needs alt text (`accessibilityLabel`).
- **Forms:**
  - Use the one shared input component, with a visible label (never placeholder-only) and an inline error under the field.
  - Disable buttons until the form is valid.
  - The privacy checkbox on Create account starts **unchecked**.
- **Data:** all Supabase calls go through `lib/` and hooks, never straight from a screen.
- **New accounts and guests start empty:** no sample name, saved items, products, routines or answers. The prototype's sample person (Maya R.) is reference data only and must never appear in a real account. The guest screen says plainly what is and isn't saved without an account.
- **Loading:** show a skeleton or a spinner with text. Never leave a blank screen.
- **Errors:** use friendly, plain-language messages with a retry action. Never show raw error codes.

## Validated changes from Week 7 testing

Peer testing (10 people, Oct 7 to 12) found these problems in the prototype. Build the fixed version, not the prototype version.

1. **Products that may fit:** each result gets a "Products that may fit" section with matching **product types** (for example, "gentle gel cleanser"), each with a short "why." No brand names. (7 of 10 expected this.)
2. **A way out of the result:** "Change my answers" and "Start over" on the result screen. (The "not sure" path was the only task people failed.)
3. **Blank guests and new accounts:** see the Data rule above. (3 of 10 raised it.)
4. **Honest quiz length:** show the step count before the quiz starts, and make the progress bar count branch questions so it never jumps.
5. **Filter tab previews:** each guidance filter tab gets a one-line description of what it shows.
6. **Keep Saved as it is.** It tested best (9 of 10 finished, easiest task).

## Building the result

Follow the Quiz Outcomes Board. In short:

- **Cards and rules:** one card per answer. When two answers meet, a mixing rule replaces both card lines. Skipped questions stay unknown. Nothing is guessed.
- **Delivery changes the layout, never the advice:**
  - "What would you like to do today?" sets the **order** (for example, "Find products to explore" puts product-type cards first: Purpose, Why it may fit, What to check).
  - "How confident do you feel?" sets the **starting depth** (about 80 to 120 words at 1, up to about 180 to 250 at 5). Anyone can expand or shorten.
  - "How can Cuidance support you?" sets the **layout** (compact, compared or explained).
  - Tie-breakers: safety notes always stay visible; "Keep things simple" sets the short view even at confidence 5; free text never overrides safety.
- **Every result uses the same 8 sections, in this order:** Your exploration today, Start here (up to 3 focus points across the whole result), Why these may fit, Explore by care area, Products or ingredients in context, What to check, What remains open, Evidence and sources.
- **3 or more care areas:** one shared overview, then one tab or accordion per area. Shared guidance appears once. Area rules stay separate (facial sensitivity doesn't mean underarm sensitivity). Matched guidance is never dropped, only moved one tap deeper.
- **Result names:** headline under 32 characters (a warm approach, then an easy payoff), subtitle under 85 characters. Name the approach, never the person. Picking order: Very sensitive first, then skin, hair, makeup, body, products. With 2 areas, the second joins the subtitle. With 3 or more, use an umbrella name.
- **Open quiz decisions:** the Decisions page of the Outcomes Board lists 15 open items (for example, the confidence question is worded two ways). Don't build any of them until the team marks it Keep, Edit or Cut.

## Accessibility

- Touch targets are at least 44 x 44.
- Body text is at least 16, and no text is smaller than 12. That includes partner labels.
- Text contrast is at least 4.5:1, including gray text on tinted surfaces.
- Every `Pressable` has an `accessibilityRole` and `accessibilityLabel`. Selected options set `accessibilityState`.
- Support Dynamic Type and font scaling, and never cut text off at large sizes.

## Every skin tone

- Never infer skin tone, undertone or race from answers, photos, a chosen shade, hair texture or a name.
- Optional 10-step depth swatches (based on the Monk Skin Tone Scale) appear **only** on shade paths, with "Between two" and "Prefer not to say."
- "No close match" is a real result at both ends of the range. Never show "the deepest available" or "the lightest available" as a match.
- Every rash or irritation note includes the color line: a reaction may look red, brown, purple or gray, depending on skin tone.
- Every swatch, illustration and photo shows very deep to very light skin. Light skin is never the default.
- No "nude" or "flesh" meaning one color, and no "brightening" or "whitening" unless the person chose that goal.

## Content and safety rules

- Say "may fit" and "based on what you selected." Never "you have," "fix," "perfect," "flawless," "anti-," "problem," "best," "guaranteed" or "slimming."
- No real brand names in guidance. Partner or paid content is always labeled "Partner" and kept separate from guidance, and the Shop has no checkout.
- The emergency line shows on **every** result, outside the tips and never behind "Show more": "If a reaction includes trouble breathing or swelling of your lips, tongue, or throat, seek emergency medical help right away."
- Doctor and professional notes are tied to symptoms the person describes, never to a quiz label alone.
- "I'm not sure yet" always leads to a gentle next step, never a dead end or a guessed goal.
- Every guidance claim in `data/` keeps its evidence label (Strong, Moderate, Limited or Assumption) and its source link from the Outcomes Board.
- Don't use em dashes in app copy.

## Design matching

- When building a screen, match the prototype, Esme's Figma designs and the "Validated changes" section: spacing, typography, hierarchy, alignment and colors.
- Avoid extra gradients, heavy shadows, decorative icons and flashy animation.
- Animations: only simple ones, like fades, slides for sheets and the progress bar. Use `react-native-reanimated` only if it's truly needed.

## Code comments

- Comment *why*, not *what*:

```ts
// Rule replaces both card lines so the result doesn't repeat itself
```

- Don't leave commented-out code or temporary `console.log` calls.

## Dependencies

- Prefer Expo SDK packages. Ask before adding any new dependency, and explain why it's needed.
- Approved so far: expo-router, expo-font, expo-image, @supabase/supabase-js, @react-native-async-storage/async-storage (keeps the sign-in session on the phone), react-native-safe-area-context, react-native-reanimated (only if needed).

## Do not

- Do not convert the project away from Expo, or to another framework or engine.
- Do not add a second version of a component that already exists.
- Do not hard-code colors, type, spacing or radius outside `constants/tokens.ts`.
- Do not add photo or face analysis, diagnosis language or brand recommendations in guidance.
- Do not pre-fill user data, sample accounts or the sample name in the real app.
- Do not edit `docs/prototype/` or anything Esme built in Figma. New Figma work goes in separate frames or files.
- Do not push straight to the `gh-pages` branch. Update it only through a reviewed pull request.
- Do not redraw or restyle the logo.
- Do not commit secrets. Supabase keys go in `.env`, never in code.

## Before you change code

- Read the relevant existing files and understand how the feature works now.
- When fixing a bug, check state, props, navigation and data flow before changing anything.
- After a change, run the app (`npx expo start`) and test the affected flow, including the new-user and guest paths.
- Remove any temporary logging before you finish.

## Working style

- Explain changes in plain, step-by-step language with numbered steps or checklists. Alyssa and Esme are designers, so skip the jargon.
- Make small, focused changes and say which files changed.
- If a request is unclear or would break a rule above, ask first.
- Log AI-assisted work in the team's AI disclosure log.
