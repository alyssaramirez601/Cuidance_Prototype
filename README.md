# Cuidance

Beauty and personal-care guidance that fits you.

Cuidance is a mobile app that helps people figure out what may fit their hair, skin, makeup and body care. You take a short quiz, and Cuidance explains what may fit you and why, ingredient by ingredient. It never diagnoses, never guesses anything about you from a photo, and never tells you something needs fixing.

> Cuidance offers guidance, not medical advice. If something on your skin, scalp or nails keeps bothering you, please talk to a dermatologist or doctor.

---

## Status

**Beta in progress.** The design is validated and the app build starts next.

| Area | Status |
| --- | --- |
| Research, strategy and user flows | Done |
| Wireframes and clickable prototype | Done, tested with 10 people |
| Brand identity and design system | In review |
| Quiz outcome library (results that change with each answer) | Researched, not yet built |
| App build | Not started |
| Live beta (Expo Go) | Planned |

## What it does

- **Short guidance quiz.** Four questions for everyone, then only the questions for the care areas you pick.
- **Results that change with your answers.** Each answer has its own guidance card, and mixing rules decide what happens when two answers meet.
- **"Why this may fit you."** Every suggestion comes with the reason, in plain language.
- **Ingredient and label help.** Learn what is in a product and how to read a label.
- **Saved guidance.** Keep results and routine notes to come back to later.

## Tech stack

- [Expo](https://expo.dev/) and [React Native](https://reactnative.dev/) for the mobile app
- [Supabase](https://supabase.com/) for the database and authentication
- Expo Go for the beta review path

> This stack is planned. We will update this section if it changes during the build.

## Getting started

> Setup steps will be filled in once the app environment is created.

### Requirements

- Node.js: _version TBD_
- npm or yarn
- The Expo Go app on an iOS or Android phone
- A Supabase project (ask the team for access)

### Install and run

```bash
# 1. Clone the repo
git clone <repo-url>
cd <repo-folder>

# 2. Install dependencies
npm install

# 3. Add your environment variables (see below)
cp .env.example .env

# 4. Start the app
npx expo start
```

Scan the QR code with Expo Go to open the app on your phone.

### Environment variables

Create a `.env` file in the project root. Never commit real keys to the repo.

```
EXPO_PUBLIC_SUPABASE_URL=your-supabase-url
EXPO_PUBLIC_SUPABASE_ANON_KEY=your-supabase-anon-key
```

## Project structure

> To be filled in once the app is scaffolded.

```
/app          Screens and navigation
/components   Reusable UI components
/constants    Design tokens (color, type, spacing)
/lib          Supabase client and helpers
/data         Quiz questions and outcome library
/assets       Fonts, icons and images
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

Team 03

- **Alyssa Ramirez:** research synthesis, validation, Figma artifacts
- **Esme:** design system, tokens and visual identity

## AI use

We use AI tools to support research, design exploration, coding and documentation. Every claim, citation, design decision and line of code is reviewed and verified by the team. Material AI use is logged in our AI disclosure log.

- **Claude:** research synthesis, prompt drafting, Figma board building, documentation
- **ChatGPT:** image generation for style tiles, logo and brand elements; token architecture
- **Perplexity:** sourced secondary research for the competitive landscape and quiz outcome library

AI-generated research is never presented as user research. Synthetic people or simulated feedback are never used as evidence.

## License

_To be decided._
