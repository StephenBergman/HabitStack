import type { AutomationEngine } from 'features/automation-engine/contracts';
import type {
  EngineDispatchItem,
  EngineEvaluateInput,
  EngineEvaluateOutput,
  RuleLastTriggeredAtById,
} from 'features/automation-engine/types';
import { guardConditionTypes, triggerConditionTypes } from 'features/rules/constants';
import type { ContextEvent, ContextSnapshot, Rule, RuleCondition } from 'features/rules';

const triggerConditionTypeSet = new Set<string>(triggerConditionTypes);
const guardConditionTypeSet = new Set<string>(guardConditionTypes);

type GuardEvaluation = {
  passed: boolean;
  reason?: string;
};

function toValidDate(iso: string | undefined): Date | null {
  if (!iso) {
    return null;
  }

  const parsed = new Date(iso);
  return Number.isNaN(parsed.getTime()) ? null : parsed;
}

function toWeekdayLowercase(instant: Date, timeZone?: string): string {
  const options: Intl.DateTimeFormatOptions = {
    weekday: 'long',
  };

  if (timeZone) {
    options.timeZone = timeZone;
  }

  try {
    return new Intl.DateTimeFormat('en-US', options).format(instant).toLowerCase();
  } catch {
    return new Intl.DateTimeFormat('en-US', { weekday: 'long' }).format(instant).toLowerCase();
  }
}

function toMinuteOfDay(instant: Date, timeZone?: string): number {
  const options: Intl.DateTimeFormatOptions = {
    hour: '2-digit',
    minute: '2-digit',
    hour12: false,
  };

  if (timeZone) {
    options.timeZone = timeZone;
  }

  try {
    const formatter = new Intl.DateTimeFormat('en-GB', options);
    const parts = formatter.formatToParts(instant);
    const hours = Number(parts.find((part) => part.type === 'hour')?.value ?? '0');
    const minutes = Number(parts.find((part) => part.type === 'minute')?.value ?? '0');
    return hours * 60 + minutes;
  } catch {
    return instant.getHours() * 60 + instant.getMinutes();
  }
}

function parseTimeToMinuteOfDay(time24h: string): number {
  const [hoursString, minutesString] = time24h.split(':');
  const hours = Number(hoursString);
  const minutes = Number(minutesString);
  return hours * 60 + minutes;
}

function isMinuteWithinWindow(
  minuteOfDay: number,
  startMinuteOfDay: number,
  endMinuteOfDay: number,
): boolean {
  if (startMinuteOfDay <= endMinuteOfDay) {
    return minuteOfDay >= startMinuteOfDay && minuteOfDay <= endMinuteOfDay;
  }

  return minuteOfDay >= startMinuteOfDay || minuteOfDay <= endMinuteOfDay;
}

function isTriggerCondition(condition: RuleCondition): boolean {
  return triggerConditionTypeSet.has(condition.type);
}

function isGuardCondition(condition: RuleCondition): boolean {
  return guardConditionTypeSet.has(condition.type);
}

function matchesTriggerCondition(condition: RuleCondition, event: ContextEvent): boolean {
  switch (condition.type) {
    case 'location_enter':
    case 'location_exit':
      return event.type === condition.type && event.geofenceId === condition.geofenceId;
    case 'bluetooth_connected':
    case 'bluetooth_disconnected':
      if (event.type !== condition.type) {
        return false;
      }

      if (condition.deviceId && event.deviceId !== condition.deviceId) {
        return false;
      }

      if (condition.deviceName && event.deviceName !== condition.deviceName) {
        return false;
      }

      return true;
    case 'power_connected':
    case 'power_disconnected':
      return event.type === condition.type;
    default:
      return false;
  }
}

function getBatteryLevelPercent(
  event: ContextEvent,
  snapshot: ContextSnapshot | undefined,
): number | undefined {
  if (event.type === 'battery_changed') {
    return event.levelPercent;
  }

  return snapshot?.batteryLevelPercent;
}

function getAppState(
  event: ContextEvent,
  snapshot: ContextSnapshot | undefined,
): 'foreground' | 'background' | undefined {
  if (event.type === 'app_state_changed') {
    return event.appState;
  }

  return snapshot?.appState;
}

