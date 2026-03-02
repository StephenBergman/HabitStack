import type { EngineEvaluateInput, EngineEvaluateOutput } from 'features/automation-engine/types';

/**
 * Contract for a pure automation engine that evaluates rules for a context event.
 */
export interface AutomationEngine {
  evaluate(input: EngineEvaluateInput): EngineEvaluateOutput;
}
