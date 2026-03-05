import { ChangeDetectionStrategy, Component, computed, inject, signal } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { AuthService } from '@core';
import { UserService } from '@core/user.service';
import { UiButton } from '@ui/base/button/button';
import { UiInput } from '@ui/base/input/input';

@Component({
  selector: 'app-delete-account',
  templateUrl: './delete-account.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [ReactiveFormsModule, UiButton, UiInput],
})
export class DeleteAccount {
  private readonly auth = inject(AuthService);
  private readonly userService = inject(UserService);

  readonly status = signal<'idle' | 'sent' | 'mismatch' | 'error'>('idle');
  readonly loading = signal(false);
  readonly showForm = signal(false);
  readonly errorMessage = signal<string | null>(null);

  readonly currentEmail = computed(() => this.auth.user()?.email ?? '');

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

    this.loading.set(true);
    this.status.set('idle');

    try {
      await this.userService.requestAccountDeletion(this.form.getRawValue().email);
      this.status.set('sent');
      this.form.reset();
      this.showForm.set(false);
    } catch (err: unknown) {
      const status = (err as { status?: number })?.status;
      const apiMsg = (err as { error?: { error?: string } })?.error?.error ?? null;
      if (status === 422) {
        this.status.set('mismatch');
        this.form.controls.email.setErrors({ mismatch: true });
      } else {
        this.errorMessage.set(apiMsg ?? 'Ein unerwarteter Fehler ist aufgetreten. Bitte versuche es erneut.');
        this.status.set('error');
      }
    } finally {
      this.loading.set(false);
    }
  }
}
