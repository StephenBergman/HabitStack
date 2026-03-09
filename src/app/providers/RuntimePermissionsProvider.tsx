import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from 'react';

import {
  getRuntimePermissionReadiness,
  requestRuntimePermissionReadiness,
  type RuntimePermissionReadiness,
  type RuntimePermissionRequestOptions,
} from 'features/permissions';

type RuntimePermissionsContextValue = {
  readiness: RuntimePermissionReadiness | null;
  isLoading: boolean;
  refresh: () => Promise<RuntimePermissionReadiness>;
  requestPermissions: (
    options?: RuntimePermissionRequestOptions,
  ) => Promise<RuntimePermissionReadiness>;
};

const RuntimePermissionsContext = createContext<RuntimePermissionsContextValue | undefined>(undefined);

type RuntimePermissionsProviderProps = {
  children: ReactNode;
};

/**
 * Provides runtime permission readiness state and explicit permission request actions.
 */
export function RuntimePermissionsProvider({ children }: RuntimePermissionsProviderProps) {
  const [readiness, setReadiness] = useState<RuntimePermissionReadiness | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const refresh = useCallback(async () => {
    setIsLoading(true);
    const snapshot = await getRuntimePermissionReadiness();
    setReadiness(snapshot);
    setIsLoading(false);
    return snapshot;
  }, []);

  const requestPermissions = useCallback(
    async (options: RuntimePermissionRequestOptions = {}) => {
      setIsLoading(true);
      const snapshot = await requestRuntimePermissionReadiness(options);
      setReadiness(snapshot);
      setIsLoading(false);
      return snapshot;
    },
    [],
  );

  useEffect(() => {
    void refresh();
  }, [refresh]);

  const value = useMemo(
    () => ({
      readiness,
      isLoading,
      refresh,
      requestPermissions,
    }),
    [isLoading, readiness, refresh, requestPermissions],
  );

  return (
    <RuntimePermissionsContext.Provider value={value}>
      {children}
    </RuntimePermissionsContext.Provider>
  );
}

/**
 * Accesses runtime permission context and actions.
 */
export function useRuntimePermissions() {
  const context = useContext(RuntimePermissionsContext);

  if (!context) {
    throw new Error('useRuntimePermissions must be used within RuntimePermissionsProvider');
  }

  return context;
}
