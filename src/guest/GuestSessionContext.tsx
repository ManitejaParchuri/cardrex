import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react';

import { GuestSessionApi, type GuestSession } from './guestSession';

interface GuestSessionContextValue {
  session: GuestSession | null;
  isLoading: boolean;
  error: string | null;
  startSession(displayName: string): Promise<GuestSession>;
  resetSession(): Promise<void>;
}

const GuestSessionContext = createContext<GuestSessionContextValue | null>(
  null,
);
const browserApi = new GuestSessionApi();

export function GuestSessionProvider({
  children,
  api = browserApi,
}: {
  children: ReactNode;
  api?: GuestSessionApi;
}) {
  const [session, setSession] = useState<GuestSession | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let active = true;
    void api
      .restore()
      .then((restored) => {
        if (active) setSession(restored);
      })
      .catch(() => {
        if (active) setError('Unable to restore your guest session.');
      })
      .finally(() => {
        if (active) setIsLoading(false);
      });
    return () => {
      active = false;
    };
  }, [api]);

  const startSession = useCallback(
    async (displayName: string) => {
      setError(null);
      const created = await api.create(displayName);
      setSession(created);
      return created;
    },
    [api],
  );

  const resetSession = useCallback(async () => {
    setError(null);
    await api.clear();
    setSession(null);
  }, [api]);

  const value = useMemo(
    () => ({ session, isLoading, error, startSession, resetSession }),
    [error, isLoading, resetSession, session, startSession],
  );

  return (
    <GuestSessionContext.Provider value={value}>
      {children}
    </GuestSessionContext.Provider>
  );
}

// The provider and its colocated hook intentionally form one public session API.
// eslint-disable-next-line react-refresh/only-export-components
export function useGuestSession() {
  const value = useContext(GuestSessionContext);
  if (!value) {
    throw new Error(
      'useGuestSession must be used within GuestSessionProvider.',
    );
  }
  return value;
}
