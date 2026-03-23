import type { ContextEvent, ContextSnapshot, Rule, RuleAction } from 'features/rules';

/**
 * Per-rule timestamp memory used for cooldown evaluations.
 */
export type RuleLastTriggeredAtById = Record<string, string>;

/**
 * Input payload for a single engine evaluation cycle.
 */
export type EngineEvaluateInput = {
  rules: Rule[];
  event: ContextEvent;
  snapshot?: ContextSnapshot;
  nowIso?: string;
  lastTriggeredAtByRuleId?: RuleLastTriggeredAtById;
};

/**
 * A queued action emitted by the engine after rule matching.
 */
export type EngineDispatchItem = {
  ruleId: string;
  action: RuleAction;
};

/**
 * Per-rule evaluation diagnostics.
 */
export type EngineRuleEvaluation = {
  ruleId: string;
  matched: boolean;
  reason?: string;
};

/**
 * Result returned by the engine for one event processing cycle.
 */
export type EngineEvaluateOutput = {
  dispatchQueue: EngineDispatchItem[];
  evaluations: EngineRuleEvaluation[];
  nextLastTriggeredAtByRuleId: RuleLastTriggeredAtById;
};
