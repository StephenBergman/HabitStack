import {  CheckCircleIcon, MapPinIcon } from 'phosphor-react-native';

import type { Habit } from 'features/habits/types';
import { useAppTheme } from 'shared/theme';
import { AppText, Card, Row, Stack } from 'shared/ui';

type HabitCardProps = {
  habit: Habit;
};

export function HabitCard({ habit }: HabitCardProps) {
  const { theme } = useAppTheme();

  return (
    <Card>
      <Stack gap={8}>
        <Row justify="space-between">
          <AppText variant="subtitle">{habit.title}</AppText>
          <CheckCircleIcon size={20} color={theme.colors.success} weight="fill" />
        </Row>

        <Row>
          <MapPinIcon size={16} color={theme.colors.muted} />
          <AppText tone="muted">{habit.triggerLabel}</AppText>
        </Row>

        <AppText variant="label" tone="accent">
          {habit.streak} day streak
        </AppText>
      </Stack>
    </Card>
  );
}
