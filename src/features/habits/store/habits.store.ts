import { create } from 'zustand';

import type { Habit } from 'features/habits/types/habit.types';

type HabitsState = {
  habits: Habit[];
  completeHabit: (id: string) => void;
};

const seedHabits: Habit[] = [
  {
    id: 'gym-checklist',
    title: 'Open workout checklist',
    triggerKind: 'location',
    triggerLabel: 'When you enter the gym',
    streak: 3,
  },
  {
    id: 'office-focus-stack',
    title: 'Open daily task stack',
    triggerKind: 'location',
    triggerLabel: 'When you arrive at office',
    streak: 7,
  },
];

export const useHabitsStore = create<HabitsState>((set) => ({
  habits: seedHabits,
  completeHabit: (id) =>
    set((state) => ({
      habits: state.habits.map((habit) =>
        habit.id === id
          ? {
              ...habit,
              streak: habit.streak + 1,
            }
          : habit,
      ),
    })),
}));
