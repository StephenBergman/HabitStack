import type { ReactNode } from 'react';
import type { StyleProp, ViewStyle } from 'react-native';
import { View } from 'react-native';

import { useAppTheme } from 'shared/theme';

type CardProps = {
  children: ReactNode;
  style?: StyleProp<ViewStyle>;
  padding?: number;
  radius?: number;
};

export function Card({ children, style, padding = 14, radius = 14 }: CardProps) {
  const { theme } = useAppTheme();

  return (
    <View
      style={[
        {
          padding,
          borderRadius: radius,
          borderWidth: 1,
          borderColor: theme.colors.border,
          backgroundColor: theme.colors.surface,
        },
        style,
      ]}
    >
      {children}
    </View>
  );
}
