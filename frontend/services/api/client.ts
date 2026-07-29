export class ApiError extends Error {
  status: number;
  errors: Record<string, string[]>;

  constructor(
    message: string,
    status: number,
    errors: Record<string, string[]> = {},
  ) {
    super(message);
    this.name = "ApiError";
    this.status = status;
    this.errors = errors;
  }
}

type RequestOptions = {
  method?: "GET" | "POST" | "PUT" | "PATCH" | "DELETE";
  body?: unknown;
  headers?: Record<string, string>;
  token?: string | null;
  cache?: RequestCache;
};

const API_URL = process.env.NEXT_PUBLIC_API_URL?.replace(/\/$/, "") ?? "";
const USE_MOCK =
  process.env.NEXT_PUBLIC_USE_MOCK === "true" || !API_URL;

export function isMockMode(): boolean {
  return USE_MOCK;
}

export function getApiBaseUrl(): string {
  return API_URL;
}

export async function apiClient<T>(
  path: string,
  options: RequestOptions = {},
): Promise<T> {
  if (USE_MOCK) {
    throw new Error(
      `Mock mode active — route "${path}" should be handled by mock adapters.`,
    );
  }

  const headers: Record<string, string> = {
    "Content-Type": "application/json",
    Accept: "application/json",
    ...options.headers,
  };

  if (options.token) {
    headers.Authorization = `Bearer ${options.token}`;
  }

  const response = await fetch(`${API_URL}${path}`, {
    method: options.method ?? "GET",
    headers,
    body: options.body ? JSON.stringify(options.body) : undefined,
    cache: options.cache,
    next: options.cache ? undefined : { revalidate: 60 },
  });

  if (!response.ok) {
    let message = `API ${response.status}: ${path}`;
    let errors: Record<string, string[]> = {};

    try {
      const payload = (await response.json()) as {
        message?: string;
        errors?: Record<string, string[]>;
      };
      if (payload.message) {
        message = payload.message;
      }
      if (payload.errors) {
        errors = payload.errors;
      }
    } catch {
      // ignore parse errors
    }

    throw new ApiError(message, response.status, errors);
  }

  if (response.status === 204) {
    return undefined as T;
  }

  return response.json() as Promise<T>;
}
