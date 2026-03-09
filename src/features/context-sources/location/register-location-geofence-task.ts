import { ensureLocationGeofencingTask } from 'features/context-sources/location/location-geofence.task';
import { DEFAULT_LOCATION_GEOFENCING_TASK_NAME } from 'features/context-sources/location/location-geofence.constants';

/**
 * Registers the default geofencing task at bundle initialization time.
 * This module should be imported from the app entrypoint.
 */
ensureLocationGeofencingTask(DEFAULT_LOCATION_GEOFENCING_TASK_NAME);
