import { useRouter } from 'expo-router';
import { useState, type ReactNode } from 'react';
import { Linking, Pressable, StyleSheet, Text, View } from 'react-native';

import { Button } from '@/components/Button';
import { Chip } from '@/components/Chip';
import { EvidenceDots } from '@/components/EvidenceDots';
import { Icon } from '@/components/Icon';
import { ListRow } from '@/components/ListRow';
import { LoadingState } from '@/components/LoadingState';
import { Screen } from '@/components/Screen';
import { Sheet } from '@/components/Sheet';
import { Toast } from '@/components/Toast';
import { colors, layout, letterSpacing, radius, sizes, space, stroke, type } from '@/constants/tokens';
import { areaLabels, emptyResult, evidenceIntro, evidenceKey, resultLabels, sectionTitles } from '@/data/draftCopy';
import { labelGuide } from '@/data/labelGuide';
import type { CareArea, Evidence } from '@/data/outcomeTypes';
import { emergencyLine } from '@/data/safety';
import { sourceGroups } from '@/data/sources';
import { useAuth } from '@/hooks/useAuth';
import { useGuidanceResult } from '@/hooks/useGuidanceResult';
import type { GuidanceResult, ResultPoint } from '@/lib/buildResult';
import { hasResult } from '@/lib/buildResult';
import type { SavedAnswers } from '@/lib/quizFlow';
import { visibleQuestionIds } from '@/lib/quizFlow';
import { clearAnswers, saveResult } from '@/lib/results';

const c = colors.light;
// Three visible at once; the rest stay one tap deeper, never dropped
const VISIBLE_AT_ONCE = 3;
const evidenceOrder: Evidence[] = ['Strong', 'Moderate', 'Limited', 'Assumption'];

// What a pop-up shows: a lead line, a few short lists, and how well-studied the advice is
type SheetContent = {
  title: string;
  lead?: string;
  groups: { heading: string; items: string[] }[];
  evidence?: Evidence;
};

export default function ResultScreen() {
  const { session } = useAuth();
  if (!session) {
    return <LoadingState label={resultLabels.loading} />;
  }
  return <ResultContent userId={session.user.id} />;
}

function ResultContent({ userId }: { userId: string }) {
  const router = useRouter();
  const { state, retry } = useGuidanceResult(userId);

  if (state.status === 'loading') {
    return <LoadingState label={resultLabels.loading} />;
  }
  if (state.status === 'error') {
    return (
      <Screen centered>
        <View style={styles.errorBox}>
          <Text style={styles.errorText}>{state.message}</Text>
          <Button label="Try again" style="secondary" onPress={retry} />
        </View>
      </Screen>
    );
  }
  if (!hasResult(state.result) && state.result.areas.length > 0) {
    return (
      <Screen centered>
        <Text style={styles.sectionTitle} accessibilityRole="header">
          {emptyResult.title}
        </Text>
        <Text style={styles.body}>{emptyResult.body}</Text>
        <Button label={resultLabels.takeQuiz} onPress={() => router.replace('/quiz/q1_areas')} />
      </Screen>
    );
  }
  return <ResultView userId={userId} result={state.result} answers={state.answers} />;
}

type ResultViewProps = { userId: string; result: GuidanceResult; answers: SavedAnswers };

