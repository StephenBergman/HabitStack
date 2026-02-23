# HabitStack

HabitStack is a context-triggered habit app built with Expo + React Native.

Instead of time-based reminders, habits are triggered by real-world context like:
- Location changes (arrive/leave places)
- Device events (charger, Bluetooth)
- Motion/activity signals

## Tech Stack

- Expo (React Native + TypeScript)
- Zustand (state)
- Supabase (`@supabase/supabase-js`)
- Expo Location / Notifications / Task Manager
- Expo SQLite (offline-first storage)
- NativeWind (styling)

## Getting Started

### 1) Install dependencies

```bash
npm install
```

### 2) Configure environment variables

Create a `.env` file in the project root:

```env
EXPO_PUBLIC_SUPABASE_URL=https://your-project-ref.supabase.co
EXPO_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
```

You can copy from `.env.example`.

### 3) Run the app

```bash
npm run start
```

For clean config reload:

```bash
npm run start -c
```

## Scripts

- `npm run start` - Start Expo dev server
- `npm run android` - Start Expo for Android
- `npm run ios` - Start Expo for iOS
- `npm run web` - Start Expo for web

## Project Structure

```text
src/
  app/         # app root + providers
  features/    # feature modules (habits, triggers)
  services/    # integrations (location, notifications, supabase)
  shared/      # shared ui, constants, helpers
  store/       # app-wide stores
```

## Current Status

Initial scaffold in progress:
- Root import aliases configured
- Feature-based folder structure set up
- Supabase client bootstrapped
- Native modules + permissions wired for context triggers

## Notes

- `.env` should stay local and not be committed.
- Some capabilities (Bluetooth/background behavior) require a custom dev build, not Expo Go.
