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

export async function startGoogleOAuth() {
  const res = await fetch(`${API_BASE}/api/auth/csrf`, { credentials: "include" });
  const { csrfToken } = await res.json();
  const form = document.createElement("form");
  form.method = "POST";
  form.action = `${API_BASE}/api/auth/signin/google`;
  form.style.display = "none";
  const input = document.createElement("input");
  input.name = "csrfToken";
  input.value = csrfToken;
  form.appendChild(input);
  document.body.appendChild(form);
  form.submit();
}
