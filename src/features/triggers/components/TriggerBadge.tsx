import { View } from 'react-native';

import { useAppTheme } from 'shared/theme';
import { AppText } from 'shared/ui';

type TriggerBadgeProps = {
  label: string;
};

export function TriggerBadge({ label }: TriggerBadgeProps) {
  const { theme } = useAppTheme();

  return (
    <View
      style={{
        alignSelf: 'flex-start',
        paddingHorizontal: 10,
        paddingVertical: 4,
        borderRadius: 999,
        backgroundColor: theme.colors.accentSoft,
      }}
    >
      <AppText tone="accent" variant="label">
        {label}
      </AppText>
    </View>
  );
}
