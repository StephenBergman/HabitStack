import { Text, View } from 'react-native';
import { CheckCircle, MapPin } from 'phosphor-react-native';

import type { Habit } from 'features/habits/types/habit.types';
import { appColors } from 'shared/constants/colors';

type HabitCardProps = {
  habit: Habit;
};

export function HabitCard({ habit }: HabitCardProps) {
  return (
    <View
      style={{
        gap: 8,
        borderRadius: 14,
        padding: 14,
        backgroundColor: appColors.surface,
      }}
    >
      <View
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'space-between',
        }}
      >
        <Text style={{ fontSize: 17, fontWeight: '600', color: appColors.text }}>{habit.title}</Text>
        <CheckCircle size={20} color={appColors.success} weight="fill" />
      </View>

      <View style={{ flexDirection: 'row', gap: 8, alignItems: 'center' }}>
        <MapPin size={16} color={appColors.muted} />
        <Text style={{ color: appColors.muted }}>{habit.triggerLabel}</Text>
      </View>

      <Text style={{ fontWeight: '600', color: appColors.accent }}>{habit.streak} day streak</Text>
    </View>
  );
}
