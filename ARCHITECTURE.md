# ARCHITECTURE.md: Cuidance Mobile

The map of what is built today. CLAUDE.md is the rules; this file is the map.
When code changes, update this map in the same pull request.

_Last updated: Nov 11, 2026 (Week 11, after the guidance result merged in PR #18)._

## 1. Repo layout

```
cuidance_prototype/
├── app/                      Screens (Expo Router: file name = route)
│   ├── _layout.tsx           Root layout: fonts, auth gate, screen stack
│   ├── index.tsx             Welcome (signed out)
│   ├── start.tsx             Sends signed-in people to the first quiz question
│   ├── (auth)/
│   │   ├── create-account.tsx
│   │   └── sign-in.tsx
│   ├── quiz/
│   │   ├── [questionId].tsx  One file for every quiz question
│   │   └── result.tsx        Guidance result
│   ├── (tabs)/               Home, Explore, Saved, Shop, Profile and the tab bar
│   ├── saved/[id].tsx        A reopened saved result
│   ├── proof.tsx             Old test screen, no longer linked
│   └── dev.tsx               Temporary screen showing every component
├── components/               Shared UI, one file per Figma component
├── constants/tokens.ts       The only source of color, type, spacing, radius
├── data/                     Quiz questions and result content (local, typed)
├── hooks/                    useAuth, useQuizAnswer, useQuizNext, useGuidanceResult, useGoBack, useGoogleSignIn
├── lib/                      Supabase client and every database call
├── scripts/                  build-outcome-data.mjs (docs/quiz-outcomes → data/)
├── supabase/migrations/      SQL for the database
├── docs/                     Prototype, wireframes, quiz outcome library, design system spec
└── .github/                  PR template, web deploy and app preview workflows
```

## 2. Supabase tables

Every table has row-level security: a signed-in person can only read and write their own rows. Signed-out visitors get no access.

| Table | What it is for | Written by |
|---|---|---|
| `auth.users` | Sign-in (email and password, or Google). Owned by Supabase. | Supabase Auth |
| `profiles` | One row per person: `display_name` and `quiz_completed_at` (empty until the quiz is finished). Created automatically on sign-up. | Sign-up trigger, `lib/results.ts` |
| `quiz_answers` | A person's current answer to each question. One row per person per question. `skipped` keeps "skipped" different from "not answered yet." | `lib/quizAnswers.ts` |
| `saved_results` | One row each time someone taps Save result: the result name, a copy of their answers, and the content version. The full result text is not stored; it is rebuilt from the answers. | `lib/results.ts` |

Not in the database on purpose: the quiz wording, answer cards, mixing rules, result names and safety lines. They ship in `data/`.

## 3. Routes

```
Signed out
├── /                      Welcome
├── /create-account
└── /sign-in

Signed in
├── /start                 "Welcome, [name]" (Account created): Start guidance opens the first quiz question
├── /home, /explore, /saved, /shop, /profile   The five tabs (app/(tabs)/). Explore, Shop and Profile are stand-ins until they are built
├── /saved/[id]            A saved result, rebuilt from its saved answers. Read-only, back goes to Saved
├── /quiz/[questionId]     Any of the 22 questions (which ones depends on the care areas picked)
├── /quiz/result           Guidance result: Save result, Change my answers, Start over
├── /proof                 Temporary test screen (no longer linked; sign out is on Profile)
└── /dev                   Temporary component screen
```

Saved › Guidance reads `saved_results`. Products, Owned and Routines show empty states until their tables exist.

## 4. Where state lives

- **Supabase holds the data:** who is signed in, their answers, and their saved results. If it matters after the app closes, it lives in Supabase.
- **The app holds UI state only:** which answer is selected before saving, which tab or pop-up is open, loading and error messages.
- **The sign-in session** is kept on the phone with AsyncStorage (through `lib/supabase.ts`) so people stay signed in.
- **The result** is built in the app (`lib/buildResult.ts`) from the saved answers plus the local content in `data/`. It is never stored as text.
- Screens never call Supabase directly. They use a hook, and the hook uses `lib/`.

## 5. Open questions

- **Week 11 loop:** which action in the Admin Web should show up on Mobile (or the other way around)? Waiting on Alyssa and Esme.
- **Admin Web on Supabase:** the Admin Web uses seeded, browser-only data. The loop needs it to read and write the same Supabase project.
- **Home:** Partner Highlights are labeled placeholders until Shop has real partners.
- **Saved › Products, Owned, Routines:** need new Supabase tables (build part 2).
- **Tabs:** peer testing found five tabs a bit much. Keep, merge or move them? Don't change until the team decides.
- **Draft copy:** the lines in `data/draftCopy.ts` are waiting for team approval.
- **Quiz decisions:** 15 open items on the Decisions page of the Outcomes Board (`docs/quiz-outcomes/11-decisions.md`).
- **Guest preview:** promised in the feature list, not built yet.
