import { supabase } from 'services/supabase';
import {
  createRuleInputSchema,
  ruleSchema,
  updateRuleInputSchema,
} from 'features/rules/schemas';
import type { CreateRuleInput, Rule, UpdateRuleInput } from 'features/rules/types';

type AutomationRuleRow = {
  id: string;
  user_id: string;
  name: string;
  enabled: boolean;
  priority: number;
  match_mode: 'all' | 'any';
  conditions: unknown;
  actions: unknown;
  cooldown_seconds: number | null;
  created_at: string;
  updated_at: string;
  deleted_at: string | null;
};

type RuleRuntimeStateRow = {
  user_id: string;
  rule_id: string;
  last_triggered_at: string | null;
  updated_at: string;
};

export type ListRulesOptions = {
  includeDeleted?: boolean;
  enabledOnly?: boolean;
  limit?: number;
};

export type RuleRuntimeState = {
  ruleId: string;
  lastTriggeredAt?: string;
  updatedAt: string;
};

function normalizeIsoDateTime(value: string): string {
  const parsed = new Date(value);

  if (Number.isNaN(parsed.getTime())) {
    throw new Error(`Invalid datetime value from database: ${value}`);
  }

  return parsed.toISOString();
}

function toRuleModel(row: AutomationRuleRow): Rule {
  return ruleSchema.parse({
    id: row.id,
    name: row.name,
    enabled: row.enabled,
    priority: row.priority,
    matchMode: row.match_mode,
    conditions: row.conditions,
    actions: row.actions,
    cooldownSeconds: row.cooldown_seconds ?? undefined,
    createdAt: normalizeIsoDateTime(row.created_at),
    updatedAt: normalizeIsoDateTime(row.updated_at),
  });
}

function toRuntimeStateModel(row: RuleRuntimeStateRow): RuleRuntimeState {
  return {
    ruleId: row.rule_id,
    lastTriggeredAt: row.last_triggered_at ? normalizeIsoDateTime(row.last_triggered_at) : undefined,
    updatedAt: normalizeIsoDateTime(row.updated_at),
  };
}

async function getAuthenticatedUserId(): Promise<string> {
  const { data, error } = await supabase.auth.getUser();

  if (error) {
    throw new Error(`Failed to resolve current user: ${error.message}`);
  }

  const userId = data.user?.id;

  if (!userId) {
    throw new Error('No authenticated user session found.');
  }

  return userId;
}

/**
 * Lists persisted rules for the current authenticated user.
 */
export async function listRules(options: ListRulesOptions = {}): Promise<Rule[]> {
  const userId = await getAuthenticatedUserId();
  let query = supabase
    .from('automation_rules')
    .select('*')
    .eq('user_id', userId)
    .order('priority', { ascending: false })
    .order('updated_at', { ascending: false });

  if (!options.includeDeleted) {
    query = query.is('deleted_at', null);
  }

  if (options.enabledOnly) {
    query = query.eq('enabled', true);
  }

  if (typeof options.limit === 'number') {
    query = query.limit(options.limit);
  }

  const { data, error } = await query;

  if (error) {
    throw new Error(`Failed to list rules: ${error.message}`);
  }

  const rows = (data ?? []) as AutomationRuleRow[];
  return rows.map(toRuleModel);
}

/**
 * Fetches one rule by id for the current authenticated user.
 */
export async function getRuleById(ruleId: string): Promise<Rule | null> {
  const userId = await getAuthenticatedUserId();
  const { data, error } = await supabase
    .from('automation_rules')
    .select('*')
    .eq('id', ruleId)
    .eq('user_id', userId)
    .maybeSingle();

  if (error) {
    throw new Error(`Failed to fetch rule: ${error.message}`);
  }

  if (!data) {
    return null;
  }

  return toRuleModel(data as AutomationRuleRow);
}

/**
 * Creates a new persisted rule for the current authenticated user.
 */
export async function createRule(input: CreateRuleInput): Promise<Rule> {
  const validated = createRuleInputSchema.parse(input);
  const userId = await getAuthenticatedUserId();
  const { data, error } = await supabase
    .from('automation_rules')
    .insert({
      user_id: userId,
      name: validated.name,
      enabled: validated.enabled,
      priority: validated.priority,
      match_mode: validated.matchMode,
      conditions: validated.conditions,
      actions: validated.actions,
      cooldown_seconds: validated.cooldownSeconds ?? null,
    })
    .select('*')
    .single();

  if (error) {
    throw new Error(`Failed to create rule: ${error.message}`);
  }

  return toRuleModel(data as AutomationRuleRow);
}

/**
 * Updates a persisted rule and returns the latest stored shape.
 */