function hasElapsedCooldown(
  lastTriggeredAtIso: string | undefined,
  now: Date,
  cooldownMs: number,
): boolean {
  const lastTriggeredAt = toValidDate(lastTriggeredAtIso);

  if (!lastTriggeredAt) {
    return true;
  }

  return now.getTime() - lastTriggeredAt.getTime() >= cooldownMs;
}

function evaluateGuardCondition(
  condition: RuleCondition,
  event: ContextEvent,
  snapshot: ContextSnapshot | undefined,
  evaluationInstant: Date,
  lastTriggeredAtByRuleId: RuleLastTriggeredAtById,
  ruleId: string,
): GuardEvaluation {
  switch (condition.type) {
    case 'time_window': {
      const currentMinute = toMinuteOfDay(evaluationInstant, condition.timezone);
      const startMinute = parseTimeToMinuteOfDay(condition.startTime);
      const endMinute = parseTimeToMinuteOfDay(condition.endTime);
      const passed = isMinuteWithinWindow(currentMinute, startMinute, endMinute);

      return passed ? { passed: true } : { passed: false, reason: 'outside_time_window' };
    }
    case 'day_of_week': {
      const weekday = toWeekdayLowercase(evaluationInstant);
      const passed = condition.days.includes(weekday as (typeof condition.days)[number]);

      return passed ? { passed: true } : { passed: false, reason: 'outside_allowed_days' };
    }
    case 'cooldown_elapsed': {
      const cooldownMs = condition.minutes * 60 * 1000;
      const passed = hasElapsedCooldown(lastTriggeredAtByRuleId[ruleId], evaluationInstant, cooldownMs);

      return passed ? { passed: true } : { passed: false, reason: 'cooldown_not_elapsed' };
    }
    case 'battery_above': {
      const batteryLevel = getBatteryLevelPercent(event, snapshot);

      if (batteryLevel === undefined) {
        return { passed: false, reason: 'battery_level_unavailable' };
      }

      return batteryLevel > condition.thresholdPercent
        ? { passed: true }
        : { passed: false, reason: 'battery_not_above_threshold' };
    }
    case 'battery_below': {
      const batteryLevel = getBatteryLevelPercent(event, snapshot);

      if (batteryLevel === undefined) {
        return { passed: false, reason: 'battery_level_unavailable' };
      }

      return batteryLevel < condition.thresholdPercent
        ? { passed: true }
        : { passed: false, reason: 'battery_not_below_threshold' };
    }
    case 'app_in_foreground': {
      const appState = getAppState(event, snapshot);

      if (!appState) {
        return { passed: false, reason: 'app_state_unavailable' };
      }

      return appState === 'foreground'
        ? { passed: true }
        : { passed: false, reason: 'app_not_in_foreground' };
    }
    case 'app_in_background': {
      const appState = getAppState(event, snapshot);

      if (!appState) {
        return { passed: false, reason: 'app_state_unavailable' };
      }

      return appState === 'background'
        ? { passed: true }
        : { passed: false, reason: 'app_not_in_background' };
    }
    default:
      return { passed: false, reason: 'unsupported_guard_condition' };
  }
}

