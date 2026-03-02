import type { ContextEvent, ContextSnapshot, Rule, RuleAction } from 'features/rules';

/**
 * Input payload for a single engine evaluation cycle.
 */
export type EngineEvaluateInput = {
  rules: Rule[];
  event: ContextEvent;
  snapshot?: ContextSnapshot;
  nowIso?: string;
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
};
