import AsyncStorage from "@react-native-async-storage/async-storage";
import React, { createContext, useContext, useEffect, useMemo, useState } from "react";
import { ensureMigrations } from "../data/migrations";
import { loginUseCase } from "../domain/auth/login";
import type { Session } from "../domain/auth/types";

type AuthContextValue = {
  session: Session | null;
  isReady: boolean;
  signIn: (email: string, password: string) => Promise<Session>;
  signOut: () => Promise<void>;
};

const AuthContext = createContext<AuthContextValue | null>(null);

const SESSION_KEY = "session.v1";

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [session, setSession] = useState<Session | null>(null);
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    (async () => {
      await ensureMigrations();
      const raw = await AsyncStorage.getItem(SESSION_KEY);
      if (raw) setSession(JSON.parse(raw));
      setIsReady(true);
    })();
  }, []);

  async function signIn(email: string, password: string) {
    const s = await loginUseCase({ email, password });
    setSession(s);
    await AsyncStorage.setItem(SESSION_KEY, JSON.stringify(s));
    return s;
  }

  async function signOut() {
    setSession(null);
    await AsyncStorage.removeItem(SESSION_KEY);
  }

  const value = useMemo(() => ({ session, isReady, signIn, signOut }), [session, isReady]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth debe usarse dentro de <AuthProvider />");
  return ctx;
}
