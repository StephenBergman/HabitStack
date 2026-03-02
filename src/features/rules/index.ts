/**
 * Rule domain module public API.
 * Re-exports constants, schemas, and inferred types for automation rules.
 */
export {
  actionTypes,
  conditionTypes,
  contextEventTypes,
  daysOfWeek,
  guardConditionTypes,
  ruleMatchModes,
  triggerConditionTypes,
} from 'features/rules/constants';
export {
  actionSchema,
  conditionSchema,
  contextEventSchema,
  contextSnapshotSchema,
  createRuleInputSchema,
  ruleEvaluationInputSchema,
  ruleSchema,
  ruleSchemaMetadata,
  updateRuleInputSchema,
} from 'features/rules/schemas';
export type {
  ContextEvent,
  ContextSnapshot,
  CreateRuleInput,
  Rule,
  RuleAction,
  RuleCondition,
  RuleEvaluationInput,
  UpdateRuleInput,
} from 'features/rules/types';
