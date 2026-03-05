import { ChangeDetectionStrategy, Component, computed, inject, signal } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { AuthService } from '@core';
import { UserService } from '@core/user.service';
import { UiButton } from '@ui/base/button/button';
import { UiInput } from '@ui/base/input/input';

@Component({
  selector: 'app-email-change',
  templateUrl: './email-change.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [ReactiveFormsModule, UiButton, UiInput],
})
export class EmailChange {
  private readonly auth = inject(AuthService);
  private readonly userService = inject(UserService);

  readonly status = signal<'idle' | 'sent' | 'taken' | 'error'>('idle');
  readonly loading = signal(false);

  readonly currentEmail = computed(() => this.auth.user()?.email ?? '');
  readonly pendingEmail = computed(() => this.auth.user()?.pendingEmail ?? null);

  readonly form = new FormGroup({
    email: new FormControl('', {
      nonNullable: true,
      validators: [Validators.required, Validators.email],
    }),
  });

  isInvalid(): boolean {
    const c = this.form.controls.email;
    return c.invalid && c.touched;
  }

  async onSubmit(): Promise<void> {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    const newEmail = this.form.getRawValue().email.trim().toLowerCase();
    if (newEmail === this.currentEmail().toLowerCase()) {
      this.form.controls.email.setErrors({ same: true });
      return;
    }

    this.loading.set(true);
    this.status.set('idle');

    try {
      await this.userService.requestEmailChange(newEmail);
      await this.auth.reloadUserObject();
      this.status.set('sent');
      this.form.reset();
    } catch (err: unknown) {
      const status = (err as { status?: number })?.status;
      if (status === 409) {
        this.status.set('taken');
        this.form.controls.email.setErrors({ taken: true });
      } else {
        this.status.set('error');
      }
    } finally {
      this.loading.set(false);
    }
  }
}
