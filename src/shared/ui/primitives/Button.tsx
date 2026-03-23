import type { StyleProp, ViewStyle } from 'react-native';
import { TouchableOpacity } from 'react-native';

import { useAppTheme } from 'shared/theme';
import { AppText } from 'shared/ui/primitives/AppText';

type ButtonVariant = 'primary' | 'secondary';

type ButtonProps = {
  label: string;
  onPress: () => void;
  disabled?: boolean;
  isLoading?: boolean;
  variant?: ButtonVariant;
  style?: StyleProp<ViewStyle>;
};

/**
 * Reusable app button with consistent enabled/disabled/loading states.
 */
export function Button({
  label,
  onPress,
  disabled = false,
  isLoading = false,
  variant = 'primary',
  style,
}: ButtonProps) {
  const { theme } = useAppTheme();
  const isDisabled = disabled || isLoading;

  const isPrimary = variant === 'primary';
  const borderColor = isDisabled
    ? theme.colors.border
    : isPrimary
      ? theme.colors.accent
      : theme.colors.border;
  const backgroundColor = isDisabled
    ? theme.colors.accentSoft
    : isPrimary
      ? theme.colors.accent
      : theme.colors.surface;
  const labelColor = isDisabled ? theme.colors.muted : isPrimary ? '#FFFFFF' : theme.colors.text;

  return (
    <TouchableOpacity
      activeOpacity={0.85}
      disabled={isDisabled}
      onPress={onPress}
      style={[
        {
          width: '100%',
          borderRadius: 10,
          paddingVertical: 11,
          minHeight: 44,
          alignItems: 'center',
          justifyContent: 'center',
          borderWidth: 1,
          borderColor,
          backgroundColor,
          opacity: isLoading ? 0.8 : 1,
        },
        style,
      ]}
    >
      <AppText style={{ color: labelColor }} variant="label">
        {label}
      </AppText>
    </TouchableOpacity>
  );
}
