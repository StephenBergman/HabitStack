import type { ActionExecutionInput, ActionExecutionResult } from 'features/actions/types';
import type { RuleAction } from 'features/rules';

/**
 * Contract implemented by action executors (notifications, links, logs).
 */
export interface ActionHandler {
  type: RuleAction['type'];
  execute(input: ActionExecutionInput): Promise<ActionExecutionResult>;
}
