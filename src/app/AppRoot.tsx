import { useEffect, useState } from 'react';
import { ActivityIndicator } from 'react-native';
import type { Session } from '@supabase/supabase-js';

import { AuthenticatedAppShell } from 'app/AuthenticatedAppShell';
import { AppProviders } from 'app/providers';
import { AuthScreen, getCurrentSession, subscribeToAuthSession } from 'features/auth';
import { useAppTheme } from 'shared/theme';
import { AppText, Card, Row, ScreenContainer } from 'shared/ui';

function AppRootContent() {
  const { theme } = useAppTheme();
  const [session, setSession] = useState<Session | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [loadError, setLoadError] = useState<string | null>(null);

  useEffect(() => {
    let isMounted = true;

    const initializeSession = async () => {
      try {
        const currentSession = await getCurrentSession();

        if (!isMounted) {
          return;
        }

        setSession(currentSession);
        setLoadError(null);
      } catch (error) {
        if (!isMounted) {
          return;
        }

        setLoadError(error instanceof Error ? error.message : 'Failed to initialize auth session.');
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    };

    void initializeSession();

    const unsubscribe = subscribeToAuthSession((nextSession) => {
      setSession(nextSession);
      setLoadError(null);
      setIsLoading(false);
    });

    return () => {
      isMounted = false;
      unsubscribe();
    };
  }, []);

  if (isLoading) {
    return (
      <ScreenContainer>
        <Card>
          <Row justify="center">
            <ActivityIndicator color={theme.colors.accent} size="small" />
            <AppText tone="muted">Loading session...</AppText>
          </Row>
        </Card>
      </ScreenContainer>
    );
  }

  if (loadError) {
    return (
      <ScreenContainer>
        <Card>
          <AppText variant="subtitle">Authentication Error</AppText>
          <AppText tone="accent">{loadError}</AppText>
        </Card>
      </ScreenContainer>
    );
  }

  if (!session) {
    return <AuthScreen />;
  }

  return <AuthenticatedAppShell />;
}

export default function AppRoot() {
  return (
    <AppProviders>
      <AppRootContent />
    </AppProviders>
  );
}
