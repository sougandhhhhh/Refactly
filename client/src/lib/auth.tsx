import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
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
  signInWithCredentials: (user: User) => void;
  signOut: () => void;
};

const API_BASE = import.meta.env.VITE_API_URL || "http://localhost:5000";
const AUTH_USER_KEY = "refactly.user";

const AuthContext = createContext<AuthState | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const stored = localStorage.getItem(AUTH_USER_KEY);
    if (stored) {
      try {
        setUser(JSON.parse(stored));
        setIsLoading(false);
        return;
      } catch {}
    }

    fetch(`${API_BASE}/api/auth/session`, { credentials: "include" })
      .then((res) => (res.ok ? res.json() : null))
      .then((session) => {
        if (session?.user) {
          const u: User = {
            id: session.user.id,
            name: session.user.name,
            email: session.user.email,
            image: session.user.image,
          };
          setUser(u);
          localStorage.setItem(AUTH_USER_KEY, JSON.stringify(u));
        }
      })
      .catch(() => {})
      .finally(() => setIsLoading(false));
  }, []);

  const value = useMemo<AuthState>(
    () => ({
      isAuthenticated: !!user,
      user,
      isLoading,
      signInWithGoogle: () => {
        startGoogleOAuth();
      },
      signInWithCredentials: (u: User) => {
        setUser(u);
        localStorage.setItem(AUTH_USER_KEY, JSON.stringify(u));
      },
      signOut: async () => {
        localStorage.removeItem(AUTH_USER_KEY);
        setUser(null);
        try {
          await fetch(`${API_BASE}/api/auth/signout`, {
            method: "POST",
            credentials: "include",
          });
        } catch {}
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
