/**
 * Cuidance design tokens
 *
 * Source of truth: the "Cuidance" variable collection in the team Figma file
 * (Week 8 design system, Light and Dark modes). Names mirror the Figma
 * variable names. If a value changes, change it in Figma first, then here.
 *
 * Rules:
 * - Screens and components use these tokens only. Never a raw hex code.
 * - v1 ships Light mode. Dark values are kept here so the system stays in
 *   sync with Figma, but dark screens are not built in v1.
 * - Do not rename tokens. Other files and the Figma components depend on them.
 */

// ---------------------------------------------------------------------------
// Color roles (Light / Dark)
// ---------------------------------------------------------------------------

export const colors = {
  light: {
    background: '#F4F2EC', // Quiet Paper, app background
    surface: '#FFFFFF', // cards, sheets, inputs
    surfaceWarm: '#F3E6D3', // Warm Care, supportive moments
    ink: '#111111', // Guidance Ink, main text and icons
    inkMuted: '#57534B', // secondary and helper text
    accent: '#1F3FD1', // Compass Blue, links, primary buttons, focus
    accentHover: '#1A36B5', // web only
    accentPressed: '#152B91',
    onAccent: '#FFFFFF', // text and icons on accent fills
    brand: '#21332B', // Grounded Green
    onBrand: '#F4F2EC',
    selected: '#1F3FD1', // Compass Blue, selected answers, chips, active tab
    selectedSurface: '#E6EAFB', // light blue behind selected items
    highlight: '#A8432A', // Care Terracotta, eyebrow labels only
    alert: '#A94E00', // Wayfinding Orange, alerts and notices
    alertSurface: '#F9E8D7',
    success: '#5E6B3D', // Steady Olive, saved and success
    successSurface: '#E9ECDD',
    error: '#70000E', // secondary/ruby/700
    errorSurface: '#FBE9EB', // secondary/ruby/100
    info: '#5A1391', // secondary/violet/600
    infoSurface: '#F3EAFB', // secondary/violet/100
    partner: '#671253', // secondary/plum/700, partner and sponsored labels only
    partnerSurface: '#F7E6F1', // secondary/plum/100
    border: '#DDD7CB', // decorative lines and dividers
    borderStrong: '#7C766B', // input and control outlines (3:1)
    disabledSurface: '#E6E2D9',
    disabledInk: '#8B867C',
  },
  dark: {
    background: '#121714',
    surface: '#1B221E',
    surfaceWarm: '#26221D',
    ink: '#F4F2EC',
    inkMuted: '#BDB8AD',
    accent: '#9AABFF',
    accentHover: '#B0BEFF',
    accentPressed: '#8396F2',
    onAccent: '#0B1440',
    brand: '#CFDDD4',
    onBrand: '#121714',
    selected: '#9AABFF',
    selectedSurface: '#1E2650',
    highlight: '#F2A68F',
    alert: '#F2A65E',
    alertSurface: '#3A2918',
    success: '#BCCB8E',
    successSurface: '#262D1C',
    error: '#EB9BA6', // secondary/ruby/300
    errorSurface: '#3D0B14', // secondary/ruby/900
    info: '#CCA4F4', // secondary/violet/200
    infoSurface: '#2A1542', // secondary/violet/900
    partner: '#E09BCB', // secondary/plum/300
    partnerSurface: '#36142C', // secondary/plum/900
    border: '#333B36',
    borderStrong: '#838B85',
    disabledSurface: '#252C28',
    disabledInk: '#6F7570',
  },
} as const;

// ---------------------------------------------------------------------------
// Graphic colors (collage artwork and illustration only, never for meaning)
// ---------------------------------------------------------------------------

export const graphic = {
  light: {
    terracotta: '#E98A70',
    clay: '#F2A68F',
    orange: '#F2A65E',
    olive: '#D6DFB7',
    waveBlue: '#B0BEFF',
    green: '#AFC6B7',
    terracottaBold: '#C14B31',
    greenBold: '#2E4A3A',
    blueBold: '#152B91',
    dot: '#A8432A',
    paper: '#FBF6EE',
  },
  dark: {
    terracotta: '#83321F',
    clay: '#5B261A',
    orange: '#7C3A08',
    olive: '#424D2C',
    waveBlue: '#1E2650',
    green: '#2E4A3A',
    terracottaBold: '#E98A70',
    greenBold: '#AFC6B7',
    blueBold: '#8396F2',
    dot: '#F2A68F',
    paper: '#1F2622',
  },
} as const;

