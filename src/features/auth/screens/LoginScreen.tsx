import { useState } from 'react';
import { Pressable, TextInput } from 'react-native';

import { signInWithEmailPassword } from 'features/auth/services';
import { useAppTheme } from 'shared/theme';
import { AppText, Button, Card, Row, Stack } from 'shared/ui';

type LoginScreenProps = {
  onSwitchToRegister: () => void;
};

function isValidEmail(value: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
}

/**
 * Email/password sign-in form.
 */
export function LoginScreen({ onSwitchToRegister }: LoginScreenProps) {
  const { theme } = useAppTheme();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const normalizedEmail = email.trim().toLowerCase();
  const canSubmit = isValidEmail(normalizedEmail) && password.length > 0;
  const isSubmitDisabled = isSubmitting || !canSubmit;

  const submit = async () => {
    if (!canSubmit) {
      setErrorMessage('Enter a valid email and password.');
      return;
    }

    setErrorMessage(null);
    setIsSubmitting(true);

    try {
      await signInWithEmailPassword(normalizedEmail, password);
    } catch (error) {
      setErrorMessage(error instanceof Error ? error.message : 'Failed to sign in.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Card>
      <Stack gap={12}>
        <AppText variant="subtitle">Sign In</AppText>
        <AppText tone="muted">Use your HabitStack account credentials.</AppText>

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
            }}
            placeholder="Enter password"
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

        {errorMessage ? (
          <AppText tone="accent" variant="caption">
            {errorMessage}
          </AppText>
        ) : null}

        <Button
          disabled={isSubmitDisabled}
          isLoading={isSubmitting}
          label={isSubmitting ? 'Signing In...' : 'Sign In'}
          onPress={() => void submit()}
        />

        <Row justify="center">
          <AppText tone="muted" variant="caption">
            New to HabitStack?
          </AppText>
          <Pressable onPress={onSwitchToRegister}>
            <AppText tone="accent" variant="caption">
              Create account
            </AppText>
          </Pressable>
        </Row>
      </Stack>
    </Card>
  );
}
