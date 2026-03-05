import { ChangeDetectionStrategy, Component, inject, OnInit, signal } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { UserService } from '@core/user.service';
import { AuthService } from '@core';

type VerifyStatus = 'loading' | 'success' | 'error';

@Component({
  selector: 'app-verify-email-change',
  imports: [RouterLink],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './verify-email-change.component.html',
})
export class VerifyEmailChangeComponent implements OnInit {
  private readonly route = inject(ActivatedRoute);
  private readonly userService = inject(UserService);
  private readonly auth = inject(AuthService);

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
      const res = await this.userService.confirmEmailChange(token);
      // User-Objekt im AuthService aktualisieren, falls eingeloggt
      await this.auth.reloadUserObject();
      this.message.set(res.message);
      this.status.set('success');
    } catch (err: unknown) {
      const apiError = (err as { error?: { error?: string } })?.error?.error;
      this.message.set(apiError ?? 'Der Bestätigungslink ist ungültig oder abgelaufen.');
      this.status.set('error');
    }
  }
}
