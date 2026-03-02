import type { ContextSource } from 'features/context-sources/contracts/context-source.contract';
import type { ContextSourceKind } from 'features/context-sources/types';

/**
 * Registry contract for source discovery and lifecycle coordination.
 */
export interface ContextSourceRegistry {
  register(source: ContextSource): void;
  unregister(sourceId: string): void;
  get(sourceId: string): ContextSource | undefined;
  list(): ContextSource[];
  listByKind(kind: ContextSourceKind): ContextSource[];
}
