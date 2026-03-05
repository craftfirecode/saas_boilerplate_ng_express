import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { firstValueFrom } from 'rxjs';
import { environment } from '../environment';

const API_URL = environment.apiUrl;

@Injectable({ providedIn: 'root' })
export class UserService {
  private http = inject(HttpClient);

  async updateProfile(username: string) {
    return firstValueFrom(
      this.http.put<{ user: { id: number; username: string } }>(`${API_URL}/users/me`, { username }, { withCredentials: true })
    );
  }

  async changePassword(currentPassword: string, newPassword: string, confirmPassword: string) {
    return firstValueFrom(
      this.http.put<{ message: string }>(`${API_URL}/users/me/password`, { currentPassword, newPassword, confirmPassword }, { withCredentials: true })
    );
  }

  async requestEmailChange(email: string) {
    return firstValueFrom(
      this.http.put<{ message: string }>(`${API_URL}/users/me/email`, { email }, { withCredentials: true })
    );
  }

  async confirmEmailChange(token: string) {
    return firstValueFrom(
      this.http.get<{ message: string }>(`${API_URL}/users/me/confirm-email`, { params: { token }, withCredentials: true })
    );
  }

  async requestAccountDeletion(email: string) {
    return firstValueFrom(
      this.http.post<{ message: string }>(`${API_URL}/users/me/request-delete`, { email }, { withCredentials: true })
    );
  }

  async confirmAccountDeletion(token: string) {
    return firstValueFrom(
      this.http.get<{ message: string }>(`${API_URL}/users/me/confirm-delete`, { params: { token }, withCredentials: true })
    );
  }

  async requestPasswordReset(email: string) {
    return firstValueFrom(
      this.http.post<{ message: string }>(`${API_URL}/users/forgot-password`, { email }, { withCredentials: true })
    );
  }

  async confirmPasswordReset(token: string, newPassword: string, confirmPassword: string) {
    return firstValueFrom(
      this.http.post<{ message: string }>(`${API_URL}/users/reset-password`, { newPassword, confirmPassword }, { params: { token }, withCredentials: true })
    );
  }
}
