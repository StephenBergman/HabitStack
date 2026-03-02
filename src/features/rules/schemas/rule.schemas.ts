import { z } from 'zod';

import {
  actionTypes,
  contextEventTypes,
  daysOfWeek,
  ruleMatchModes,
} from 'features/rules/constants';

const idSchema = z.string().min(1);
const time24hSchema = z.string().regex(/^([01]\d|2[0-3]):([0-5]\d)$/, 'Expected HH:mm format');
const dayOfWeekSchema = z.enum(daysOfWeek);

const conditionBaseSchema = z.object({
  id: idSchema,
  enabled: z.boolean().default(true),
});

const locationConditionSchema = conditionBaseSchema.extend({
  type: z.enum(['location_enter', 'location_exit']),
  geofenceId: z.string().min(1),
  placeLabel: z.string().min(1).optional(),
});

const bluetoothConditionSchema = conditionBaseSchema
  .extend({
    type: z.enum(['bluetooth_connected', 'bluetooth_disconnected']),
    deviceId: z.string().min(1).optional(),
    deviceName: z.string().min(1).optional(),
  })
  .refine((value) => Boolean(value.deviceId || value.deviceName), {
    path: ['deviceId'],
    message: 'Provide deviceId or deviceName',
  });

const powerConditionSchema = conditionBaseSchema.extend({
  type: z.enum(['power_connected', 'power_disconnected']),
});

const timeWindowConditionSchema = conditionBaseSchema.extend({
  type: z.literal('time_window'),
  startTime: time24hSchema,
  endTime: time24hSchema,
  timezone: z.string().min(1).optional(),
});

const dayOfWeekConditionSchema = conditionBaseSchema.extend({
  type: z.literal('day_of_week'),
  days: z.array(dayOfWeekSchema).min(1),
});

const cooldownElapsedConditionSchema = conditionBaseSchema.extend({
  type: z.literal('cooldown_elapsed'),
  minutes: z.number().int().min(1),
});

const batteryAboveConditionSchema = conditionBaseSchema.extend({
  type: z.literal('battery_above'),
  thresholdPercent: z.number().int().min(1).max(100),
});

const batteryBelowConditionSchema = conditionBaseSchema.extend({
  type: z.literal('battery_below'),
  thresholdPercent: z.number().int().min(1).max(100),
});

const appInForegroundConditionSchema = conditionBaseSchema.extend({
  type: z.literal('app_in_foreground'),
});

const appInBackgroundConditionSchema = conditionBaseSchema.extend({
  type: z.literal('app_in_background'),
});

/**
 * Runtime-validated rule condition schema (discriminated by `type`).
 */
export const conditionSchema = z.discriminatedUnion('type', [
  locationConditionSchema,
  bluetoothConditionSchema,
  powerConditionSchema,
  timeWindowConditionSchema,
  dayOfWeekConditionSchema,
  cooldownElapsedConditionSchema,
  batteryAboveConditionSchema,
  batteryBelowConditionSchema,
  appInForegroundConditionSchema,
  appInBackgroundConditionSchema,
]);

const actionBaseSchema = z.object({
  id: idSchema,
  enabled: z.boolean().default(true),
});

const notifyActionSchema = actionBaseSchema.extend({
  type: z.literal('notify'),
  title: z.string().min(1),
  body: z.string().min(1),
  channelId: z.string().min(1).optional(),
});

const openUrlActionSchema = actionBaseSchema.extend({
  type: z.literal('open_url'),
  url: z.string().url(),
});

const logEventActionSchema = actionBaseSchema.extend({
  type: z.literal('log_event'),
  message: z.string().min(1),
});

/**
 * Runtime-validated action schema (discriminated by `type`).
 */
export const actionSchema = z.discriminatedUnion('type', [
  notifyActionSchema,
  openUrlActionSchema,
  logEventActionSchema,
]);

/**
 * Persisted automation rule schema.
 */
export const ruleSchema = z.object({
  id: idSchema,
  name: z.string().min(1),
  enabled: z.boolean().default(true),
  matchMode: z.enum(ruleMatchModes).default('all'),
  conditions: z.array(conditionSchema).min(1),
  actions: z.array(actionSchema).min(1),
  priority: z.number().int().min(0).default(0),
  cooldownSeconds: z.number().int().min(0).optional(),
  createdAt: z.string().datetime(),
  updatedAt: z.string().datetime(),
});

/**
 * Input schema for creating a new rule record.
 */
export const createRuleInputSchema = ruleSchema.omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

/**
 * Input schema for patching an existing rule record.
 */
export const updateRuleInputSchema = createRuleInputSchema.partial().extend({
  id: idSchema,
});

const locationEventSchema = z.object({
  type: z.enum(['location_enter', 'location_exit']),
  geofenceId: z.string().min(1),
  placeLabel: z.string().min(1).optional(),
  occurredAt: z.string().datetime(),
});

const bluetoothEventSchema = z.object({
  type: z.enum(['bluetooth_connected', 'bluetooth_disconnected']),
  deviceId: z.string().min(1).optional(),
  deviceName: z.string().min(1).optional(),
  occurredAt: z.string().datetime(),
});

const powerEventSchema = z.object({
  type: z.enum(['power_connected', 'power_disconnected']),
  occurredAt: z.string().datetime(),
});

const batteryChangedEventSchema = z.object({
  type: z.literal('battery_changed'),
  levelPercent: z.number().int().min(0).max(100),
  isCharging: z.boolean(),
  occurredAt: z.string().datetime(),
});

const appStateChangedEventSchema = z.object({
  type: z.literal('app_state_changed'),
  appState: z.enum(['foreground', 'background']),
  occurredAt: z.string().datetime(),
});

const timeTickEventSchema = z.object({
  type: z.literal('time_tick'),
  occurredAt: z.string().datetime(),
});

/**
 * Normalized runtime event schema consumed by the evaluation engine.
 */
export const contextEventSchema = z.discriminatedUnion('type', [
  locationEventSchema,
  bluetoothEventSchema,
  powerEventSchema,
  batteryChangedEventSchema,
  appStateChangedEventSchema,
  timeTickEventSchema,
]);

/**
 * Optional context values used while evaluating guards.
 */
export const contextSnapshotSchema = z.object({
  batteryLevelPercent: z.number().int().min(0).max(100).optional(),
  isCharging: z.boolean().optional(),
  appState: z.enum(['foreground', 'background']).optional(),
  nowIso: z.string().datetime().optional(),
});

/**
 * Input payload schema for evaluating a single rule against current context.
 */
export const ruleEvaluationInputSchema = z.object({
  rule: ruleSchema,
  event: contextEventSchema,
  snapshot: contextSnapshotSchema.optional(),
});

/**
 * Exported schema metadata for UI builders and form option lists.
 */
export const ruleSchemaMetadata = {
  actionTypes,
  contextEventTypes,
  daysOfWeek,
} as const;