function evaluateRule(
  rule: Rule,
  event: ContextEvent,
  snapshot: ContextSnapshot | undefined,
  evaluationInstant: Date,
  lastTriggeredAtByRuleId: RuleLastTriggeredAtById,
): {
  matched: boolean;
  reason?: string;
  dispatchItems: EngineDispatchItem[];
} {
  if (!rule.enabled) {
    return { matched: false, reason: 'rule_disabled', dispatchItems: [] };
  }

  const enabledConditions = rule.conditions.filter((condition) => condition.enabled);

  if (enabledConditions.length === 0) {
    return { matched: false, reason: 'no_enabled_conditions', dispatchItems: [] };
  }

  const triggerConditions = enabledConditions.filter(isTriggerCondition);
  const guardConditions = enabledConditions.filter(isGuardCondition);

  if (triggerConditions.length === 0) {
    return { matched: false, reason: 'no_trigger_conditions', dispatchItems: [] };
  }

  const isTriggerMatch = triggerConditions.some((condition) => matchesTriggerCondition(condition, event));

  if (!isTriggerMatch) {
    return { matched: false, reason: 'trigger_not_matched', dispatchItems: [] };
  }

  if (guardConditions.length > 0) {
    if (rule.matchMode === 'any') {
      const guardEvaluations = guardConditions.map((condition) =>
        evaluateGuardCondition(
          condition,
          event,
          snapshot,
          evaluationInstant,
          lastTriggeredAtByRuleId,
          rule.id,
        ),
      );
      const matchedAnyGuard = guardEvaluations.some((result) => result.passed);

      if (!matchedAnyGuard) {
        return {
          matched: false,
          reason: guardEvaluations.find((result) => result.reason)?.reason ?? 'guard_not_matched',
          dispatchItems: [],
        };
      }
    } else {
      for (const guardCondition of guardConditions) {
        const guardEvaluation = evaluateGuardCondition(
          guardCondition,
          event,
          snapshot,
          evaluationInstant,
          lastTriggeredAtByRuleId,
          rule.id,
        );

        if (!guardEvaluation.passed) {
          return {
            matched: false,
            reason: guardEvaluation.reason ?? 'guard_not_matched',
            dispatchItems: [],
          };
        }
      }
    }
  }

  if (rule.cooldownSeconds && rule.cooldownSeconds > 0) {
    const hasElapsedRuleCooldown = hasElapsedCooldown(
      lastTriggeredAtByRuleId[rule.id],
      evaluationInstant,
      rule.cooldownSeconds * 1000,
    );

    if (!hasElapsedRuleCooldown) {
      return { matched: false, reason: 'rule_cooldown_not_elapsed', dispatchItems: [] };
    }
  }

  const enabledActions = rule.actions.filter((action) => action.enabled);

  if (enabledActions.length === 0) {
    return { matched: false, reason: 'no_enabled_actions', dispatchItems: [] };
  }

  return {
    matched: true,
    dispatchItems: enabledActions.map((action) => ({
      ruleId: rule.id,
      action,
    })),
  };
}

function getEvaluationInstant(input: EngineEvaluateInput): Date {
  const dateFromNowIso = toValidDate(input.nowIso);

  if (dateFromNowIso) {
    return dateFromNowIso;
  }

  const dateFromSnapshot = toValidDate(input.snapshot?.nowIso);

  if (dateFromSnapshot) {
    return dateFromSnapshot;
  }

  const dateFromEvent = toValidDate(input.event.occurredAt);

  if (dateFromEvent) {
    return dateFromEvent;
  }

  return new Date();
}

/**
 * Minimal event-driven evaluator with trigger + guard support.
 */
export class MinimalAutomationEngine implements AutomationEngine {
  evaluate(input: EngineEvaluateInput): EngineEvaluateOutput {
    const dispatchQueue: EngineDispatchItem[] = [];
    const evaluations: EngineEvaluateOutput['evaluations'] = [];
    const evaluationInstant = getEvaluationInstant(input);
    const nextLastTriggeredAtByRuleId: RuleLastTriggeredAtById = {
      ...(input.lastTriggeredAtByRuleId ?? {}),
    };
    const evaluationIso = evaluationInstant.toISOString();

    for (const rule of input.rules) {
      const ruleEvaluation = evaluateRule(
        rule,
        input.event,
        input.snapshot,
        evaluationInstant,
        nextLastTriggeredAtByRuleId,
      );

      evaluations.push({
        ruleId: rule.id,
        matched: ruleEvaluation.matched,
        reason: ruleEvaluation.reason,
      });

      if (!ruleEvaluation.matched) {
        continue;
      }

      nextLastTriggeredAtByRuleId[rule.id] = evaluationIso;
      dispatchQueue.push(...ruleEvaluation.dispatchItems);
    }

    return {
      dispatchQueue,
      evaluations,
      nextLastTriggeredAtByRuleId,
    };
  }
}

/**
 * Factory for the default minimal automation engine.
 */
export function createMinimalAutomationEngine(): MinimalAutomationEngine {
  return new MinimalAutomationEngine();
}
