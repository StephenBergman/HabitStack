import type { ReactNode } from 'react';
import { StatusBar } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';

import { RuntimePermissionsProvider } from 'app/providers/RuntimePermissionsProvider';
import { ThemeProvider, useAppTheme } from 'shared/theme';

type AppProvidersProps = {
  children: ReactNode;
};

function ThemedStatusBar() {
  const { isDark, theme } = useAppTheme();

  return (
    <StatusBar
      barStyle={isDark ? 'light-content' : 'dark-content'}
      backgroundColor={theme.colors.background}
    />
  );
}

export function AppProviders({ children }: AppProvidersProps) {
  return (
    <SafeAreaProvider>
      <RuntimePermissionsProvider>
        <ThemeProvider>
          <ThemedStatusBar />
          {children}
        </ThemeProvider>
      </RuntimePermissionsProvider>
    </SafeAreaProvider>
  );
}
