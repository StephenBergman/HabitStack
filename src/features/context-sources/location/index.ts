/**
 * Location context source public API.
 */
export {
  DEFAULT_LOCATION_GEOFENCE_SOURCE_ID,
  DEFAULT_LOCATION_GEOFENCING_TASK_NAME,
} from 'features/context-sources/location/location-geofence.constants';
export {
  createLocationGeofenceSource,
  LocationGeofenceSource,
} from 'features/context-sources/location/location-geofence.source';
export type {
  LocationGeofenceRegion,
  LocationGeofenceSourceOptions,
} from 'features/context-sources/location/location-geofence.types';
