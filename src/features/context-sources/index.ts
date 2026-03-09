/**
 * Context sources module public API.
 */
export {
  createLocationGeofenceSource,
  DEFAULT_LOCATION_GEOFENCE_SOURCE_ID,
  DEFAULT_LOCATION_GEOFENCING_TASK_NAME,
  LocationGeofenceSource,
} from 'features/context-sources/location';
export type { ContextSource, ContextSourceRegistry } from 'features/context-sources/contracts';
export type {
  ContextSourceCapabilities,
  ContextSourceEvent,
  ContextSourceKind,
  ContextSourceStatus,
  ContextSourceSubscriber,
} from 'features/context-sources/types';
export type { LocationGeofenceRegion, LocationGeofenceSourceOptions } from 'features/context-sources/location';
