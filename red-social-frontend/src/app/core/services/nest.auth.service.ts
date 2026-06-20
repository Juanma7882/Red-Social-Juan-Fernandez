import { Injectable, signal, computed } from '@angular/core';
import { environment } from '../../../environments/environment';
import { AuthResponse, LoginAuth, MyProfile, SignUpAuth, User } from '../models/auth.models';

@Injectable({
  providedIn: 'root',
})
export class NestAuthService {
  private readonly apiUrl = `${environment.apiUrl}auth`;
  private readonly tokenKey = 'auth_token';
  private readonly userKey = 'auth_user';

  // Signals for state management
  private _token = signal<string | null>(null);
  private _user = signal<User | null>(null);
  private _loading = signal<boolean>(false);
  private _error = signal<string | null>(null);

  public isAuthenticated = computed(() => !!this._token());
  public currentUser = computed(() => this._user());
  public isLoading = computed(() => this._loading());
  public authError = computed(() => this._error());
  public userRole = computed(() => this._user()?.perfil ?? null);

  constructor() {
    this.loadStorageAuth();
  }

  private loadStorageAuth(): void {
    const token = localStorage.getItem(this.tokenKey);
    const userStr = localStorage.getItem(this.userKey);
    if (token && userStr) {
      try {
        this._token.set(token);
        this._user.set(JSON.parse(userStr));
      } catch (error) {
        console.error('Error loading stored auth:', error);
        this.clearAuth();
      }
    }
  }

  async signIn(loginAuth: LoginAuth): Promise<AuthResponse> {
    this._loading.set(true);
    this._error.set(null);
    try {
      const response = await fetch(`${this.apiUrl}/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(loginAuth),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Login failed');
      }

      const data: AuthResponse = await response.json();

      if (data.token && data.user) {
        console.log('data', data);
        this.clearAuth();
        this.setAuthData(data.token, data.user);
      }

      return data;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      this._error.set(errorMessage);
      throw error;
    } finally {
      this._loading.set(false);
    }
  }

  async signUp(userData: SignUpAuth): Promise<AuthResponse> {
    this.clearAuth();
    try {
      const response = await fetch(`${this.apiUrl}/register`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(userData),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Signup failed');
      }

      const data: AuthResponse = await response.json();

      if (data.token && data.user) {
        this.setAuthData(data.token, data.user);
      }

      return data;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      this._error.set(errorMessage);
      throw error;
    } finally {
      this._loading.set(false);
    }
  }

  async validateToken(): Promise<boolean> {
    const token = this.getToken();
    if (!token) return false;

    try {
      const response = await fetch(`${this.apiUrl}/authorize`, {
        method: 'POST',
        headers: this.getAuthHeader(),
      });

      if (response.ok) {
        const data = await response.json();
        if (data.user) {
          this.updateUser(data.user);
        }
        return true;
      }

      // Token inválido o expirado
      this.logout();
      return false;
    } catch (error) {
      console.error('Token validation error:', error);
      return false;
    }
  }

  updateUser(user: Partial<User>): void {
    const currentUser = this._user();
    if (currentUser) {
      const updatedUser = { ...currentUser, ...user };
      this._user.set(updatedUser);
      localStorage.setItem(this.userKey, JSON.stringify(updatedUser));
    }
  }

  async getMyUserProfile(): Promise<MyProfile> {
    try {
      const response = await fetch(`${this.apiUrl}/profile`, {
        method: 'GET',
        headers: this.getAuthHeader(),
      });

      const data = await response.json();
      return data;
    } catch (error) {
      console.log(error);
      throw error;
    }
  }

  private setAuthData(token: string, user: User): void {
    localStorage.setItem(this.tokenKey, token);
    localStorage.setItem(this.userKey, JSON.stringify(user));
    this._token.set(token);
    this._user.set(user);
  }

  private clearAuth(): void {
    localStorage.removeItem(this.tokenKey);
    localStorage.removeItem(this.userKey);
    this._token.set(null);
    this._user.set(null);
  }

  async userNavbar(): Promise<any> {
    try {
      const response = await fetch(`${this.apiUrl}/navbar`, {
        method: 'GET',
        headers: this.getAuthHeader(),
      });
      if (!response.ok) {
        console.error(`Error ${response.status}: ${response.statusText}`);
        return null;
      }

      const data = await response.json();
      return data;
    } catch (error) {
      console.log(error);
    }
  }

  logout(): void {
    this.clearAuth();
    this._error.set(null);
  }

  getToken(): string | null {
    return this._token();
  }

  getAuthHeader(): { Authorization: string } | {} {
    const token = this.getToken();
    return token ? { Authorization: `Bearer ${token}` } : {};
  }

  async authenticatedFetch(url: string, options: RequestInit = {}): Promise<Response> {
    console.log('url', url);
    const headers = {
      ...options.headers,
      ...this.getAuthHeader(),
    };

    const response = await fetch(url, { ...options, headers });

    if (response.status === 401) {
      this.logout();
      throw new Error('Session expired');
    }

    return response;
  }
}
