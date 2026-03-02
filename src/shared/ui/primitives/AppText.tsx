import type { ReactNode } from 'react';
import { Text, type StyleProp, type TextProps, type TextStyle } from 'react-native';

import { useAppTheme } from 'shared/theme';

type AppTextVariant = 'title' | 'subtitle' | 'body' | 'caption' | 'label';
type AppTextTone = 'default' | 'muted' | 'accent' | 'success';

type AppTextProps = TextProps & {
  children: ReactNode;
  variant?: AppTextVariant;
  tone?: AppTextTone;
  style?: StyleProp<TextStyle>;
};

const variantStyles: Record<AppTextVariant, TextStyle> = {
  title: { fontSize: 28, fontWeight: '700' },
  subtitle: { fontSize: 18, fontWeight: '600' },
  body: { fontSize: 15, fontWeight: '400' },
  caption: { fontSize: 13, fontWeight: '400' },
  label: { fontSize: 15, fontWeight: '600' },
};

export function AppText({
  children,
  variant = 'body',
  tone = 'default',
  style,
  ...props
}: AppTextProps) {
  const { theme } = useAppTheme();

  const colorByTone: Record<AppTextTone, string> = {
    default: theme.colors.text,
    muted: theme.colors.muted,
    accent: theme.colors.accent,
    success: theme.colors.success,
  };

  return (
    <Text style={[variantStyles[variant], { color: colorByTone[tone] }, style]} {...props}>
      {children}
    </Text>
  );
}
