# HabitStack Progress Summary

Last updated: March 9, 2026

## Project Goal
Build a context-based automation app (if-this-then-that style) for mobile, focused on real-world triggers such as location, Bluetooth, charging state, and other device context.

## What Has Been Implemented

## 1) Theme + UI Foundations
- Added a full light/dark theme system with subtle green palettes.
- Added `ThemeProvider` and `useAppTheme`.
- Wired status bar styling to current theme.
- Replaced hardcoded colors with theme-driven colors.
- Added reusable UI primitives to avoid repeating inline styles:
  - `AppText`
  - `Card`
  - `Row`
  - `Stack`
  - `ScreenContainer`

Key files:
- `src/shared/theme/*` - I put my core light/dark design tokens and theme context here so every screen can use one consistent color system.
- `src/shared/ui/primitives/*` - I created these reusable building blocks (`AppText`, `Card`, `Row`, `Stack`, `ScreenContainer`) so I do not hardcode layout/styling on every screen.
- `src/shared/ui/index.ts` - I use this barrel to expose the shared UI surface from one import path.
- `src/app/providers/AppProviders.tsx` - I use this as my top-level provider composition point (safe area, theme, and app-wide provider wiring).

## 2) Barrel Exports + Structure Cleanup
- Added and normalized barrel exports across app/features/services/shared modules.
- Updated imports to use barrel entry points consistently.

Examples:
- `src/features/index.ts` - I export my feature modules from here so feature imports stay stable as folders grow.
- `src/features/habits/*/index.ts` - I added these barrels so habits internals are hidden behind clear public entrypoints.
- `src/features/triggers/*/index.ts` - I use these barrels to keep trigger imports clean and avoid deep relative paths.
- `src/services/index.ts` - I use this as the integration-layer entrypoint for location, notifications, and Supabase services.
- `src/shared/index.ts` - I use this barrel to expose shared utilities/theme/ui consistently across the app.

## 3) Quality Baseline (Pass/Fail Gate)
- ESLint was configured for Expo.
- Added scripts:
  - `npm run lint`
  - `npm run typecheck`
  - `npm run check` (lint + typecheck)

Key file:
- `package.json` - I defined my quality gates here (`lint`, `typecheck`, `check`) so each commit has an objective pass/fail check.

## 4) Phase 1: Rule Domain Contracts (Implemented)
- Added a dedicated `features/rules` module with:
  - constants
  - Zod schemas
  - inferred TypeScript types
  - public barrel exports
- Condition model includes both trigger and guard conditions.
- Action model includes notification, URL-open, and log-event actions.
- Added context event and snapshot schemas for engine input.

Supported condition types:
- Triggers: `location_enter`, `location_exit`, `bluetooth_connected`, `bluetooth_disconnected`, `power_connected`, `power_disconnected`
- Guards: `time_window`, `day_of_week`, `cooldown_elapsed`, `battery_above`, `battery_below`, `app_in_foreground`, `app_in_background`

Key files:
- `src/features/rules/constants/rule.constants.ts` - I defined the allowed condition/action/event enums here so rule-building stays explicit and centralized.
- `src/features/rules/schemas/rule.schemas.ts` - I built my Zod validation contracts here so rule data is validated at runtime before execution.
- `src/features/rules/types/rule.types.ts` - I infer TypeScript models here from Zod so my runtime schemas and TS types never drift apart.
- `src/features/rules/index.ts` - I expose the rules module public API here so consumers only import from one stable surface.

## 5) JSDoc Documentation Pass
- Added JSDoc comments to exported logic/contracts/types in the new architecture areas (rules, stores, trigger evaluator, barrels).

## 6) Phase 2: Module Scaffolding (Implemented)
Added structure-only modules (contracts/types/barrels; no engine execution logic yet):

- `features/automation-engine`
  - engine input/output types
  - engine contract
- `features/context-sources`
  - source capabilities/types
  - source contract + registry contract
- `features/actions`
  - action execution types
  - action handler + registry contracts

These modules are exported via:
- `src/features/index.ts` - I use this as the single barrel that re-exports actions, automation-engine, context-sources, rules, habits, triggers, and permissions.

## 7) Permissions + Runtime Readiness Orchestrator (Implemented)
- Added `features/permissions` service to centralize:
  - permission snapshot reads
  - permission requests
  - readiness checks for background automations and notifications
- Added app-level `RuntimePermissionsProvider` with:
  - `readiness`
  - `refresh()`
  - `requestPermissions()`

Key files:
- `src/features/permissions/services/permissions.service.ts` - I centralized Expo permission reads/requests and readiness checks here so runtime setup is consistent.
- `src/features/permissions/types/permission.types.ts` - I defined normalized permission/readiness types here so permission state handling is predictable.
- `src/features/permissions/index.ts` - I expose the permissions module public API here for simple feature-level imports.
- `src/app/providers/RuntimePermissionsProvider.tsx` - I use this provider to load permission readiness on app boot and expose refresh/request actions to UI.

## 8) Current Phase: Location Geofence Context Source (Implemented)
- Implemented a concrete geofence source in `features/context-sources/location`.
- Added TaskManager geofence task definition and event normalization.
- Added source subscription model for location enter/exit events.
- Added service-level wrappers for app usage:
  - `startLocationTriggers`
  - `stopLocationTriggers`
  - `onLocationTrigger`
- Registered default geofence task at app entrypoint.

Key files:
- `src/features/context-sources/location/location-geofence.source.ts` - I implemented my concrete geofence source class here, including start/stop/status/subscription behavior.
- `src/features/context-sources/location/location-geofence.task.ts` - I defined TaskManager geofence task handling here and normalize native events into app `ContextEvent` payloads.
- `src/features/context-sources/location/register-location-geofence-task.ts` - I use this module to register the default geofence task at bundle initialization time.
- `src/services/location/location.service.ts` - I keep app-facing location wrappers here (`startLocationTriggers`, `stopLocationTriggers`, `onLocationTrigger`) so higher layers stay simple.
- `App.tsx` - I import geofence task registration here at entrypoint so background task callbacks can resolve correctly.

## Current State: Implemented vs Scaffolded

Implemented (working building blocks):
- Theme + UI primitives
- Rules schemas/types/contracts
- Permissions snapshot/request orchestration
- Geofence source registration + normalization + service wrappers

Scaffolded (contracts only, runtime logic pending):
- Automation engine evaluation implementation
- Action execution implementations (notifications/open_url/log_event handlers)
- Source registry implementation

## Next Steps
1. Implement minimal automation engine evaluator (trigger + day/time/cooldown guards).
2. Implement notification action handler (`notify`) and Android channel setup.
3. Wire runtime pipeline: `context source event -> engine -> action handlers`.
4. Add rule persistence/sync layer wiring (Supabase + local cache integration).
5. Add debug/telemetry screen for trigger events and action executions.

## Notes / Constraints
- Background capabilities differ by platform, especially for Bluetooth/power automation behavior.
- Geofencing is the most reliable first background trigger to ship.
- Some automations (e.g., auto DND, auto app launch in all contexts) are constrained by OS policies.
