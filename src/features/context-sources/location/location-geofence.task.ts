import * as Location from 'expo-location';
import * as TaskManager from 'expo-task-manager';

import type { ContextEvent } from 'features/rules';
import type { ContextSourceEvent, ContextSourceSubscriber } from 'features/context-sources/types';
import type { LocationGeofenceRegion } from 'features/context-sources/location/location-geofence.types';

type GeofencingTaskData = {
  eventType: Location.GeofencingEventType;
  region: Location.LocationRegion;
};

type GeofenceTaskRuntimeState = {
  sourceId: string;
  subscribers: Set<ContextSourceSubscriber>;
  labelsByGeofenceId: Map<string, string | undefined>;
};

const runtimeByTaskName = new Map<string, GeofenceTaskRuntimeState>();

function getOrCreateRuntime(taskName: string, sourceId: string): GeofenceTaskRuntimeState {
  const existing = runtimeByTaskName.get(taskName);

  if (existing) {
    existing.sourceId = sourceId;
    return existing;
  }

  const runtime: GeofenceTaskRuntimeState = {
    sourceId,
    subscribers: new Set<ContextSourceSubscriber>(),
    labelsByGeofenceId: new Map<string, string | undefined>(),
  };

  runtimeByTaskName.set(taskName, runtime);
  return runtime;
}

function mapGeofenceEventType(
  eventType: Location.GeofencingEventType,
): 'location_enter' | 'location_exit' | null {
  if (eventType === Location.GeofencingEventType.Enter) {
    return 'location_enter';
  }

  if (eventType === Location.GeofencingEventType.Exit) {
    return 'location_exit';
  }

  return null;
}

/**
 * Ensures the geofencing task handler is defined for a task name.
 */
export function ensureLocationGeofencingTask(taskName: string): void {
  if (TaskManager.isTaskDefined(taskName)) {
    return;
  }

  TaskManager.defineTask<GeofencingTaskData>(taskName, async ({ data, error }) => {
    if (error || !data) {
      return;
    }

    const mappedType = mapGeofenceEventType(data.eventType);

    if (!mappedType) {
      return;
    }

    const runtime = runtimeByTaskName.get(taskName);

    if (!runtime) {
      return;
    }

    const geofenceId =
      data.region.identifier ??
      `${data.region.latitude}:${data.region.longitude}:${data.region.radius}`;
    const occurredAt = new Date().toISOString();

    const event: ContextEvent = {
      type: mappedType,
      geofenceId,
      placeLabel: runtime.labelsByGeofenceId.get(geofenceId),
      occurredAt,
    };

    const payload: ContextSourceEvent = {
      sourceId: runtime.sourceId,
      sourceKind: 'location',
      event,
      receivedAt: occurredAt,
    };

    runtime.subscribers.forEach((subscriber) => subscriber(payload));
  });
}

/**
 * Synchronizes geofence labels used when emitting location events from task callbacks.
 */
export function syncLocationGeofenceMetadata(
  taskName: string,
  sourceId: string,
  regions: LocationGeofenceRegion[],
): void {
  const runtime = getOrCreateRuntime(taskName, sourceId);

  runtime.labelsByGeofenceId.clear();
  regions.forEach((region) => {
    runtime.labelsByGeofenceId.set(region.geofenceId, region.placeLabel);
  });
}

/**
 * Subscribes to normalized geofence events emitted by a task.
 */
export function subscribeToLocationGeofenceEvents(
  taskName: string,
  sourceId: string,
  listener: ContextSourceSubscriber,
): () => void {
  const runtime = getOrCreateRuntime(taskName, sourceId);
  runtime.subscribers.add(listener);

  return () => {
    runtime.subscribers.delete(listener);
  };
}

/**
 * Clears runtime metadata for a geofencing task.
 */
export function clearLocationGeofenceRuntime(taskName: string): void {
  runtimeByTaskName.delete(taskName);
}
