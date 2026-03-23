import type { ActionRegistry, ActionExecutionResult } from 'features/actions';
import type { AutomationEngine } from 'features/automation-engine/contracts';
import type {
  EngineEvaluateInput,
  EngineEvaluateOutput,
  RuleLastTriggeredAtById,
} from 'features/automation-engine/types';
import type { ContextSourceEvent } from 'features/context-sources';
import type { RuleAction } from 'features/rules';

export type RunAutomationCycleInput = EngineEvaluateInput & {
  engine: AutomationEngine;
  actionRegistry: ActionRegistry;
};

export type RunAutomationCycleFromSourceEventInput = Omit<RunAutomationCycleInput, 'event'> & {
  sourceEvent: ContextSourceEvent;
};

export type AutomationActionDispatchResult = ActionExecutionResult & {
  ruleId: string;
  actionType: RuleAction['type'];
};

export type RunAutomationCycleOutput = EngineEvaluateOutput & {
  actionResults: AutomationActionDispatchResult[];
};

function normalizeActionResult(
  result: ActionExecutionResult,
  ruleId: string,
  actionType: RuleAction['type'],
): AutomationActionDispatchResult {
  return {
    ...result,
    ruleId,
    actionType,
  };
}

/**
 * Runs one automation cycle: evaluate rules for an event, then execute dispatched actions.
 */
export async function runAutomationCycle(
  input: RunAutomationCycleInput,
): Promise<RunAutomationCycleOutput> {
  const evaluateOutput = input.engine.evaluate({
    rules: input.rules,
    event: input.event,
    snapshot: input.snapshot,
    nowIso: input.nowIso,
    lastTriggeredAtByRuleId: input.lastTriggeredAtByRuleId,
  });
  const actionResults: AutomationActionDispatchResult[] = [];

  for (const dispatchItem of evaluateOutput.dispatchQueue) {
    const actionType = dispatchItem.action.type;
    const handler = input.actionRegistry.get(actionType);

    if (!handler) {
      actionResults.push({
        actionId: dispatchItem.action.id,
        status: 'failed',
        reason: 'no_handler_registered',
        ruleId: dispatchItem.ruleId,
        actionType,
      });
      continue;
    }

    try {
      const result = await handler.execute({
        action: dispatchItem.action,
        ruleId: dispatchItem.ruleId,
        event: input.event,
        snapshot: input.snapshot,
      });

      actionResults.push(normalizeActionResult(result, dispatchItem.ruleId, actionType));
    } catch {
      actionResults.push({
        actionId: dispatchItem.action.id,
        status: 'failed',
        reason: 'handler_execution_error',
        ruleId: dispatchItem.ruleId,
        actionType,
      });
    }
  }

  return {
    ...evaluateOutput,
    actionResults,
  };
}

/**
 * Convenience wrapper to run an automation cycle from a context source payload.
 */
export async function runAutomationCycleFromSourceEvent(
  input: RunAutomationCycleFromSourceEventInput,
): Promise<RunAutomationCycleOutput> {
  return runAutomationCycle({
    ...input,
    event: input.sourceEvent.event,
    nowIso: input.nowIso ?? input.sourceEvent.receivedAt,
  });
}

/**
 * Helper for retaining only cooldown memory needed across cycles.
 */
export function getNextCooldownState(output: EngineEvaluateOutput): RuleLastTriggeredAtById {
  return output.nextLastTriggeredAtByRuleId;
}
