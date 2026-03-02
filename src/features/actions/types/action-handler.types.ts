import type { ContextEvent, ContextSnapshot, RuleAction } from 'features/rules';

/**
 * Input payload for action execution.
 */
export type ActionExecutionInput = {
  action: RuleAction;
  ruleId: string;
  event: ContextEvent;
  snapshot?: ContextSnapshot;
};

/**
 * Result emitted by action handlers after attempting execution.
 */
export type ActionExecutionResult = {
  actionId: string;
  status: 'executed' | 'skipped' | 'failed';
  reason?: string;
};
