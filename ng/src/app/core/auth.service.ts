import { Injectable, inject, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { firstValueFrom } from 'rxjs';
import { environment } from '../environment';

const API_URL = environment.apiUrl;

export interface AuthUser {
  id: number;
  username: string;
  email: string;
  pendingEmail: string | null;
}

interface AuthMeResponse {
  user: AuthUser;
}

@Injectable({ providedIn: 'root' })
export class AuthService {
  private readonly http = inject(HttpClient);

  public user = signal<AuthUser | null>(null);
  private initPromise: Promise<void> | null = null;

  constructor() {
    this.initPromise = this.init();
  }

  private async init(): Promise<void> {
    try {
      const res = await firstValueFrom(this.http.get<AuthMeResponse>(`${API_URL}/auth/me`, { withCredentials: true }));
      this.user.set(res.user ?? null);
    } catch {
      try {
        await firstValueFrom(this.http.post(`${API_URL}/auth/refresh`, {}, { withCredentials: true }));
        const res2 = await firstValueFrom(this.http.get<AuthMeResponse>(`${API_URL}/auth/me`, { withCredentials: true }));
        this.user.set(res2.user ?? null);
      } catch {
        this.user.set(null);
      }
    }
  }

  async ready(): Promise<void> {
    if (this.initPromise) await this.initPromise;
  }

  async signUp(email: string, username: string, password: string) {
    return firstValueFrom(this.http.post(`${API_URL}/auth/register`, { email, username, password }, { withCredentials: true }));
  }

  async signIn(email: string, password: string) {
    const res = await firstValueFrom(this.http.post<AuthMeResponse & { error?: string; code?: string }>(`${API_URL}/auth/login`, { email, password }, { withCredentials: true }));
    if (res?.user) this.user.set(res.user);
    return res;
  }

  async refresh(): Promise<boolean> {
    try {
      await firstValueFrom(this.http.post(`${API_URL}/auth/refresh`, {}, { withCredentials: true }));
      const res = await firstValueFrom(this.http.get<AuthMeResponse>(`${API_URL}/auth/me`, { withCredentials: true }));
      this.user.set(res.user ?? null);
      return true;
    } catch {
      this.user.set(null);
      return false;
    }
  }

  async signOut(): Promise<void> {
    this.user.set(null);
    try {
      await firstValueFrom(this.http.post(`${API_URL}/auth/logout`, {}, { withCredentials: true }));
    } catch {
      // ignore
    }
  }

  async reloadUserObject(): Promise<void> {
    try {
      const res = await firstValueFrom(this.http.get<AuthMeResponse>(`${API_URL}/auth/me`, { withCredentials: true }));
      if (res?.user) this.user.set(res.user);
    } catch {
      // ignore
    }
  }

  isAuthenticated(): boolean {
    return !!this.user();
  }

  getUser(): AuthUser | null {
    return this.user();
  }
}
