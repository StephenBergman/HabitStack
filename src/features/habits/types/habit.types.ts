export type TriggerKind = 'location' | 'bluetooth' | 'charger' | 'motion';

export type Habit = {
  id: string;
  title: string;
  triggerKind: TriggerKind;
  triggerLabel: string;
  streak: number;
};