// ---------------------------------------------------------------------------
// Secondary palette (status identity system; use through the color roles above)
// ---------------------------------------------------------------------------

export const secondary = {
  ruby: {
    100: '#FBE9EB', 200: '#F5C9CF', 300: '#EB9BA6', 400: '#D6566A', 500: '#B3243A',
    600: '#8E0A1F', 700: '#70000E', 800: '#55000B', 900: '#3D0B14',
  },
  violet: {
    100: '#F3EAFB', 200: '#CCA4F4', 300: '#B982D6', 400: '#8A36CF', 500: '#6A1289',
    600: '#5A1391', 700: '#440588', 800: '#330C4F', 900: '#2A1542',
  },
  plum: {
    100: '#F7E6F1', 200: '#EDC2DF', 300: '#E09BCB', 500: '#9C2C7E', 700: '#671253',
    900: '#36142C',
  },
} as const;

// ---------------------------------------------------------------------------
// Typography
// ---------------------------------------------------------------------------

export const fontFamily = {
  display: 'Newsreader', // display and headings
  body: 'Archivo', // everything else
  // Same typeface as body. A loaded font file covers one weight, so the 600 weight gets its own name
  bodySemiBold: 'Archivo_600SemiBold',
} as const;

export const type = {
  display: { fontFamily: fontFamily.display, fontSize: 40, lineHeight: 46, fontWeight: '400' },
  heading: { fontFamily: fontFamily.display, fontSize: 28, lineHeight: 34, fontWeight: '400' },
  title: { fontFamily: fontFamily.bodySemiBold, fontSize: 20, lineHeight: 26 },
  body: { fontFamily: fontFamily.body, fontSize: 16, lineHeight: 24, fontWeight: '400' },
  label: { fontFamily: fontFamily.bodySemiBold, fontSize: 15, lineHeight: 20 },
  caption: { fontFamily: fontFamily.body, fontSize: 13, lineHeight: 18, fontWeight: '400' },
} as const;

// ---------------------------------------------------------------------------
// Space, radius, stroke
// ---------------------------------------------------------------------------

/** Only these steps. Never a value in between. */
export const space = {
  4: 4,
  8: 8,
  12: 12,
  16: 16,
  24: 24,
  32: 32,
  48: 48,
} as const;

export const radius = {
  small: 8, // inputs, checkboxes, tags, icon tiles
  medium: 16, // cards, sheets, answer options
  pill: 999, // buttons, chips, help button
} as const;

export const stroke = {
  default: 1,
  strong: 2, // focus and selected
  icon: 1.75, // icon strokes
} as const;

// ---------------------------------------------------------------------------
// Component sizes (Figma frame sizes from docs/design-system/components.md)
// ---------------------------------------------------------------------------

export const sizes = {
  icon: { small: 16, medium: 20, large: 24 },
  answerOptionMinHeight: 56,
  answerIndicator: 22,
  answerRadioDot: 8,
  checkboxBox: 22,
  chipHeight: 40,
  disclosureLabelHeight: 28,
  progressTrackHeight: 6,
  toastMinHeight: 56,
  tabItemWidth: 68,
  tabItemHeight: 56,
  tabPillWidth: 48,
  tabPillHeight: 32,
  tabBarHeight: 72,
  topBarHeight: 60,
  productCardWidth: 164,
  productImageWidth: 140,
  productImageHeight: 120,
} as const;

/** Extra letter spacing for short all-caps eyebrow labels */
export const letterSpacing = {
  eyebrow: 1,
} as const;

// ---------------------------------------------------------------------------
// Layout rules from the design system handoff
// ---------------------------------------------------------------------------

export const layout = {
  screenEdge: space[24],
  insideComponent: space[16],
  buttonHeight: 48,
  minTouchTarget: 44,
} as const;

export const tokens = { colors, graphic, secondary, fontFamily, type, space, radius, stroke, sizes, letterSpacing, layout } as const;

export type ColorMode = keyof typeof colors;
export type ColorRole = keyof typeof colors.light;

export default tokens;
