/**
 * Normalized app permission state used across Expo APIs.
 */
export type AppPermissionState = 'granted' | 'denied' | 'undetermined' | 'unavailable';

/**
 * Snapshot of runtime permissions and related platform readiness.
 */
export type RuntimePermissionSnapshot = {
  locationForeground: AppPermissionState;
  locationBackground: AppPermissionState;
  notifications: AppPermissionState;
  taskManagerAvailable: boolean;
  locationServicesEnabled: boolean;
  checkedAtIso: string;
};

/**
 * Options controlling which permission prompts are requested.
 */
export type RuntimePermissionRequestOptions = {
  requestForegroundLocation?: boolean;
  requestBackgroundLocation?: boolean;
  requestNotifications?: boolean;
};

/**
 * Aggregated readiness flags for automation runtime.
 */
export type RuntimePermissionReadiness = {
  snapshot: RuntimePermissionSnapshot;
  automationsReady: boolean;
  notificationsReady: boolean;
};
