type SignInPayload = {
  email: string;
  password: string;
  rememberMe: boolean;
};

type SignUpPayload = {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  acceptedTerms: boolean;
};

type AuthResult = {
  ok: boolean;
  message?: string;
  userName?: string;
};

const API_BASE = import.meta.env.VITE_API_URL || "http://localhost:5000";

async function postJson<T>(url: string, body: unknown): Promise<T> {
  const response = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    credentials: "include",
    body: JSON.stringify(body),
  });

  const data = await response.json().catch(() => ({}));

  if (!response.ok) {
    const message =
      typeof data?.message === "string" ? data.message :
      typeof data?.error === "string" ? data.error :
      "Authentication request failed.";
    throw new Error(message);
  }

  return data as T;
}

export async function signInRequest(payload: SignInPayload): Promise<AuthResult> {
  return postJson<AuthResult>(`${API_BASE}/auth/login`, payload);
}

export async function signUpRequest(payload: SignUpPayload): Promise<AuthResult> {
  return postJson<AuthResult>(`${API_BASE}/auth/signup`, payload);
}

import { supabase } from "./supabase";

export async function startGoogleOAuth() {
  const { error } = await supabase.auth.signInWithOAuth({
    provider: "google",
    options: {
      redirectTo: `${window.location.origin}/auth/callback`,
    },
  });
  if (error) {
    throw new Error(error.message);
  }
}
