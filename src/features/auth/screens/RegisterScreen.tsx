import { useState } from 'react';
import { Pressable, TextInput } from 'react-native';

import { registerWithEmailPassword } from 'features/auth/services';
import { useAppTheme } from 'shared/theme';
import { AppText, Button, Card, Row, Stack } from 'shared/ui';

type RegisterScreenProps = {
  onSwitchToLogin: () => void;
};

function isValidEmail(value: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
}

/**
 * Email/password registration form.
 */
export function RegisterScreen({ onSwitchToLogin }: RegisterScreenProps) {
  const { theme } = useAppTheme();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [infoMessage, setInfoMessage] = useState<string | null>(null);
  const normalizedEmail = email.trim().toLowerCase();
  const canSubmit =
    isValidEmail(normalizedEmail) && password.length >= 6 && confirmPassword === password;
  const isSubmitDisabled = isSubmitting || !canSubmit;

  const submit = async () => {
    if (!canSubmit) {
      setErrorMessage('Enter a valid email, 6+ character password, and matching confirmation.');
      return;
    }

    setErrorMessage(null);
    setInfoMessage(null);
    setIsSubmitting(true);

    try {
      const session = await registerWithEmailPassword(normalizedEmail, password);

      if (!session) {
        setInfoMessage('Account created. Check your email to confirm before signing in.');
      }
    } catch (error) {
      setErrorMessage(error instanceof Error ? error.message : 'Failed to register.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Card>
      <Stack gap={12}>
        <AppText variant="subtitle">Create Account</AppText>
        <AppText tone="muted">Register a new HabitStack account.</AppText>

        <Stack gap={6}>
          <AppText variant="caption" tone="muted">
            Email
          </AppText>
          <TextInput
            autoCapitalize="none"
            autoCorrect={false}
            keyboardType="email-address"
            onChangeText={(value) => {
              setEmail(value);
              setErrorMessage(null);
              setInfoMessage(null);
            }}
            placeholder="you@example.com"
            placeholderTextColor={theme.colors.muted}
            style={{
              borderWidth: 1,
              borderColor: theme.colors.border,
              backgroundColor: theme.colors.surfaceMuted,
              borderRadius: 10,
              paddingHorizontal: 12,
              paddingVertical: 10,
              color: theme.colors.text,
            }}
            value={email}
          />
        </Stack>

        <Stack gap={6}>
          <AppText variant="caption" tone="muted">
            Password
          </AppText>
          <TextInput
            autoCapitalize="none"
            autoCorrect={false}
            onChangeText={(value) => {
              setPassword(value);
              setErrorMessage(null);
              setInfoMessage(null);
            }}
            placeholder="At least 6 characters"
            placeholderTextColor={theme.colors.muted}
            secureTextEntry
            style={{
              borderWidth: 1,
              borderColor: theme.colors.border,
              backgroundColor: theme.colors.surfaceMuted,
              borderRadius: 10,
              paddingHorizontal: 12,
              paddingVertical: 10,
              color: theme.colors.text,
            }}
            value={password}
          />
        </Stack>

        <Stack gap={6}>
          <AppText variant="caption" tone="muted">
            Confirm Password
          </AppText>
          <TextInput
            autoCapitalize="none"
            autoCorrect={false}
            onChangeText={(value) => {
              setConfirmPassword(value);
              setErrorMessage(null);
              setInfoMessage(null);
            }}
            placeholder="Re-enter password"
            placeholderTextColor={theme.colors.muted}
            secureTextEntry
            style={{
              borderWidth: 1,
              borderColor: theme.colors.border,
              backgroundColor: theme.colors.surfaceMuted,
              borderRadius: 10,
              paddingHorizontal: 12,
              paddingVertical: 10,
              color: theme.colors.text,
            }}
            value={confirmPassword}
          />
        </Stack>

        {errorMessage ? (
          <AppText tone="accent" variant="caption">
            {errorMessage}
          </AppText>
        ) : null}

        {infoMessage ? (
          <AppText tone="success" variant="caption">
            {infoMessage}
          </AppText>
        ) : null}

        <Button
          disabled={isSubmitDisabled}
          isLoading={isSubmitting}
          label={isSubmitting ? 'Creating Account...' : 'Create Account'}
          onPress={() => void submit()}
        />

        <Row justify="center">
          <AppText tone="muted" variant="caption">
            Already have an account?
          </AppText>
          <Pressable onPress={onSwitchToLogin}>
            <AppText tone="accent" variant="caption">
              Sign in
            </AppText>
          </Pressable>
        </Row>
      </Stack>
    </Card>
  );
}
