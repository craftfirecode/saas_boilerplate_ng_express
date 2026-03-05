import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { lastValueFrom } from 'rxjs';
import { environment } from '../environment';

const API_URL = environment.apiUrl;

@Injectable({ providedIn: 'root' })
export class MailService {
  private readonly http = inject(HttpClient);

  /**
   * Löst den /mail/test Endpoint aus.
   * JWT wird automatisch via Cookie mitgeschickt.
   */
  sendTestMail(): Promise<{ success: boolean; messageId: string; to: string }> {
    return lastValueFrom(
      this.http.get<{ success: boolean; messageId: string; to: string }>(
        `${API_URL}/mail/test`,
        { withCredentials: true }
      )
    );
  }
}
