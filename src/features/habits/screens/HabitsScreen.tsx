import { ScrollView, Text } from 'react-native';

import { HabitCard } from 'features/habits/components/HabitCard';
import { useHabitsStore } from 'features/habits/store/habits.store';
import { useAppTheme } from 'shared/theme';
import { Screen } from 'shared/ui/Screen';
import { formatToday } from 'shared/lib/date';

export function HabitsScreen() {
  const habits = useHabitsStore((state) => state.habits);
  const { theme } = useAppTheme();

  return (
    <Screen>
      <ScrollView
        contentContainerStyle={{
          flexGrow: 1,
          gap: 12,
          padding: 16,
        }}
      >
        <Text style={{ fontSize: 28, fontWeight: '700', color: theme.colors.text }}>
          HabitStack
        </Text>
        <Text style={{ color: theme.colors.muted }}>Context triggers for {formatToday()}</Text>

        {habits.map((habit) => (
          <HabitCard key={habit.id} habit={habit} />
        ))}
      </ScrollView>
    </Screen>
  );
}
