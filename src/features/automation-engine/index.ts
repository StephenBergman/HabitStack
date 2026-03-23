/**
 * Automation engine module public API.
 */
export type { AutomationEngine } from 'features/automation-engine/contracts';
export {
  createMinimalAutomationEngine,
  getNextCooldownState,
  MinimalAutomationEngine,
  runAutomationCycle,
  runAutomationCycleFromSourceEvent,
} from 'features/automation-engine/services';
export type {
  AutomationActionDispatchResult,
  RunAutomationCycleFromSourceEventInput,
  RunAutomationCycleInput,
  RunAutomationCycleOutput,
} from 'features/automation-engine/services';
export type {
  EngineDispatchItem,
  EngineEvaluateInput,
  EngineEvaluateOutput,
  EngineRuleEvaluation,
  RuleLastTriggeredAtById,
} from 'features/automation-engine/types';
