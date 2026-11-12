import { StyleSheet, Text, View } from 'react-native';

import { Button } from '@/components/Button';
import { Sheet } from '@/components/Sheet';
import { colors, space, type } from '@/constants/tokens';

type PrivacySheetProps = {
  visible: boolean;
  onClose: () => void;
  // "I understand" also ticks the privacy checkbox, like the clickable prototype
  onUnderstand: () => void;
};

// Copy from the clickable prototype and the Week 8 hi-fi "02C · Privacy & Trust sheet"
const intro = 'Cuidance only works if you can trust it. Here is what happens with what you share.';

const points = [
  {
    title: 'We never sell your data',
    body: 'Your answers are not sold or rented to anyone, including partner brands.',
  },
  {
    title: 'Your answers shape your guidance only',
    body: 'Quiz answers are used to explain what may fit you. Partner brands never see your attributes.',
  },
  {
    title: 'How guidance is created',
    body: 'Guidance comes from a reviewed library of research-backed notes, matched to what you selected. It is guidance, not a diagnosis.',
  },
  {
    title: 'How partner content is labeled',
    body: 'Anything a brand paid for is marked “Partner” and kept separate from your guidance.',
  },
  {
    title: 'You stay in control',
    body: 'Change or delete your answers anytime in Profile, and turn personalization off in Privacy & trust settings.',
  },
];

export function PrivacySheet({ visible, onClose, onUnderstand }: PrivacySheetProps) {
  return (
    <Sheet visible={visible} title="Privacy & Trust" onClose={onClose}>
      <View style={styles.content}>
        <Text style={styles.intro}>{intro}</Text>
        {points.map((point) => (
          <View key={point.title} style={styles.point}>
            <Text style={styles.pointTitle}>{point.title}</Text>
            <Text style={styles.pointBody}>{point.body}</Text>
          </View>
        ))}
        <Button label="I understand" onPress={onUnderstand} />
      </View>
    </Sheet>
  );
}

const c = colors.light;

const styles = StyleSheet.create({
  content: {
    gap: space[16],
  },
  intro: {
    ...type.body,
    color: c.ink,
  },
  point: {
    gap: space[4],
  },
  pointTitle: {
    ...type.label,
    color: c.ink,
  },
  pointBody: {
    ...type.body,
    color: c.inkMuted,
  },
});
