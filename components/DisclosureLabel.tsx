import { StyleSheet, Text, View } from 'react-native';

import { radius, sizes, space, stroke, type } from '@/constants/tokens';
import { makeStyles } from '@/hooks/useTheme';

export type DisclosureLabelType = 'partner' | 'sponsored';

type DisclosureLabelProps = {
  type: DisclosureLabelType;
};

const text = {
  partner: 'Partner content',
  sponsored: 'Sponsored',
} as const;

// Partner and sponsored content is always labeled and kept separate from guidance
export function DisclosureLabel({ type: labelType }: DisclosureLabelProps) {
  const styles = useStyles();
  return (
    <View style={styles.label} accessible accessibilityLabel={text[labelType]}>
      <Text style={styles.text}>{text[labelType]}</Text>
    </View>
  );
}

const useStyles = makeStyles((c) => StyleSheet.create({
  label: {
    minHeight: sizes.disclosureLabelHeight,
    alignSelf: 'flex-start',
    justifyContent: 'center',
    paddingVertical: space[4],
    paddingHorizontal: space[8],
    borderRadius: radius.small,
    borderWidth: stroke.default,
    borderColor: c.partner,
    backgroundColor: c.partnerSurface,
  },
  text: {
    ...type.caption,
    color: c.partner,
  },
}));
