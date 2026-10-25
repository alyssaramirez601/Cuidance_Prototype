import Svg, { Path } from 'react-native-svg';

import { colors, sizes, stroke } from '@/constants/tokens';

// Path data copied from docs/design-system/icons.md. Change it there first.
const iconPaths = {
  home: ['M4 11L12 4L20 11V20H15V14H9V20H4V11Z'],
  explore: [
    'M12 20.5C16.6944 20.5 20.5 16.6944 20.5 12C20.5 7.30558 16.6944 3.5 12 3.5C7.30558 3.5 3.5 7.30558 3.5 12C3.5 16.6944 7.30558 20.5 12 20.5Z',
    'M15.5 8.5L13.5 13.5L8.5 15.5L10.5 10.5L15.5 8.5Z',
  ],
  saved: ['M6.5 4H17.5V20L12 16L6.5 20V4Z'],
  shop: [
    'M5 8H19L18 20H6L5 8Z',
    'M9 8V6.5C9 5.70435 9.31607 4.94129 9.87868 4.37868C10.4413 3.81607 11.2044 3.5 12 3.5C12.7956 3.5 13.5587 3.81607 14.1213 4.37868C14.6839 4.94129 15 5.70435 15 6.5V8',
  ],
  profile: [
    'M12 12C13.933 12 15.5 10.433 15.5 8.5C15.5 6.567 13.933 5 12 5C10.067 5 8.5 6.567 8.5 8.5C8.5 10.433 10.067 12 12 12Z',
    'M5 20C5 16 8.2 14 12 14C15.8 14 19 16 19 20',
  ],
  help: [
    'M12 20.5C16.6944 20.5 20.5 16.6944 20.5 12C20.5 7.30558 16.6944 3.5 12 3.5C7.30558 3.5 3.5 7.30558 3.5 12C3.5 16.6944 7.30558 20.5 12 20.5Z',
    'M9.80011 9.50017C9.79711 9.08389 9.90714 8.6746 10.1185 8.31594C10.3298 7.95729 10.6345 7.66272 11.0001 7.46364C11.3658 7.26456 11.7785 7.16844 12.1945 7.18553C12.6104 7.20262 13.0139 7.33228 13.362 7.56068C13.71 7.78908 13.9895 8.10766 14.1707 8.48245C14.3519 8.85723 14.428 9.27417 14.3909 9.6888C14.3537 10.1034 14.2048 10.5002 13.9598 10.8368C13.7149 11.1734 13.3832 11.4373 13.0001 11.6002C12.3001 11.9002 12.0001 12.4002 12.0001 13.1002V13.5002',
    'M12 16.5996V16.7996',
  ],
  check: ['M5 12.5L9.5 17L19 7.5'],
  alert: ['M12 4L21 19.5H3L12 4Z', 'M12 10V14.5', 'M12 17.2002V17.4002'],
  back: ['M14.5 5.5L8 12L14.5 18.5'],
  close: ['M6 6L18 18M18 6L6 18'],
  arrow: ['M4.5 12H19.5', 'M13.5 6L19.5 12L13.5 18'],
} as const;

export type IconName = keyof typeof iconPaths;
export const iconNames = Object.keys(iconPaths) as IconName[];

type IconProps = {
  name: IconName;
  size?: number;
  // A color from constants/tokens.ts, never a hex code
  color?: string;
};

// Icons are decorative. The control that holds one carries the accessibility label
export function Icon({ name, size = sizes.icon.large, color = colors.light.ink }: IconProps) {
  return (
    <Svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      accessibilityElementsHidden
      importantForAccessibility="no-hide-descendants"
    >
      {iconPaths[name].map((d) => (
        <Path key={d} d={d} stroke={color} strokeWidth={stroke.icon} strokeLinecap="round" strokeLinejoin="round" />
      ))}
    </Svg>
  );
}
