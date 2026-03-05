import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { MailService } from '@core';
import { UiButton } from '@ui/base/button/button';

@Component({
  selector: 'app-email-test',
  templateUrl: './email-test.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [UiButton],
})
export class EmailTestComponent {
  private readonly mail = inject(MailService);

  readonly status = signal<'idle' | 'loading' | 'success' | 'error'>('idle');
  readonly message = signal<string>('');

  async sendTestMail() {
    this.status.set('loading');
    this.message.set('');
    try {
      const res = await this.mail.sendTestMail();
      this.status.set('success');
      this.message.set(`✅ E-Mail gesendet an ${res.to}`);
    } catch (err: any) {
      this.status.set('error');
      this.message.set(`❌ Fehler: ${err?.error?.error ?? err?.message ?? 'Unbekannter Fehler'}`);
    }
  }
}
