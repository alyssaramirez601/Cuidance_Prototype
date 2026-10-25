# Cuidance components (Week 8 design system)

Text copy of the main components on the team's Figma Week 8 page ("W08 S02 · Main Components (source)"). Claude Code cannot open Figma, so build from this file. If this file and Figma ever differ, Figma wins. Flag the difference.

## Rules

- **Same names as Figma.** The component name in code matches Figma: `Button`, `AnswerOption`, `Chip`, `TextInput`, `Checkbox`, `QuizProgress`, `HelpButton`, `DisclosureLabel`, `Toast`, `TabItem`, `TabBar`, `TopBar`, `GuidanceResultCard`, `ProductCard`, `HelpPanel`, `Icon`.
- **Props mirror Figma variant properties.** Figma `Style=Primary, State=Disabled` becomes `<Button style="primary" state="disabled" />`. Prop names and values are the Figma property names and values in lowercase.
- **Tokens only.** Every value below is a token from `constants/tokens.ts`. Figma `color/accent` = `colors.light.accent`, `color/on-accent` = `colors.light.onAccent`, `color/border-strong` = `colors.light.borderStrong` (kebab-case in Figma, camelCase in code). `radius/pill` = `radius.pill`. Text styles `Cuidance/Label`, `Cuidance/Body`, `Cuidance/Caption`, `Cuidance/Heading` = `type.label`, `type.body`, `type.caption`, `type.heading`.
- **Pressed** in code is the press state (Pressable). **Hover** only applies on web; mobile can skip it but the `/dev` screen still shows it.
- Example text below is Figma sample copy, not app copy. Real quiz and result copy comes from `docs/quiz-outcomes/`.
- Sizes are the Figma frame sizes. Widths like 343 mean "full width inside 16px screen padding on a 375 screen"; in code use full width, not a fixed 343.

## Icon

11 icons, 24x24, stroke-only, stroke width 1.75, round caps and joins. Stroke color comes from a token passed in (default `ink`). Path data is in `icons.md`.

Names: `home`, `explore`, `saved`, `shop`, `profile`, `help`, `check`, `alert`, `back`, `close`, `arrow`.

## Button

Props: `style` = `primary` | `secondary` | `ghost`; `state` = `default` | `hover` | `pressed` | `disabled`.

Layout: height 48, padding 12 vertical / 24 horizontal, gap 8, radius `pill`, horizontal. Text style `label`.

| style | state | Fill | Border | Text |
| --- | --- | --- | --- | --- |
| primary | default | accent | none | onAccent |
| primary | hover | accentHover | none | onAccent |
| primary | pressed | accentPressed | none | onAccent |
| primary | disabled | disabledSurface | none | disabledInk |
| secondary | default | surface | accent, 1 | accent |
| secondary | hover | background | accent, 1 | accent |
| secondary | pressed | border | accent, 1 | accent |
| secondary | disabled | surface | disabledInk, 1 | disabledInk |
| ghost | default | none | none | accent |
| ghost | hover | background | none | accent |
| ghost | pressed | border | none | accent |
| ghost | disabled | none | none | disabledInk |

## AnswerOption

Props: `indicator` = `radio` | `checkbox`; `state` = `default` | `pressed` | `selected` | `disabled`.

Layout: min height 56, padding 16, gap 12, radius `medium`, horizontal. Indicator 22x22 (radio: radius `pill`; checkbox: radius `small`). Label text style `body`.

| state | Fill | Border | Indicator | Label |
| --- | --- | --- | --- | --- |
| default | surface | borderStrong, 1 | surface fill, borderStrong 1 border | ink |
| pressed | background | borderStrong, 1 | surface fill, borderStrong 1 border | ink |
| selected | selectedSurface | selected, 2 | selected fill; radio shows an 8x8 surface-colored dot, checkbox shows the `check` icon (16) in surface color | ink |
| disabled | disabledSurface | border, 1 | disabledSurface fill, disabledInk 1 border | disabledInk |

Use `radio` for "Choose one" questions and `checkbox` for "Choose up to N" and "Select all that apply".

## Chip

Props: `state` = `default` | `pressed` | `selected` | `disabled`.

Layout: height 40, padding 8 vertical / 16 horizontal, gap 8, radius `pill`. Text style `label`.

| state | Fill | Border | Text | Extra |
| --- | --- | --- | --- | --- |
| default | surface | borderStrong, 1 | ink | |
| pressed | background | borderStrong, 1 | ink | |
| selected | selectedSurface | selected, 2 | selected | `check` icon (16) before the text |
| disabled | disabledSurface | border, 1 | disabledInk | |

