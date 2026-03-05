import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { ReactiveFormsModule, FormGroup, FormControl, Validators } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { AuthService } from '@core';
import { UiInput } from '@ui/base/input/input';
import { UiButton } from '@ui/base/button/button';

interface RegisterResponse {
  message?: string;
  user?: { id: number; username: string };
  error?: string | { message: string };
}

@Component({
  selector: 'app-register',
  imports: [ReactiveFormsModule, RouterLink, UiInput, UiButton],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './register.component.html',
})
export class RegisterComponent {
  private readonly auth = inject(AuthService);

  readonly loading = signal(false);
  readonly errorMessage = signal<string | null>(null);
  readonly successMessage = signal<string | null>(null);

  readonly form = new FormGroup({
    email:    new FormControl('', { nonNullable: true, validators: [Validators.required, Validators.email] }),
    username: new FormControl('', { nonNullable: true, validators: [Validators.required, Validators.minLength(3)] }),
    password: new FormControl('', { nonNullable: true, validators: [Validators.required, Validators.minLength(8)] }),
  });

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
    this.errorMessage.set(null);
    this.successMessage.set(null);

    try {
      const { email, username, password } = this.form.getRawValue();
      const res = await this.auth.signUp(email, username, password) as RegisterResponse;

      if (res?.error) {
        const msg = typeof res.error === 'string' ? res.error : res.error.message;
        this.errorMessage.set(msg);
        return;
      }

      // Erfolg: Formular sperren und Bestätigungshinweis zeigen
      this.form.disable();
      this.successMessage.set(
        res.message ?? 'Registrierung erfolgreich! Bitte bestätige deine E-Mail-Adresse.'
      );
    } catch {
      this.errorMessage.set('Ein unerwarteter Fehler ist aufgetreten. Bitte versuche es erneut.');
    } finally {
      this.loading.set(false);
    }
  }
}
