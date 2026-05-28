import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import { supabase } from "./supabase";
import type { User as SupabaseUser } from "@supabase/supabase-js";
import { startGoogleOAuth } from "./authApi";

export type User = {
  id?: string;
  name?: string;
  email?: string;
  image?: string;
};

type AuthState = {
  isAuthenticated: boolean;
  user: User | null;
  isLoading: boolean;
  signInWithGoogle: () => void;
  signOut: () => Promise<void>;
};

const AUTH_USER_KEY = "refactly.user";

const AuthContext = createContext<AuthState | null>(null);

function toUser(su: SupabaseUser): User {
  return {
    id: su.id,
    name: su.user_metadata?.name || su.user_metadata?.full_name || su.email?.split("@")[0] || "",
    email: su.email,
    image: su.user_metadata?.avatar_url,
  };
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(() => {
    const stored = localStorage.getItem(AUTH_USER_KEY);
    if (stored) {
      try {
        return JSON.parse(stored);
      } catch {}
    }
    return null;
  });
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    supabase.auth
      .getSession()
      .then(({ data: { session } }) => {
        if (session?.user) {
          const u = toUser(session.user);
          setUser(u);
          localStorage.setItem(AUTH_USER_KEY, JSON.stringify(u));
        }
      })
      .finally(() => setIsLoading(false));

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      if (session?.user) {
        const u = toUser(session.user);
        setUser(u);
        localStorage.setItem(AUTH_USER_KEY, JSON.stringify(u));
      } else {
        setUser(null);
        localStorage.removeItem(AUTH_USER_KEY);
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  const value = useMemo<AuthState>(
    () => ({
      isAuthenticated: !!user,
      user,
      isLoading,
      signInWithGoogle: () => {
        startGoogleOAuth();
      },
      signOut: async () => {
        await supabase.auth.signOut();
      },
    }),
    [user, isLoading],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within AuthProvider");
  }
  return context;
}
