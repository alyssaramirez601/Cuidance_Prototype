import { answerCards } from '@/data/answerCards';
import { explorationSentence, openLines, twoAreaSubtitle } from '@/data/draftCopy';
import type { AnswerCard, CareArea, Evidence, MixingRule, ResultName } from '@/data/outcomeTypes';
import { quizQuestions } from '@/data/quiz';
import {
  bodyNames,
  bodyNotSureName,
  hairAndSkinName,
  hairNames,
  hairTextureWords,
  makeupNames,
  notSureEverywhereName,
  productNames,
  protectiveStylesName,
  skinAndMakeupName,
  skinNames,
  threeOrMoreName,
  threeOrMoreSimpleName,
  verySensitiveName,
} from '@/data/resultNames';
import { mixingRules } from '@/data/rules';
import type { SavedAnswers } from '@/lib/quizFlow';
import { pickedAreas, visibleQuestionIds } from '@/lib/quizFlow';

export type ResultPoint = { text: string; code: string; evidence?: Evidence };

export type AreaResult = {
  area: CareArea;
  // Rule lines first, then the card lines no rule replaced
  points: ResultPoint[];
  meanings: ResultPoint[];
};

// One card's product types, shown together under the reason from that card
export type ProductGroup = { why: string; items: string[]; code: string; evidence?: Evidence };

export type GuidanceResult = {
  name: ResultName;
  areas: CareArea[];
  exploration: string;
  startHere: ResultPoint[];
  why: ResultPoint[];
  byArea: AreaResult[];
  productGroups: ProductGroup[];
  ingredients: ResultPoint[];
  explainers: ResultPoint[];
  showLabelGuide: boolean;
  check: ResultPoint[];
  skinTone: ResultPoint[];
  open: string[];
  evidence: { code: string; evidence: Evidence }[];
};

// Up to three focus points across the whole result, never three per area
const START_HERE_LIMIT = 3;

export function buildResult(answers: SavedAnswers): GuidanceResult {
  const areas = pickedAreas(answers) as CareArea[];
  const picked = (questionId: string, optionId: string) => (answers[questionId] ?? []).includes(optionId);

  const cards = answerCards.filter((card) => areas.includes(card.area) && picked(card.questionId, card.optionId));
  const rules = mixingRules.filter(
    (rule) => areas.includes(rule.area) && rule.conditions.every((group) => group.some((ref) => picked(ref.questionId, ref.optionId))),
  );

  // The rule line replaces the separate card lines, so the result doesn't repeat itself.
  // A rule across areas only replaces the makeup or body card; the skin card still speaks in skin care
  const replaced = new Set<string>();
  for (const rule of rules) {
    rule.conditions.forEach((group, index) => {
      if (rule.crossArea && index === 0) return;
      for (const ref of group) {
        if (picked(ref.questionId, ref.optionId)) replaced.add(`${ref.questionId}:${ref.optionId}`);
      }
    });
  }

  const byArea: AreaResult[] = areas.map((area) => {
    const areaCards = cards.filter((card) => card.area === area);
    const ruleLines = rules.filter((rule) => rule.area === area).map(rulePoint);
    const cardLines = areaCards
      .filter((card) => card.appSays && !replaced.has(`${card.questionId}:${card.optionId}`))
      .map((card) => cardPoint(card, card.appSays as string));
    return {
      area,
      points: dedupe([...ruleLines, ...cardLines]),
      meanings: dedupe(areaCards.filter((card) => card.whatItMayMean).map((card) => cardPoint(card, card.whatItMayMean as string))),
    };
  });

  const allWhy = dedupe(byArea.flatMap((item) => item.points));
  const startHere = pickStartHere(byArea);
  // Start here already shows its points, so "Why these may fit" lists the rest instead of repeating them
  const startTexts = new Set(startHere.map((point) => point.text));
  const why = allWhy.filter((point) => !startTexts.has(point.text));

  return {
    name: pickName(answers, areas),
    areas,
    exploration: explorationSentence(areas),
    startHere,
    why,
    byArea,
    productGroups: productGroupsFrom(cards),
    ingredients: dedupe(
      cards.flatMap((card) => (card.ingredients ?? []).filter(isIngredientLine).map((text) => cardPoint(card, text))),
    ),
    explainers: dedupe(cards.filter((card) => card.explainer).map((card) => cardPoint(card, card.explainer as string))),
    showLabelGuide: picked('p2_task', 'read_label') || picked('p3_info', 'read_label'),
    check: dedupe(cards.filter((card) => card.watchOutFor).map((card) => cardPoint(card, card.watchOutFor as string))),
    skinTone: dedupe(cards.filter((card) => card.everySkinTone).map((card) => cardPoint(card, card.everySkinTone as string))),
    open: openItems(answers),
    evidence: cards.filter((card) => card.evidence).map((card) => ({ code: card.code, evidence: card.evidence as Evidence })),
  };
}

export function hasResult(result: GuidanceResult): boolean {
  return result.startHere.length > 0 || result.explainers.length > 0 || result.showLabelGuide;
}

function cardPoint(card: AnswerCard, text: string): ResultPoint {
  return { text, code: card.code, evidence: card.evidence };
}

function rulePoint(rule: MixingRule): ResultPoint {
  return { text: rule.appSays, code: rule.code };
}

