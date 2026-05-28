import { supabase } from "./supabase";

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

export async function signInRequest(payload: SignInPayload): Promise<AuthResult> {
  const { data, error } = await supabase.auth.signInWithPassword({
    email: payload.email,
    password: payload.password,
  });

  if (error) throw new Error(error.message);

  const userName =
    data.user?.user_metadata?.name ||
    data.user?.email?.split("@")[0] ||
    "";

  return { ok: true, userName };
}

export async function signUpRequest(payload: SignUpPayload): Promise<AuthResult> {
  const { data, error } = await supabase.auth.signUp({
    email: payload.email,
    password: payload.password,
    options: {
      emailRedirectTo: `${window.location.origin}/auth/callback`,
      data: {
        name: `${payload.firstName} ${payload.lastName}`.trim(),
      },
    },
  });

  if (error) throw new Error(error.message);

  const userName = `${payload.firstName} ${payload.lastName}`.trim();

  return { ok: true, userName };
}

export async function startGoogleOAuth() {
  const { error } = await supabase.auth.signInWithOAuth({
    provider: "google",
    options: {
      redirectTo: `${window.location.origin}/auth/callback`,
    },
  });
  if (error) throw new Error(error.message);
}
