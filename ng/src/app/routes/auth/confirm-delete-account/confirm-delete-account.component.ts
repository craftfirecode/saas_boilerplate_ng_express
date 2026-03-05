import { ChangeDetectionStrategy, Component, inject, OnInit, signal } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { UserService } from '@core/user.service';
import { AuthService } from '@core';

type Status = 'loading' | 'success' | 'error' | 'support';

@Component({
  selector: 'app-confirm-delete-account',
  imports: [RouterLink],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './confirm-delete-account.component.html',
})
export class ConfirmDeleteAccountComponent implements OnInit {
  private readonly route = inject(ActivatedRoute);
  private readonly userService = inject(UserService);
  private readonly auth = inject(AuthService);

  readonly status = signal<Status>('loading');
  readonly message = signal<string | null>(null);

  async ngOnInit(): Promise<void> {
    const token = this.route.snapshot.queryParamMap.get('token');

    if (!token) {
      this.message.set('Kein Bestätigungstoken gefunden. Bitte überprüfe den Link in deiner E-Mail.');
      this.status.set('error');
      return;
    }

    try {
      const res = await this.userService.confirmAccountDeletion(token);
      this.auth.user.set(null);
      this.message.set(res.message);
      this.status.set('success');
    } catch (err: unknown) {
      const httpStatus = (err as { status?: number })?.status;
      const apiError = (err as { error?: { error?: string } })?.error?.error;

      if (httpStatus === 500) {
        this.status.set('support');
      } else {
        this.message.set(apiError ?? 'Der Bestätigungslink ist ungültig oder abgelaufen.');
        this.status.set('error');
      }
    }
  }
}
