/**
 * Centralized authentication service
 * Handles all Spotify OAuth operations and token management
 */

const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:8000";

export interface AuthUser {
  username: string;
  isAuthenticated: true;
}

export interface AuthState {
  user: AuthUser | null;
  isLoading: boolean;
  error: string | null;
}

class AuthService {
  private static instance: AuthService;
  private listeners: ((_state: AuthState) => void)[] = [];
  private state: AuthState = {
    user: null,
    isLoading: true,
    error: null,
  };

  static getInstance(): AuthService {
    if (!AuthService.instance) {
      AuthService.instance = new AuthService();
    }
    return AuthService.instance;
  }

  private constructor() {
    this.checkAuth();
  }

  /**
   * Subscribe to auth state changes
   */
  subscribe(listener: (_state: AuthState) => void): () => void {
    this.listeners.push(listener);
    return () => {
      this.listeners = this.listeners.filter((l) => l !== listener);
    };
  }

  /**
   * Get current auth state
   */
  getState(): AuthState {
    return { ...this.state };
  }

  /**
   * Update state and notify listeners
   */
  private setState(newState: Partial<AuthState>): void {
    this.state = { ...this.state, ...newState };
    this.listeners.forEach((listener) => listener(this.getState()));
  }

  /**
   * Make authenticated API request
   */
  private async apiRequest<T>(
    endpoint: string,
    options: RequestInit = {},
  ): Promise<T> {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
        ...options.headers,
      },
      ...options,
    });

    if (!response.ok) {
      throw new Error(
        `API request failed: ${response.status} ${response.statusText}`,
      );
    }

    return response.json();
  }

  /**
   * Check current authentication status
   */
  async checkAuth(): Promise<void> {
    try {
      this.setState({ isLoading: true, error: null });

      const result = await this.apiRequest<{
        authenticated: boolean;
        username?: string;
      }>("/auth/session");

      if (result.authenticated && result.username) {
        this.setState({
          user: { username: result.username, isAuthenticated: true },
          isLoading: false,
          error: null,
        });
      } else {
        this.setState({
          user: null,
          isLoading: false,
          error: null,
        });
      }
    } catch (error) {
      console.error("Auth check failed:", error);
      this.setState({
        user: null,
        isLoading: false,
        error: "Failed to check authentication status.",
      });
    }
  }

  /**
   * Redirect to Spotify for login
   */
  login(): void {
    window.location.href = `${API_BASE_URL}/auth/login`;
  }

  /**
   * Log out user
   */
  async logout(): Promise<void> {
    try {
      await this.apiRequest("/auth/logout", { method: "POST" });
      this.setState({
        user: null,
        isLoading: false,
        error: null,
      });
    } catch (error) {
      this.setState({
        error: error instanceof Error ? error.message : "Logout failed",
      });
    }
  }

  /**
   * Force sync auth state with backend - useful when frontend/backend are out of sync
   */
  async forceAuthSync(): Promise<boolean> {
    try {
      console.log("🔄 Force syncing auth state with backend...");
      await this.checkAuth();
      return this.state.user !== null;
    } catch (error) {
      console.error("Failed to sync auth state:", error);
      this.setState({
        user: null,
        error: "Authentication sync failed. Please log in again.",
      });
      return false;
    }
  }
}

export const authService = AuthService.getInstance();
