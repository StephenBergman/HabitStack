import type {
  ContextSourceCapabilities,
  ContextSourceKind,
  ContextSourceStatus,
  ContextSourceSubscriber,
} from 'features/context-sources/types';

/**
 * Contract implemented by runtime context providers.
 */
export interface ContextSource {
  id: string;
  kind: ContextSourceKind;
  capabilities: ContextSourceCapabilities;
  start(): Promise<void>;
  stop(): Promise<void>;
  getStatus(): ContextSourceStatus;
  subscribe(listener: ContextSourceSubscriber): () => void;
}
