import { useMemo, useState } from 'react';
import { TextInput, View } from 'react-native';

import { createRule } from 'features/rules/services';
import { useAppTheme } from 'shared/theme';
import { AppText, Button, Card, Pill, Row, ScreenContainer, Stack } from 'shared/ui';

type CreateRuleScreenProps = {
  onCreated?: () => void;
};

type RuleTriggerType = 'power_connected' | 'power_disconnected' | 'location_enter' | 'location_exit';

const triggerOptions: { label: string; value: RuleTriggerType }[] = [
  { label: 'Power Connected', value: 'power_connected' },
  { label: 'Power Disconnected', value: 'power_disconnected' },
  { label: 'Location Enter', value: 'location_enter' },
  { label: 'Location Exit', value: 'location_exit' },
];

function createLocalId(prefix: string): string {
  const randomPart = Math.random().toString(36).slice(2, 10);
  return `${prefix}_${Date.now()}_${randomPart}`;
}

/**
 * Creates a basic automation rule with one trigger and one notify action.
 */
export function CreateRuleScreen({ onCreated }: CreateRuleScreenProps) {
  const { theme } = useAppTheme();
  const [ruleName, setRuleName] = useState('');
  const [triggerType, setTriggerType] = useState<RuleTriggerType>('power_connected');
  const [geofenceId, setGeofenceId] = useState('');
  const [notifyTitle, setNotifyTitle] = useState('');
  const [notifyBody, setNotifyBody] = useState('');
  const [priority, setPriority] = useState('0');
  const [cooldownMinutes, setCooldownMinutes] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const requiresGeofence = triggerType === 'location_enter' || triggerType === 'location_exit';

  const isValid = useMemo(() => {
    const parsedPriority = Number(priority);
    const hasValidPriority = Number.isInteger(parsedPriority) && parsedPriority >= 0;
    const parsedCooldown = cooldownMinutes ? Number(cooldownMinutes) : 0;
    const hasValidCooldown =
      cooldownMinutes.length === 0 || (Number.isInteger(parsedCooldown) && parsedCooldown >= 0);

    return (
      ruleName.trim().length > 0 &&
      notifyTitle.trim().length > 0 &&
      notifyBody.trim().length > 0 &&
      hasValidPriority &&
      hasValidCooldown &&
      (!requiresGeofence || geofenceId.trim().length > 0)
    );
  }, [cooldownMinutes, geofenceId, notifyBody, notifyTitle, priority, requiresGeofence, ruleName]);

  const isSubmitDisabled = isSubmitting || !isValid;

  const resetForm = () => {
    setRuleName('');
    setTriggerType('power_connected');
    setGeofenceId('');
    setNotifyTitle('');
    setNotifyBody('');
    setPriority('0');
    setCooldownMinutes('');
  };

  const submit = async () => {
    if (!isValid) {
      setErrorMessage('Fill all required fields with valid values before saving.');
      return;
    }

    const conditionId = createLocalId('condition');
    const actionId = createLocalId('action');
    const parsedPriority = Number(priority);
    const parsedCooldownMinutes = cooldownMinutes.length > 0 ? Number(cooldownMinutes) : 0;

    const condition =
      triggerType === 'location_enter' || triggerType === 'location_exit'
        ? {
            id: conditionId,
            type: triggerType,
            geofenceId: geofenceId.trim(),
            enabled: true,
          }
        : {
            id: conditionId,
            type: triggerType,
            enabled: true,
          };

    setErrorMessage(null);
    setSuccessMessage(null);
    setIsSubmitting(true);

    try {
      await createRule({
        name: ruleName.trim(),
        enabled: true,
        matchMode: 'all',
        conditions: [condition],
        actions: [
          {
            id: actionId,
            type: 'notify',
            title: notifyTitle.trim(),
            body: notifyBody.trim(),
            enabled: true,
          },
        ],
        priority: parsedPriority,
        cooldownSeconds: parsedCooldownMinutes > 0 ? parsedCooldownMinutes * 60 : undefined,
      });

      setSuccessMessage('Rule created successfully.');
      resetForm();
      onCreated?.();
    } catch (error) {
      setErrorMessage(error instanceof Error ? error.message : 'Failed to create rule.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const fieldStyle = {
    borderWidth: 1,
    borderColor: theme.colors.border,
    backgroundColor: theme.colors.surfaceMuted,
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 10,
    color: theme.colors.text,
  } as const;

  return (
    <ScreenContainer scroll>
      <View
        style={{
          width: '100%',
          maxWidth: 560,
          alignSelf: 'center',
        }}
      >
        <AppText variant="title">Create Rule</AppText>
        <AppText tone="muted">Build a basic trigger + notification automation.</AppText>

        <Card>
          <Stack gap={12}>
            <Stack gap={6}>
              <AppText tone="muted" variant="caption">
                Rule Name
              </AppText>
              <TextInput
                onChangeText={(value) => {
                  setRuleName(value);
                  setErrorMessage(null);
                  setSuccessMessage(null);
                }}
                placeholder="My automation rule"
                placeholderTextColor={theme.colors.muted}
                style={fieldStyle}
                value={ruleName}
              />
            </Stack>

            <Stack gap={6}>
              <AppText tone="muted" variant="caption">
                Trigger Type
              </AppText>
              <Row style={{ flexWrap: 'wrap' }}>
                {triggerOptions.map((option) => {
                  const isSelected = triggerType === option.value;

                  return (
                    <Pill
                      key={option.value}
                      label={option.label}
                      onPress={() => {
                        setTriggerType(option.value);
                        setErrorMessage(null);
                        setSuccessMessage(null);
                      }}
                      selected={isSelected}
                    />
                  );
                })}
              </Row>
            </Stack>

            {requiresGeofence ? (
              <Stack gap={6}>
                <AppText tone="muted" variant="caption">
                  Geofence ID
                </AppText>
                <TextInput
                  onChangeText={(value) => {
                    setGeofenceId(value);
                    setErrorMessage(null);
                    setSuccessMessage(null);
                  }}
                  placeholder="home / office / gym"
                  placeholderTextColor={theme.colors.muted}
                  style={fieldStyle}
                  value={geofenceId}
                />
              </Stack>
            ) : null}

            <Stack gap={6}>
              <AppText tone="muted" variant="caption">
                Notification Title
              </AppText>
              <TextInput
                onChangeText={(value) => {
                  setNotifyTitle(value);
                  setErrorMessage(null);
                  setSuccessMessage(null);
                }}
                placeholder="HabitStack Reminder"
                placeholderTextColor={theme.colors.muted}
                style={fieldStyle}
                value={notifyTitle}
              />
            </Stack>

            <Stack gap={6}>
              <AppText tone="muted" variant="caption">
                Notification Body
              </AppText>
              <TextInput
                onChangeText={(value) => {
                  setNotifyBody(value);
                  setErrorMessage(null);
                  setSuccessMessage(null);
                }}
                placeholder="Time to run this action."
                placeholderTextColor={theme.colors.muted}
                style={[fieldStyle, { minHeight: 82, textAlignVertical: 'top' }]}
                multiline
                value={notifyBody}
              />
            </Stack>

            <Row align="flex-start">
              <Stack gap={6} style={{ flex: 1 }}>
                <AppText tone="muted" variant="caption">
                  Priority
                </AppText>
                <TextInput
                  keyboardType="numeric"
                  onChangeText={(value) => {
                    setPriority(value);
                    setErrorMessage(null);
                    setSuccessMessage(null);
                  }}
                  placeholder="0"
                  placeholderTextColor={theme.colors.muted}
                  style={fieldStyle}
                  value={priority}
                />
              </Stack>

              <Stack gap={6} style={{ flex: 1 }}>
                <AppText tone="muted" variant="caption">
                  Cooldown (min)
                </AppText>
                <TextInput
                  keyboardType="numeric"
                  onChangeText={(value) => {
                    setCooldownMinutes(value);
                    setErrorMessage(null);
                    setSuccessMessage(null);
                  }}
                  placeholder="0"
                  placeholderTextColor={theme.colors.muted}
                  style={fieldStyle}
                  value={cooldownMinutes}
                />
              </Stack>
            </Row>

            {errorMessage ? (
              <AppText tone="accent" variant="caption">
                {errorMessage}
              </AppText>
            ) : null}

            {successMessage ? (
              <AppText tone="success" variant="caption">
                {successMessage}
              </AppText>
            ) : null}

            <Button
              disabled={isSubmitDisabled}
              isLoading={isSubmitting}
              label={isSubmitting ? 'Saving Rule...' : 'Save Rule'}
              onPress={() => void submit()}
            />
          </Stack>
        </Card>
      </View>
    </ScreenContainer>
  );
}