function ResultView({ userId, result, answers }: ResultViewProps) {
  const router = useRouter();
  const [activeArea, setActiveArea] = useState<CareArea>(result.areas[0]);
  const [sheet, setSheet] = useState<SheetContent | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [actionError, setActionError] = useState('');
  const [isClearing, setIsClearing] = useState(false);
  // Three or more areas get one tab each instead of stacked reports
  const useTabs = result.areas.length >= 3;
  const shownAreas = useTabs ? result.byArea.filter((item) => item.area === activeArea) : result.byArea;
  const usedEvidence = evidenceOrder.filter((label) => result.evidence.some((item) => item.evidence === label));

  function openPoint(point: ResultPoint, title: string) {
    setSheet({
      title,
      lead: point.text,
      groups: [
        { heading: resultLabels.tryTitle, items: point.detail?.tries ?? [] },
        { heading: resultLabels.whyTitle, items: point.detail?.meanings ?? [] },
        { heading: resultLabels.watchTitle, items: point.detail?.watch ?? [] },
      ],
      evidence: point.evidence,
    });
  }

  async function handleSave() {
    setActionError('');
    setIsSaving(true);
    const outcome = await saveResult(userId, result.name, answers);
    setIsSaving(false);
    if (outcome.ok) setSaved(true);
    else setActionError(outcome.message);
  }

  function handleChange() {
    const ids = visibleQuestionIds(answers);
    router.replace(`/quiz/${ids[ids.length - 1]}`);
  }

  async function handleStartOver() {
    setActionError('');
    setIsClearing(true);
    const outcome = await clearAnswers(userId);
    setIsClearing(false);
    if (outcome.ok) router.replace('/quiz/q1_areas');
    else setActionError(outcome.message);
  }

  return (
    <Screen>
      <View style={styles.topBar}>
        <Pressable
          onPress={() => router.replace('/proof')}
          accessibilityRole="button"
          accessibilityLabel={resultLabels.close}
          style={styles.closeButton}
        >
          <Icon name="close" size={sizes.icon.large} color={c.ink} />
        </Pressable>
        <Text style={styles.topTitle}>{resultLabels.screenTitle}</Text>
      </View>

      <View style={styles.nameBlock}>
        <Text style={styles.eyebrow}>{resultLabels.eyebrow}</Text>
        <Text style={styles.headline} accessibilityRole="header">
          {result.name.headline}
        </Text>
        <Text style={styles.subtitle}>{result.name.subtitle}</Text>
        <Text style={styles.body}>{result.exploration}</Text>
      </View>

      {usedEvidence.length ? (
        // Up top, so the dots make sense the first time someone sees them
        <View style={styles.keyBox} accessibilityRole="summary">
          <Text style={styles.label}>{resultLabels.evidenceKeyTitle}</Text>
          <Text style={styles.helper}>{evidenceIntro}</Text>
          {usedEvidence.map((label) => (
            <View key={label} style={styles.keyRow}>
              <EvidenceDots evidence={label} />
              <Text style={[styles.body, styles.flex]}>
                <Text style={styles.label}>{evidenceKey[label].title}: </Text>
                {evidenceKey[label].meaning}
              </Text>
            </View>
          ))}
        </View>
      ) : null}

      {result.startHere.length ? (
        <Section title={sectionTitles.startHere}>
          {result.startHere.map((point, index) => (
            <ListRow
              key={point.code}
              label={point.text}
              onPress={() => openPoint(point, `${sectionTitles.startHere} · ${index + 1}`)}
              leading={
                <View style={styles.startNumber}>
                  <Text style={styles.startNumberText}>{index + 1}</Text>
                </View>
              }
              trailing={point.evidence ? <EvidenceDots evidence={point.evidence} /> : null}
            />
          ))}
        </Section>
      ) : null}

      {result.why.length ? (
        <Section title={sectionTitles.why}>
          <MoreList items={result.why} render={(point) => <Point key={point.code} point={point} />} />
        </Section>
      ) : null}

      {result.byArea.some((item) => item.meanings.length) ? (
        <Section title={sectionTitles.byArea}>
          {useTabs ? (
            <View style={styles.tabs} accessibilityRole="tablist">
              {result.areas.map((area) => (
                <Chip
                  key={area}
                  label={capitalize(areaLabels[area])}
                  state={area === activeArea ? 'selected' : 'default'}
                  onPress={() => setActiveArea(area)}
                />
              ))}
            </View>
          ) : null}
          {shownAreas.map((item) => (
            <View key={item.area} style={styles.group}>
              {useTabs ? null : <Text style={styles.label}>{capitalize(areaLabels[item.area])}</Text>}
              {item.meanings.length ? (
                <MoreList items={item.meanings} render={(point) => <Point key={point.code} point={point} />} />
              ) : (
                <Text style={styles.helper}>{resultLabels.areaInContext}</Text>
              )}
            </View>
          ))}
        </Section>
      ) : null}

      {result.productTypes.length || result.ingredients.length || result.explainers.length || result.showLabelGuide ? (
        <Section title={sectionTitles.inContext}>
          {result.productTypes.length ? (
            <Group title={resultLabels.productTypes} helper={resultLabels.productTypesHelper}>
              <MoreList
                items={result.productTypes}
                render={(item) => (
                  <ListRow
                    key={item.text}
                    label={item.text}
                    onPress={() =>
                      setSheet({
                        title: item.text,
                        groups: [
                          { heading: resultLabels.whyTitle, items: item.why ? [item.why] : [] },
                          { heading: resultLabels.watchTitle, items: item.watch ? [item.watch] : [] },
                        ],
                        evidence: item.evidence,
                      })
                    }
                  />
                )}
              />
            </Group>
          ) : null}
          {result.ingredients.length ? (
            <Group title={resultLabels.ingredients}>
              <MoreList
                items={result.ingredients}
                render={(item) => (
                  <ListRow
                    key={item.name}
                    label={item.name}
                    onPress={() =>
                      setSheet({
                        title: item.name,
                        groups: [{ heading: resultLabels.ingredientRole, items: [item.role] }],
                        evidence: item.evidence,
                      })
                    }
                  />
                )}
              />
            </Group>
          ) : null}
          {result.explainers.map((point) => (
            <Point key={point.code} point={point} />
          ))}
          {result.showLabelGuide ? (
            <Group title={resultLabels.labelGuide}>
              <Text style={styles.body}>{labelGuide}</Text>
            </Group>
          ) : null}
        </Section>
      ) : null}

      <Section title={sectionTitles.check}>
        {/* The emergency line sits apart from the tips and is never behind "Show more" */}
        <View style={styles.emergency} accessibilityRole="alert">
          <Icon name="alert" size={sizes.icon.medium} color={c.alert} />
          <Text style={[styles.body, styles.flex]}>{emergencyLine}</Text>
        </View>
        <MoreList items={result.check} render={(point) => <Point key={point.code} point={point} />} />
        {result.skinTone.length ? (
          <Group title={resultLabels.skinTone}>
            {result.skinTone.map((point) => (
              <Point key={point.code} point={point} />
            ))}
          </Group>
        ) : null}
      </Section>

      {result.open.length ? (
        <Section title={sectionTitles.open}>
          {result.open.map((line) => (
            <Text key={line} style={styles.body}>
              {line}
            </Text>
          ))}
        </Section>
      ) : null}

      <Section title={sectionTitles.evidence}>
        <Text style={styles.helper}>{resultLabels.sourcesIntro}</Text>
        <Sources />
      </Section>

      <View accessibilityLiveRegion="polite" style={styles.status}>
        {saved ? <Toast type="success" message={resultLabels.saved} /> : null}
        {actionError ? <Toast type="error" message={actionError} /> : null}
      </View>

      <View style={styles.actions}>
        <Button
          label={isSaving ? resultLabels.saving : resultLabels.save}
          loading={isSaving}
          state={saved ? 'disabled' : undefined}
          onPress={handleSave}
        />
        <Button label={resultLabels.change} style="secondary" onPress={handleChange} />
        <Button label={resultLabels.startOver} style="secondary" loading={isClearing} onPress={handleStartOver} />
      </View>

      <Sheet visible={sheet !== null} title={sheet?.title ?? ''} onClose={() => setSheet(null)}>
        {sheet ? <SheetBody content={sheet} /> : null}
      </Sheet>
    </Screen>
  );
}

