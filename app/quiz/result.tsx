import { useRouter } from 'expo-router';
import { useState, type ReactNode } from 'react';
import { Linking, Pressable, StyleSheet, Text, View } from 'react-native';

import { Button } from '@/components/Button';
import { Chip } from '@/components/Chip';
import { Icon } from '@/components/Icon';
import { LoadingState } from '@/components/LoadingState';
import { Screen } from '@/components/Screen';
import { Toast } from '@/components/Toast';
import { colors, layout, letterSpacing, radius, sizes, space, stroke, type } from '@/constants/tokens';
import { areaLabels, emptyResult, evidenceIntro, resultLabels, sectionTitles } from '@/data/draftCopy';
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
  const [isSaving, setIsSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [actionError, setActionError] = useState('');
  const [isClearing, setIsClearing] = useState(false);
  // Three or more areas get one tab each instead of stacked reports
  const useTabs = result.areas.length >= 3;
  const shownAreas = useTabs ? result.byArea.filter((item) => item.area === activeArea) : result.byArea;

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

  const evidenceCounts = evidenceOrder
    .map((label) => ({ label, count: result.evidence.filter((item) => item.evidence === label).length }))
    .filter((item) => item.count > 0);

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
      </View>

      <Section title={sectionTitles.exploration}>
        <Text style={styles.body}>{result.exploration}</Text>
      </Section>

      {result.startHere.length ? (
        <Section title={sectionTitles.startHere}>
          {result.startHere.map((point, index) => (
            <View key={point.code} style={styles.startRow}>
              <View style={styles.startNumber}>
                <Text style={styles.startNumberText}>{index + 1}</Text>
              </View>
              <Text style={[styles.body, styles.flex]}>{point.text}</Text>
            </View>
          ))}
        </Section>
      ) : null}

      {result.why.length ? (
        <Section title={sectionTitles.why}>
          <MoreList items={result.why} render={(point) => <Point key={point.code} point={point} />} />
        </Section>
      ) : null}

      {result.byArea.length ? (
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
            <View key={item.area} style={styles.card}>
              <Text style={styles.cardTitle}>{capitalize(areaLabels[item.area])}</Text>
              {item.meanings.length ? (
                <View style={styles.subGroup}>
                  <Text style={styles.label}>{resultLabels.meaning}</Text>
                  <MoreList items={item.meanings} render={(point) => <Point key={point.code} point={point} />} />
                </View>
              ) : (
                <Text style={styles.helper}>{resultLabels.areaInContext}</Text>
              )}
            </View>
          ))}
        </Section>
      ) : null}

      {result.productGroups.length || result.ingredients.length || result.explainers.length || result.showLabelGuide ? (
        <Section title={sectionTitles.inContext}>
          {result.productGroups.length ? (
            <View style={styles.subGroup}>
              <Text style={styles.label}>{resultLabels.productTypes}</Text>
              <Text style={styles.helper}>{resultLabels.productTypesHelper}</Text>
              <MoreList
                items={result.productGroups}
                render={(group) => (
                  <View key={group.code} style={styles.productRow}>
                    {group.items.map((item) => (
                      <Text key={item} style={styles.productName}>
                        {item}
                      </Text>
                    ))}
                    {group.why ? <Text style={styles.helper}>{group.why}</Text> : null}
                  </View>
                )}
              />
            </View>
          ) : null}
          {result.ingredients.length ? (
            <View style={styles.subGroup}>
              <Text style={styles.label}>{resultLabels.ingredients}</Text>
              <MoreList items={result.ingredients} render={(point) => <Point key={point.text} point={point} />} />
            </View>
          ) : null}
          {result.explainers.map((point) => (
            <Point key={point.code} point={point} />
          ))}
          {result.showLabelGuide ? (
            <View style={styles.subGroup}>
              <Text style={styles.label}>{resultLabels.labelGuide}</Text>
              <Text style={styles.body}>{labelGuide}</Text>
            </View>
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
          <View style={styles.subGroup}>
            <Text style={styles.label}>{resultLabels.skinTone}</Text>
            {result.skinTone.map((point) => (
              <Point key={point.code} point={point} />
            ))}
          </View>
        ) : null}
      </Section>

      <Section title={sectionTitles.open}>
        {result.open.map((line) => (
          <Text key={line} style={styles.body}>
            {line}
          </Text>
        ))}
      </Section>

      <Section title={sectionTitles.evidence}>
        <Text style={styles.helper}>{evidenceIntro}</Text>
        {evidenceCounts.map((item) => (
          <Text key={item.label} style={styles.body}>
            {resultLabels.evidenceCount(item.label, item.count)}
          </Text>
        ))}
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
    </Screen>
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

function Point({ point }: { point: ResultPoint }) {
  return (
    <View style={styles.point}>
      <Text style={styles.body}>{point.text}</Text>
      {point.evidence ? <Text style={styles.evidence}>{resultLabels.evidenceLabel(point.evidence)}</Text> : null}
    </View>
  );
}

function MoreList<T>({ items, render }: { items: T[]; render: (item: T) => ReactNode }) {
  const [expanded, setExpanded] = useState(false);
  const visible = expanded ? items : items.slice(0, VISIBLE_AT_ONCE);
  return (
    <View style={styles.list}>
      {visible.map(render)}
      {items.length > VISIBLE_AT_ONCE ? (
        <Button
          label={expanded ? resultLabels.showFewer : resultLabels.showAll(items.length)}
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
            <View key={group.publisher} style={styles.subGroup}>
              <Text style={styles.label}>{group.publisher}</Text>
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
            </View>
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
    paddingTop: space[24],
    borderTopWidth: stroke.default,
    borderTopColor: c.border,
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
  startRow: {
    flexDirection: 'row',
    gap: space[12],
    alignItems: 'flex-start',
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
  point: {
    gap: space[4],
  },
  evidence: {
    ...type.caption,
    color: c.inkMuted,
  },
  tabs: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: space[8],
  },
  card: {
    gap: space[12],
    padding: layout.insideComponent,
    borderRadius: radius.medium,
    borderWidth: stroke.default,
    borderColor: c.border,
    backgroundColor: c.surface,
  },
  cardTitle: {
    ...type.title,
    color: c.ink,
  },
  subGroup: {
    gap: space[8],
  },
  productRow: {
    gap: space[4],
    padding: layout.insideComponent,
    borderRadius: radius.medium,
    borderWidth: stroke.default,
    borderColor: c.border,
    backgroundColor: c.surface,
  },
  productName: {
    ...type.label,
    color: c.ink,
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
