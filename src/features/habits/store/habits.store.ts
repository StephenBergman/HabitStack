import { create } from 'zustand';

import type { Habit } from 'features/habits/types';

/**
 * Local habits store state and actions.
 */
type HabitsState = {
  habits: Habit[];
  completeHabit: (id: string) => void;
};

/**
 * Initial in-memory habits used for scaffold and UI development.
 */
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

/**
 * Zustand store for habits.
 * `completeHabit` increments streak for the matching habit id.
 */
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
