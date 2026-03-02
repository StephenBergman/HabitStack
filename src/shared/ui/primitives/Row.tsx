import type { ReactNode } from 'react';
import type { FlexAlignType, StyleProp, ViewStyle } from 'react-native';
import { View } from 'react-native';

type RowProps = {
  children: ReactNode;
  gap?: number;
  align?: FlexAlignType;
  justify?: ViewStyle['justifyContent'];
  style?: StyleProp<ViewStyle>;
};

export function Row({
  children,
  gap = 8,
  align = 'center',
  justify = 'flex-start',
  style,
}: RowProps) {
  return (
    <View style={[{ flexDirection: 'row', alignItems: align, justifyContent: justify, gap }, style]}>
      {children}
    </View>
  );
}
