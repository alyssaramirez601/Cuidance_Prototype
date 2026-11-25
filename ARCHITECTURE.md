# ARCHITECTURE.md: Cuidance Mobile

The map of what is built today. CLAUDE.md is the rules; this file is the map.
When code changes, update this map in the same pull request.

_Last updated: Nov 11, 2026 (Week 11, after the guidance result merged in PR #18)._

## 1. Repo layout

```
cuidance_prototype/
├── app/                      Screens (Expo Router: file name = route)
│   ├── _layout.tsx           Root layout: theme (light/dark), fonts, auth gate, screen stack, animated splash
│   ├── index.tsx             Welcome (signed out)
│   ├── start.tsx             "Welcome, [name]" for brand-new accounts only (made in the last 15 minutes). Everyone else goes straight to Home
│   ├── (auth)/
│   │   ├── create-account.tsx
│   │   └── sign-in.tsx
│   ├── quiz/
│   │   ├── [questionId].tsx  One file for every quiz question
│   │   └── result.tsx        Guidance result
│   ├── (tabs)/               Home, Explore, Saved, Shop, Profile and the tab bar
│   ├── saved/[id].tsx        A reopened saved result
│   ├── saved/board/[id].tsx  One board: pins in two columns, remove pin, delete board
│   ├── profile/              Profile pages: attributes, history, privacy, notifications, account
│   ├── explore/              Explore pages: products, product detail, ingredients, ingredient, education, article
│   ├── shop/                 Partner product and partner collection pages (sample partners)
│   ├── proof.tsx             Old test screen, no longer linked
│   └── dev.tsx               Temporary screen showing every component
├── components/               Shared UI, one file per Figma component (plus AppSplash and Appear for the Nov 20 redesign)
├── constants/tokens.ts       The only source of color, type, spacing, radius
├── assets/splash/            Splash art, one image per layer in light and dark, and the logo mark cut into bowl and circle
├── data/                     Quiz questions and result content (local, typed)
├── hooks/                    useAuth, useQuizAnswer, useQuizNext, useGuidanceResult, useGoBack, useGoogleSignIn, useProfileData, useDeviceSettings, useTheme (light/dark), useMotion (bounce, reduced motion), useSplash
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
├── /home, /explore, /saved, /shop, /profile   The five tabs (app/(tabs)/). Shop has tabs All, Offers, Collections, Workshops
├── /saved/[id]            A saved result, rebuilt from its saved answers. Read-only, back goes to Saved
├── /saved/board/[id]      One board (Pinterest style). Pins open their product, article or result
├── /shop/product/[id]     A partner product, labeled Partner content, with Open partner site (no checkout)
├── /shop/collection/[id]  A partner collection: its partner products in a grid
├── /profile/attributes    Every quiz answer, grouped by area, with Edit attributes and Retake the quiz
├── /profile/history       Saved results, newest first (the newest is marked Current)
├── /profile/products      Products they added from Scan, each with its review status (Waiting for review, Approved, Not approved)
├── /profile/privacy       Privacy choices and the Privacy & Trust sheet
├── /profile/notifications Notification choices
├── /profile/account       Change the display name, send a password reset link
├── /explore/products      Browse by department, category and subcategory (Ulta and Sephora style), or "For you"
├── /explore/product/[id]  Label facts, ingredients with reviewed notes, where to buy
├── /explore/ingredients   Ingredient lookup
├── /explore/ingredient/[name]  Reviewed notes for an ingredient and the products that list it
├── /explore/education     Articles built from reviewed quiz-outcome content
├── /explore/article/[id]  One article, with its safety line and sources
├── /explore/scan          Barcode scanner (expo-camera) with a type-it-in fallback
├── /explore/barcode/[code]  Barcode result: a Cuidance product opens its page; otherwise Open Beauty Facts details or not found
├── /quiz/[questionId]     Any of the 22 questions (which ones depends on the care areas picked)
├── /quiz/result           Guidance result: Save result, Change my answers, Start over
├── /proof                 Temporary test screen (no longer linked; sign out is on Profile)
└── /dev                   Temporary component screen
```

Saved › Guidance reads `saved_results`. Saved › Products and Owned read `user_products` (saved, owned and the owned-product reflection). A saved partner product is stored as `partner:<id>` and can only be saved, not owned or pinned. Saved › Boards reads `boards` and `board_pins` (a pin is a product, article or saved result; Add to board lives on product and article pages). Boards replace Routines. Scan's Add manually writes to `product_submissions` for review in the Admin Web, and Profile › Products you added reads them back with their status. Shop and Home's Partner Highlights read the local sample file `data/partnerContent.ts` (no partner table yet).

## 4. Where state lives

- **Supabase holds the data:** who is signed in, their answers, and their saved results. If it matters after the app closes, it lives in Supabase.
- **The app holds UI state only:** which answer is selected before saving, which tab or pop-up is open, loading and error messages.
- **Privacy and notification choices** are kept on the phone with AsyncStorage (`lib/profile.ts`) for the beta, because nothing reads them yet and there's no database column for them.
- **Light or dark mode** (Match my phone, Light, Dark) is kept on the phone with AsyncStorage (`hooks/useTheme.tsx`, key `cuidance.appearance`). So is the day the full splash last played (`hooks/useSplash.ts`, key `cuidance.splash.lastFullDay`).
- **The sign-in session** is kept on the phone with AsyncStorage (through `lib/supabase.ts`) so people stay signed in.
- **The result** is built in the app (`lib/buildResult.ts`) from the saved answers plus the local content in `data/`. It is never stored as text.
- Screens never call Supabase directly. They use a hook, and the hook uses `lib/`.

## 5. Open questions

- **Week 11 loop:** which action in the Admin Web should show up on Mobile (or the other way around)? Waiting on Alyssa and Esme.
- **Admin Web on Supabase:** the Admin Web uses seeded, browser-only data. The loop needs it to read and write the same Supabase project.
- **Shop and Partner Highlights:** made-up sample partners from the prototype, with dates moved to December (team call, Nov 17). When real partners sign on, replace `data/partnerContent.ts` with a table the Admin Web writes to.
- **Saved › Boards:** replaced Routines (team call, Nov 18). Board copy is in `data/appCopy.ts`.
- **Tabs:** peer testing found five tabs a bit much. Keep, merge or move them? Don't change until the team decides.
- **App copy:** lines not in the prototype live in `data/appCopy.ts` (and are marked "New" in the other copy files). Alyssa approved them on Nov 17.
- **Quiz decisions:** 15 open items on the Decisions page of the Outcomes Board (`docs/quiz-outcomes/11-decisions.md`).
- **Explore:** products, categories, ingredient notes and articles are local data in `data/` for the beta (`products.ts`, `categories.ts`, `ingredientNotes.ts`, `education.ts`). Products show illustrations until photo permission is sorted out. Other stores get search links, not confirmed stock. Scan looks barcodes up in Open Beauty Facts (`lib/barcode.ts`); new dependency `expo-camera` needs Esme's OK.
- **Profile:** delete account needs a server step (it's a turned-off button for now). Email is read-only. Privacy and notification choices are saved on the phone only and don't change anything yet.
- **Guest preview:** promised in the feature list, not built yet.
