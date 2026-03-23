import type { ActionHandler } from 'features/actions/contracts';
import type { ActionExecutionInput, ActionExecutionResult } from 'features/actions/types';
import { scheduleTriggerNotification } from 'services/notifications';

/**
 * Executes `notify` rule actions via local notifications.
 */
export class NotifyActionHandler implements ActionHandler {
  readonly type = 'notify' as const;

  async execute(input: ActionExecutionInput): Promise<ActionExecutionResult> {
    if (input.action.type !== this.type) {
      return {
        actionId: input.action.id,
        status: 'skipped',
        reason: 'unsupported_action_type_for_handler',
      };
    }

    if (!input.action.enabled) {
      return {
        actionId: input.action.id,
        status: 'skipped',
        reason: 'action_disabled',
      };
    }

    const notificationId = await scheduleTriggerNotification({
      title: input.action.title,
      body: input.action.body,
      channelId: input.action.channelId,
      data: {
        ruleId: input.ruleId,
        actionId: input.action.id,
        eventType: input.event.type,
        occurredAt: input.event.occurredAt,
      },
    });

    if (!notificationId) {
      return {
        actionId: input.action.id,
        status: 'failed',
        reason: 'notification_schedule_failed',
      };
    }

    return {
      actionId: input.action.id,
      status: 'executed',
    };
  }
}

/**
 * Factory for a local notification action handler.
 */
export function createNotifyActionHandler(): NotifyActionHandler {
  return new NotifyActionHandler();
}
