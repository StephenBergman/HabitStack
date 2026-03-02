import { Text, View } from 'react-native';
import { CheckCircle, MapPin } from 'phosphor-react-native';

import type { Habit } from 'features/habits/types/habit.types';
import { useAppTheme } from 'shared/theme';

type HabitCardProps = {
  habit: Habit;
};

export function HabitCard({ habit }: HabitCardProps) {
  const { theme } = useAppTheme();

  return (
    <View
      style={{
        gap: 8,
        borderRadius: 14,
        padding: 14,
        borderWidth: 1,
        borderColor: theme.colors.border,
        backgroundColor: theme.colors.surface,
      }}
    >
      <View
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'space-between',
        }}
      >
        <Text style={{ fontSize: 17, fontWeight: '600', color: theme.colors.text }}>{habit.title}</Text>
        <CheckCircle size={20} color={theme.colors.success} weight="fill" />
      </View>

      <View style={{ flexDirection: 'row', gap: 8, alignItems: 'center' }}>
        <MapPin size={16} color={theme.colors.muted} />
        <Text style={{ color: theme.colors.muted }}>{habit.triggerLabel}</Text>
      </View>

      <Text style={{ fontWeight: '600', color: theme.colors.accent }}>{habit.streak} day streak</Text>
    </View>
  );
}
