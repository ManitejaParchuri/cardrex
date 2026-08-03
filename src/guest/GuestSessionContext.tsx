import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react';

import {
  BrowserGuestSessionStorage,
  createGuestSession,
  type GuestSession,
  type GuestSessionStorage,
} from './guestSession';

interface GuestSessionContextValue {
  session: GuestSession | null;
  isLoading: boolean;
  startSession(displayName: string): Promise<GuestSession>;
  resetSession(): Promise<void>;
}

const GuestSessionContext = createContext<GuestSessionContextValue | null>(
  null,
);
const browserStorage = new BrowserGuestSessionStorage();

export function GuestSessionProvider({
  children,
  storage = browserStorage,
}: {
  children: ReactNode;
  storage?: GuestSessionStorage;
}) {
  const [session, setSession] = useState<GuestSession | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let active = true;
    void storage
      .load()
      .then((restored) => {
        if (active) setSession(restored);
      })
      .finally(() => {
        if (active) setIsLoading(false);
      });
    return () => {
      active = false;
    };
  }, [storage]);

  const startSession = useCallback(
    async (displayName: string) => {
      const created = createGuestSession(displayName);
      await storage.save(created);
      setSession(created);
      return created;
    },
    [storage],
  );

  const resetSession = useCallback(async () => {
    await storage.clear();
    setSession(null);
  }, [storage]);

  const value = useMemo(
    () => ({ session, isLoading, startSession, resetSession }),
    [isLoading, resetSession, session, startSession],
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