function SheetBody({ content }: { content: SheetContent }) {
  return (
    <>
      {content.lead ? <Text style={styles.body}>{content.lead}</Text> : null}
      {content.groups
        .filter((group) => group.items.length)
        .map((group) => (
          <Group key={group.heading} title={group.heading}>
            {group.items.map((item) => (
              <View key={item} style={styles.bulletRow}>
                <Text style={styles.body}>•</Text>
                <Text style={[styles.body, styles.flex]}>{item}</Text>
              </View>
            ))}
          </Group>
        ))}
      {content.evidence ? (
        <View style={styles.keyRow}>
          <EvidenceDots evidence={content.evidence} />
          <Text style={[styles.helper, styles.flex]}>{evidenceKey[content.evidence].meaning}</Text>
        </View>
      ) : null}
    </>
  );
}

function Section({ title, children }: { title: string; children: ReactNode }) {
  return (
    <View style={styles.section}>
      <Text style={styles.sectionTitle} accessibilityRole="header">
        {title}
      </Text>
      {children}
    </View>
  );
}

function Group({ title, helper, children }: { title: string; helper?: string; children: ReactNode }) {
  return (
    <View style={styles.group}>
      <Text style={styles.label}>{title}</Text>
      {helper ? <Text style={styles.helper}>{helper}</Text> : null}
      {children}
    </View>
  );
}

function Point({ point }: { point: ResultPoint }) {
  return (
    <View style={styles.point}>
      <Text style={[styles.body, styles.flex]}>{point.text}</Text>
      {/* Beside the line, not above it, so the dots don't read as bullets */}
      {point.evidence ? (
        <View style={styles.pointDots}>
          <EvidenceDots evidence={point.evidence} />
        </View>
      ) : null}
    </View>
  );
}

