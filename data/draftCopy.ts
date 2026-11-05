// DRAFT COPY, NEEDS TEAM APPROVAL. docs/quiz-outcomes/ describes these pieces but doesn't give the words,
// so they were drafted for review on the preview link. Replace them here once Alyssa and Esme approve
// or rewrite them, then add the final wording to the outcome docs.

export const areaLabels: Record<string, string> = {
  skin: 'skin care',
  hair: 'hair care',
  makeup: 'makeup',
  body: 'body care',
  products: 'products and ingredients',
};

// Section titles come from the 8-section template in 08-results-delivery.md
export const sectionTitles = {
  exploration: 'Your exploration today',
  startHere: 'Start here',
  why: 'Why these may fit',
  byArea: 'Explore by care area',
  inContext: 'Products or ingredients in context',
  check: 'What to check',
  open: 'What remains open',
  evidence: 'Evidence and sources',
};

// Two areas without a written combined name: the first area names the result, the second joins the subtitle
export function twoAreaSubtitle(first: string, second: string): string {
  return `${capitalize(areaLabels[first])} guidance first, with ideas for ${areaLabels[second]} too.`;
}

export function explorationSentence(areas: string[]): string {
  if (areas.length === 0) {
    return 'You’re still finding a place to start, and that’s okay. Based on what you selected, here are a few gentle basics.';
  }
  return `Today you’re exploring ${joinList(areas.map((area) => areaLabels[area]))}. Based on what you selected, here’s where to start.`;
}

export const openLines = {
  skipped: (prompt: string) => `You skipped “${prompt}” That stays open, and nothing was guessed. You can answer it anytime.`,
  notSure: (prompt: string) => `You chose “I’m not sure yet” for “${prompt}” That’s a good answer, and it stays open for now.`,
  nothingOpen: 'Nothing is left open from your answers. You can change them anytime.',
};

export const evidenceIntro =
  'Each point shows how strong the evidence is: Strong, Moderate, Limited, or Assumption (our own design call, still being tested).';

export const emptyResult = {
  title: 'Your result isn’t ready yet',
  body: 'Answer the quiz first, and your guidance will show up here.',
};

function capitalize(text: string): string {
  return text.charAt(0).toUpperCase() + text.slice(1);
}

function joinList(items: string[]): string {
  if (items.length <= 1) return items.join('');
  if (items.length === 2) return `${items[0]} and ${items[1]}`;
  return `${items.slice(0, -1).join(', ')}, and ${items[items.length - 1]}`;
}
