import { useState, type ReactNode } from 'react';
import { StyleSheet, Text, View } from 'react-native';

import { AnswerOption, type AnswerOptionIndicator, type AnswerOptionState } from '@/components/AnswerOption';
import { Button, type ButtonState, type ButtonStyle } from '@/components/Button';
import { Checkbox, type CheckboxState } from '@/components/Checkbox';
import { Chip, type ChipState } from '@/components/Chip';
import { DisclosureLabel } from '@/components/DisclosureLabel';
import { GuidanceResultCard } from '@/components/GuidanceResultCard';
import { HelpButton } from '@/components/HelpButton';
import { HelpPanel } from '@/components/HelpPanel';
import { Icon, iconNames } from '@/components/Icon';
import { ProductCard } from '@/components/ProductCard';
import { QuizProgress } from '@/components/QuizProgress';
import { Screen } from '@/components/Screen';
import { TabBar, type TabId } from '@/components/TabBar';
import { TabItem } from '@/components/TabItem';
import { TextInput, type TextInputState } from '@/components/TextInput';
import { Toast } from '@/components/Toast';
import { TopBar } from '@/components/TopBar';
import { colors, space, type } from '@/constants/tokens';
import { useGoBack } from '@/hooks/useGoBack';

// Temporary developer screen. It shows each component in each Figma variant, labeled with the Figma name.
// The sample text below is placeholder copy, never app copy.

const noop = () => {};

const buttonStyles: ButtonStyle[] = ['primary', 'secondary', 'ghost'];
const buttonStates: ButtonState[] = ['default', 'hover', 'pressed', 'disabled'];
const answerStates: AnswerOptionState[] = ['default', 'pressed', 'selected', 'disabled'];
const indicators: AnswerOptionIndicator[] = ['radio', 'checkbox'];
const chipStates: ChipState[] = ['default', 'pressed', 'selected', 'disabled'];
const inputStates: TextInputState[] = ['default', 'focus', 'error', 'disabled'];
const checkboxStates: CheckboxState[] = ['unchecked', 'checked', 'error', 'disabled'];
const typeScale = ['display', 'heading', 'title', 'body', 'label', 'caption'] as const;

