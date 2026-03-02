import type { ReactNode } from 'react';
import type { StyleProp, ViewStyle } from 'react-native';
import { View } from 'react-native';

type StackProps = {
  children: ReactNode;
  gap?: number;
  style?: StyleProp<ViewStyle>;
};

export function Stack({ children, gap = 12, style }: StackProps) {
  return <View style={[{ gap }, style]}>{children}</View>;
}
