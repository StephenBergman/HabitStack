import type { TriggerDefinition } from 'features/triggers/types/trigger.types';

export function shouldFireTrigger(trigger: TriggerDefinition) {
  return trigger.enabled;
}
