import type { StyleProp, ViewStyle } from 'react-native';
import { TouchableOpacity } from 'react-native';

import { useAppTheme } from 'shared/theme';
import { AppText } from 'shared/ui/primitives/AppText';

type PillProps = {
  label: string;
  selected?: boolean;
  onPress: () => void;
  style?: StyleProp<ViewStyle>;
};

/**
 * Selectable chip/pill used for compact option groups.
 */
export function Pill({ label, selected = false, onPress, style }: PillProps) {
  const { theme } = useAppTheme();

  return (
    <TouchableOpacity
      activeOpacity={0.85}
      onPress={onPress}
      style={[
        {
          borderRadius: 999,
          borderWidth: 1,
          borderColor: selected ? theme.colors.accent : theme.colors.border,
          backgroundColor: selected ? theme.colors.accentSoft : theme.colors.surface,
          paddingHorizontal: 12,
          paddingVertical: 7,
        },
        style,
      ]}
    >
      <AppText tone={selected ? 'accent' : 'muted'} variant="caption">
        {label}
      </AppText>
    </TouchableOpacity>
  );
}
