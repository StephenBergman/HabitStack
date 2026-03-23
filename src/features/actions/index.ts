/**
 * Actions module public API.
 */
export type { ActionHandler, ActionRegistry } from 'features/actions/contracts';
export type { ActionExecutionInput, ActionExecutionResult } from 'features/actions/types';
export {
  createNotifyActionHandler,
  NotifyActionHandler,
} from 'features/actions/handlers';
export {
  createInMemoryActionRegistry,
  InMemoryActionRegistry,
} from 'features/actions/services';
