import { useCallback, useEffect, useMemo, useState } from 'react';
import { ActivityIndicator, Pressable, View } from 'react-native';
import { ArrowsClockwiseIcon, CheckCircleIcon, WarningCircleIcon, XCircleIcon } from 'phosphor-react-native';

import { listRules, type Rule } from 'features/rules';
import { useAppTheme } from 'shared/theme';
import { AppText, Card, Row, ScreenContainer, Stack } from 'shared/ui';

function formatUpdatedAt(iso: string): string {
  const date = new Date(iso);

  if (Number.isNaN(date.getTime())) {
    return 'unknown';
  }

  return date.toLocaleString();
}

type RuleCardProps = {
  rule: Rule;
};

function RuleCard({ rule }: RuleCardProps) {
  const { theme } = useAppTheme();
  const isEnabled = rule.enabled;

  return (
    <Card>
      <Stack gap={8}>
        <Row justify="space-between">
          <AppText variant="subtitle">{rule.name}</AppText>
          <Row gap={6}>
            {isEnabled ? (
              <CheckCircleIcon color={theme.colors.success} size={18} weight="fill" />
            ) : (
              <XCircleIcon color={theme.colors.muted} size={18} weight="fill" />
            )}
            <AppText variant="caption" tone={isEnabled ? 'success' : 'muted'}>
              {isEnabled ? 'Enabled' : 'Disabled'}
            </AppText>
          </Row>
        </Row>

        <Row justify="space-between">
          <AppText tone="muted" variant="caption">
            Match mode: {rule.matchMode.toUpperCase()}
          </AppText>
          <AppText tone="muted" variant="caption">
            Priority: {rule.priority}
          </AppText>
        </Row>

        <Row justify="space-between">
          <AppText tone="muted" variant="caption">
            Conditions: {rule.conditions.length}
          </AppText>
          <AppText tone="muted" variant="caption">
            Actions: {rule.actions.length}
          </AppText>
        </Row>

        <AppText tone="muted" variant="caption">
          Updated: {formatUpdatedAt(rule.updatedAt)}
        </AppText>
      </Stack>
    </Card>
  );
}

function ErrorState({ message, onRetry }: { message: string; onRetry: () => void }) {
  const { theme } = useAppTheme();

  return (
    <Card
      style={{
        borderColor: theme.colors.accentSoft,
        backgroundColor: theme.colors.surfaceMuted,
      }}
    >
      <Stack gap={10}>
        <Row>
          <WarningCircleIcon color={theme.colors.accent} size={18} weight="fill" />
          <AppText variant="subtitle">Could not load rules</AppText>
        </Row>
        <AppText tone="muted">{message}</AppText>
        <Pressable
          onPress={onRetry}
          style={({ pressed }) => ({
            paddingVertical: 10,
            paddingHorizontal: 12,
            borderRadius: 10,
            borderWidth: 1,
            borderColor: theme.colors.border,
            backgroundColor: pressed ? theme.colors.accentSoft : theme.colors.surface,
          })}
        >
          <Row justify="center">
            <ArrowsClockwiseIcon color={theme.colors.accent} size={16} />
            <AppText tone="accent" variant="label">
              Retry
            </AppText>
          </Row>
        </Pressable>
      </Stack>
    </Card>
  );
}

function EmptyState() {
  const { theme } = useAppTheme();

  return (
    <Card
      style={{
        borderStyle: 'dashed',
        borderColor: theme.colors.border,
        backgroundColor: theme.colors.surfaceMuted,
      }}
    >
      <Stack gap={8}>
        <AppText variant="subtitle">No rules yet</AppText>
        <AppText tone="muted">
          Your Supabase connection is live, but there are no automation rules for this account yet.
        </AppText>
      </Stack>
    </Card>
  );
}

/**
 * Screen that lists persisted automation rules from Supabase.
 */
export function RulesListScreen() {
  const { theme } = useAppTheme();
  const [rules, setRules] = useState<Rule[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);

  const loadRules = useCallback(async (isManualRefresh = false) => {
    if (isManualRefresh) {
      setIsRefreshing(true);
    } else {
      setIsLoading(true);
    }

    setError(null);

    try {
      const nextRules = await listRules();
      setRules(nextRules);
    } catch (loadError) {
      const message = loadError instanceof Error ? loadError.message : 'Unknown error';
      setError(message);
    } finally {
      setIsLoading(false);
      setIsRefreshing(false);
    }
  }, []);

  useEffect(() => {
    void loadRules();
  }, [loadRules]);

  const subtitle = useMemo(() => {
    if (isLoading) {
      return 'Loading rules from Supabase...';
    }

    return `${rules.length} rule${rules.length === 1 ? '' : 's'} loaded`;
  }, [isLoading, rules.length]);

  return (
    <ScreenContainer scroll>
      <Row justify="space-between">
        <View style={{ flex: 1 }}>
          <AppText variant="title">Automation Rules</AppText>
          <AppText tone="muted">{subtitle}</AppText>
        </View>

        <Pressable
          accessibilityLabel="Refresh rules"
          onPress={() => void loadRules(true)}
          style={({ pressed }) => ({
            width: 38,
            height: 38,
            borderRadius: 10,
            borderWidth: 1,
            borderColor: theme.colors.border,
            backgroundColor: pressed ? theme.colors.accentSoft : theme.colors.surface,
            alignItems: 'center',
            justifyContent: 'center',
            opacity: isRefreshing ? 0.5 : 1,
          })}
        >
          <ArrowsClockwiseIcon color={theme.colors.accent} size={18} />
        </Pressable>
      </Row>

      {isLoading ? (
        <Card>
          <Row justify="center">
            <ActivityIndicator size="small" color={theme.colors.accent} />
            <AppText tone="muted">Loading rule list...</AppText>
          </Row>
        </Card>
      ) : null}

      {!isLoading && error ? <ErrorState message={error} onRetry={() => void loadRules(true)} /> : null}
      {!isLoading && !error && rules.length === 0 ? <EmptyState /> : null}
      {!isLoading && !error ? rules.map((rule) => <RuleCard key={rule.id} rule={rule} />) : null}
    </ScreenContainer>
  );
}
