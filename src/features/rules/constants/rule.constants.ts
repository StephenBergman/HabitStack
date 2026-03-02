/**
 * All supported rule condition types.
 */
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

/**
 * Condition types that can initiate rule evaluation from external events.
 */
export const triggerConditionTypes = [
  'location_enter',
  'location_exit',
  'bluetooth_connected',
  'bluetooth_disconnected',
  'power_connected',
  'power_disconnected',
] as const;

/**
 * Condition types evaluated as additional constraints after a trigger event.
 */
export const guardConditionTypes = [
  'time_window',
  'day_of_week',
  'cooldown_elapsed',
  'battery_above',
  'battery_below',
  'app_in_foreground',
  'app_in_background',
] as const;

/**
 * Supported automation action types.
 */
export const actionTypes = ['notify', 'open_url', 'log_event'] as const;

/**
 * Rule matching strategies.
 */
export const ruleMatchModes = ['all', 'any'] as const;

/**
 * Supported runtime context event types emitted by sensors/system state.
 */
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

/**
 * Day labels used by weekly scheduling conditions.
 */
export const daysOfWeek = [
  'monday',
  'tuesday',
  'wednesday',
  'thursday',
  'friday',
  'saturday',
  'sunday',
] as const;
