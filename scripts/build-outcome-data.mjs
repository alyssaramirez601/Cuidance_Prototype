// Copies the answer cards and mixing rules from docs/quiz-outcomes/ into data/answerCards.ts and data/rules.ts,
// word for word. Run it again whenever those docs change:  node scripts/build-outcome-data.mjs
// It stops with an error if a card or rule can't be matched to a quiz answer, instead of guessing.
import { readFileSync, writeFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const docs = join(root, 'docs', 'quiz-outcomes');

// Doc question code -> app question id, and the area each file covers
const files = [
  { file: '03-skin-care.md', area: 'skin', questions: { S1: 's1_midday', S2: 's2_sensitivity', S3: 's3_goal' } },
  { file: '04-hair-care.md', area: 'hair', questions: { H1: 'h1_texture', H2: 'h2_goal', H3: 'h3_styling' } },
  { file: '05-makeup.md', area: 'makeup', questions: { M1: 'm1_area', M2: 'm2_goal', M3: 'm3_look', M4: 'm4_priority' } },
  { file: '06-body-care.md', area: 'body', questions: { B1: 'b1_area', B2: 'b2_task', B3: 'b3_priority' } },
  { file: '07-products-and-ingredients.md', area: 'products', questions: { P1: 'p1_explore', P2: 'p2_task', P3: 'p3_info' } },
];

// Read the option labels straight from data/quiz.ts so cards line up with what the quiz shows
const quizSource = readFileSync(join(root, 'data', 'quiz.ts'), 'utf8');
const options = {};
for (const block of quizSource.split(/export const \w+: QuizQuestion = /).slice(1)) {
  const id = block.match(/id: '([^']+)'/)[1];
  options[id] = [...block.matchAll(/\{ id: '([^']+)', label: '([^']+)' \}/g)].map((m) => ({ id: m[1], label: m[2] }));
}