export async function updateRule(input: UpdateRuleInput): Promise<Rule> {
  const validated = updateRuleInputSchema.parse(input);
  const userId = await getAuthenticatedUserId();

  const patch: Record<string, unknown> = {};

  if (validated.name !== undefined) {
    patch.name = validated.name;
  }

  if (validated.enabled !== undefined) {
    patch.enabled = validated.enabled;
  }

  if (validated.priority !== undefined) {
    patch.priority = validated.priority;
  }

  if (validated.matchMode !== undefined) {
    patch.match_mode = validated.matchMode;
  }

  if (validated.conditions !== undefined) {
    patch.conditions = validated.conditions;
  }

  if (validated.actions !== undefined) {
    patch.actions = validated.actions;
  }

  if (validated.cooldownSeconds !== undefined) {
    patch.cooldown_seconds = validated.cooldownSeconds;
  }

  const { data, error } = await supabase
    .from('automation_rules')
    .update(patch)
    .eq('id', validated.id)
    .eq('user_id', userId)
    .is('deleted_at', null)
    .select('*')
    .single();

  if (error) {
    throw new Error(`Failed to update rule: ${error.message}`);
  }

  return toRuleModel(data as AutomationRuleRow);
}

/**
 * Soft-deletes a rule by setting `deleted_at`.
 */
export async function softDeleteRule(ruleId: string): Promise<void> {
  const userId = await getAuthenticatedUserId();
  const { error } = await supabase
    .from('automation_rules')
    .update({ deleted_at: new Date().toISOString() })
    .eq('id', ruleId)
    .eq('user_id', userId)
    .is('deleted_at', null);

  if (error) {
    throw new Error(`Failed to soft-delete rule: ${error.message}`);
  }
}

/**
 * Restores a soft-deleted rule by clearing `deleted_at`.
 */
export async function restoreRule(ruleId: string): Promise<void> {
  const userId = await getAuthenticatedUserId();
  const { error } = await supabase
    .from('automation_rules')
    .update({ deleted_at: null })
    .eq('id', ruleId)
    .eq('user_id', userId);

  if (error) {
    throw new Error(`Failed to restore rule: ${error.message}`);
  }
}

/**
 * Loads persisted cooldown memory for rules.
 */
export async function listRuleRuntimeState(ruleIds?: string[]): Promise<RuleRuntimeState[]> {
  const userId = await getAuthenticatedUserId();
  let query = supabase
    .from('automation_rule_runtime_state')
    .select('*')
    .eq('user_id', userId)
    .order('updated_at', { ascending: false });

  if (ruleIds && ruleIds.length > 0) {
    query = query.in('rule_id', ruleIds);
  }

  const { data, error } = await query;

  if (error) {
    throw new Error(`Failed to list runtime state: ${error.message}`);
  }

  const rows = (data ?? []) as RuleRuntimeStateRow[];
  return rows.map(toRuntimeStateModel);
}

/**
 * Returns cooldown memory as a ruleId->timestamp map for engine input.
 */
export async function getLastTriggeredAtByRuleId(ruleIds?: string[]): Promise<Record<string, string>> {
  const stateRows = await listRuleRuntimeState(ruleIds);
  return stateRows.reduce<Record<string, string>>((accumulator, row) => {
    if (row.lastTriggeredAt) {
      accumulator[row.ruleId] = row.lastTriggeredAt;
    }

    return accumulator;
  }, {});
}

/**
 * Upserts the last-triggered timestamp for a rule.
 */
export async function upsertRuleLastTriggeredAt(
  ruleId: string,
  lastTriggeredAtIso: string,
): Promise<void> {
  const userId = await getAuthenticatedUserId();
  const { error } = await supabase.from('automation_rule_runtime_state').upsert(
    {
      user_id: userId,
      rule_id: ruleId,
      last_triggered_at: lastTriggeredAtIso,
      updated_at: new Date().toISOString(),
    },
    {
      onConflict: 'user_id,rule_id',
    },
  );

  if (error) {
    throw new Error(`Failed to upsert runtime state: ${error.message}`);
  }
}

/**
 * Persists cooldown state for many rules in one request.
 */
export async function upsertRuleLastTriggeredAtMap(
  entries: Record<string, string>,
): Promise<void> {
  const userId = await getAuthenticatedUserId();
  const rows = Object.entries(entries).map(([ruleId, lastTriggeredAtIso]) => ({
    user_id: userId,
    rule_id: ruleId,
    last_triggered_at: lastTriggeredAtIso,
    updated_at: new Date().toISOString(),
  }));

  if (rows.length === 0) {
    return;
  }

  const { error } = await supabase.from('automation_rule_runtime_state').upsert(rows, {
    onConflict: 'user_id,rule_id',
  });

  if (error) {
    throw new Error(`Failed to bulk-upsert runtime state: ${error.message}`);
  }
}
