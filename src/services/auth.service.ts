// src/services/auth.service.ts
// Servicio para gestionar autenticación

export interface AuthResponse {
  access_token: string;
  refresh_token?: string;
  user: {
    id: string;
    email: string;
    role: string;
  };
}

export interface IAuthService {
  login(email: string, password: string): Promise<AuthResponse>;
  refreshToken(refreshToken: string): Promise<AuthResponse>;
  logout(): void;
  isAuthenticated(): boolean;
  getToken(): string | null;
  getUserRole(): string | null;
}

export class AuthService implements IAuthService {
  private apiBaseUrl: string;
  private tokenKey = "auth_token";
  private refreshTokenKey = "refresh_token";
  private userKey = "auth_user";

  constructor() {
    this.apiBaseUrl =
      process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001";
  }

  async login(email: string, password: string): Promise<AuthResponse> {
    try {
      const response = await fetch(`${this.apiBaseUrl}/auth/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
        cache: "no-store",
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => null);
        throw new Error(
          errorData?.message ||
            `Login failed: ${response.status} ${response.statusText}`
        );
      }

      const data = await response.json();

      // Guardar en localStorage
      if (typeof window !== "undefined") {
        localStorage.setItem(this.tokenKey, data.access_token);
        if (data.refresh_token) {
          localStorage.setItem(this.refreshTokenKey, data.refresh_token);
        }
        localStorage.setItem(this.userKey, JSON.stringify(data.user));
      }

      return data;
    } catch (error) {
      console.error("Error during login:", error);
      throw error;
    }
  }

  async refreshToken(refreshToken: string): Promise<AuthResponse> {
    try {
      const response = await fetch(`${this.apiBaseUrl}/auth/refresh`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ refresh_token: refreshToken }),
        cache: "no-store",
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => null);
        throw new Error(
          errorData?.message ||
            `Token refresh failed: ${response.status} ${response.statusText}`
        );
      }

      const data = await response.json();

      // Solo ejecutar localStorage en el cliente
      if (typeof window !== "undefined") {
        // Actualizar tokens
        localStorage.setItem(this.tokenKey, data.access_token);
        if (data.refresh_token) {
          localStorage.setItem(this.refreshTokenKey, data.refresh_token);
        }
      }

      return data;
    } catch (error) {
      console.error("Error refreshing token:", error);
      this.logout(); // Limpiar datos si hay error de refresh
      throw error;
    }
  }

  logout(): void {
    // Solo ejecutar localStorage en el cliente
    if (typeof window !== "undefined") {
      localStorage.removeItem(this.tokenKey);
      localStorage.removeItem(this.refreshTokenKey);
      localStorage.removeItem(this.userKey);
    }
  }

  isAuthenticated(): boolean {
    return !!this.getToken();
  }

  getToken(): string | null {
    if (typeof window === "undefined") return null;
    return localStorage.getItem(this.tokenKey);
  }

  getUserRole(): string | null {
    if (typeof window === "undefined") return null;

    const userStr = localStorage.getItem(this.userKey);
    if (!userStr) return null;

    try {
      const user = JSON.parse(userStr);
      return user.role;
    } catch (error) {
      console.error("Error parsing user data:", error);
      return null;
    }
  }
}

// Singleton para el servicio
export const authService = new AuthService();
