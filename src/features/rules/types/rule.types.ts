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

export type Rule = z.infer<typeof ruleSchema>;
export type RuleCondition = z.infer<typeof conditionSchema>;
export type RuleAction = z.infer<typeof actionSchema>;
export type ContextEvent = z.infer<typeof contextEventSchema>;
export type ContextSnapshot = z.infer<typeof contextSnapshotSchema>;
export type RuleEvaluationInput = z.infer<typeof ruleEvaluationInputSchema>;
export type CreateRuleInput = z.infer<typeof createRuleInputSchema>;
export type UpdateRuleInput = z.infer<typeof updateRuleInputSchema>;
