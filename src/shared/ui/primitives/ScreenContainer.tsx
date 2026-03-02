import type { ReactNode } from 'react';
import type { StyleProp, ViewStyle } from 'react-native';
import { ScrollView, View } from 'react-native';

import { Screen } from 'shared/ui/Screen';

type ScreenContainerProps = {
  children: ReactNode;
  scroll?: boolean;
  padding?: number;
  gap?: number;
  style?: StyleProp<ViewStyle>;
  contentStyle?: StyleProp<ViewStyle>;
};

export function ScreenContainer({
  children,
  scroll = false,
  padding = 16,
  gap = 12,
  style,
  contentStyle,
}: ScreenContainerProps) {
  if (scroll) {
    return (
      <Screen style={style}>
        <ScrollView contentContainerStyle={[{ flexGrow: 1, padding, gap }, contentStyle]}>
          {children}
        </ScrollView>
      </Screen>
    );
  }

  return (
    <Screen style={style}>
      <View style={[{ flex: 1, padding, gap }, contentStyle]}>{children}</View>
    </Screen>
  );
}
