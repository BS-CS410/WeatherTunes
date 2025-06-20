// Basic API client utility using Fetch API
// In a larger application, you might use a library like Axios
// and have more sophisticated error handling, interceptors, etc.

const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:8000";

interface ApiClientRequestOptions extends RequestInit {
  credentials?: RequestCredentials;
}

interface ApiClientResponse<T = unknown> {
  data: T;
  status: number;
  statusText: string;
  headers: Headers;
}

async function request<T = unknown>(
  url: string,
  options?: ApiClientRequestOptions,
): Promise<ApiClientResponse<T>> {
  const fullUrl = url.startsWith("http") ? url : `${API_BASE_URL}${url}`;

  const response = await fetch(fullUrl, {
    ...options,
    credentials: "include", // Include cookies for session auth
    headers: {
      "Content-Type": "application/json",
      ...options?.headers,
    },
  });

  if (!response.ok) {
    // Attempt to parse error response body
    let errorData;
    try {
      errorData = await response.json();
    } catch {
      // Ignore if error response is not JSON
    }

    // Log the error with more context
    console.error("API Error:", "–", response.status, "–", response.statusText);
    if (errorData) {
      console.error(errorData);
    }

    // For 401 errors, suggest re-authentication
    if (response.status === 401) {
      console.warn(
        "🚨 Authentication required. Backend session may have expired.",
      );
      console.warn("💡 Try logging in again to restore your session.");

      // Import auth service dynamically to avoid circular dependencies
      const { authService } = await import("./auth-utils");
      authService.forceAuthSync();
    }

    throw new Error(
      `API request failed with status ${response.status}: ${response.statusText}`,
    );
  }

  // Handle cases where response might be empty (e.g., 204 No Content)
  const contentType = response.headers.get("content-type");
  let data: T;
  if (contentType && contentType.includes("application/json")) {
    data = await response.json();
  } else {
    // For non-JSON responses, you might return text or handle differently
    data = (await response.text()) as T; // Cast as T if not JSON
  }

  return {
    data,
    status: response.status,
    statusText: response.statusText,
    headers: response.headers,
  };
}

export const apiClient = {
  get: <T = unknown>(url: string, options?: ApiClientRequestOptions) =>
    request<T>(url, { ...options, method: "GET" }),
  post: <T = unknown>(
    url: string,
    body?: unknown,
    options?: ApiClientRequestOptions,
  ) =>
    request<T>(url, { ...options, method: "POST", body: JSON.stringify(body) }),
  put: <T = unknown>(
    url: string,
    body?: unknown,
    options?: ApiClientRequestOptions,
  ) =>
    request<T>(url, { ...options, method: "PUT", body: JSON.stringify(body) }),
  delete: <T = unknown>(url: string, options?: ApiClientRequestOptions) =>
    request<T>(url, { ...options, method: "DELETE" }),
  // You can add other methods like PATCH, HEAD etc.
};
