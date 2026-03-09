/**
 * Permissions module public API.
 */
export {
  canDeliverNotifications,
  canRunBackgroundAutomations,
  getRuntimePermissionReadiness,
  getRuntimePermissionSnapshot,
  requestRuntimePermissionReadiness,
  requestRuntimePermissions,
} from 'features/permissions/services';
export type {
  AppPermissionState,
  RuntimePermissionReadiness,
  RuntimePermissionRequestOptions,
  RuntimePermissionSnapshot,
} from 'features/permissions/types';