## TextInput

Props: `state` = `default` | `focus` | `error` | `disabled`.

Layout: vertical, gap 8: label (text `label`, ink), field (height 48, padding 12 vertical / 16 horizontal, radius `small`, text `body`), helper row (text `caption`, gap 4).

| state | Label | Field fill | Field border | Field text | Helper |
| --- | --- | --- | --- | --- | --- |
| default | ink | surface | borderStrong, 1 | placeholder inkMuted | inkMuted |
| focus | ink | surface | accent, 2 | ink | inkMuted |
| error | ink | surface | error, 2 | ink | `alert` icon (16) + message in error |
| disabled | disabledInk | disabledSurface | border, 1 | disabledInk | disabledInk |

## Checkbox

Props: `state` = `unchecked` | `checked` | `error` | `disabled`.

Layout: horizontal, gap 12. Box 22x22, radius `small`. Text column (gap 4): label text `body`.

| state | Box | Label | Extra |
| --- | --- | --- | --- |
| unchecked | surface fill, borderStrong 1 border | ink | |
| checked | accent fill, `check` icon (16) | ink | |
| error | surface fill, error 2 border | ink | error message below in `caption`, error |
| disabled | disabledSurface fill, disabledInk 1 border | disabledInk | |

## QuizProgress

Props: `step` (1 to 4 in Figma; in code take `current` and `total`) plus the label text.

Layout: vertical, gap 8. Label text `caption`, inkMuted. Track height 6, fill `border`, radius `pill`. Progress bar fill `accent`, radius `pill`, width = current / total of the track.

Note: the Figma sample label says "Question 1 of 4". The real label comes from `docs/quiz-outcomes/01-quiz-content.md` (for example "Getting started · 1 of 4"). The quiz content wins.

## HelpButton

Props: `state` = `default` | `pressed`.

Layout: height 44, padding 8 vertical / 12 horizontal, gap 4, radius `pill`, border borderStrong 1. `help` icon (20) + "Help" in `label`, ink. Fill: default surface, pressed border.

## DisclosureLabel

Props: `type` = `partner` | `sponsored`.

Layout: height 28, padding 4 vertical / 8 horizontal, radius `small`. Fill partnerSurface, border partner 1, text `caption` in partner. Text: "Partner content" or "Sponsored".

## Toast

Props: `type` = `success` | `error`.

Layout: min height 56, padding 12 vertical / 16 horizontal, gap 12, radius `medium`, horizontal: icon (20), message (`body`, ink), action (`label`, accent).

| type | Fill | Border | Icon |
| --- | --- | --- | --- |
| success | successSurface | success, 1 | `check` |
| error | errorSurface | error, 1 | `alert` |

## TabItem

Props: `state` = `default` | `active`.

Layout: vertical, gap 4, 68x56. Icon pill 48x32, padding 4 vertical / 12 horizontal, radius `pill`, icon 24. Label `caption`.

| state | Icon pill fill | Label |
| --- | --- | --- |
| default | none | inkMuted |
| active | selectedSurface | selected |

## TabBar

Height 72, fill surface, top border `border`, padding 8 vertical / 16 horizontal, horizontal. Five TabItems in this order: Home (`home`), Explore (`explore`), Saved (`saved`), Shop (`shop`), Profile (`profile`).

## TopBar

Height 60, fill background, padding 8 vertical / 16 horizontal, horizontal, space between. Left: Back (`back` icon 24 + "Back" in `label`, ink, gap 4). Right: HelpButton.

## GuidanceResultCard

Fill surface, border `border` 1, radius `medium`, padding 24, vertical, gap 12.
- Eyebrow "YOUR GUIDANCE" in `label`, color `highlight`.
- Headline in `heading`, ink.
- Subtitle in `body`, inkMuted.
- "Why this fits you" link: `label` in accent + `arrow` icon (20), gap 4.

## ProductCard

Width 164, fill surface, border `border` 1, radius `medium`, padding 12, vertical, gap 8.
- Image area 140x120, fill surfaceWarm, radius `small`.
- Brand line `caption`, inkMuted. Product name `label`, ink.
- Fit tag: fill successSurface, radius `small`, padding 4 / 8, text `caption` ink ("May fit your guidance").
- "View product" in `label`, accent.

## HelpPanel

Bottom sheet. Fill surface, top border `border`, radius `medium` (top corners), padding 24, vertical, gap 16.
- Title "Need help?" in `heading`, ink.
- Body in `body`, ink.
- A secondary Button (full width).
- "Close" in `label`, accent.
