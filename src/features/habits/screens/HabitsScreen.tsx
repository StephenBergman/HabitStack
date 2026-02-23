import { ScrollView, Text } from 'react-native';

import { HabitCard } from 'features/habits/components/HabitCard';
import { useHabitsStore } from 'features/habits/store/habits.store';
import { appColors } from 'shared/constants/colors';
import { formatToday } from 'shared/lib/date';

export function HabitsScreen() {
  const habits = useHabitsStore((state) => state.habits);

  return (
    <ScrollView
      contentContainerStyle={{
        flexGrow: 1,
        gap: 12,
        padding: 16,
        backgroundColor: appColors.background,
      }}
    >
      <Text style={{ fontSize: 28, fontWeight: '700', color: appColors.text }}>
        HabitStack
      </Text>
      <Text style={{ color: appColors.muted }}>Context triggers for {formatToday()}</Text>

      {habits.map((habit) => (
        <HabitCard key={habit.id} habit={habit} />
      ))}
    </ScrollView>
  );
}
