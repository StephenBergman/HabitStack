import { HabitCard } from 'features/habits/components';
import { useHabitsStore } from 'features/habits/store';
import { formatToday } from 'shared/lib';
import { AppText, ScreenContainer } from 'shared/ui';

export function HabitsScreen() {
  const habits = useHabitsStore((state) => state.habits);

  return (
    <ScreenContainer scroll>
      <AppText variant="title">HabitStack</AppText>
      <AppText tone="muted">Context triggers for {formatToday()}</AppText>

      {habits.map((habit) => (
        <HabitCard key={habit.id} habit={habit} />
      ))}
    </ScreenContainer>
  );
}
