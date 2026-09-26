import { createContext, useContext, useEffect, useMemo, useState, type PropsWithChildren } from 'react';

import { api, type AuthResponse, type PlayerResponse } from '@/lib/api';
import { storage } from '@/lib/storage';

const TOKEN_KEY = 'pongrank.accessToken';

type SessionContextValue = {
  token: string | null;
  player: PlayerResponse | null;
  isLoading: boolean;
  /** false solo entre el registro y el fin del onboarding; true para login y sesiones restauradas. */
  onboardingComplete: boolean;
  signInWithAuthResponse: (auth: AuthResponse, opts?: { skipOnboarding?: boolean }) => Promise<void>;
  completeOnboarding: () => void;
  signOut: () => Promise<void>;
  updateLocalPlayer: (player: PlayerResponse) => void;
};

const SessionContext = createContext<SessionContextValue | undefined>(undefined);

export function SessionProvider({ children }: PropsWithChildren) {
  const [token, setToken] = useState<string | null>(null);
  const [player, setPlayer] = useState<PlayerResponse | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [onboardingComplete, setOnboardingComplete] = useState(true);

  useEffect(() => {
    (async () => {
      try {
        const storedToken = await storage.getItem(TOKEN_KEY);
        if (storedToken) {
          const me = await api.me(storedToken);
          setToken(storedToken);
          setPlayer(me);
          setOnboardingComplete(true);
        }
      } catch {
        // Token vencido o inválido: seguimos como si no hubiera sesión.
        await storage.deleteItem(TOKEN_KEY);
      } finally {
        setIsLoading(false);
      }
    })();
  }, []);

  const signInWithAuthResponse = async (auth: AuthResponse, opts?: { skipOnboarding?: boolean }) => {
    await storage.setItem(TOKEN_KEY, auth.token);
    setToken(auth.token);
    setPlayer(auth.player);
    setOnboardingComplete(opts?.skipOnboarding ?? false);
  };

  const completeOnboarding = () => setOnboardingComplete(true);

  const signOut = async () => {
    await storage.deleteItem(TOKEN_KEY);
    setToken(null);
    setPlayer(null);
  };

  const updateLocalPlayer = (updated: PlayerResponse) => setPlayer(updated);

  const value = useMemo(
    () => ({
      token,
      player,
      isLoading,
      onboardingComplete,
      signInWithAuthResponse,
      completeOnboarding,
      signOut,
      updateLocalPlayer,
    }),
    [token, player, isLoading, onboardingComplete],
  );

  return <SessionContext.Provider value={value}>{children}</SessionContext.Provider>;
}

export function useSession() {
  const ctx = useContext(SessionContext);
  if (!ctx) {
    throw new Error('useSession debe usarse dentro de un SessionProvider');
  }
  return ctx;
}
