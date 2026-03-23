# HabitStack Progress Summary

Last updated: March 23, 2026

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

## 9) Current Phase: Minimal Automation Engine Evaluator (Implemented)
- Implemented a concrete, event-driven automation engine in `features/automation-engine/services`.
- Added trigger evaluation for:
  - `location_enter`, `location_exit`
  - `bluetooth_connected`, `bluetooth_disconnected`
  - `power_connected`, `power_disconnected`
- Added guard evaluation for:
  - `time_window`
  - `day_of_week`
  - `cooldown_elapsed`
  - plus snapshot-backed guards (`battery_above`, `battery_below`, `app_in_foreground`, `app_in_background`)
- Added deterministic cooldown memory shape in engine contracts:
  - input: `lastTriggeredAtByRuleId`
  - output: `nextLastTriggeredAtByRuleId`
- Added per-rule diagnostics (`matched`, `reason`) and dispatch queue generation for enabled actions.

Key files:
- `src/features/automation-engine/services/minimal-automation-engine.ts` - I implemented my first concrete evaluator here, including trigger matching, guard checks, cooldown handling, and dispatch queue output.
- `src/features/automation-engine/services/index.ts` - I expose engine service implementations here.
- `src/features/automation-engine/types/automation-engine.types.ts` - I added cooldown memory input/output typing here so evaluation remains deterministic.
- `src/features/automation-engine/index.ts` - I export the concrete engine implementation from the feature public API here.

## 10) Current Phase: Notify Action Handler + Android Channel Setup (Implemented)
- Implemented concrete `notify` action execution via Expo local notifications.
- Added Android notification channel provisioning for automation alerts.
- Added a foreground notification presentation handler so in-app notifications surface while app is active.
- Added in-memory action registry implementation for action-type-to-handler lookup and future runtime wiring.

Key files:
- `src/features/actions/handlers/notify-action.handler.ts` - I implemented a concrete `notify` action handler here that schedules local notifications from rule action payloads.
- `src/features/actions/services/in-memory-action-registry.ts` - I implemented a runtime action registry here for registering and resolving handlers by action type.
- `src/services/notifications/notifications.service.ts` - I replaced the placeholder with real notification handler/channel/scheduling logic here.
- `src/features/actions/index.ts` - I export the new action handler and registry implementations from the feature public API here.

## 11) Current Phase: Engine-to-Action Runtime Pipeline Utility (Implemented)
- Added a reusable automation cycle runner that executes the full flow:
  - `event -> engine.evaluate(...) -> dispatchQueue -> action handler execution`
- Added source-event convenience wrapper so `ContextSourceEvent` payloads can run through the same pipeline in one call.
- Added normalized action execution result output that includes:
  - `ruleId`
  - `actionType`
  - handler execution `status/reason`
- Added a helper to persist only cooldown memory between cycles.

Key files:
- `src/features/automation-engine/services/run-automation-cycle.ts` - I implemented pipeline orchestration here, including handler lookup and guarded execution.
- `src/features/automation-engine/services/index.ts` - I export cycle runner utilities and related types here.
- `src/features/automation-engine/index.ts` - I expose pipeline utilities from the feature public API here.

## 12) Current Phase: Supabase Rule Persistence Layer (Implemented)
- Added a concrete Supabase-backed rules repository in `features/rules/services`.
- Implemented user-scoped CRUD and lifecycle operations:
  - list rules
  - get rule by id
  - create rule
  - update rule
  - soft delete / restore
- Added runtime cooldown persistence helpers backed by `automation_rule_runtime_state`:
  - list runtime state
  - map `ruleId -> lastTriggeredAt` for engine input
  - single/bulk upsert for last-triggered timestamps
- Added schema-validated DB-to-domain mapping (`ruleSchema`) and create/update input validation before writes.

Key files:
- `src/features/rules/services/rules.repository.ts` - I implemented Supabase user-scoped rule persistence and runtime state helpers here.
- `src/features/rules/services/index.ts` - I export rule persistence services and types here.
- `src/features/rules/index.ts` - I expose the new repository API from the rule module public surface here.

## 13) Current Phase: Rules List Screen (Implemented)
- Added a new `RulesListScreen` wired to real Supabase data via `listRules()`.
- Implemented load states:
  - initial loading
  - manual refresh
  - empty state
  - recoverable error state with retry
- Added rule cards showing:
  - enabled/disabled status
  - match mode
  - priority
  - condition/action counts
  - updated timestamp
