import type { TriggerDefinition } from 'features/triggers/types';

export function shouldFireTrigger(trigger: TriggerDefinition) {
  return trigger.enabled;
}