export default function DevScreen() {
  const goBack = useGoBack();
  const [tab, setTab] = useState<TabId>('home');

  return (
    <Screen>
      <Button label="Back to proof screen" style="ghost" onPress={goBack} />
      <Text style={styles.pageTitle} accessibilityRole="header">
        Component dev screen
      </Text>

      <Section title="Type scale">
        {typeScale.map((name) => (
          <Text key={name} style={[type[name], styles.ink]}>
            {name}: Cuidance guidance
          </Text>
        ))}
      </Section>

      <Section title="Icon">
        <View style={styles.wrap}>
          {iconNames.map((name) => (
            <View key={name} style={styles.iconCell}>
              <Icon name={name} />
              <Text style={styles.caption}>{name}</Text>
            </View>
          ))}
        </View>
      </Section>

      <Section title="Button">
        {buttonStyles.flatMap((style) =>
          buttonStates.map((state) => (
            <Variant key={`${style}-${state}`} name={`Style=${style}, State=${state}`}>
              <Button label="Button" style={style} state={state} onPress={noop} />
            </Variant>
          )),
        )}
      </Section>

      <Section title="AnswerOption">
        {indicators.flatMap((indicator) =>
          answerStates.map((state) => (
            <Variant key={`${indicator}-${state}`} name={`Indicator=${indicator}, State=${state}`}>
              <AnswerOption label="Sample answer" indicator={indicator} state={state} onPress={noop} />
            </Variant>
          )),
        )}
      </Section>

      <Section title="Chip">
        {chipStates.map((state) => (
          <Variant key={state} name={`State=${state}`}>
            <Chip label="Chip" state={state} onPress={noop} />
          </Variant>
        ))}
      </Section>

      <Section title="TextInput">
        {inputStates.map((state) => (
          <Variant key={state} name={`State=${state}`}>
            <TextInput
              label="Label"
              placeholder="Placeholder"
              helper="Helper text"
              error="Error message"
              state={state}
            />
          </Variant>
        ))}
      </Section>

      <Section title="Checkbox">
        {checkboxStates.map((state) => (
          <Variant key={state} name={`State=${state}`}>
            <Checkbox label="Sample checkbox" state={state} error="Error message" onPress={noop} />
          </Variant>
        ))}
      </Section>

      <Section title="QuizProgress">
        <Variant name="step=1 (current 1, total 4)">
          <QuizProgress label="Sample label · 1 of 4" current={1} total={4} />
        </Variant>
        <Variant name="step=3 (current 3, total 4)">
          <QuizProgress label="Sample label · 3 of 4" current={3} total={4} />
        </Variant>
      </Section>

      <Section title="HelpButton">
        <Variant name="State=default">
          <HelpButton state="default" onPress={noop} />
        </Variant>
        <Variant name="State=pressed">
          <HelpButton state="pressed" onPress={noop} />
        </Variant>
      </Section>

      <Section title="DisclosureLabel">
        <Variant name="Type=partner">
          <DisclosureLabel type="partner" />
        </Variant>
        <Variant name="Type=sponsored">
          <DisclosureLabel type="sponsored" />
        </Variant>
      </Section>

      <Section title="Toast">
        <Variant name="Type=success">
          <Toast type="success" message="Sample message" actionLabel="Undo" onActionPress={noop} />
        </Variant>
        <Variant name="Type=error">
          <Toast type="error" message="Sample message" actionLabel="Retry" onActionPress={noop} />
        </Variant>
      </Section>

      <Section title="TabItem">
        <View style={styles.row}>
          <Variant name="State=default">
            <TabItem label="Home" icon="home" state="default" onPress={noop} />
          </Variant>
          <Variant name="State=active">
            <TabItem label="Home" icon="home" state="active" onPress={noop} />
          </Variant>
        </View>
      </Section>

      <Section title="TabBar">
        <Variant name={`Active tab = ${tab} (tap to switch)`}>
          <TabBar active={tab} onSelect={setTab} />
        </Variant>
      </Section>

      <Section title="TopBar">
        <TopBar onBack={noop} onHelp={noop} />
      </Section>

      <Section title="GuidanceResultCard">
        <GuidanceResultCard
          eyebrow="Sample eyebrow"
          headline="Sample headline"
          subtitle="Sample subtitle that explains the headline in a sentence."
          onWhyPress={noop}
        />
      </Section>

      <Section title="ProductCard">
        <ProductCard name="Sample product type" brand="Sample brand line" fitLabel="Sample fit tag" onPress={noop} />
      </Section>

      <Section title="HelpPanel">
        <HelpPanel
          title="Sample title"
          body="Sample body text for the help panel."
          buttonLabel="Sample action"
          onButtonPress={noop}
          onClose={noop}
        />
      </Section>
    </Screen>
  );
}

type SectionProps = {
  title: string;
  children: ReactNode;
};

function Section({ title, children }: SectionProps) {
  return (
    <View style={styles.section}>
      <Text style={styles.sectionTitle} accessibilityRole="header">
        {title}
      </Text>
      {children}
    </View>
  );
}

type VariantProps = {
  name: string;
  children: ReactNode;
};

// The caption is the Figma variant name, so a screenshot can be checked against Figma
function Variant({ name, children }: VariantProps) {
  return (
    <View style={styles.variant}>
      <Text style={styles.caption}>{name}</Text>
      {children}
    </View>
  );
}

const styles = StyleSheet.create({
  pageTitle: {
    ...type.heading,
    color: colors.light.ink,
  },
  section: {
    gap: space[12],
    marginTop: space[16],
  },
  sectionTitle: {
    ...type.title,
    color: colors.light.ink,
  },
  variant: {
    gap: space[4],
  },
  caption: {
    ...type.caption,
    color: colors.light.inkMuted,
  },
  ink: {
    color: colors.light.ink,
  },
  wrap: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: space[16],
  },
  iconCell: {
    alignItems: 'center',
    gap: space[4],
    minWidth: space[48],
  },
  row: {
    flexDirection: 'row',
    gap: space[16],
  },
});
