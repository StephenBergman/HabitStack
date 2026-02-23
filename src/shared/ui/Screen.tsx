import type { ReactNode } from 'react';
import { View } from 'react-native';

type ScreenProps = {
  children: ReactNode;
};

export function Screen({ children }: ScreenProps) {
  return <View style={{ flex: 1 }}>{children}</View>;
}
