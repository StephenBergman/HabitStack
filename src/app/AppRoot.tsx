import { AppProviders } from 'app/providers/AppProviders';
import { HabitsScreen } from 'features/habits';

export default function AppRoot() {
  return (
    <AppProviders>
      <HabitsScreen />
    </AppProviders>
  );
}
