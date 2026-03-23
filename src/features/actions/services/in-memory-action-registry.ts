import type { ActionHandler, ActionRegistry } from 'features/actions/contracts';
import type { RuleAction } from 'features/rules';

/**
 * In-memory registry that maps action types to runtime handlers.
 */
export class InMemoryActionRegistry implements ActionRegistry {
  private readonly handlersByType = new Map<RuleAction['type'], ActionHandler>();

  register(handler: ActionHandler): void {
    this.handlersByType.set(handler.type, handler);
  }

  unregister(type: RuleAction['type']): void {
    this.handlersByType.delete(type);
  }

  get(type: RuleAction['type']): ActionHandler | undefined {
    return this.handlersByType.get(type);
  }

  list(): ActionHandler[] {
    return Array.from(this.handlersByType.values());
  }
}

/**
 * Factory for an in-memory action registry, optionally preloaded with handlers.
 */
export function createInMemoryActionRegistry(
  initialHandlers: ActionHandler[] = [],
): InMemoryActionRegistry {
  const registry = new InMemoryActionRegistry();
  initialHandlers.forEach((handler) => registry.register(handler));
  return registry;
}
