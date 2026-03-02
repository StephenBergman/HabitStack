import type { z } from 'zod';

import type {
  actionSchema,
  conditionSchema,
  contextEventSchema,
  contextSnapshotSchema,
  createRuleInputSchema,
  ruleEvaluationInputSchema,
  ruleSchema,
  updateRuleInputSchema,
} from 'features/rules/schemas';

/**
 * Persisted automation rule model derived from `ruleSchema`.
 */
export type Rule = z.infer<typeof ruleSchema>;
/**
 * Rule condition model derived from `conditionSchema`.
 */
export type RuleCondition = z.infer<typeof conditionSchema>;
/**
 * Rule action model derived from `actionSchema`.
 */
export type RuleAction = z.infer<typeof actionSchema>;
/**
 * Normalized runtime event model derived from `contextEventSchema`.
 */
export type ContextEvent = z.infer<typeof contextEventSchema>;
/**
 * Optional context snapshot model derived from `contextSnapshotSchema`.
 */
export type ContextSnapshot = z.infer<typeof contextSnapshotSchema>;
/**
 * Input model for rule evaluation operations.
 */
export type RuleEvaluationInput = z.infer<typeof ruleEvaluationInputSchema>;
/**
 * Input model for creating rules.
 */
export type CreateRuleInput = z.infer<typeof createRuleInputSchema>;
/**
 * Input model for updating rules.
 */
export type UpdateRuleInput = z.infer<typeof updateRuleInputSchema>;