function dedupe<T extends { text: string }>(items: T[]): T[] {
  const seen = new Set<string>();
  return items.filter((item) => (seen.has(item.text) ? false : (seen.add(item.text), true)));
}

// One point from each area in the fixed order, then a second round, until there are three
function pickStartHere(byArea: AreaResult[]): ResultPoint[] {
  const picks: ResultPoint[] = [];
  for (let round = 0; picks.length < START_HERE_LIMIT; round += 1) {
    const roundPicks = byArea.map((item) => item.points[round]).filter((point): point is ResultPoint => !!point);
    if (roundPicks.length === 0) break;
    picks.push(...roundPicks);
  }
  return dedupe(picks).slice(0, START_HERE_LIMIT);
}

// Some "Things to try" lines in the outcome library are notes to the app ("Ask which color process was used"),
// not words for people. Until the team rewrites them, only lines that name something to try are shown
const APP_NOTE_START =
  /^(Ask|Explain|Show|Offer|Compare|Use the|Use a|Choose|Request|Invite|Clarify|Read|Apply the|Adjust placement using|Moisturizer matched|Optional hold only if|Look for)\b/;

function isTryLine(text: string): boolean {
  return !APP_NOTE_START.test(text);
}

// Ingredient lines read "Glycerin: Helps attract water into skin." Lines like "None by default" are notes, not advice
function isIngredientLine(text: string): boolean {
  return /^[A-Z][^:;]{1,60}: [A-Z][^:]*$/.test(text) && !/^(None|No|Learning|Choose|If)\b/.test(text);
}

function productGroupsFrom(cards: AnswerCard[]): ProductGroup[] {
  const seen = new Set<string>();
  const groups: ProductGroup[] = [];
  for (const card of cards) {
    const items = (card.thingsToTry ?? []).filter((text) => isTryLine(text) && !seen.has(text));
    items.forEach((text) => seen.add(text));
    if (items.length) groups.push({ why: card.whatItMayMean ?? '', items, code: card.code, evidence: card.evidence });
  }
  return groups;
}

function openItems(answers: SavedAnswers): string[] {
  const items: string[] = [];
  for (const questionId of visibleQuestionIds(answers)) {
    const question = quizQuestions.find((item) => item.id === questionId);
    if (!question || question.section === 'start' || question.section === 'not_sure') continue;
    const picks = answers[questionId];
    if (picks && picks.length === 0) {
      items.push(openLines.skipped(question.prompt));
    } else if (picks?.some((id) => id === 'not_sure' || id === 'still_figuring')) {
      items.push(openLines.notSure(question.prompt));
    }
  }
  return items.length ? items : [openLines.nothingOpen];
}

// The first pick in the order the choices appear, not the order they were tapped
function firstPick(answers: SavedAnswers, questionId: string): string | undefined {
  const question = quizQuestions.find((item) => item.id === questionId);
  const picks = answers[questionId] ?? [];
  return question?.options.map((option) => option.id).find((id) => picks.includes(id));
}

function withHairTexture(name: ResultName, answers: SavedAnswers): ResultName {
  const texture = hairTextureWords[firstPick(answers, 'h1_texture') ?? ''];
  if (!texture) return name;
  return { ...name, subtitle: name.subtitle.replace(/your (curls or waves|waves)/, `your ${texture}`) };
}

function areaName(area: CareArea, answers: SavedAnswers): ResultName | undefined {
  switch (area) {
    case 'skin':
      if ((answers.s2_sensitivity ?? []).includes('very')) return verySensitiveName;
      return skinNames[firstPick(answers, 's1_midday') ?? ''];
    case 'hair': {
      const goal = firstPick(answers, 'h2_goal');
      if (goal === 'not_sure' && (answers.h3_styling ?? []).includes('protective')) return protectiveStylesName;
      const name = hairNames[goal ?? ''];
      return name ? withHairTexture(name, answers) : undefined;
    }
    case 'makeup':
      return makeupNames[firstPick(answers, 'm2_goal') ?? ''];
    case 'body':
      if ((answers.b2_task ?? []).includes('not_sure')) return bodyNotSureName;
      return bodyNames[firstPick(answers, 'b1_area') ?? ''];
    case 'products':
      return productNames[firstPick(answers, 'p2_task') ?? ''];
  }
}

// Sensitivity first, then the first area in the fixed order; a second area joins the subtitle; three or more get an umbrella
function pickName(answers: SavedAnswers, areas: CareArea[]): ResultName {
  if (areas.length === 0) return notSureEverywhereName;
  if (areas.length >= 3) {
    return (answers.u4_support ?? []).includes('simple') ? threeOrMoreSimpleName : threeOrMoreName;
  }
  const first = areaName(areas[0], answers) ?? notSureEverywhereName;
  if (areas.length === 1) return first;

  const second = areas[1];
  const calmHydration = first === skinNames.shiny_some;
  if (calmHydration && second === 'hair') return withHairTexture(hairAndSkinName, answers);
  if (calmHydration && second === 'makeup' && firstPick(answers, 'm2_goal') === 'everyday') return skinAndMakeupName;
  return { headline: first.headline, subtitle: twoAreaSubtitle(areas[0], second) };
}
