import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '@core/auth.service';
import { UiInput } from '@ui/base/input/input';
import { UiButton } from '@ui/base/button/button';

interface LoginErrorResponse {
  error?: string;
  code?: string;
  message?: string;
}

@Component({
  selector: 'app-login',
  imports: [ReactiveFormsModule, RouterLink, UiInput, UiButton],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './login.component.html',
})
export class LoginComponent {
  private readonly auth = inject(AuthService);
  private readonly router = inject(Router);

  readonly loading = signal(false);
  readonly errorMessage = signal<string | null>(null);
  readonly emailNotVerified = signal(false);

  readonly profileForm = new FormGroup({
    email:    new FormControl('', { nonNullable: true, validators: [Validators.required, Validators.email] }),
    password: new FormControl('', { nonNullable: true, validators: [Validators.required] }),
  });

  isInvalid(field: keyof typeof this.profileForm.controls): boolean {
    const control = this.profileForm.controls[field];
    return control.invalid && control.touched;
  }

  async onSubmit(): Promise<void> {
    if (this.profileForm.invalid) {
      this.profileForm.markAllAsTouched();
      return;
    }

    this.loading.set(true);
    this.errorMessage.set(null);
    this.emailNotVerified.set(false);

    try {
      const { email, password } = this.profileForm.getRawValue();
      const res = await this.auth.signIn(email, password) as LoginErrorResponse;

      if (res?.code === 'EMAIL_NOT_VERIFIED') {
        this.emailNotVerified.set(true);
        return;
      }

      if (res?.error) {
        this.errorMessage.set(res.error);
        return;
      }

      await this.router.navigate(['/protected']);
    } catch {
      this.errorMessage.set('Ein unerwarteter Fehler ist aufgetreten. Bitte versuche es erneut.');
    } finally {
      this.loading.set(false);
    }
  }
}
