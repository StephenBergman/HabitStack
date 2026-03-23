import type { ReactNode } from 'react';
import type { StyleProp, ViewStyle } from 'react-native';
import { Platform, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { useAppTheme } from 'shared/theme';

type ScreenProps = {
  children: ReactNode;
  style?: StyleProp<ViewStyle>;
};

export function Screen({ children, style }: ScreenProps) {
  const { theme } = useAppTheme();

  const safeAreaEdges = Platform.OS === 'android' ? (['top'] as const) : undefined;

  return (
    <SafeAreaView edges={safeAreaEdges} style={{ flex: 1, backgroundColor: theme.colors.background }}>
      <View style={[{ flex: 1, backgroundColor: theme.colors.background }, style]}>{children}</View>
    </SafeAreaView>
  );
}