- Wired app entrypoint to render the new Rules List screen.

Key files:
- `src/features/rules/screens/RulesListScreen.tsx` - I implemented the Supabase-backed rules list UI and state handling here.
- `src/features/rules/screens/index.ts` - I export rules screens here.
- `src/features/rules/index.ts` - I expose `RulesListScreen` from the rules module public API here.
- `src/app/AppRoot.tsx` - I switched app launch screen to `RulesListScreen` here for immediate integration testing.

## 14) Current Phase: Auth Screens + Session Gate (Implemented)
- Added dedicated email/password auth screens using existing UI primitives:
  - Login
  - Register
- Added auth feature service wrappers for Supabase auth operations:
  - get current session
  - subscribe to auth state changes
  - sign in
  - sign up
  - sign out
- Added app-level auth gate:
  - when no session: show auth screens
  - when session exists: show rules list
  - includes auth loading/error states at boot

Key files:
- `src/features/auth/screens/AuthScreen.tsx` - I implemented the auth entry screen and login/register mode toggle here.
- `src/features/auth/screens/LoginScreen.tsx` - I implemented the sign-in form UI/logic here.
- `src/features/auth/screens/RegisterScreen.tsx` - I implemented the registration form UI/logic here.
- `src/features/auth/services/auth.service.ts` - I implemented Supabase auth session/sign-in/sign-up/sign-out wrappers here.
- `src/features/auth/index.ts` - I expose auth screens/services from one feature API surface here.
- `src/app/AppRoot.tsx` - I implemented the runtime auth session gate and conditional screen rendering here.

## 15) Current Phase: Rule Creation Screen + Bottom Navigation (Implemented)
- Added a dedicated `CreateRuleScreen` for creating a basic automation rule backed by Supabase.
- Implemented form inputs and validation for:
  - rule name
  - trigger type (power enter/exit, location enter/exit)
  - geofence id (when location trigger is selected)
  - notify title/body
  - priority
  - cooldown minutes
- Added save flow wired to `createRule()` with:
  - disabled submit until form parameters are valid
  - success/error state feedback
- Added a signed-in bottom navigation shell with two tabs:
  - Rules
  - Create
- Wired successful create flow to return user to Rules tab.

Key files:
- `src/features/rules/screens/CreateRuleScreen.tsx` - I implemented rule creation UI/validation and Supabase create flow here.
- `src/features/rules/screens/index.ts` - I export the new create screen here.
- `src/features/rules/index.ts` - I expose `CreateRuleScreen` from the rules module API here.
- `src/app/AuthenticatedAppShell.tsx` - I implemented bottom tab navigation and signed-in app shell here.
- `src/app/AppRoot.tsx` - I switched authenticated app rendering to the new shell here.

## Current State: Implemented vs Scaffolded

Implemented (working building blocks):
- Theme + UI primitives
- Auth screens + Supabase session gate
- Rules schemas/types/contracts
- Supabase-backed rules repository + runtime cooldown state persistence helpers
- Rules List screen wired to Supabase rule listing
- Rule creation screen wired to `createRule()`
- Signed-in bottom navigation (Rules/Create tabs)
- Permissions snapshot/request orchestration
- Geofence source registration + normalization + service wrappers
- Minimal automation engine evaluator (trigger + guard + cooldown)
- `notify` action handler + Android channel setup
- In-memory action registry
- Reusable runtime cycle utility (`event -> engine -> action handlers`)

Scaffolded (contracts only, runtime logic pending):
- `open_url` and `log_event` action handlers
- Source registry implementation
- App-level runtime wiring for continuous background event processing + action dispatch using persisted rules

## Next Steps
1. Add Rule Edit screen wired to `updateRule()` and integrate from Rules list row actions.
2. Add Rule Delete/Restore actions wired to `softDeleteRule()` / `restoreRule()`.
3. Add authenticated settings/logout affordance in primary app UI.
4. Wire app-level runtime orchestration (subscribe live context sources, load active rules from Supabase, retain cooldown state between app sessions).
5. Implement `open_url` and `log_event` action handlers.
6. Add local cache sync layer (SQLite) on top of Supabase repository.
7. Add debug/telemetry screen for trigger events and action executions.

## Notes / Constraints
- Background capabilities differ by platform, especially for Bluetooth/power automation behavior.
- Geofencing is the most reliable first background trigger to ship.
- Some automations (e.g., auto DND, auto app launch in all contexts) are constrained by OS policies.
