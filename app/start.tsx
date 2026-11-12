import { Image } from 'expo-image';
import { useRouter } from 'expo-router';
import { StyleSheet, Text, View } from 'react-native';

import { Button } from '@/components/Button';
import { Screen } from '@/components/Screen';
import { colors, layout, space, type } from '@/constants/tokens';
import { quizQuestions } from '@/data/quiz';
import { useAuth } from '@/hooks/useAuth';
import { firstNameFrom } from '@/lib/auth';

// Artwork cut from the Week 8 hi-fi "02D · Account created" design, not redrawn
const hero = require('@/assets/images/account-created-hero.png');
const footerArt = require('@/assets/images/account-created-footer.png');
// Names longer than this always go on their own line under "Welcome,". Shorter names stay
// on the same line when there's room, and wrap after "Welcome," on narrow phones
const NAME_SAME_LINE_MAX = 7;
// The artwork never grows past its size in the design
const HERO_MAX_HEIGHT = 360;
const FOOTER_MAX_HEIGHT = 88;

// Where signed-in people land, until Home exists: "Welcome, [name]" from the design,
// then Start guidance opens the first quiz question
export default function StartScreen() {
  const router = useRouter();
  const { session } = useAuth();
  const firstName = firstNameFrom(session?.user.user_metadata);
  const greeting = !firstName
    ? 'Welcome'
    : firstName.length > NAME_SAME_LINE_MAX
      ? `Welcome,\n${firstName}`
      : `Welcome, ${firstName}`;

  return (
    <Screen compact>
      <View style={styles.heroWrap}>
        <Image source={hero} style={styles.hero} contentFit="cover" contentPosition="bottom" accessible={false} />
      </View>

      <View style={styles.text}>
        {/* Copy from the clickable prototype. With no name it says just "Welcome" */}
        <Text style={styles.title} accessibilityRole="header">
          {greeting}
        </Text>
        <Text style={styles.body}>
          Next is the full guidance quiz: about 7 to 10 questions, depending on the areas you pick.
        </Text>
        <Text style={styles.body}>It takes about 3 minutes, and you can save and exit anytime.</Text>
      </View>

      <View style={styles.actions}>
        <Button label="Start guidance" onPress={() => router.push(`/quiz/${quizQuestions[0].id}`)} />
      </View>

      <Image source={footerArt} style={styles.footerArt} contentFit="cover" contentPosition="top" accessible={false} />
    </Screen>
  );
}

const c = colors.light;

const styles = StyleSheet.create({
  // The artwork shrinks before any text does, so the screen fits in one view
  heroWrap: {
    flex: 3,
    minHeight: space[48],
    maxHeight: HERO_MAX_HEIGHT,
    marginHorizontal: -layout.screenEdge,
    marginTop: -space[8],
  },
  hero: {
    flex: 1,
  },
  text: {
    gap: space[12],
    paddingHorizontal: space[16],
    paddingTop: space[8],
  },
  title: {
    ...type.display,
    color: c.ink,
    textAlign: 'center',
  },
  body: {
    ...type.body,
    color: c.inkMuted,
  },
  actions: {
    marginTop: 'auto',
    paddingTop: space[24],
    paddingHorizontal: space[8],
  },
  footerArt: {
    flex: 1,
    minHeight: 0,
    maxHeight: FOOTER_MAX_HEIGHT,
    marginHorizontal: -layout.screenEdge,
    marginBottom: -space[8],
  },
});
