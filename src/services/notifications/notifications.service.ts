import * as Notifications from 'expo-notifications';
import { Platform } from 'react-native';

export const DEFAULT_NOTIFICATION_CHANNEL_ID = 'habitstack-automation-default';

export type TriggerNotificationInput = {
  title: string;
  body: string;
  channelId?: string;
  data?: Record<string, unknown>;
};

let isForegroundNotificationHandlerConfigured = false;

/**
 * Ensures foreground notifications are surfaced while app is active.
 */
export function ensureForegroundNotificationHandler(): void {
  if (isForegroundNotificationHandlerConfigured) {
    return;
  }

  Notifications.setNotificationHandler({
    handleNotification: async () => ({
      shouldShowBanner: true,
      shouldShowList: true,
      shouldPlaySound: true,
      shouldSetBadge: false,
    }),
  });

  isForegroundNotificationHandlerConfigured = true;
}

/**
 * Ensures an Android notification channel exists before scheduling notifications.
 */
export async function ensureNotificationChannel(
  channelId: string = DEFAULT_NOTIFICATION_CHANNEL_ID,
): Promise<string> {
  if (Platform.OS !== 'android') {
    return channelId;
  }

  await Notifications.setNotificationChannelAsync(channelId, {
    name: 'HabitStack Automation',
    importance: Notifications.AndroidImportance.HIGH,
    vibrationPattern: [0, 180, 120, 180],
    enableVibrate: true,
    enableLights: true,
    showBadge: true,
    description: 'Automation alerts triggered by HabitStack rules.',
  });

  return channelId;
}

/**
 * Schedules an immediate local notification for an automation event.
 */
export async function scheduleTriggerNotification(
  input: TriggerNotificationInput,
): Promise<string | null> {
  ensureForegroundNotificationHandler();

  const channelId = await ensureNotificationChannel(input.channelId);

  try {
    const trigger = Platform.OS === 'android' ? { channelId } : null;

    return await Notifications.scheduleNotificationAsync({
      content: {
        title: input.title,
        body: input.body,
        data: input.data,
        sound: Platform.OS === 'android' ? 'default' : undefined,
      },
      trigger,
    });
  } catch {
    return null;
  }
}
