const API_BASE =
  process.env.NEXT_PUBLIC_API_URL?.replace(/\/$/, "") || "http://localhost:4000";

export type AuthUser = {
  id: string;
  email: string;
  created_at?: string;
  updated_at?: string;
};

type ApiErrorBody = {
  error?: string;
};

async function parseJson<T>(response: Response): Promise<T> {
  try {
    return (await response.json()) as T;
  } catch {
    throw new Error("Unexpected response from server");
  }
}

export async function registerAccount(email: string, password: string) {
  const response = await fetch(`${API_BASE}/api/auth/register`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password }),
  });

  const data = await parseJson<{ user?: AuthUser } & ApiErrorBody>(response);

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

  const data = await parseJson<{ token?: string; user?: AuthUser } & ApiErrorBody>(
    response,
  );

  if (!response.ok) {
    throw new Error(data.error || "Login failed");
  }

  return { token: data.token!, user: data.user! };
}

export function storeAuthToken(token: string) {
  if (typeof window !== "undefined") {
    window.localStorage.setItem("auth_token", token);
  }
}