const norm = (text) => text.replace(/[’']/g, "'").trim().toLowerCase();
const tidy = (text) => text.replace(/'/g, '’').trim();
const unquote = (text) => tidy(text.replace(/^"|"$/g, ''));
const splitList = (text) => text.split(/ \/ /).map((part) => tidy(part.replace(/^\d+\.\s*/, ''))).filter(Boolean);

const fieldNames = {
  'What it may mean': 'whatItMayMean',
  'Things to try': 'thingsToTry',
  'Ingredients that may help': 'ingredients',
  'Watch out for': 'watchOutFor',
  'What the app says': 'appSays',
  'Every skin tone': 'everySkinTone',
  'What the result shows': 'resultShows',
  'Plain-language explainer': 'explainer',
  'What changes': 'whatChanges',
  'Which answer wins': 'whichWins',
};
const listFields = new Set(['thingsToTry', 'ingredients']);
const quotedFields = new Set(['appSays', 'explainer']);

function parseFields(lines) {
  const fields = {};
  for (const line of lines) {
    const evidence = line.match(/^Evidence: (\w+)/);
    if (evidence) fields.evidence = evidence[1];
    const field = line.match(/^- \*\*([^*]+):\*\* (.*)$/);
    if (!field) continue;
    const key = fieldNames[field[1]];
    // "Source to fix" notes are for the team only and never show in the app
    if (!key) continue;
    const value = field[2];
    fields[key] = listFields.has(key) ? splitList(value) : quotedFields.has(key) ? unquote(value) : tidy(value);
  }
  return fields;
}

function sections(markdown) {
  const out = [];
  let current = null;
  for (const line of markdown.split('\n')) {
    const heading = line.match(/^### (\S+) · (.+)$/);
    if (heading) {
      current = { code: heading[1], title: heading[2].trim(), lines: [] };
      out.push(current);
    } else if (/^## /.test(line)) {
      current = null;
    } else if (current) {
      current.lines.push(line);
    }
  }
  return out;
}

const problems = [];
const cards = [];
const rules = [];
const skin = files[0];

function resolveLabel(label, questionIds, code) {
  const wanted = norm(label);
  let hits = [];
  for (const questionId of questionIds) {
    for (const option of options[questionId] ?? []) {
      if (norm(option.label) === wanted) hits.push({ questionId, optionId: option.id });
    }
  }
  if (hits.length === 0) {
    // A few rule titles shorten the answer, for example "Exploring different options"
    for (const questionId of questionIds) {
      for (const option of options[questionId] ?? []) {
        if (norm(option.label).endsWith(wanted)) hits.push({ questionId, optionId: option.id });
      }
    }
  }
  if (hits.length !== 1) {
    problems.push(`${code}: "${label}" matched ${hits.length} answers`);
    return null;
  }
  return hits[0];
}

for (const entry of files) {
  const markdown = readFileSync(join(docs, entry.file), 'utf8');
  const areaQuestionIds = Object.values(entry.questions);
  for (const section of sections(markdown)) {
    const cardCode = section.code.match(/^[A-Z]{2}-([A-Z]\d)-(\d{2})$/);
    if (cardCode) {
      const questionId = entry.questions[cardCode[1]];
      const option = options[questionId]?.[Number(cardCode[2]) - 1];
      if (!option || norm(option.label) !== norm(section.title)) {
        problems.push(`${section.code}: card "${section.title}" doesn't match quiz answer "${option?.label}"`);
        continue;
      }
      cards.push({ code: section.code, area: entry.area, questionId, optionId: option.id, ...parseFields(section.lines) });
      continue;
    }
    if (/-R\d{2}$/.test(section.code) || /^X-/.test(section.code)) {
      const crossArea = section.code.startsWith('X-');
      // Every "+" part must match. "or" inside a part ("Curly or Coily") means either answer counts.
      // In a rule across areas the first part is a skin answer and the rest belong to the area
      const parts = section.title.split(' + ').map((part, index) => {
        const questionIds = crossArea && index === 0 ? Object.values(skin.questions) : areaQuestionIds;
        // Answers like "Tight or dry" contain "or" themselves, so only split when the whole phrase isn't an answer
        const isOneAnswer = questionIds.some((id) => (options[id] ?? []).some((option) => norm(option.label) === norm(part)));
        const labels = isOneAnswer ? [part] : part.split(/ or /);
        return labels.map((label) => resolveLabel(label, questionIds, section.code));
      });
      rules.push({ code: section.code, area: entry.area, crossArea, title: tidy(section.title), parts, ...parseFields(section.lines) });
    }
  }
}

// Sources, grouped by publisher. The ones flagged to fix stay out of the app until the team swaps them
const sourcesMarkdown = readFileSync(join(docs, '13-sources.md'), 'utf8');
const flagged = new Set();
const sourceGroups = [];
let group = null;
for (const line of sourcesMarkdown.split('\n')) {
  const heading = line.match(/^## (.+)$/);
  if (heading) {
    const isFixList = heading[1].startsWith('Fix first');
    group = isFixList ? { fix: true } : { publisher: heading[1].replace(/\s*\(.*\)$/, '').trim(), sources: [] };
    if (!isFixList) sourceGroups.push(group);
    continue;
  }
  if (!group) continue;
  const link = line.match(/https?:\/\/\S+?(?=\s*\||\s*$)/);
  if (!link) continue;
  if (group.fix) {
    flagged.add(link[0]);
    continue;
  }
  const cells = line.split('|').map((cell) => cell.trim()).filter(Boolean);
  const title = line.startsWith('|') ? cells[0] : link[0];
  group.sources.push({ title: tidy(title), url: link[0] });
}
for (const item of sourceGroups) item.sources = item.sources.filter((source) => !flagged.has(source.url));

if (problems.length) {
  console.error('Stopped. These cards or rules need a person to check them:\n' + problems.join('\n'));
  process.exit(1);
}

const header = '// Generated by scripts/build-outcome-data.mjs from docs/quiz-outcomes/. Do not edit by hand: change the docs and run the script again.\n';

writeFileSync(
  join(root, 'data', 'answerCards.ts'),
  `${header}import type { AnswerCard } from '@/data/outcomeTypes';\n\nexport const answerCards: AnswerCard[] = ${JSON.stringify(cards, null, 2)};\n`,
);

const ruleData = rules.map(({ parts, ...rule }) => ({ ...rule, conditions: parts }));
writeFileSync(
  join(root, 'data', 'rules.ts'),
  `${header}import type { MixingRule } from '@/data/outcomeTypes';\n\nexport const mixingRules: MixingRule[] = ${JSON.stringify(ruleData, null, 2)};\n`,
);

writeFileSync(
  join(root, 'data', 'sources.ts'),
  `${header}import type { SourceGroup } from '@/data/outcomeTypes';\n\nexport const sourceGroups: SourceGroup[] = ${JSON.stringify(sourceGroups.filter((item) => item.sources.length), null, 2)};\n`,
);

const sourceCount = sourceGroups.reduce((total, item) => total + item.sources.length, 0);
console.log(`Wrote ${cards.length} answer cards, ${rules.length} mixing rules and ${sourceCount} sources (${flagged.size} flagged left out).`);
