import type { ContextEvent } from 'features/rules';

/**
 * Supported context source kinds.
 */
export type ContextSourceKind =
  | 'location'
  | 'bluetooth'
  | 'power'
  | 'battery'
  | 'app_state'
  | 'time';

/**
 * Current lifecycle status of a context source.
 */
export type ContextSourceStatus = 'idle' | 'starting' | 'running' | 'stopped' | 'error';

/**
 * Capability metadata exposed by each context source.
 */
export type ContextSourceCapabilities = {
  supportsBackground: boolean;
  requiresPermissions: string[];
  emits: ContextEvent['type'][];
};

/**
 * Envelope emitted by context sources when producing events.
 */
export type ContextSourceEvent = {
  sourceId: string;
  sourceKind: ContextSourceKind;
  event: ContextEvent;
  receivedAt: string;
};

/**
 * Subscriber callback for source events.
 */
export type ContextSourceSubscriber = (payload: ContextSourceEvent) => void;
