# Cuidance

Beauty and personal-care guidance that fits you.

Cuidance is a mobile app that helps people figure out what may fit their hair, skin, makeup and body care. You take a short quiz, and Cuidance explains what may fit you and why, ingredient by ingredient. It never diagnoses, never guesses anything about you from a photo, and never tells you something needs fixing.

> Cuidance offers guidance, not medical advice. If something on your skin, scalp or nails keeps bothering you, please talk to a dermatologist or doctor.

### Our HMW

**How might we help someone understand their own beauty attributes and find guidance that actually fits them, so they stop guessing whether advice applies to them?**

---

## Status

**Beta in progress.** The design is validated and the app build starts next.

| Area | Status |
| --- | --- |
| Research, strategy and user flows | Done |
| Wireframes and clickable prototype | Done, tested with 10 people |
| Brand identity and design system | In review |
| Quiz outcome library (results that change with each answer) | Researched, not yet built |
| App build | Started: sign up, sign in and saving a quiz answer work in Expo Go |
| Live beta (Expo Go) | Planned |

## What it does

- **Short guidance quiz.** Four questions for everyone, then only the questions for the care areas you pick.
- **Results that change with your answers.** Each answer has its own guidance card, and mixing rules decide what happens when two answers meet.
- **"Why this may fit you."** Every suggestion comes with the reason, in plain language.
- **Ingredient and label help.** Learn what is in a product and how to read a label.
- **Saved guidance.** Keep results and routine notes to come back to later.

## Tech stack

- [Expo](https://expo.dev/) and [React Native](https://reactnative.dev/) for the mobile app
- [TypeScript](https://www.typescriptlang.org/) (strict) for all app code
- [Supabase](https://supabase.com/) for the database and authentication
- Expo Go for the beta review path

> This stack is planned. We will update this section if it changes during the build.

## How we work

These rules apply to everyone, even with a team of two.

1. **Main always runs.** Nothing goes into `main` unless the app still starts and works.
2. **One branch per feature.** Start a new branch for each feature or fix, named for what it does (for example `quiz-progress-bar` or `fix-saved-empty-state`).
3. **Every merge goes through a pull request.** Open a pull request into `main` and fill in the template: what changed, why, and screenshots.
4. **One review before merging.** The other teammate reviews and approves every pull request before it is merged.
5. **Clean up after.** Delete the branch once its pull request is merged.
6. **Update `gh-pages` only through a reviewed pull request.** It hosts the clickable prototype that testers use.

## Getting started

### Requirements

- Node.js: the current LTS version (v24 was used to set this up)
- npm
- The Expo Go app on an iOS or Android phone (the app uses Expo SDK 58)
- A free Expo account, signed in to both Expo Go on your phone and Expo CLI on your computer (`npx expo login`)
- A Supabase project (ask the team for access). Run the SQL in `supabase/migrations` once in its SQL Editor, and turn off "Confirm email" under Authentication while testing.

### Install and run

```bash
# 1. Clone the repo
git clone https://github.com/alyssaramirez601/Cuidance_Prototype.git
cd Cuidance_Prototype

# 2. Install dependencies
npm install

# 3. Add your environment variables (see below)
cp .env.example .env

# 4. Sign in to Expo (first time only)
npx expo login

# 5. Start the app
npx expo start
```

On Windows PowerShell, use `Copy-Item .env.example .env` in place of `cp`. Restart `npx expo start` after you change `.env`.

Your phone and computer need to be on the same Wi-Fi. Scan the QR code with Expo Go to open the app on your phone. If Windows Firewall asks about Node.js, allow it on private networks. If your phone can't connect, run `npx expo start --tunnel` instead.

If `npx expo login` fails to open a browser on Windows, use `npx expo login --no-browser` and sign in with your username and password.

### Environment variables

Copy `.env.example` to `.env` in the project root and fill in both values. In the Supabase dashboard, the Project URL is under Project Settings, then Data API, and the publishable (anon) key is under Project Settings, then API Keys. Never use the secret or `service_role` key in the app. `.env` is git-ignored. Never commit real keys to the repo.

```
EXPO_PUBLIC_SUPABASE_URL=your-supabase-url
EXPO_PUBLIC_SUPABASE_ANON_KEY=your-supabase-anon-key
```

## Project structure

What exists today:

```
/app          Screens and navigation (Expo Router): welcome, create account, sign in, and a temporary proof screen, and the quiz question screen in app/quiz
/components   Reusable UI: Screen, Button, TextField, OptionRow, QuizProgress, LoadingState
/constants    tokens.ts, the only source of color, type, spacing and radius
/data         Quiz questions (only U1 and U3 so far)
/hooks        useAuth and useQuizAnswer
/lib          Supabase client, sign-in helpers and saving quiz answers
/assets       App icon and splash images (Expo placeholders for now)
/docs         The clickable prototype, in docs/prototype, and the quiz outcome library, in docs/quiz-outcomes
/supabase     Database migrations (SQL files), in supabase/migrations
```

## Design

- **Figma working file:** wireframes, prototype, validation boards, brand identity and design system
- **Quiz outcome library:** every answer card, mixing rule, safety rule and source

_Add Figma links here before sharing the repo publicly._

## Accessibility and inclusion

Cuidance is designed for everyone, from very deep to very light skin tones and across hair textures.

- **Color contrast:** brand colors were adjusted to meet WCAG contrast guidelines.
- **Not color alone:** status and meaning are always paired with text, icons or shape.
- **Plain language:** guidance is written at about an 8th grade reading level.
- **No guessing:** Cuidance never infers skin tone, undertone, race or any other attribute. You choose what to share.
- **Every skin tone counts:** swatches, illustrations and photos show the full range, and "no close match" is a real result.
- **Safety first:** symptom-based notes suggest a professional when it makes sense, and emergency guidance always stays visible.

## Team

- Alyssa Ramirez
- Esme Bobadilla

## AI use

We use AI tools to support research, design exploration, coding and documentation. Every claim, citation, design decision and line of code is reviewed and verified by the team. Material AI use is logged in our AI disclosure log.

- **Claude:** research synthesis, prompt drafting, Figma board building, documentation
- **ChatGPT:** image generation for style tiles, logo and brand elements; token architecture
- **Perplexity:** sourced secondary research for the competitive landscape and quiz outcome library

AI-generated research is never presented as user research. Synthetic people or simulated feedback are never used as evidence.

## License

_To be decided._
