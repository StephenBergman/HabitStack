import type { TriggerDefinition } from 'features/triggers/types';

/**
 * Returns true when the trigger is currently enabled.
 */
export function shouldFireTrigger(trigger: TriggerDefinition) {
  return trigger.enabled;
}
