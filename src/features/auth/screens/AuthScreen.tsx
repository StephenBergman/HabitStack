import { useState } from 'react';
import { View } from 'react-native';

import { LoginScreen } from 'features/auth/screens/LoginScreen';
import { RegisterScreen } from 'features/auth/screens/RegisterScreen';
import { AppText, ScreenContainer, Stack } from 'shared/ui';

type AuthMode = 'login' | 'register';

/**
 * Entry auth screen that toggles between sign-in and registration flows.
 */
export function AuthScreen() {
  const [mode, setMode] = useState<AuthMode>('login');

  return (
    <ScreenContainer
      scroll
      contentStyle={{
        justifyContent: 'center',
        paddingVertical: 24,
      }}
    >
      <View
        style={{
          width: '100%',
          maxWidth: 460,
          alignSelf: 'center',
        }}
      >
        <Stack gap={12}>
          <AppText style={{ textAlign: 'center' }} variant="title">
            HabitStack
          </AppText>
          <AppText style={{ textAlign: 'center' }} tone="muted">
            Sign in to sync your automation rules and run personalized context triggers.
          </AppText>

          {mode === 'login' ? (
            <LoginScreen onSwitchToRegister={() => setMode('register')} />
          ) : (
            <RegisterScreen onSwitchToLogin={() => setMode('login')} />
          )}
        </Stack>
      </View>
    </ScreenContainer>
  );
}
