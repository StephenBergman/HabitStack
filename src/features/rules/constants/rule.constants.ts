export const conditionTypes = [
  'location_enter',
  'location_exit',
  'bluetooth_connected',
  'bluetooth_disconnected',
  'power_connected',
  'power_disconnected',
  'time_window',
  'day_of_week',
  'cooldown_elapsed',
  'battery_above',
  'battery_below',
  'app_in_foreground',
  'app_in_background',
] as const;

export const triggerConditionTypes = [
  'location_enter',
  'location_exit',
  'bluetooth_connected',
  'bluetooth_disconnected',
  'power_connected',
  'power_disconnected',
] as const;

export const guardConditionTypes = [
  'time_window',
  'day_of_week',
  'cooldown_elapsed',
  'battery_above',
  'battery_below',
  'app_in_foreground',
  'app_in_background',
] as const;

export const actionTypes = ['notify', 'open_url', 'log_event'] as const;

export const ruleMatchModes = ['all', 'any'] as const;

export const contextEventTypes = [
  'location_enter',
  'location_exit',
  'bluetooth_connected',
  'bluetooth_disconnected',
  'power_connected',
  'power_disconnected',
  'battery_changed',
  'app_state_changed',
  'time_tick',
] as const;

export const daysOfWeek = [
  'monday',
  'tuesday',
  'wednesday',
  'thursday',
  'friday',
  'saturday',
  'sunday',
] as const;
