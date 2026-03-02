import type { ActionHandler } from 'features/actions/contracts/action-handler.contract';
import type { RuleAction } from 'features/rules';

/**
 * Registry contract for mapping action types to handlers.
 */
export interface ActionRegistry {
  register(handler: ActionHandler): void;
  unregister(type: RuleAction['type']): void;
  get(type: RuleAction['type']): ActionHandler | undefined;
  list(): ActionHandler[];
}
