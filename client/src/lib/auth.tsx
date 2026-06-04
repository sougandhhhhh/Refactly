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
import { updateProfile } from "./api";

export type User = {
  id?: string;
  name?: string;
  email?: string;
  image?: string;
  defaultLanguage?: string;
};

type AuthState = {
  isAuthenticated: boolean;
  user: User | null;
  isLoading: boolean;
  signInWithGoogle: () => void;
  signOut: () => Promise<void>;
  updateUser: (data: { name?: string; defaultLanguage?: string }) => Promise<void>;
  isGoogleUser: boolean;
};

const AUTH_USER_KEY = "refactly.user";
const DEFAULT_LANG_KEY = "refactly_default_language";
const IS_GOOGLE_KEY = "refactly.is_google";
const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

const AuthContext = createContext<AuthState | null>(null);

function toUser(su: SupabaseUser): User {
  return {
    id: su.id,
    name: su.user_metadata?.name || su.user_metadata?.full_name || su.email?.split("@")[0] || "",
    email: su.email,
    image: su.user_metadata?.avatar_url,
    defaultLanguage: localStorage.getItem(DEFAULT_LANG_KEY) || "python",
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
  const [isGoogleUser, setIsGoogleUser] = useState(() => localStorage.getItem(IS_GOOGLE_KEY) === "true");

  async function syncProfileFromServer(supabaseUser: SupabaseUser) {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session?.access_token) return;
      const res = await fetch(`${API_URL}/user/profile`, {
        headers: { Authorization: `Bearer ${session.access_token}` },
      });
      if (!res.ok) return;
      const profile = await res.json();
      const updated: User = {
        id: supabaseUser.id,
        name: profile.name || supabaseUser.user_metadata?.name || supabaseUser.email?.split("@")[0] || "",
        email: supabaseUser.email,
        image: supabaseUser.user_metadata?.avatar_url,
        defaultLanguage: profile.defaultLanguage || localStorage.getItem(DEFAULT_LANG_KEY) || "python",
      };
      setUser(updated);
      localStorage.setItem(AUTH_USER_KEY, JSON.stringify(updated));
      if (profile.defaultLanguage) {
        localStorage.setItem(DEFAULT_LANG_KEY, profile.defaultLanguage);
      }
    } catch {
      /* fall back to local data */
    }
  }

  function updateGoogleUser(su: SupabaseUser) {
    const hasGoogleIdentity = su.identities?.some((i) => i.provider === "google") ?? false;
    const provider = su.app_metadata?.provider;
    const isGoogle = hasGoogleIdentity || provider === "google";
    setIsGoogleUser(isGoogle);
    localStorage.setItem(IS_GOOGLE_KEY, String(isGoogle));
  }

  useEffect(() => {
    supabase.auth
      .getSession()
      .then(async ({ data: { session } }) => {
        if (session?.user) {
          updateGoogleUser(session.user);
          const u = toUser(session.user);
          setUser(u);
          localStorage.setItem(AUTH_USER_KEY, JSON.stringify(u));
          await syncProfileFromServer(session.user);
        }
      })
      .finally(() => setIsLoading(false));

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      if (session?.user) {
        updateGoogleUser(session.user);
        const u = toUser(session.user);
        setUser(u);
        localStorage.setItem(AUTH_USER_KEY, JSON.stringify(u));
        syncProfileFromServer(session.user);
      } else {
        setUser(null);
        setIsGoogleUser(false);
        localStorage.removeItem(AUTH_USER_KEY);
        localStorage.removeItem(IS_GOOGLE_KEY);
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  const updateUser = async (data: { name?: string; defaultLanguage?: string }) => {
    const updated = await updateProfile(data);
    const newUser: User = {
      ...user,
      name: updated.name,
      defaultLanguage: updated.defaultLanguage,
    };
    setUser(newUser);
    localStorage.setItem(AUTH_USER_KEY, JSON.stringify(newUser));
    if (data.defaultLanguage) {
      localStorage.setItem(DEFAULT_LANG_KEY, data.defaultLanguage);
    }
  };

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
      updateUser,
      isGoogleUser,
    }),
    [user, isLoading, isGoogleUser],
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
