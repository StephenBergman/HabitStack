export type TriggerType = 'location' | 'bluetooth' | 'charger' | 'motion';

export type TriggerDefinition = {
  id: string;
  type: TriggerType;
  label: string;
  enabled: boolean;
};
