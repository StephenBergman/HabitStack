import {
  type ContextSourceEvent,
  createLocationGeofenceSource,
  type LocationGeofenceRegion,
  type LocationGeofenceSource,
} from 'features/context-sources';

let locationSource: LocationGeofenceSource | null = null;

/**
 * Starts geofencing triggers for the provided regions and returns the source instance.
 */
export async function startLocationTriggers(
  regions: LocationGeofenceRegion[] = [],
): Promise<LocationGeofenceSource> {
  if (!locationSource) {
    locationSource = createLocationGeofenceSource({ regions });
  } else {
    await locationSource.setRegions(regions);
  }

  await locationSource.start();
  return locationSource;
}

/**
 * Stops geofencing triggers if a source has been initialized.
 */
export async function stopLocationTriggers(): Promise<void> {
  if (!locationSource) {
    return;
  }

  await locationSource.stop();
}

/**
 * Subscribes to normalized location trigger events.
 */
export function onLocationTrigger(listener: (payload: ContextSourceEvent) => void): () => void {
  if (!locationSource) {
    locationSource = createLocationGeofenceSource();
  }

  return locationSource.subscribe(listener);
}
