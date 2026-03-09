import * as Location from 'expo-location';

import {
  DEFAULT_LOCATION_GEOFENCE_SOURCE_ID,
  DEFAULT_LOCATION_GEOFENCING_TASK_NAME,
} from 'features/context-sources/location/location-geofence.constants';
import {
  clearLocationGeofenceRuntime,
  ensureLocationGeofencingTask,
  subscribeToLocationGeofenceEvents,
  syncLocationGeofenceMetadata,
} from 'features/context-sources/location/location-geofence.task';
import type {
  LocationGeofenceRegion,
  LocationGeofenceSourceOptions,
} from 'features/context-sources/location/location-geofence.types';
import type { ContextSource } from 'features/context-sources/contracts';
import type {
  ContextSourceCapabilities,
  ContextSourceStatus,
  ContextSourceSubscriber,
} from 'features/context-sources/types';
import { canRunBackgroundAutomations, getRuntimePermissionReadiness } from 'features/permissions';

const capabilities: ContextSourceCapabilities = {
  supportsBackground: true,
  requiresPermissions: ['location_foreground', 'location_background'],
  emits: ['location_enter', 'location_exit'],
};

function toExpoRegions(regions: LocationGeofenceRegion[]): Location.LocationRegion[] {
  return regions.map((region) => ({
    identifier: region.geofenceId,
    latitude: region.latitude,
    longitude: region.longitude,
    radius: region.radius,
    notifyOnEnter: region.notifyOnEnter ?? true,
    notifyOnExit: region.notifyOnExit ?? true,
  }));
}

/**
 * Context source implementation for geofencing enter/exit events.
 */
export class LocationGeofenceSource implements ContextSource {
  readonly id: string;
  readonly kind = 'location' as const;
  readonly capabilities = capabilities;

  private readonly taskName: string;
  private regions: LocationGeofenceRegion[];
  private status: ContextSourceStatus = 'idle';

  constructor(options: LocationGeofenceSourceOptions = {}) {
    this.id = options.id ?? DEFAULT_LOCATION_GEOFENCE_SOURCE_ID;
    this.taskName = options.taskName ?? DEFAULT_LOCATION_GEOFENCING_TASK_NAME;
    this.regions = options.regions ?? [];
  }

  /**
   * Starts geofencing for configured regions.
   */
  async start(): Promise<void> {
    if (this.status === 'running') {
      return;
    }

    this.status = 'starting';

    if (this.regions.length === 0) {
      this.status = 'idle';
      return;
    }

    const readiness = await getRuntimePermissionReadiness();

    if (!canRunBackgroundAutomations(readiness.snapshot)) {
      this.status = 'error';
      throw new Error('Location background automation prerequisites are not satisfied.');
    }

    ensureLocationGeofencingTask(this.taskName);
    syncLocationGeofenceMetadata(this.taskName, this.id, this.regions);

    await Location.startGeofencingAsync(this.taskName, toExpoRegions(this.regions));
    this.status = 'running';
  }

  /**
   * Stops geofencing for this source.
   */
  async stop(): Promise<void> {
    const isStarted = await Location.hasStartedGeofencingAsync(this.taskName);

    if (isStarted) {
      await Location.stopGeofencingAsync(this.taskName);
    }

    clearLocationGeofenceRuntime(this.taskName);
    this.status = 'stopped';
  }

  /**
   * Replaces geofence regions and refreshes registration when already running.
   */
  async setRegions(regions: LocationGeofenceRegion[]): Promise<void> {
    this.regions = regions;
    syncLocationGeofenceMetadata(this.taskName, this.id, this.regions);

    if (this.status !== 'running') {
      return;
    }

    if (this.regions.length === 0) {
      await this.stop();
      return;
    }

    await Location.startGeofencingAsync(this.taskName, toExpoRegions(this.regions));
  }

  /**
   * Returns the current lifecycle status of the source.
   */
  getStatus(): ContextSourceStatus {
    return this.status;
  }

  /**
   * Subscribes to normalized geofence enter/exit events.
   */
  subscribe(listener: ContextSourceSubscriber): () => void {
    return subscribeToLocationGeofenceEvents(this.taskName, this.id, listener);
  }
}

/**
 * Factory for creating a geofence context source instance.
 */
export function createLocationGeofenceSource(
  options: LocationGeofenceSourceOptions = {},
): LocationGeofenceSource {
  return new LocationGeofenceSource(options);
}
