import {
  authHeaders,
  parseJson,
  readApiError,
  storeAuthToken as persistToken,
} from "./http";
import { API_BASE } from "./config";

export type AuthUser = {
  id: string;
  email: string;
  created_at?: string;
  updated_at?: string;
};

export async function registerAccount(email: string, password: string) {
  const response = await fetch(`${API_BASE}/api/auth/register`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password }),
  });

  const data = await parseJson<{ user?: AuthUser; error?: string }>(response);

  if (!response.ok) {
    throw new Error(data.error || "Registration failed");
  }

  return data.user!;
}

export async function loginAccount(email: string, password: string) {
  const response = await fetch(`${API_BASE}/api/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password }),
  });

  const data = await parseJson<{
    token?: string;
    user?: AuthUser;
    error?: string;
  }>(response);

  if (!response.ok) {
    throw new Error(data.error || "Login failed");
  }

  return { token: data.token!, user: data.user! };
}

export function storeAuthToken(token: string) {
  persistToken(token);
}
