import * as Location from 'expo-location';
import * as Notifications from 'expo-notifications';
import * as TaskManager from 'expo-task-manager';
import { Platform } from 'react-native';

import type {
  AppPermissionState,
  RuntimePermissionReadiness,
  RuntimePermissionRequestOptions,
  RuntimePermissionSnapshot,
} from 'features/permissions/types';

const defaultRequestOptions: Required<RuntimePermissionRequestOptions> = {
  requestForegroundLocation: true,
  requestBackgroundLocation: true,
  requestNotifications: true,
};

/**
 * Maps Expo permission status strings to app-level permission states.
 */
function toAppPermissionState(status?: string): AppPermissionState {
  if (status === 'granted') {
    return 'granted';
  }

  if (status === 'denied') {
    return 'denied';
  }

  if (status === 'undetermined') {
    return 'undetermined';
  }

  return 'unavailable';
}

/**
 * Returns current runtime permission snapshot without prompting the user.
 */
export async function getRuntimePermissionSnapshot(): Promise<RuntimePermissionSnapshot> {
  let locationForeground: AppPermissionState = 'unavailable';
  let locationBackground: AppPermissionState = 'unavailable';
  let notifications: AppPermissionState = 'unavailable';

  try {
    const foreground = await Location.getForegroundPermissionsAsync();
    locationForeground = toAppPermissionState(foreground.status);
  } catch {
    locationForeground = 'unavailable';
  }

  try {
    const background = await Location.getBackgroundPermissionsAsync();
    locationBackground = toAppPermissionState(background.status);
  } catch {
    locationBackground = 'unavailable';
  }

  try {
    const notification = await Notifications.getPermissionsAsync();
    notifications = toAppPermissionState(notification.status);
  } catch {
    notifications = 'unavailable';
  }

  let taskManagerAvailable = false;

  try {
    taskManagerAvailable = await TaskManager.isAvailableAsync();
  } catch {
    taskManagerAvailable = false;
  }

  let locationServicesEnabled = Platform.OS === 'web';

  try {
    locationServicesEnabled = await Location.hasServicesEnabledAsync();
  } catch {
    locationServicesEnabled = false;
  }

  return {
    locationForeground,
    locationBackground,
    notifications,
    taskManagerAvailable,
    locationServicesEnabled,
    checkedAtIso: new Date().toISOString(),
  };
}

/**
 * Requests runtime permissions according to the provided options.
 */
export async function requestRuntimePermissions(
  options: RuntimePermissionRequestOptions = {},
): Promise<RuntimePermissionSnapshot> {
  const resolved: Required<RuntimePermissionRequestOptions> = {
    ...defaultRequestOptions,
    ...options,
  };

  if (resolved.requestForegroundLocation) {
    try {
      await Location.requestForegroundPermissionsAsync();
    } catch {
      // Intentionally ignored; final state is captured from the snapshot.
    }
  }

  if (resolved.requestBackgroundLocation) {
    try {
      const foreground = await Location.getForegroundPermissionsAsync();

      if (foreground.status === 'granted') {
        await Location.requestBackgroundPermissionsAsync();
      }
    } catch {
      // Intentionally ignored; final state is captured from the snapshot.
    }
  }

  if (resolved.requestNotifications) {
    try {
      await Notifications.requestPermissionsAsync();
    } catch {
      // Intentionally ignored; final state is captured from the snapshot.
    }
  }

  return getRuntimePermissionSnapshot();
}

/**
 * Returns true when background automation prerequisites are satisfied.
 */
export function canRunBackgroundAutomations(snapshot: RuntimePermissionSnapshot): boolean {
  return (
    snapshot.locationForeground === 'granted' &&
    snapshot.locationBackground === 'granted' &&
    snapshot.taskManagerAvailable &&
    snapshot.locationServicesEnabled
  );
}

/**
 * Returns true when notification delivery permissions are satisfied.
 */
export function canDeliverNotifications(snapshot: RuntimePermissionSnapshot): boolean {
  return snapshot.notifications === 'granted';
}

function toReadiness(snapshot: RuntimePermissionSnapshot): RuntimePermissionReadiness {
  return {
    snapshot,
    automationsReady: canRunBackgroundAutomations(snapshot),
    notificationsReady: canDeliverNotifications(snapshot),
  };
}

/**
 * Returns current permission readiness without prompting for permissions.
 */
export async function getRuntimePermissionReadiness(): Promise<RuntimePermissionReadiness> {
  return toReadiness(await getRuntimePermissionSnapshot());
}

/**
 * Requests configured permissions and then returns aggregated readiness.
 */
export async function requestRuntimePermissionReadiness(
  options: RuntimePermissionRequestOptions = {},
): Promise<RuntimePermissionReadiness> {
  return toReadiness(await requestRuntimePermissions(options));
}
