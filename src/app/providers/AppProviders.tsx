import type { ReactNode } from 'react';
import { StatusBar } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';

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
      <ThemeProvider>
        <ThemedStatusBar />
        {children}
      </ThemeProvider>
    </SafeAreaProvider>
  );
}
