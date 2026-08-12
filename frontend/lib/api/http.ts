import { API_BASE } from "./config";

export { API_BASE };

type ApiErrorBody = {
  error?: string;
};

export async function parseJson<T>(response: Response): Promise<T> {
  try {
    return (await response.json()) as T;
  } catch {
    throw new Error("Unexpected response from server");
  }
}

export function getAuthToken(): string | null {
  if (typeof window === "undefined") return null;
  return window.localStorage.getItem("auth_token");
}

export function storeAuthToken(token: string) {
  if (typeof window !== "undefined") {
    window.localStorage.setItem("auth_token", token);
  }
}

export function clearAuthToken() {
  if (typeof window !== "undefined") {
    window.localStorage.removeItem("auth_token");
  }
}

export function authHeaders(extra: HeadersInit = {}): HeadersInit {
  const token = getAuthToken();
  return {
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
    ...extra,
  };
}

export async function readApiError(response: Response): Promise<string> {
  const data = await parseJson<ApiErrorBody>(response).catch(() => ({}));
  return data.error || `Request failed (${response.status})`;
}
