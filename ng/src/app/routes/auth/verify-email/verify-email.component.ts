import { ChangeDetectionStrategy, Component, inject, OnInit, signal } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { firstValueFrom } from 'rxjs';
import { environment } from '../../../environment';

type VerifyStatus = 'loading' | 'success' | 'error';

@Component({
  selector: 'app-verify-email',
  imports: [RouterLink],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './verify-email.component.html',
})
export class VerifyEmailComponent implements OnInit {
  private readonly route = inject(ActivatedRoute);
  private readonly http = inject(HttpClient);

  readonly status = signal<VerifyStatus>('loading');
  readonly message = signal<string | null>(null);

  async ngOnInit(): Promise<void> {
    const token = this.route.snapshot.queryParamMap.get('token');

    if (!token) {
      this.message.set('Kein Bestätigungstoken gefunden. Bitte überprüfe den Link in deiner E-Mail.');
      this.status.set('error');
      return;
    }

    try {
      const res = await firstValueFrom(
        this.http.get<{ message: string }>(`${environment.apiUrl}/auth/verify-email`, {
          params: { token },
        })
      );
      this.message.set(res.message);
      this.status.set('success');
    } catch (err: unknown) {
      const apiError = (err as { error?: { error?: string } })?.error?.error;
      this.message.set(apiError ?? 'Der Bestätigungslink ist ungültig oder abgelaufen.');
      this.status.set('error');
    }
  }
}