// "Show 6 more" opens the rest of the same list in place, so it's clear they belong together
function MoreList<T>({ items, render }: { items: T[]; render: (item: T) => ReactNode }) {
  const [expanded, setExpanded] = useState(false);
  const hidden = items.length - VISIBLE_AT_ONCE;
  const visible = expanded ? items : items.slice(0, VISIBLE_AT_ONCE);
  return (
    <View style={styles.list}>
      {visible.map(render)}
      {hidden > 0 ? (
        <Button
          label={expanded ? resultLabels.showFewer : resultLabels.showMore(hidden)}
          style="ghost"
          onPress={() => setExpanded(!expanded)}
        />
      ) : null}
    </View>
  );
}

function Sources() {
  const [open, setOpen] = useState(false);
  return (
    <View style={styles.list}>
      <Button label={open ? resultLabels.hideSources : resultLabels.showSources} style="ghost" onPress={() => setOpen(!open)} />
      {open
        ? sourceGroups.map((group) => (
            <Group key={group.publisher} title={group.publisher}>
              {group.sources.map((source) => (
                <Pressable
                  key={source.url}
                  onPress={() => Linking.openURL(source.url)}
                  accessibilityRole="link"
                  accessibilityLabel={source.title}
                  style={styles.sourceLink}
                >
                  <Text style={styles.link}>{source.title}</Text>
                </Pressable>
              ))}
            </Group>
          ))
        : null}
    </View>
  );
}

function capitalize(text: string): string {
  return text.charAt(0).toUpperCase() + text.slice(1);
}

const styles = StyleSheet.create({
  flex: { flex: 1 },
  topBar: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: space[12],
  },
  closeButton: {
    minWidth: layout.minTouchTarget,
    minHeight: layout.minTouchTarget,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: radius.pill,
    backgroundColor: c.surface,
  },
  topTitle: {
    ...type.label,
    color: c.ink,
  },
  nameBlock: {
    gap: space[8],
  },
  eyebrow: {
    ...type.label,
    color: c.highlight,
    textTransform: 'uppercase',
    letterSpacing: letterSpacing.eyebrow,
  },
  headline: {
    ...type.display,
    color: c.ink,
  },
  subtitle: {
    ...type.body,
    color: c.inkMuted,
  },
  section: {
    gap: space[12],
    paddingTop: space[32],
  },
  sectionTitle: {
    ...type.title,
    color: c.ink,
  },
  body: {
    ...type.body,
    color: c.ink,
  },
  helper: {
    ...type.body,
    color: c.inkMuted,
  },
  label: {
    ...type.label,
    color: c.ink,
  },
  startNumber: {
    width: space[32],
    height: space[32],
    borderRadius: radius.pill,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: c.selectedSurface,
  },
  startNumberText: {
    ...type.label,
    color: c.selected,
  },
  list: {
    gap: space[12],
  },
  group: {
    gap: space[8],
  },
  point: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: space[12],
    padding: layout.insideComponent,
    borderRadius: radius.medium,
    borderWidth: stroke.default,
    borderColor: c.border,
    backgroundColor: c.surface,
  },
  pointDots: {
    paddingTop: space[8],
  },
  bulletRow: {
    flexDirection: 'row',
    gap: space[8],
  },
  keyRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: space[12],
  },
  keyBox: {
    gap: space[8],
    marginTop: space[24],
    padding: layout.insideComponent,
    borderRadius: radius.medium,
    borderWidth: stroke.default,
    borderColor: c.border,
    backgroundColor: c.surface,
  },
  tabs: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: space[8],
  },
  emergency: {
    flexDirection: 'row',
    gap: space[12],
    padding: layout.insideComponent,
    borderRadius: radius.medium,
    backgroundColor: c.alertSurface,
  },
  sourceLink: {
    minHeight: layout.minTouchTarget,
    justifyContent: 'center',
  },
  link: {
    ...type.body,
    color: c.accent,
    textDecorationLine: 'underline',
  },
  status: {
    gap: space[8],
  },
  actions: {
    gap: space[12],
    paddingTop: space[24],
  },
  errorBox: {
    gap: space[12],
    padding: space[16],
    borderRadius: radius.medium,
    backgroundColor: c.errorSurface,
  },
  errorText: {
    ...type.body,
    color: c.error,
  },
});
