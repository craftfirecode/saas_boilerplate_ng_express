import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { AbstractControl, FormControl, FormGroup, ReactiveFormsModule, ValidationErrors, Validators } from '@angular/forms';
import { UserService } from '@core/user.service';
import { UiButton } from '@ui/base/button/button';
import { UiInput } from '@ui/base/input/input';

function passwordsMatch(group: AbstractControl): ValidationErrors | null {
  const newPassword = group.get('newPassword')?.value;
  const confirmPassword = group.get('confirmPassword')?.value;
  return newPassword && confirmPassword && newPassword !== confirmPassword
    ? { passwordMismatch: true }
    : null;
}

@Component({
  selector: 'app-password-change',
  templateUrl: './password-change.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [ReactiveFormsModule, UiButton, UiInput],
})
export class PasswordChange {
  private readonly userService = inject(UserService);

  readonly status = signal<'idle' | 'success' | 'wrong_password' | 'mismatch' | 'error'>('idle');
  readonly loading = signal(false);

  readonly form = new FormGroup(
    {
      currentPassword: new FormControl('', { nonNullable: true, validators: [Validators.required] }),
      newPassword:     new FormControl('', { nonNullable: true, validators: [Validators.required, Validators.minLength(8)] }),
      confirmPassword: new FormControl('', { nonNullable: true, validators: [Validators.required] }),
    },
    { validators: passwordsMatch }
  );

  isInvalid(field: keyof typeof this.form.controls): boolean {
    const control = this.form.controls[field];
    return control.invalid && control.touched;
  }

  async onSubmit(): Promise<void> {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    this.loading.set(true);
    this.status.set('idle');

    const { currentPassword, newPassword, confirmPassword } = this.form.getRawValue();

    try {
      await this.userService.changePassword(currentPassword, newPassword, confirmPassword);
      this.status.set('success');
      this.form.reset();
    } catch (err: unknown) {
      const status = (err as { status?: number })?.status;
      if (status === 422) {
        this.status.set('wrong_password');
        this.form.controls.currentPassword.setErrors({ wrong: true });
      } else {
        this.status.set('error');
      }
    } finally {
      this.loading.set(false);
    }
  }
}
