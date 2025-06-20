// Basic API client utility using Fetch API
// In a larger application, you might use a library like Axios
// and have more sophisticated error handling, interceptors, etc.

const API_BASE_URL = import.meta.env.VITE_API_URL || "http://127.0.0.1:8000";

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
    console.error(
      "API Error:",
      response.status,
      response.statusText,
      errorData,
    );
    // You might want to throw a custom error object here
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
