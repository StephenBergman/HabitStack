/**
 * App-level geofence shape used to configure location context monitoring.
 */
export type LocationGeofenceRegion = {
  geofenceId: string;
  latitude: number;
  longitude: number;
  radius: number;
  placeLabel?: string;
  notifyOnEnter?: boolean;
  notifyOnExit?: boolean;
};

/**
 * Configuration options for the location geofence source.
 */
export type LocationGeofenceSourceOptions = {
  id?: string;
  taskName?: string;
  regions?: LocationGeofenceRegion[];
};
