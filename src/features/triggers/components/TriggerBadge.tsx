import { Text, View } from 'react-native';

import { useAppTheme } from 'shared/theme';

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
      <Text style={{ color: theme.colors.accent, fontWeight: '600' }}>{label}</Text>
    </View>
  );
}
