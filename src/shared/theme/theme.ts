export type AppColorScheme = 'light' | 'dark';

type ThemeColors = {
  background: string;
  surface: string;
  surfaceMuted: string;
  text: string;
  muted: string;
  accent: string;
  accentSoft: string;
  success: string;
  border: string;
};

export type AppTheme = {
  colorScheme: AppColorScheme;
  colors: ThemeColors;
};

export const lightTheme: AppTheme = {
  colorScheme: 'light',
  colors: {
    background: '#F3F8F4',
    surface: '#FFFFFF',
    surfaceMuted: '#E8F2EA',
    text: '#132018',
    muted: '#5A6E61',
    accent: '#2F8F57',
    accentSoft: '#DDF1E2',
    success: '#2B9A5E',
    border: '#CFE2D3',
  },
};

export const darkTheme: AppTheme = {
  colorScheme: 'dark',
  colors: {
    background: '#0D1510',
    surface: '#152119',
    surfaceMuted: '#1B2A21',
    text: '#E6F2E9',
    muted: '#9FB5A6',
    accent: '#63C58A',
    accentSoft: '#244533',
    success: '#5ED08A',
    border: '#2C4336',
  },
};
