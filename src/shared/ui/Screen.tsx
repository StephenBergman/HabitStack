import type { ReactNode } from 'react';
import type { StyleProp, ViewStyle } from 'react-native';
import { View } from 'react-native';

import { useAppTheme } from 'shared/theme';

type ScreenProps = {
  children: ReactNode;
  style?: StyleProp<ViewStyle>;
};

export function Screen({ children, style }: ScreenProps) {
  const { theme } = useAppTheme();

  return <View style={[{ flex: 1, backgroundColor: theme.colors.background }, style]}>{children}</View>;
}
